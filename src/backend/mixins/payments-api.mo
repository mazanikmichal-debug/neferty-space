import Payments "../lib/payments";
import Types "../types/nft";
import Principal "mo:core/Principal";
import Nat64 "mo:core/Nat64";
import Nat "mo:core/Nat";
import Nat8 "mo:core/Nat8";
import FactoryLib "../lib/factory";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import List "mo:core/List";
import Blob "mo:core/Blob";
import Prim "mo:⛔";

mixin (
  fees : { var platformFeesE8s : Nat64 },
  factory : FactoryLib.State,
  selfRef : { var selfPrincipal : Principal },
  usedBlockIndexes : Set.Set<Nat64>,
  pendingTransactions : Map.Map<Nat64, Types.PendingTx>
) {
  // ── ICP price cache (actor-level state, survives across calls) ───────────
  let priceCache = Payments.newPriceCache();

  /// Fetch current ICP/USD price from the Exchange Rate Canister (XRC).
  /// Cached for 60 seconds. Falls back to 5.0 USD on error.
  public func getICPPrice() : async Float {
    await Payments.getICPPrice(priceCache);
  };

  /// Returns the total cycles needed for `imageCount` images.
  public query func estimateCycles(imageCount : Nat) : async Nat {
    Payments.calculateCycles(imageCount);
  };

  /// Returns the ICP amount needed (incl. 25 % surcharge) for `imageCount`
  /// images at the given `icpPriceUSD`.
  public query func estimateICPForImages(imageCount : Nat, icpPriceUSD : Float) : async Float {
    Payments.calculateICPNeeded(imageCount, icpPriceUSD);
  };

  /// Returns how many images a user can fund with `icpAmount` ICP
  /// at the given `icpPriceUSD`.
  public query func estimateImagesForICP(icpAmount : Float, icpPriceUSD : Float) : async Nat {
    Payments.calculateImagesFromICP(icpAmount, icpPriceUSD);
  };

  // ── CMC subaccount helper ─────────────────────────────────────────────────
  // Derives a 32-byte CMC subaccount from a Principal:
  // byte[0] = length of principal bytes, bytes[1..len] = principal bytes, rest = 0.
  func principalToSubaccount(p : Principal) : Blob {
    let arr  = p.toBlob().toArray();
    let size = arr.size();
    let sub  = Prim.Array_init<Nat8>(32, 0);
    sub[0] := Nat8.fromNat(size);
    var i = 0;
    while (i < size) {
      sub[i + 1] := arr[i];
      i += 1;
    };
    Blob.fromArray(Prim.Array_tabulate<Nat8>(32, func i = sub[i]));
  };

  // Shared Ledger / CMC actor type aliases (used across multiple functions)
  type Tokens              = { e8s : Nat64 };
  type AccountIdentifier   = Blob;
  type GetBlocksArgs       = { start : Nat64; length : Nat64 };
  type Operation           = {
    #Transfer : { from : AccountIdentifier; to : AccountIdentifier; amount : Tokens; fee : Tokens };
    #Burn     : { from : AccountIdentifier; amount : Tokens };
    #Mint     : { to : AccountIdentifier; amount : Tokens };
  };
  type Transaction         = {
    operation : ?Operation;
    memo      : Nat64;
    created_at_time : ?{ timestamp_nanos : Nat64 };
  };
  type Block               = { transaction : Transaction; timestamp : { timestamp_nanos : Nat64 }; parent_hash : ?Blob };
  type QueryBlocksResponse = { first_block_index : Nat64; blocks : [Block] };
  type NotifyTopUpArg      = { block_index : Nat64; canister_id : Principal };
  type NotifyTopUpResult   = { #Ok : Nat; #Err : { #Refunded : { block_index : ?Nat64; reason : Text }; #InvalidTransaction : Text; #TransactionTooOld : Nat64; #Processing; #NotificationAlreadyProcessed; #CanisterNotFound; #OutOfCycles; #Other : { error_code : Nat64; error_message : Text } } };

  let ledger : actor {
    query_blocks : (GetBlocksArgs) -> async QueryBlocksResponse;
    transfer     : ({
      memo        : Nat64;
      amount      : Tokens;
      fee         : Tokens;
      from_subaccount : ?Blob;
      to          : AccountIdentifier;
      created_at_time : ?{ timestamp_nanos : Nat64 };
    }) -> async { #Ok : Nat64; #Err : { #BadFee : { expected_fee : Tokens }; #InsufficientFunds : { balance : Tokens }; #TxTooOld : { allowed_window_nanos : Nat64 }; #TxCreatedInFuture; #TxDuplicate : { duplicate_of : Nat64 } } };
  } = actor("ryjl3-tyaaa-aaaaa-aaaba-cai");

  let cmc : actor {
    notify_top_up : (NotifyTopUpArg) -> async NotifyTopUpResult;
  } = actor("rkp4c-7iaaa-aaaaa-aaaca-cai");

  func blobToHexPayments(blob : Blob) : Text {
    let hexChars = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    var result = "";
    for (byte in blob.vals()) {
      let b = byte.toNat();
      result := result # hexChars[b / 16] # hexChars[b % 16];
    };
    result;
  };

  // ── getCmcDepositAddress ──────────────────────────────────────────────────
  /// Returns the Account Identifier (hex) that Plug Wallet must send ICP to.
  /// This is the CMC canister's account for the Factory's subaccount.
  public func getCmcDepositAddress() : async Text {
    let cmcPrincipal = Principal.fromText("rkp4c-7iaaa-aaaaa-aaaca-cai");
    let factorySub   = principalToSubaccount(selfRef.selfPrincipal);
    let accountBlob  = cmcPrincipal.toLedgerAccount(?factorySub);
    blobToHexPayments(accountBlob);
  };

  // ── Internal CMC top-up helper ────────────────────────────────────────────
  // Transfers artistE8s to CMC and calls notify_top_up for collectionId.
  // Returns #ok(cyclesMinted) or #err(reason).
  func doNotifyTopUp(blockIndex : Nat64, targetCanisterId : Principal) : async Types.ProcessTopUpResult {

    let notifyResult = try {
      await cmc.notify_top_up({ block_index = blockIndex; canister_id = targetCanisterId });
    } catch (e) {
      return #err("CMC notify_top_up zlyhal pre canister: " # targetCanisterId.toText() # " | blockIndex: " # blockIndex.toText() # " | error: " # e.message());
    };

    switch (notifyResult) {
      case (#Ok(cyclesMinted)) #ok({ cyclesMinted; icpUsed = blockIndex; platformFee = 0 });
      case (#Err(e)) {
        let errMsg = switch (e) {
          case (#Refunded(r))           { "CMC refunded: " # r.reason };
          case (#InvalidTransaction(t)) { "CMC invalid tx: " # t };
          case (#TransactionTooOld(n))  { "CMC tx too old (block: " # n.toText() # ")" };
          case (#Processing)            { "CMC still processing, retry later" };
          case (#NotificationAlreadyProcessed) { "CMC: blok bol uz spracovany" };
          case (#CanisterNotFound)      { "CMC: canister nenajdeny" };
          case (#OutOfCycles)           { "CMC: nedostatok cycles" };
          case (#Other(o))              { "CMC error " # o.error_code.toText() # ": " # o.error_message };
        };
        #err("CMC notify_top_up zlyhal pre canister: " # targetCanisterId.toText() # " | blockIndex: " # blockIndex.toText() # " | error: " # errMsg);
      };
    };
  };

  // ── processTopUp ─────────────────────────────────────────────────────────
  /// Main top-up entry point.
  /// Plug Wallet sends ICP to getCmcDepositAddress(), gets back a block_index,
  /// then calls processTopUp(block_index, collection_id).
  /// Double-spend protected via usedBlockIndexes Set.
  public shared ({ caller }) func processTopUp(blockIndex : Nat64, collectionId : Principal) : async Types.ProcessTopUpResult {
    let now = Time.now();

    // ── 1. Double-spend guard ────────────────────────────────────────────────
    if (usedBlockIndexes.contains(blockIndex)) {
      return #err("Blok bol už spracovaný");
    };

    // ── 2. Verify block on ICP Ledger ────────────────────────────────────────
    let blocksResp = try {
      await ledger.query_blocks({ start = blockIndex; length = 1 });
    } catch (e) {
      return #err("Chyba pri čítaní Ledgera: " # e.message());
    };

    if (blocksResp.blocks.size() == 0) {
      return #err("Blok nenájdený: " # blockIndex.toText());
    };

    let block = blocksResp.blocks[0];

    // NOTE: We do NOT check the destination address here.
    // The block destination may differ from the currently-computed CMC deposit address
    // when selfPrincipal was aaaaa-aa at the time the user fetched getCmcDepositAddress.
    // CMC itself is the authoritative validator: if the ICP was not sent to CMC's
    // subaccount for targetCanisterId, CMC will reject notify_top_up with a clear error.
    let rawAmountE8s : Nat64 = switch (block.transaction.operation) {
      case (?(#Transfer({ from = _; to = _; amount; fee = _ }))) {
        amount.e8s;
      };
      case _ return #err("Blok nie je ICP prevod");
    };

    // ── 3. Deduct Ledger fee to get net amount that actually arrived ─────────
    // The Ledger block stores the transfer amount (before fee deduction).
    // The CMC deposit subaccount only received rawAmountE8s - LEDGER_FEE.
    let ledgerFee : Nat64 = 10_000;
    if (rawAmountE8s <= ledgerFee) {
      return #err("Suma je príliš malá na pokrytie poplatku Ledgera");
    };
    let amountE8s : Nat64 = rawAmountE8s - ledgerFee;

    // Minimum amount check
    if (amountE8s < 100_000) {
      return #err("Suma po odpočítaní poplatku je príliš malá (minimum 0.001 ICP)");
    };

    // ── 4. Split 75 / 25 on net amount ──────────────────────────────────────
    let split       = Payments.calculateSplit(amountE8s);
    let platformE8s = split.platformE8s;

    // Record as pending before async call (safety net)
    let pendingEntry : Types.PendingTx = {
      caller;
      collectionId;
      amount        = amountE8s;
      blockIndex;
      status        = #pending;
      retryCount    = 0;
      createdAt     = now;
      lastAttemptAt = now;
    };
    pendingTransactions.add(blockIndex, pendingEntry);

    // ── 4. Sanitize collectionId: replace aaaaa-aa placeholder with Factory selfPrincipal ─
    var targetId = collectionId;
    if (targetId.toText() == "aaaaa-aa") {
      targetId := selfRef.selfPrincipal;
    };

    // ── 5. Call CMC via notify_top_up ────────────────────────────────────────
    // Pass the ORIGINAL block index from Plug Wallet — no internal ledger.transfer.
    let topUpRes = await doNotifyTopUp(blockIndex, targetId);

    switch (topUpRes) {
      case (#ok({ cyclesMinted; icpUsed = _; platformFee = _ })) {
        // ── 5. Mark block as used ────────────────────────────────────────────
        usedBlockIndexes.add(blockIndex);

        // ── 6. Update pending log to completed ──────────────────────────────
        pendingTransactions.add(blockIndex, {
          pendingEntry with
          status        = #completed;
          lastAttemptAt = Time.now();
        });

        // ── 7. Route platform fee to on-chain Treasury subaccount ────────────
        fees.platformFeesE8s := fees.platformFeesE8s + platformE8s;
        if (platformE8s > ledgerFee) {
          let treasuryTo = Payments.treasuryAccountId(selfRef.selfPrincipal);
          ignore try {
            await ledger.transfer({
              memo            = 0;
              amount          = { e8s = platformE8s - ledgerFee };
              fee             = { e8s = ledgerFee };
              from_subaccount = null;  // ICP landed in Factory main account via CMC
              to              = treasuryTo;
              created_at_time = null;
            });
          } catch (_) {};
        };

        #ok({ cyclesMinted; icpUsed = amountE8s; platformFee = platformE8s });
      };
      case (#err(msg)) {
        // Leave as #pending for retry
        pendingTransactions.add(blockIndex, {
          pendingEntry with
          status        = #pending;
          lastAttemptAt = Time.now();
        });
        #err(msg);
      };
    };
  };

  // ── retryTopUp ────────────────────────────────────────────────────────────
  /// Callable by original caller or admin. Retries a pending top-up.
  /// After 3 failed retries the record stays #pending for manual admin retry.
  public shared ({ caller }) func retryTopUp(blockIndex : Nat64) : async Types.ProcessTopUpResult {
    let now = Time.now();
    let tx = switch (pendingTransactions.get(blockIndex)) {
      case null    return #err("Transakcia nenájdená");
      case (?tx) tx;
    };

    // Double-spend guard: any authenticated caller may retry; the Set ensures
    // the block_index can only be successfully processed once.
    ignore caller;

    if (tx.status == #completed) return #err("Transakcia je už dokončená");
    if (usedBlockIndexes.contains(blockIndex)) {
      return #err("Blok bol už spracovaný");
    };
    if (tx.retryCount >= 3) {
      return #err("Maximálny počet pokusov dosiahnutý. Kontaktujte admina.");
    };

    let split     = Payments.calculateSplit(tx.amount);
    let artistE8s = split.artistE8s;
    let platformE8s = split.platformE8s;

    // Update retry count
    pendingTransactions.add(blockIndex, {
      tx with
      retryCount    = tx.retryCount + 1;
      lastAttemptAt = now;
    });

    let topUpRes = await doNotifyTopUp(blockIndex, selfRef.selfPrincipal);

    switch (topUpRes) {
      case (#ok({ cyclesMinted; icpUsed = _; platformFee = _ })) {
        usedBlockIndexes.add(blockIndex);
        pendingTransactions.add(blockIndex, {
          tx with
          status        = #completed;
          lastAttemptAt = Time.now();
          retryCount    = tx.retryCount + 1;
        });
        fees.platformFeesE8s := fees.platformFeesE8s + platformE8s;
        let retryFee : Nat64 = 10_000;
        if (platformE8s > retryFee) {
          let treasuryTo = Payments.treasuryAccountId(selfRef.selfPrincipal);
          ignore try {
            await ledger.transfer({
              memo            = 0;
              amount          = { e8s = platformE8s - retryFee };
              fee             = { e8s = retryFee };
              from_subaccount = null;
              to              = treasuryTo;
              created_at_time = null;
            });
          } catch (_) {};
        };
        #ok({ cyclesMinted; icpUsed = tx.amount; platformFee = platformE8s });
      };
      case (#err(msg)) {
        pendingTransactions.add(blockIndex, {
          tx with
          status        = #pending;
          lastAttemptAt = Time.now();
          retryCount    = tx.retryCount + 1;
        });
        #err(msg);
      };
    };
  };

  // ── adminRetryTopUp ───────────────────────────────────────────────────────
  /// Same as retryTopUp but restricted to admin. Bypasses the retryCount cap.
  public shared ({ caller }) func adminRetryTopUp(blockIndex : Nat64) : async Types.ProcessTopUpResult {
    if (not Principal.equal(caller, factory.admin.principal)) {
      Runtime.trap("Len admin môže volať adminRetryTopUp");
    };
    let now = Time.now();
    let tx = switch (pendingTransactions.get(blockIndex)) {
      case null    return #err("Transakcia nenájdená");
      case (?tx) tx;
    };
    if (tx.status == #completed) return #err("Transakcia je už dokončená");
    if (usedBlockIndexes.contains(blockIndex)) {
      return #err("Blok bol už spracovaný");
    };

    let split     = Payments.calculateSplit(tx.amount);
    let artistE8s = split.artistE8s;
    let platformE8s = split.platformE8s;

    pendingTransactions.add(blockIndex, {
      tx with
      retryCount    = tx.retryCount + 1;
      lastAttemptAt = now;
    });

    let topUpRes = await doNotifyTopUp(blockIndex, selfRef.selfPrincipal);

    switch (topUpRes) {
      case (#ok({ cyclesMinted; icpUsed = _; platformFee = _ })) {
        usedBlockIndexes.add(blockIndex);
        pendingTransactions.add(blockIndex, {
          tx with
          status        = #completed;
          lastAttemptAt = Time.now();
          retryCount    = tx.retryCount + 1;
        });
        fees.platformFeesE8s := fees.platformFeesE8s + platformE8s;
        let adminRetryFee : Nat64 = 10_000;
        if (platformE8s > adminRetryFee) {
          let treasuryTo = Payments.treasuryAccountId(selfRef.selfPrincipal);
          ignore try {
            await ledger.transfer({
              memo            = 0;
              amount          = { e8s = platformE8s - adminRetryFee };
              fee             = { e8s = adminRetryFee };
              from_subaccount = null;
              to              = treasuryTo;
              created_at_time = null;
            });
          } catch (_) {};
        };
        #ok({ cyclesMinted; icpUsed = tx.amount; platformFee = platformE8s });
      };
      case (#err(msg)) {
        pendingTransactions.add(blockIndex, {
          tx with
          status        = #pending;
          lastAttemptAt = Time.now();
          retryCount    = tx.retryCount + 1;
        });
        #err(msg);
      };
    };
  };

  // ── getMyPendingTransactions ──────────────────────────────────────────────
  /// Returns all pending transactions for the caller.
  public query ({ caller }) func getMyPendingTransactions() : async [Types.PendingTx] {
    let result = List.empty<Types.PendingTx>();
    for ((_, tx) in pendingTransactions.entries()) {
      if (Principal.equal(tx.caller, caller) and tx.status == #pending) {
        result.add(tx);
      };
    };
    result.toArray();
  };

  // ── getPendingTransactions ────────────────────────────────────────────────
  /// Returns all pending transactions. Admin only.
  public query ({ caller }) func getPendingTransactions() : async [Types.PendingTx] {
    if (not Principal.equal(caller, factory.admin.principal)) {
      Runtime.trap("Len admin môže vidieť všetky čakajúce transakcie");
    };
    let result = List.empty<Types.PendingTx>();
    for ((_, tx) in pendingTransactions.entries()) {
      if (tx.status == #pending) {
        result.add(tx);
      };
    };
    result.toArray();
  };

  // ── Legacy topUpCollection (kept for backward compat) ─────────────────────
  /// Top-up the caller's Collection canister with cycles purchased from ICP.
  /// Caller must have sent ICP to the Factory account before calling this.
  /// blockIndex: the Ledger block index of the inbound transfer from caller.
  /// Flow: verify block → split 75/25 → CMC notifies Collection with cycles → track 25%.
  public shared ({ caller }) func topUpCollection(blockIndex : Nat64) : async Types.TopUpResult {
    // ── 1. Resolve Collection canister — in single-canister (hybrid) mode,
    //       the Factory itself IS the collection. Fall back to selfRef.selfPrincipal
    //       when the registry has no entry OR holds the corrupted aaaaa-aa placeholder.
    let zeroPrincipal = Principal.fromText("aaaaa-aa");
    let rawCols = FactoryLib.getCollections(factory, caller)
      .filter(func(cid) { not Principal.equal(cid, zeroPrincipal) });
    let collectionId : Principal = if (rawCols.size() > 0) rawCols[0] else selfRef.selfPrincipal;

    // ── 2. Fetch the block and verify the transfer ─────────────────────────
    let blocksResp = try {
      await ledger.query_blocks({ start = blockIndex; length = 1 });
    } catch (e) {
      return #err("Failed to query Ledger: " # e.message());
    };

    if (blocksResp.blocks.size() == 0) {
      return #err("Block not found: " # blockIndex.toText());
    };

    let block = blocksResp.blocks[0];
    let factoryAccount = selfRef.selfPrincipal.toLedgerAccount(null);
    let callerAccount  = caller.toLedgerAccount(null);

    let amountE8s : Nat64 = switch (block.transaction.operation) {
      case (?(#Transfer({ from; to; amount; fee = _ }))) {
        // Verify: from = caller, to = this Factory
        if (from != callerAccount)  return #err("Transfer not from caller");
        if (to   != factoryAccount) return #err("Transfer not to Factory");
        amount.e8s;
      };
      case _ return #err("Block is not an ICP transfer");
    };

    // ── 4. Calculate 75 / 25 split ─────────────────────────────────────────
    let split       = Payments.calculateSplit(amountE8s);
    let artistE8s   = split.artistE8s;
    let platformE8s = split.platformE8s;
    let networkFee  : Nat64 = 10_000;
    if (artistE8s <= networkFee) return #err("Amount too small after split");

    // ── 5. CMC actor: send artistE8s ICP and notify to mint cycles ─────────
    type CMCTransferResult = { #Ok : Nat64; #Err : { #BadFee : { expected_fee : Tokens }; #InsufficientFunds : { balance : Tokens }; #TxTooOld : { allowed_window_nanos : Nat64 }; #TxCreatedInFuture; #TxDuplicate : { duplicate_of : Nat64 } } };

    let cmcPrincipalLeg = Principal.fromText("rkp4c-7iaaa-aaaaa-aaaca-cai");
    let cmcAccountLeg   = cmcPrincipalLeg.toLedgerAccount(null);

    // Transfer artistE8s to CMC
    let xferResultLeg = try {
      await ledger.transfer({
        memo            = 1347375188; // 0x50555054 "PUPT" mnemonic for top-up
        amount          = { e8s = artistE8s - networkFee };
        fee             = { e8s = networkFee };
        from_subaccount = null;
        to              = cmcAccountLeg;
        created_at_time = null;
      });
    } catch (e) {
      return #err("Ledger transfer to CMC failed: " # e.message());
    };

    let cmcBlockIndexLeg = switch (xferResultLeg) {
      case (#Ok(idx)) idx;
      case (#Err(e))  return #err("Ledger error: " # debug_show(e));
    };

    let notifyResultLeg = try {
      await cmc.notify_top_up({ block_index = cmcBlockIndexLeg; canister_id = collectionId });
    } catch (e) {
      return #err("CMC notify failed: " # e.message());
    };

    let cyclesMinted : Nat = switch (notifyResultLeg) {
      case (#Ok(c))  c;
      case (#Err(e)) {
        let errMsg = switch (e) {
          case (#Refunded(r))           { "CMC refunded: " # r.reason };
          case (#InvalidTransaction(t)) { "CMC invalid tx: " # t };
          case (#TransactionTooOld(n))  { "CMC tx too old (block: " # n.toText() # ")" };
          case (#Processing)            { "CMC still processing, retry later" };
          case (#NotificationAlreadyProcessed) { "CMC: blok bol uz spracovany" };
          case (#CanisterNotFound)      { "CMC: canister nenajdeny" };
          case (#OutOfCycles)           { "CMC: nedostatok cycles" };
          case (#Other(o))              { "CMC error " # o.error_code.toText() # ": " # o.error_message };
        };
        return #err("CMC error: " # errMsg);
      };
    };

    // ── 6. Accumulate platform 25 % ────────────────────────────────────────
    fees.platformFeesE8s := fees.platformFeesE8s + platformE8s;

    #ok({ icpUsed = amountE8s; cyclesMinted; platformFee = platformE8s });
  };
}
