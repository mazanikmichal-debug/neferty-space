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

  /// Result of processTopUp (includes cycles minted on success).
  public type ProcessTopUpResult = {
    #ok  : { cyclesMinted : Nat; icpUsed : Nat64; platformFee : Nat64 };
    #err : Text;
  };

  /// Status of a pending top-up transaction.
  public type TxStatus = { #pending; #completed; #failed };

  /// Pending / completed transaction record stored in Factory.
  public type PendingTx = {
    caller        : Principal;
    collectionId  : Principal;
    amount        : Nat64;       // e8s verified from Ledger block
    blockIndex    : Nat64;       // Ledger block index used for this top-up
    status        : TxStatus;
    retryCount    : Nat;
    createdAt     : Int;
    lastAttemptAt : Int;
  };

  /// Admin withdrawal result.
  public type WithdrawResult = {
    #ok  : Nat64;
    #err : Text;
  };
  public type TransferResult = { #ok; #err : Text };
  public type VisibilityResult = { #ok; #err : Text };

  public type NFTPage = { items : [NFTMetadata]; total : Nat };

  /// Lightweight NFT metadata returned by list endpoints — NO image Blob.
  /// Use getNFTImage(tokenId) to fetch the image separately.
  public type NFTMetadataLite = {
    tokenId : TokenId;
    owner : Principal;
    name : Text;
    description : Text;
    createdAt : Time.Time;
    history : [TransactionEvent];
    isPublic : Bool;
    collectionName : ?Text;
    collectionCanisterId : ?Text;
  };

  public type NFTPageLite = { items : [NFTMetadataLite]; total : Nat };
}
