import Types "../types/nft";
import FactoryLib "../lib/factory";
import CollectionLib "../lib/collection";
import Payments "../lib/payments";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Nat8 "mo:core/Nat8";
import Error "mo:core/Error";
import Time "mo:core/Time";
import NFTLib "../lib/nft";
import Nat64 "mo:core/Nat64";
import Prim "mo:⛔";
import Cycles "mo:core/Cycles";

// fees state is injected from main.mo so mixin mutations persist
mixin (
  factory : FactoryLib.State,
  fees : { var platformFeesE8s : Nat64 },
  selfRef : { var selfPrincipal : Principal },
  cyclesSnap : { var lastCycles : Nat; var lastSnapshotTime : Int },
  nftFactoryState : NFTLib.FactoryState
) {

  // ── Collection lifecycle ──────────────────────────────────────────────────

  /// Idempotent: returns existing collection ID, or deploys a new one.
  /// Always deploys a new Collection canister and appends it to the owner's array.
  public shared ({ caller }) func createMyCollection() : async { #ok : Principal; #err : Text } {
    let col = try {
      await (system CollectionLib.Collection)(#new { settings = null })(caller, selfRef.selfPrincipal);
    } catch (e) {
      return #err("Canister deployment failed: " # e.message());
    };
    let cid = Principal.fromActor(col);
    // Defensive guard: reject a zero/placeholder principal
    if (Principal.equal(cid, Principal.fromText("aaaaa-aa"))) {
      return #err("Deployment returned invalid canister ID (aaaaa-aa); not added to registry");
    };
    FactoryLib.addToRegistry(factory, caller, cid);
    NFTLib.createCollection(nftFactoryState, caller, cid);
    #ok(cid);
  };

  /// In the single-canister model the main canister IS the collection.
  /// Returns the canister's own principal if the user has minted at least 1 NFT
  /// (checked via mintCounts) OR has an entry in the factory registry.
  /// In the single-canister model the main canister IS the collection.
  /// Returns the canister's own principal if the user has minted at least 1 NFT
  /// (checked via mintCounts) OR has an entry in the factory registry.
  /// If registry has a corrupted aaaaa-aa entry, falls back to selfRef like null.
  /// Returns the caller's collection principals.
  /// Falls back to [selfRef.selfPrincipal] if the user has mints but no registry entry.
  public query func getMyCollection(user : Principal) : async [Principal] {
    let zeroPrincipal = Principal.fromText("aaaaa-aa");
    let cols = FactoryLib.getCollections(factory, user)
      .filter(func(cid) { not Principal.equal(cid, zeroPrincipal) });
    if (cols.size() > 0) return cols;
    // Fall back: any minted NFT means the user has a collection in single-canister mode
    let mintCount = NFTLib.getMintCount(nftFactoryState, user);
    if (mintCount > 0) {
      [selfRef.selfPrincipal];
    } else {
      [];
    };
  };
  /// Alias for getMyCollection — returns all collection principals for the user.
  public query func getMyCollections(user : Principal) : async [Principal] {
    let zeroPrincipal = Principal.fromText("aaaaa-aa");
    let cols = FactoryLib.getCollections(factory, user)
      .filter(func(cid) { not Principal.equal(cid, zeroPrincipal) });
    if (cols.size() > 0) return cols;
    let mintCount = NFTLib.getMintCount(nftFactoryState, user);
    if (mintCount > 0) { [selfRef.selfPrincipal] } else { [] };
  };


  // ── Delegated queries to the Collection canister ──────────────────────────

  public shared func getMyMintCount(user : Principal) : async Nat {
    // In single-canister mode, mintCounts tracks mints directly
    NFTLib.getMintCount(nftFactoryState, user);
  };

  public shared func getCollectionPhase(user : Principal) : async Types.CollectionPhase {
    NFTLib.getCollectionPhase(nftFactoryState, user);
  };

  /// Returns the raw cycle balance of the caller's Collection canister.
  /// In single-canister mode, returns the main canister's own cycle balance.
  public shared ({ caller }) func getMyCollectionCycles() : async Nat {
    Cycles.balance();
  };

  /// Returns human-readable health with expert data for Settings dashboard.
  public shared ({ caller }) func getMyHealthStatus() : async Types.HealthStatus {
    let mintCount = NFTLib.getMintCount(nftFactoryState, caller);
    let cycles = Cycles.balance();
    let days   = Payments.estimateDaysFromCycles(cycles);
    let images = Payments.estimateImagesFromCycles(cycles);
    let pct    = Payments.daysPercentage(days);
    let rawColor = Payments.cycleHealthStatus(cycles);
    let color : Types.CycleHealth = switch (rawColor) {
      case (#green)  #green;
      case (#orange) #orange;
      case (#red)    #red;
    };
    let storageMB = Payments.estimateStorageMB(mintCount);
    let statusText = "Zbierka má palivo na ~" # days.toText() # " dní (" # images.toText() # " obrázkov)";
    {
      status          = statusText;
      daysRemaining   = days;
      imagesRemaining = images;
      daysPercentage  = pct;
      healthColor     = color;  // Types.CycleHealth
      rawCycles       = cycles;
      estimatedStorageMB = storageMB;
    };
  };

  /// Returns the cycle balance and image count of a Collection canister.
  /// Factory calls both getCyclesBalance() and getImageCount() on the Collection.
  public shared ({ caller }) func getCollectionStatus(collectionId : Principal) : async {
    cycles      : Nat;
    imageCount  : Nat;
    ownerPrincipal : Principal;
  } {
    let zeroPrincipal = Principal.fromText("aaaaa-aa");
    // Reject zero/null principal — corrupted or uninitialized collection ID
    if (Principal.equal(collectionId, zeroPrincipal)) {
      return { cycles = 0; imageCount = 0; ownerPrincipal = caller };
    };
    // In single-canister mode the collectionId IS this canister — avoid calling
    // getCyclesBalance on ourselves (we don't export that method on main.mo).
    if (Principal.equal(collectionId, selfRef.selfPrincipal)) {
      let cycles     = Cycles.balance();
      let imageCount = NFTLib.getMintCount(nftFactoryState, caller);
      return { cycles; imageCount; ownerPrincipal = caller };
    };
    // Multi-canister mode: delegate to the Collection actor.
    let collection = actor(collectionId.toText()) : actor {
      getCyclesBalance : shared () -> async Nat;
      getImageCount    : shared () -> async Nat;
    };
    let cycles     = await collection.getCyclesBalance();
    let imageCount = await collection.getImageCount();
    { cycles; imageCount; ownerPrincipal = caller };
  };

  // ── Collection removal ───────────────────────────────────────────────────

  /// Removes a specific collection canister from the caller's registry entry.
  /// Returns #ok(true) if found and removed, #err("Collection not found") otherwise.
  public shared ({ caller }) func removeMyCollection(collectionId : Principal) : async { #ok : Bool; #err : Text } {
    FactoryLib.removeFromRegistry(factory, caller, collectionId);
  };

  // ── Dynamic admin management ─────────────────────────────────────────────

  /// Public query: returns the current list of admin principals.
  public query func listAdmins() : async [Principal] {
    FactoryLib.getAdmins(factory);
  };

  /// Admin-only: add a new admin principal. Rejects duplicates.
  public shared ({ caller }) func addAdmin(newAdmin : Principal) : async { #ok; #err : Text } {
    if (not FactoryLib.isAdmin(factory, caller)) {
      return #err("Not authorized: admin only");
    };
    FactoryLib.addAdmin(factory, newAdmin);
  };

  /// Admin-only: remove an admin principal. Refuses if it would leave 0 admins.
  public shared ({ caller }) func removeAdmin(adminToRemove : Principal) : async { #ok; #err : Text } {
    if (not FactoryLib.isAdmin(factory, caller)) {
      return #err("Not authorized: admin only");
    };
    FactoryLib.removeAdmin(factory, adminToRemove);
  };

  // ── Admin registry cleanup ──────────────────────────────────────────────────

  /// Admin-only: removes all registry entries whose collection canister ID is
  /// the zero principal ("aaaaa-aa"). Returns the number of entries removed.
  /// Call this once to purge any corrupted placeholder entries so affected
  /// users can call createMyCollection() again.
  /// Self-service cleanup: removes the caller's own registry entry if it equals
  /// the zero/placeholder principal ("aaaaa-aa"). Returns 1 if removed, 0 otherwise.
  /// Any authenticated (non-anonymous) user may call this for their own entry only.
  public shared ({ caller }) func cleanupCorruptedRegistry() : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated");
    };
    FactoryLib.removeSingleCorruptedEntry(factory, caller);
  };

  /// Returns the caller's current collection canister ID from the registry,
  /// or null if no entry exists. Treats the zero principal as null (corrupted).
  /// Returns the caller's collection canister IDs from the registry (empty array = none).
  /// Filters out the zero/placeholder principal.
  public query ({ caller }) func getUserRegistryEntry() : async [Principal] {
    let zeroPrincipal = Principal.fromText("aaaaa-aa");
    FactoryLib.getCollections(factory, caller)
      .filter(func(cid) { not Principal.equal(cid, zeroPrincipal) });
  };

  // ── Hybrid mode: default-collection detection ────────────────────────────

  /// Returns true when the given principal is using the Factory canister itself
  /// as their default collection (i.e. no separate dedicated Collection canister).
  /// True when:
  ///   - registry entry is null or aaaaa-aa (corrupted) AND mintCount > 0
  ///   - registry entry IS selfRef.selfPrincipal (explicitly set to Factory)
  /// False only when the user has a real, separate Collection canister ID.
  /// Returns true when the given principal is using the Factory canister itself
  /// as their default collection (no separate dedicated Collection canister).
  public query func isUsingDefaultCollection(user : Principal) : async Bool {
    let zeroPrincipal = Principal.fromText("aaaaa-aa");
    let cols = FactoryLib.getCollections(factory, user)
      .filter(func(cid) { not Principal.equal(cid, zeroPrincipal) and not Principal.equal(cid, selfRef.selfPrincipal) });
    if (cols.size() > 0) return false; // has real separate canister(s)
    let mintCount = NFTLib.getMintCount(nftFactoryState, user);
    mintCount > 0;
  };

  // ── Main-canister status (admin-only) ─────────────────────────────────────

  /// Returns live cycles/memory stats and an estimated days-remaining figure.
  /// Protected: only the registered admin principal may call this.
  public shared ({ caller }) func getStatus() : async {
    cycles       : Nat;
    memory       : Nat;
    heap_memory  : Nat;
    estimate_days : Nat;
  } {
    if (not FactoryLib.isAdmin(factory, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };

    let currentCycles = Cycles.balance();
    let memory        = Prim.rts_memory_size();
    let heap_memory   = Prim.rts_heap_size();
    let now           = Time.now(); // nanoseconds

    let estimate_days : Nat = if (
      cyclesSnap.lastSnapshotTime == 0 or
      currentCycles >= cyclesSnap.lastCycles or
      now <= cyclesSnap.lastSnapshotTime
    ) {
      9999; // first call or no net burn since last snapshot
    } else {
      let deltaCycles = Int.abs((cyclesSnap.lastCycles : Int) - (currentCycles : Int)).toNat() |> (if (cyclesSnap.lastCycles > currentCycles) _ else 0);
      let deltaNs     = (now - cyclesSnap.lastSnapshotTime).toNat();
      // burn rate per nanosecond → per day (86_400 seconds * 1_000_000_000 ns/s)
      let nsPerDay : Nat = 86_400_000_000_000;
      if (deltaCycles == 0) {
        9999;
      } else {
        // estimate_days = currentCycles / burnRatePerDay
        // burnRatePerDay = deltaCycles * nsPerDay / deltaNs
        let numerator   = currentCycles * deltaNs;
        let denominator = deltaCycles * nsPerDay;
        if (denominator == 0) 9999
        else numerator / denominator;
      };
    };

    // Update snapshot
    cyclesSnap.lastCycles       := currentCycles;
    cyclesSnap.lastSnapshotTime := now;

    { cycles = currentCycles; memory; heap_memory; estimate_days };
  };

  // ── Admin treasury ────────────────────────────────────────────────────────

  /// Returns the admin principal (used for access control).
  public query func getAdminPrincipal() : async Principal {
    factory.admin.principal;
  };

  /// Returns accumulated platform fees (25 %) by querying the actual
  /// on-chain Treasury subaccount balance. Admin only.
  public shared ({ caller }) func getPlatformFees() : async Nat64 {
    if (not FactoryLib.isAdmin(factory, caller)) {
      Runtime.trap("Not authorized");
    };
    let ledgerBal : actor {
      account_balance : ({ account : Blob }) -> async { e8s : Nat64 };
    } = actor("ryjl3-tyaaa-aaaaa-aaaba-cai");
    let treasuryId = Payments.treasuryAccountId(selfRef.selfPrincipal);
    try {
      let bal = await ledgerBal.account_balance({ account = treasuryId });
      bal.e8s;
    } catch (_) {
      fees.platformFeesE8s; // fallback to in-memory counter on error
    };
  };

  /// Returns the Factory canister's own ICP account identifier as hex Text.
  public query func getFactoryAccountId() : async Text {
    let accountBlob = selfRef.selfPrincipal.toLedgerAccount(null);
    blobToHex(accountBlob);
  };

  /// Transfers accumulated platform fees from the Treasury subaccount
  /// to `toPrincipal`. Admin only.
  public shared ({ caller }) func withdrawPlatformFees(toPrincipal : Principal) : async Types.WithdrawResult {
    if (not FactoryLib.isAdmin(factory, caller)) {
      return #err("Not authorized");
    };

    let ledgerW : actor {
      account_balance : ({ account : Blob }) -> async { e8s : Nat64 };
      transfer : ({
        memo        : Nat64;
        amount      : { e8s : Nat64 };
        fee         : { e8s : Nat64 };
        from_subaccount : ?Blob;
        to          : Blob;
        created_at_time : ?{ timestamp_nanos : Nat64 };
      }) -> async { #Ok : Nat64; #Err : { #BadFee : { expected_fee : { e8s : Nat64 } }; #InsufficientFunds : { balance : { e8s : Nat64 } }; #TxTooOld : { allowed_window_nanos : Nat64 }; #TxCreatedInFuture; #TxDuplicate : { duplicate_of : Nat64 } } };
    } = actor("ryjl3-tyaaa-aaaaa-aaaba-cai");

    let treasuryId = Payments.treasuryAccountId(selfRef.selfPrincipal);
    let liveBalance = try {
      let b = await ledgerW.account_balance({ account = treasuryId });
      b.e8s;
    } catch (e) {
      return #err("Failed to query Treasury balance: " # e.message());
    };

    let fee : Nat64 = 10_000;
    if (liveBalance <= fee) return #err("Treasury balance too small to cover network fee (balance: " # liveBalance.toText() # " e8s)");
    let net = liveBalance - fee;
    let toAccount = toPrincipal.toLedgerAccount(null);

    try {
      let result = await ledgerW.transfer({
        memo            = 0;
        amount          = { e8s = net };
        fee             = { e8s = fee };
        from_subaccount = ?Payments.treasurySubaccount();  // withdraw FROM Treasury subaccount
        to              = toAccount;
        created_at_time = null;
      });
      switch (result) {
        case (#Ok(_)) {
          fees.platformFeesE8s := 0; // reset audit counter
          #ok(net);
        };
        case (#Err(e)) #err("Ledger error: " # debug_show(e));
      };
    } catch (e) {
      #err("Transfer failed: " # e.message());
    };
  };

  // ── Hex helper ────────────────────────────────────────────────────────────

  func blobToHex(blob : Blob) : Text {
    let hexChars = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    var result = "";
    for (byte in blob.vals()) {
      let b = byte.toNat();
      result := result # hexChars[b / 16] # hexChars[b % 16];
    };
    result;
  };
}
