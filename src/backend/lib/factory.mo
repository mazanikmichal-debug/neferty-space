import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  /// In-memory registry entry: (owner, collectionCanisterId).
  public type RegistryEntry = (Principal, Principal);

  /// Mutable state for the factory — holds the registry and admin.
  public type State = {
    registry : List.List<RegistryEntry>;
    admin    : { var principal : Principal };
  };

  // ── Initialisation ────────────────────────────────────────────────────────

  /// Create fresh State from a snapshot (used in main.mo on startup / restore).
  public func init(snapshot : [RegistryEntry], adminPrincipal : Principal) : State {
    let registry = List.fromArray(snapshot);
    let admin    = { var principal = adminPrincipal };
    { registry; admin };
  };

  // ── Lookup ────────────────────────────────────────────────────────────────

  /// Returns the collection canister Principal for `owner`, or null.
  public func getCollection(state : State, owner : Principal) : ?Principal {
    switch (state.registry.find(func((o, _)) { Principal.equal(o, owner) })) {
      case (?(_, cid)) ?cid;
      case null        null;
    };
  };

  // ── Mutation ──────────────────────────────────────────────────────────────

  /// Append (owner, collectionId) to the registry.
  public func addToRegistry(state : State, owner : Principal, collectionId : Principal) {
    state.registry.add((owner, collectionId));
  };

  // ── Registry helpers ──────────────────────────────────────────────────────

  /// Returns total number of registered collections.
  public func getRegistrySize(state : State) : Nat {
    state.registry.size();
  };
}
