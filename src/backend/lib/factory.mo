import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  /// In-memory registry entry: (owner, collectionCanisterId).
  public type RegistryEntry = (Principal, Principal);

  /// Mutable state for the factory — holds the registry and admin.
  public type State = {
    registry : List.List<RegistryEntry>;
    admin    : { var principal : Principal };
    admins   : List.List<Principal>;
  };

  // ── Initialisation ────────────────────────────────────────────────────────

  /// Create fresh State from a snapshot (used in main.mo on startup / restore).
  public func init(snapshot : [RegistryEntry], adminPrincipal : Principal) : State {
    let registry = List.fromArray(snapshot);
    let admin    = { var principal = adminPrincipal };
    let admins   = List.empty<Principal>();
    { registry; admin; admins };
  };

  /// Returns true if `caller` is one of the registered admins.
  public func isAdmin(state : State, caller : Principal) : Bool {
    state.admins.find(func(a) { Principal.equal(caller, a) }) != null;
  };

  // ── Admin management ─────────────────────────────────────────────────────

  /// Returns all admin principals as an array.
  public func getAdmins(state : State) : [Principal] {
    state.admins.toArray();
  };

  /// Adds a new admin. Returns #err if already present.
  public func addAdmin(state : State, newAdmin : Principal) : { #ok; #err : Text } {
    if (state.admins.find(func(a) { Principal.equal(a, newAdmin) }) != null) {
      return #err("Principal is already an admin");
    };
    state.admins.add(newAdmin);
    #ok;
  };

  /// Removes an admin. Returns #err if not found or if removing would leave 0 admins.
  public func removeAdmin(state : State, adminToRemove : Principal) : { #ok; #err : Text } {
    if (state.admins.find(func(a) { Principal.equal(a, adminToRemove) }) == null) {
      return #err("Principal is not an admin");
    };
    if (state.admins.size() <= 1) {
      return #err("Cannot remove the last admin");
    };
    let filtered = state.admins.filter(func(a) { not Principal.equal(a, adminToRemove) });
    state.admins.clear();
    state.admins.addAll(filtered.values());
    #ok;
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

  // ── Cleanup ───────────────────────────────────────────────────────────────

  /// Remove all registry entries whose collection ID is the zero principal ("aaaaa-aa").
  /// Returns the number of corrupted entries removed.
  public func removeCorruptedEntries(state : State) : Nat {
    let zeroPrincipal = Principal.fromText("aaaaa-aa");
    let before = state.registry.size();
    let filtered = state.registry.filter(func((_, cid)) { not Principal.equal(cid, zeroPrincipal) });
    state.registry.clear();
    state.registry.addAll(filtered.values());
    before - state.registry.size();
  };

  /// Remove the registry entry for `owner` if and only if its collection ID
  /// is the zero/placeholder principal ("aaaaa-aa"). Returns 1 if removed, 0 otherwise.
  public func removeSingleCorruptedEntry(state : State, owner : Principal) : Nat {
    let zeroPrincipal = Principal.fromText("aaaaa-aa");
    switch (getCollection(state, owner)) {
      case (?cid) {
        if (not Principal.equal(cid, zeroPrincipal)) return 0;
        let filtered = state.registry.filter(func((o, _)) { not Principal.equal(o, owner) });
        state.registry.clear();
        state.registry.addAll(filtered.values());
        1;
      };
      case null 0;
    };
  };
}
