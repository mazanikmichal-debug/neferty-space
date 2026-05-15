import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/nft";
import Principal "mo:core/Principal";
import Array "mo:core/Array";

module {
  public type State = {
    nfts : Map.Map<Types.TokenId, Types.NFTMetadata>;
    counter : { var nextId : Nat };
  };

  // Factory state: registry maps owner -> collection ID (owner principal, single-canister model)
  // mintCounts maps owner -> number of NFTs minted
  public type FactoryState = {
    collectionRegistry : Map.Map<Principal, Principal>;
    mintCounts : Map.Map<Principal, Nat>;
  };

  let PHASE_FREE_LIMIT   : Nat = 10;
  let PHASE_BONUS_LIMIT  : Nat = 25;

  public func getCollectionPhase(factoryState : FactoryState, user : Principal) : Types.CollectionPhase {
    let count = switch (factoryState.mintCounts.get(user)) {
      case (?n) n;
      case null 0;
    };
    if (count < PHASE_FREE_LIMIT) #Free
    else if (count < PHASE_BONUS_LIMIT) #Bonus
    else #Premium;
  };

  public func getMintCount(factoryState : FactoryState, user : Principal) : Nat {
    switch (factoryState.mintCounts.get(user)) {
      case (?n) n;
      case null 0;
    };
  };

  public func incrementMintCount(factoryState : FactoryState, user : Principal) {
    let current = getMintCount(factoryState, user);
    factoryState.mintCounts.add(user, current + 1);
  };

  public func createCollection(factoryState : FactoryState, caller : Principal) : { #ok; #alreadyExists } {
    if (factoryState.collectionRegistry.containsKey(caller)) {
      #alreadyExists;
    } else {
      // In single-canister model the collection ID is the owner's principal
      factoryState.collectionRegistry.add(caller, caller);
      #ok;
    };
  };

  public func getCollection(factoryState : FactoryState, user : Principal) : ?Principal {
    factoryState.collectionRegistry.get(user);
  };

  public func mint(
    state : State,
    owner : Principal,
    name : Text,
    description : Text,
    image : Blob,
    mintEvent : Types.TransactionEvent,
    isPublic : Bool,
    collectionName : ?Text,
  ) : Types.MintResult {
    let tokenId = state.counter.nextId;
    state.counter.nextId += 1;
    let metadata : Types.NFTMetadata = {
      tokenId;
      owner;
      name;
      description;
      image;
      createdAt = mintEvent.timestamp;
      history = [mintEvent];
      isPublic;
      collectionName;
    };
    state.nfts.add(tokenId, metadata);
    #ok tokenId;
  };

  public func getByOwner(
    state : State,
    owner : Principal,
  ) : [Types.NFTMetadata] {
    state.nfts.values().filter(func(nft) { Principal.equal(nft.owner, owner) }).toArray();
  };

  public func getById(
    state : State,
    tokenId : Types.TokenId,
  ) : ?Types.NFTMetadata {
    state.nfts.get(tokenId);
  };
  public func getAllPublic(
    state : State,
  ) : [Types.NFTMetadata] {
    state.nfts.values().filter(func(nft) { nft.isPublic }).toArray();
  };

  public func getAllPublicByOwner(
    state : State,
    owner : Principal,
  ) : [Types.NFTMetadata] {
    state.nfts.values().filter(func(nft) { nft.isPublic and Principal.equal(nft.owner, owner) }).toArray();
  };

  public func getAllPublicPaginated(
    state : State,
    offset : Nat,
    limit : Nat,
  ) : Types.NFTPage {
    let all = getAllPublic(state);
    let total = all.size();
    let start = if (offset >= total) total else offset;
    let end_ = if (start + limit > total) total else start + limit;
    { items = all.sliceToArray(start, end_); total };
  };

  public func getByOwnerPaginated(
    state : State,
    owner : Principal,
    offset : Nat,
    limit : Nat,
  ) : Types.NFTPage {
    let all = getByOwner(state, owner);
    let total = all.size();
    let start = if (offset >= total) total else offset;
    let end_ = if (start + limit > total) total else start + limit;
    { items = all.sliceToArray(start, end_); total };
  };

  public func setVisibility(
    state : State,
    caller : Principal,
    tokenId : Types.TokenId,
    isPublic : Bool,
  ) : Types.VisibilityResult {
    switch (state.nfts.get(tokenId)) {
      case null { #err "NFT not found" };
      case (?nft) {
        if (not Principal.equal(nft.owner, caller)) {
          return #err "Not the owner";
        };
        state.nfts.add(tokenId, { nft with isPublic });
        #ok;
      };
    };
  };

  public func transfer(
    state : State,
    caller : Principal,
    tokenId : Types.TokenId,
    to : Principal,
  ) : Types.TransferResult {
    switch (state.nfts.get(tokenId)) {
      case null { #err "NFT not found" };
      case (?nft) {
        if (not Principal.equal(nft.owner, caller)) {
          return #err "Not the owner";
        };
        let transferEvent : Types.TransactionEvent = {
          eventType = #Transfer;
          from = ?caller;
          to;
          timestamp = Time.now();
        };
        let updated : Types.NFTMetadata = {
          nft with
          owner = to;
          history = nft.history.concat([transferEvent]);
        };
        state.nfts.add(tokenId, updated);
        #ok;
      };
    };
  };
}
