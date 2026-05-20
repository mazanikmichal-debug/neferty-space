import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  /// Mutable state for the factory — holds the registry and admin.
  public type State = {
    registry : Map.Map<Principal, [Principal]>;
    admin    : { var principal : Principal };
    admins   : List.List<Principal>;
  };

  // ── Initialisation ────────────────────────────────────────────────────────

  /// Create fresh State.
  public func init(adminPrincipal : Principal) : State {
    let registry = Map.empty<Principal, [Principal]>();
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
  /// Returns all collection canister Principals for `owner`, or empty array.
  public func getCollections(state : State, owner : Principal) : [Principal] {
    switch (state.registry.get(owner)) {
      case (?arr) arr;
      case null   [];
    };
  };

  // ── Mutation ──────────────────────────────────────────────────────────────

  /// Append (owner, collectionId) to the registry.
  /// Append collectionId to the owner's array in the registry.
  public func addToRegistry(state : State, owner : Principal, collectionId : Principal) {
    let existing = switch (state.registry.get(owner)) {
      case (?arr) arr;
      case null   [];
    };
    state.registry.add(owner, existing.concat([collectionId]));
  };

  /// Remove a specific collectionId from `owner`'s registry array.
  /// Removes the owner key entirely if the array becomes empty after removal.
  /// Returns #ok(true) if the collectionId was found and removed,
  /// #err("Collection not found") if it was not in the owner's array.
  public func removeFromRegistry(state : State, owner : Principal, collectionId : Principal) : { #ok : Bool; #err : Text } {
    switch (state.registry.get(owner)) {
      case null { #err("Collection not found") };
      case (?arr) {
        let filtered = arr.filter(func(cid) { not Principal.equal(cid, collectionId) });
        if (filtered.size() == arr.size()) {
          return #err("Collection not found");
        };
        if (filtered.size() == 0) {
          state.registry.remove(owner);
        } else {
          state.registry.add(owner, filtered);
        };
        #ok(true);
      };
    };
  };

  // ── Registry helpers ──────────────────────────────────────────────────────

  /// Returns total number of registered collections.
  /// Returns total number of registered owners.
  public func getRegistrySize(state : State) : Nat {
    state.registry.size();
  };

  // ── Cleanup ───────────────────────────────────────────────────────────────

  /// Remove all registry entries whose collection ID is the zero principal ("aaaaa-aa").
  /// Returns the number of corrupted entries removed.
  /// Remove all aaaaa-aa entries from every owner's collection array.
  /// Removes the owner key entirely if their array becomes empty.
  /// Returns the number of corrupted principals removed.
  public func removeCorruptedEntries(state : State) : Nat {
    let zeroPrincipal = Principal.fromText("aaaaa-aa");
    var removed : Nat = 0;
    let toDelete = List.empty<Principal>();
    for ((owner, arr) in state.registry.entries()) {
      let clean = arr.filter(func(cid) { not Principal.equal(cid, zeroPrincipal) });
      let delta = if (arr.size() >= clean.size()) arr.size() - clean.size() else 0;
      removed += delta;
      if (clean.size() == 0) {
        toDelete.add(owner);
      } else if (delta > 0) {
        state.registry.add(owner, clean);
      };
    };
    for (owner in toDelete.values()) {
      state.registry.remove(owner);
    };
    removed;
  };

  /// Remove the registry entry for `owner` if and only if its collection ID
  /// is the zero/placeholder principal ("aaaaa-aa"). Returns 1 if removed, 0 otherwise.
  /// Remove aaaaa-aa entries from `owner`'s collection array.
  /// Removes the owner key if the array becomes empty.
  /// Returns the number of corrupted principals removed.
  public func removeSingleCorruptedEntry(state : State, owner : Principal) : Nat {
    let zeroPrincipal = Principal.fromText("aaaaa-aa");
    switch (state.registry.get(owner)) {
      case null 0;
      case (?arr) {
        let clean = arr.filter(func(cid) { not Principal.equal(cid, zeroPrincipal) });
        let removed = arr.size() - clean.size();
        if (removed == 0) return 0;
        if (clean.size() == 0) {
          state.registry.remove(owner);
        } else {
          state.registry.add(owner, clean);
        };
        removed;
      };
    };
  };
}
