import CollectionTypes "../types/collection";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Cycles "mo:core/Cycles";

/// actor class — each artist gets their own deployed instance.
actor class Collection(initialOwner : Principal) {

  let owner   : Principal                              = initialOwner;
  let nfts    : List.List<CollectionTypes.CollectionNFT> = List.empty();
  let counter : { var nextId : Nat }                   = { var nextId = 0 };

  let PHASE_FREE  : Nat = 10;
  let PHASE_BONUS : Nat = 25;

  // ── Queries ───────────────────────────────────────────────────────────────

  public query func getMintCount() : async Nat {
    counter.nextId;
  };

  public query func getPhase() : async CollectionTypes.CollectionPhase {
    let count = counter.nextId;
    if (count < PHASE_FREE)  #Free
    else if (count < PHASE_BONUS) #Bonus
    else #Premium;
  };

  /// Returns raw cycle balance of this canister.
  public query func getCycleBalance() : async Nat {
    Cycles.balance();
  };

  public query func getMyNFTs(offset : Nat, limit : Nat) : async CollectionTypes.NFTPage {
    let all   = nfts.toArray();
    let total = all.size();
    let start = if (offset >= total) total else offset;
    let end_  = if (start + limit > total) total else start + limit;
    { items = all.sliceToArray(start, end_); total };
  };

  public query func getAllPublicNFTs() : async [CollectionTypes.CollectionNFT] {
    nfts.filter(func(nft) { nft.isPublic }).toArray();
  };

  // ── Updates ───────────────────────────────────────────────────────────────

  public shared ({ caller }) func mintNFT(
    name           : Text,
    image          : Blob,
    collectionName : Text,
    isPublic       : Bool,
    recipient      : ?Principal,
  ) : async CollectionTypes.MintResult {
    if (not Principal.equal(caller, owner)) return #unauthorized;
    if (counter.nextId >= PHASE_BONUS)       return #limitReached;

    let tokenOwner = switch (recipient) {
      case (?p) p;
      case null caller;
    };
    let tokenId = counter.nextId;
    counter.nextId += 1;

    let mintEvent : CollectionTypes.TransactionEvent = {
      eventType = #Mint;
      from      = null;
      to        = tokenOwner;
      timestamp = Time.now();
    };
    let nft : CollectionTypes.CollectionNFT = {
      tokenId;
      owner     = tokenOwner;
      name;
      image;
      collectionName;
      isPublic;
      createdAt = Time.now();
      history   = [mintEvent];
    };
    nfts.add(nft);
    #ok(tokenId);
  };

  public shared ({ caller }) func transferNFT(
    tokenId : Nat,
    to      : Principal,
  ) : async CollectionTypes.TransferResult {
    if (not Principal.equal(caller, owner)) return #err("Not the owner");
    switch (nfts.findIndex(func(n) { n.tokenId == tokenId })) {
      case null { #err("NFT not found") };
      case (?idx) {
        let nft = nfts.at(idx);
        if (not Principal.equal(nft.owner, caller)) return #err("Not the owner");
        let transferEvent : CollectionTypes.TransactionEvent = {
          eventType = #Transfer;
          from      = ?caller;
          to;
          timestamp = Time.now();
        };
        let updated : CollectionTypes.CollectionNFT = {
          nft with
          owner   = to;
          history = nft.history.concat([transferEvent]);
        };
        nfts.put(idx, updated);
        #ok;
      };
    };
  };

  public shared ({ caller }) func setVisibility(
    tokenId  : Nat,
    isPublic : Bool,
  ) : async CollectionTypes.VisibilityResult {
    if (not Principal.equal(caller, owner)) return #err("Not the owner");
    switch (nfts.findIndex(func(n) { n.tokenId == tokenId })) {
      case null { #err("NFT not found") };
      case (?idx) {
        let nft = nfts.at(idx);
        nfts.put(idx, { nft with isPublic });
        #ok;
      };
    };
  };
}
