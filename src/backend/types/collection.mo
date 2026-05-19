module {
  /// Phase of a Collection canister based on mint count.
  public type CollectionPhase = { #Free; #Bonus; #Premium };

  /// Result variants for minting inside a Collection canister.
  public type MintResult = { #ok : Nat; #limitReached; #unauthorized };

  /// Result for transfer / visibility ops inside Collection.
  public type TransferResult = { #ok; #err : Text };
  public type VisibilityResult = { #ok; #err : Text };

  /// A single NFT record stored inside a Collection canister.
  public type CollectionNFT = {
    tokenId   : Nat;
    owner     : Principal;
    name      : Text;
    image     : Blob;
    collectionName : Text;
    isPublic  : Bool;
    createdAt : Int;
    history   : [TransactionEvent];
  };

  public type TransactionEvent = {
    eventType : { #Mint; #Transfer };
    from      : ?Principal;
    to        : Principal;
    timestamp : Int;
  };

  /// Paginated response.
  public type NFTPage = { items : [CollectionNFT]; total : Nat };

  /// Lightweight NFT record without image Blob for list endpoints.
  public type CollectionNFTLite = {
    tokenId   : Nat;
    owner     : Principal;
    name      : Text;
    collectionName : Text;
    isPublic  : Bool;
    createdAt : Int;
    history   : [TransactionEvent];
  };

  public type NFTPageLite = { items : [CollectionNFTLite]; total : Nat };
}
