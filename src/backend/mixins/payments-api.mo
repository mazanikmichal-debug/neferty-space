import Payments "../lib/payments";
import Types "../types/nft";
import Principal "mo:core/Principal";
import Nat64 "mo:core/Nat64";
import Nat "mo:core/Nat";
import FactoryLib "../lib/factory";
import Error "mo:core/Error";

mixin (fees : { var platformFeesE8s : Nat64 }, factory : FactoryLib.State, selfRef : { var selfPrincipal : Principal }) {
  /// Fetch current ICP/USD price from the Exchange Rate Canister (XRC).
  /// Falls back to 10.0 USD on error.
  public func getICPPrice() : async Float {
    await Payments.getICPPrice();
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

  /// Top-up the caller's Collection canister with cycles purchased from ICP.
  /// Caller must have sent ICP to the Factory account before calling this.
  /// blockIndex: the Ledger block index of the inbound transfer from caller.
  /// Flow: verify block → split 75/25 → CMC notifies Collection with cycles → track 25%.
  public shared ({ caller }) func topUpCollection(blockIndex : Nat64) : async Types.TopUpResult {
    // ── 1. Look up caller's Collection canister ───────────────────────────
    let collectionId = switch (FactoryLib.getCollection(factory, caller)) {
      case (?cid) cid;
      case null   return #err("No collection found for caller");
    };

    // ── 2. ICP Ledger actor ────────────────────────────────────────────────
    type Tokens = { e8s : Nat64 };
    type AccountIdentifier = Blob;
    type BlockIndex = Nat64;
    type Operation = {
      #Transfer : { from : AccountIdentifier; to : AccountIdentifier; amount : Tokens; fee : Tokens };
      #Burn     : { from : AccountIdentifier; amount : Tokens };
      #Mint     : { to : AccountIdentifier; amount : Tokens };
    };
    type Transaction = {
      operation : ?Operation;
      memo      : Nat64;
      created_at_time : ?{ timestamp_nanos : Nat64 };
    };
    type Block = { transaction : Transaction; timestamp : { timestamp_nanos : Nat64 }; parent_hash : ?Blob };
    type GetBlocksArgs   = { start : Nat64; length : Nat64 };
    type QueryBlocksResponse = { first_block_index : Nat64; blocks : [Block] };

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

    // ── 3. Fetch the block and verify the transfer ─────────────────────────
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
    type NotifyTopUpArg    = { block_index : Nat64; canister_id : Principal };
    type NotifyTopUpResult = { #Ok : Nat; #Err : { #InvalidTransaction : Text; #TransactionTooOld : Nat64; #OutOfCycles; #NotificationAlreadyProcessed; #CanisterNotFound; #Other : { error_code : Nat64; error_message : Text } } };

    let cmcPrincipal = Principal.fromText("rkp4c-7iaaa-aaaaa-aaaca-cai");
    let cmcAccount   = cmcPrincipal.toLedgerAccount(null);

    // Transfer artistE8s to CMC
    let xferResult = try {
      await ledger.transfer({
        memo            = 1347375188; // 0x50555054 "PUPT" mnemonic for top-up
        amount          = { e8s = artistE8s - networkFee };
        fee             = { e8s = networkFee };
        from_subaccount = null;
        to              = cmcAccount;
        created_at_time = null;
      });
    } catch (e) {
      return #err("Ledger transfer to CMC failed: " # e.message());
    };

    let cmcBlockIndex = switch (xferResult) {
      case (#Ok(idx)) idx;
      case (#Err(e))  return #err("Ledger error: " # debug_show(e));
    };

    let cmc : actor {
      notify_top_up : (NotifyTopUpArg) -> async NotifyTopUpResult;
    } = actor("rkp4c-7iaaa-aaaaa-aaaca-cai");

    let notifyResult = try {
      await cmc.notify_top_up({ block_index = cmcBlockIndex; canister_id = collectionId });
    } catch (e) {
      return #err("CMC notify failed: " # e.message());
    };

    let cyclesMinted : Nat = switch (notifyResult) {
      case (#Ok(c))  c;
      case (#Err(e)) return #err("CMC error: " # debug_show(e));
    };

    // ── 6. Accumulate platform 25 % ────────────────────────────────────────
    fees.platformFeesE8s := fees.platformFeesE8s + platformE8s;

    #ok({ icpUsed = amountE8s; cyclesMinted; platformFee = platformE8s });
  };
}
