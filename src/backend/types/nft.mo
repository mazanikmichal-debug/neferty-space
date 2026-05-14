import Time "mo:core/Time";

module {
  public type TokenId = Nat;

  public type TransactionEvent = {
    eventType : { #Mint; #Transfer };
    from : ?Principal;
    to : Principal;
    timestamp : Int;
  };

  public type NFTMetadata = {
    tokenId : TokenId;
    owner : Principal;
    name : Text;
    description : Text;
    image : Blob;
    createdAt : Time.Time;
    history : [TransactionEvent];
    isPublic : Bool;
  };

  public type MintResult = { #ok : TokenId; #paymentRequired; #err : Text };
  public type CollectionPhase = { #free; #bonus; #premium };
  public type TransferResult = { #ok; #err : Text };
  public type VisibilityResult = { #ok; #err : Text };

  public type NFTPage = { items : [NFTMetadata]; total : Nat };
}
