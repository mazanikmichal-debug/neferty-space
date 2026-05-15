import Types "../types/nft";
import FactoryLib "../lib/factory";
import CollectionLib "../lib/collection";
import Payments "../lib/payments";
import Principal "mo:core/Principal";
import Nat64 "mo:core/Nat64";
import Runtime "mo:core/Runtime";
import Nat8 "mo:core/Nat8";
import Error "mo:core/Error";

// fees state is injected from main.mo so mixin mutations persist
mixin (factory : FactoryLib.State, fees : { var platformFeesE8s : Nat64 }, selfRef : { var selfPrincipal : Principal }) {

  // ── Collection lifecycle ──────────────────────────────────────────────────

  /// Idempotent: returns existing collection ID, or deploys a new one.
  public shared ({ caller }) func createMyCollection() : async Principal {
    switch (FactoryLib.getCollection(factory, caller)) {
      case (?cid) cid;
      case null {
        let col = await (with cycles = 500_000_000_000) CollectionLib.Collection(caller);
        let cid = Principal.fromActor(col);
        FactoryLib.addToRegistry(factory, caller, cid);
        cid;
      };
    };
  };

  public query func getMyCollection(user : Principal) : async ?Principal {
    FactoryLib.getCollection(factory, user);
  };

  // ── Delegated queries to the Collection canister ──────────────────────────

  public shared func getMyMintCount(user : Principal) : async Nat {
    switch (FactoryLib.getCollection(factory, user)) {
      case null 0;
      case (?cid) {
        let col = actor(cid.toText()) : actor { getMintCount : () -> async Nat };
        await col.getMintCount();
      };
    };
  };

  public shared func getCollectionPhase(user : Principal) : async Types.CollectionPhase {
    switch (FactoryLib.getCollection(factory, user)) {
      case null #Free;
      case (?cid) {
        let col = actor(cid.toText()) : actor { getPhase : () -> async Types.CollectionPhase };
        await col.getPhase();
      };
    };
  };

  /// Returns the raw cycle balance of the caller's Collection canister.
  public shared ({ caller }) func getMyCollectionCycles() : async Nat {
    switch (FactoryLib.getCollection(factory, caller)) {
      case null 0;
      case (?cid) {
        let col = actor(cid.toText()) : actor { getCycleBalance : () -> async Nat };
        await col.getCycleBalance();
      };
    };
  };

  /// Returns human-readable health with expert data for Settings dashboard.
  public shared ({ caller }) func getMyHealthStatus() : async Types.HealthStatus {
    let mintCount = switch (FactoryLib.getCollection(factory, caller)) {
      case null 0;
      case (?cid) {
        let col = actor(cid.toText()) : actor { getMintCount : () -> async Nat };
        await col.getMintCount();
      };
    };
    let cycles = switch (FactoryLib.getCollection(factory, caller)) {
      case null 0;
      case (?cid) {
        let col = actor(cid.toText()) : actor { getCycleBalance : () -> async Nat };
        await col.getCycleBalance();
      };
    };
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

  // ── Admin treasury ────────────────────────────────────────────────────────

  /// Returns the admin principal (used for access control).
  public query func getAdminPrincipal() : async Principal {
    factory.admin.principal;
  };

  /// Returns accumulated platform fees (25 %). Admin only.
  public query ({ caller }) func getPlatformFees() : async Nat64 {
    if (not Principal.equal(caller, factory.admin.principal)) {
      Runtime.trap("Not authorized");
    };
    fees.platformFeesE8s;
  };

  /// Returns the Factory canister's own ICP account identifier as hex Text.
  public query func getFactoryAccountId() : async Text {
    let accountBlob = selfRef.selfPrincipal.toLedgerAccount(null);
    blobToHex(accountBlob);
  };

  /// Transfers accumulated platform fees to `toPrincipal`. Admin only.
  public shared ({ caller }) func withdrawPlatformFees(toPrincipal : Principal) : async Types.WithdrawResult {
    if (not Principal.equal(caller, factory.admin.principal)) {
      return #err("Not authorized");
    };
    let amount = fees.platformFeesE8s;
    if (amount == 0) return #err("No fees to withdraw");

    let ledger : actor {
      transfer : ({
        memo        : Nat64;
        amount      : { e8s : Nat64 };
        fee         : { e8s : Nat64 };
        from_subaccount : ?Blob;
        to          : Blob;
        created_at_time : ?{ timestamp_nanos : Nat64 };
      }) -> async { #Ok : Nat64; #Err : { #BadFee : { expected_fee : { e8s : Nat64 } }; #InsufficientFunds : { balance : { e8s : Nat64 } }; #TxTooOld : { allowed_window_nanos : Nat64 }; #TxCreatedInFuture; #TxDuplicate : { duplicate_of : Nat64 } } };
    } = actor("ryjl3-tyaaa-aaaaa-aaaba-cai");

    let fee : Nat64 = 10_000;
    if (amount <= fee) return #err("Amount too small to cover network fee");
    let net = amount - fee;
    let toAccount = toPrincipal.toLedgerAccount(null);

    try {
      let result = await ledger.transfer({
        memo            = 0;
        amount          = { e8s = net };
        fee             = { e8s = fee };
        from_subaccount = null;
        to              = toAccount;
        created_at_time = null;
      });
      switch (result) {
        case (#Ok(_)) {
          fees.platformFeesE8s := 0;
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
