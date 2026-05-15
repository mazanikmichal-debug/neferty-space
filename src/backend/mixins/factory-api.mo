import Types "../types/nft";
import FactoryLib "../lib/factory";
import CollectionLib "../lib/collection";
import Payments "../lib/payments";
import Principal "mo:core/Principal";

mixin (factory : FactoryLib.State) {

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

  /// Returns human-readable health: status text, days remaining, images remaining.
  public shared ({ caller }) func getMyHealthStatus() : async Types.HealthStatus {
    let cycles = switch (FactoryLib.getCollection(factory, caller)) {
      case null 0;
      case (?cid) {
        let col = actor(cid.toText()) : actor { getCycleBalance : () -> async Nat };
        await col.getCycleBalance();
      };
    };
    let days   = Payments.estimateDaysFromCycles(cycles);
    let images = Payments.estimateImagesFromCycles(cycles);
    let color  = Payments.cycleHealthStatus(cycles);
    let statusText = "Collection has fuel for ~" # days.toText() # " more days (" # images.toText() # " images remaining)";
    { status = statusText; daysRemaining = days; imagesRemaining = images; healthColor = color };
  };
}
