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
    collectionName : ?Text;
  };

  public type MintResult = { #ok : TokenId; #paymentRequired; #err : Text };
  public type CollectionPhase = { #Free; #Bonus; #Premium };

  /// Cycle health colour returned to the frontend.
  public type CycleHealth = { #green; #yellow; #red };

  /// Human-readable health payload shown in Settings dashboard.
  public type HealthStatus = {
    status       : Text;
    daysRemaining   : Nat;
    imagesRemaining : Nat;
    healthColor  : CycleHealth;
  };
  public type TransferResult = { #ok; #err : Text };
  public type VisibilityResult = { #ok; #err : Text };

  public type NFTPage = { items : [NFTMetadata]; total : Nat };
}
