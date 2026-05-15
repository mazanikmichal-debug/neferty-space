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
  /// Percentage-based: green >50 %, orange 20-50 %, red <20 % (365 days = 100 %).
  public type CycleHealth = { #green; #orange; #red };

  /// Human-readable health payload shown in Settings dashboard.
  public type HealthStatus = {
    status          : Text;
    daysRemaining   : Nat;
    imagesRemaining : Nat;
    daysPercentage  : Nat;    // (daysRemaining / 365 * 100) capped at 100
    healthColor     : CycleHealth;
    rawCycles       : Nat;    // expert mode: actual cycle balance
    estimatedStorageMB : Nat; // expert mode: mintCount * 500KB / 1024
  };

  /// Result of a successful top-up via ICP Ledger + CMC.
  public type TopUpResult = {
    #ok  : { icpUsed : Nat64; cyclesMinted : Nat; platformFee : Nat64 };
    #err : Text;
  };

  /// Admin withdrawal result.
  public type WithdrawResult = {
    #ok  : Nat64;
    #err : Text;
  };
  public type TransferResult = { #ok; #err : Text };
  public type VisibilityResult = { #ok; #err : Text };

  public type NFTPage = { items : [NFTMetadata]; total : Nat };
}
