import Types "../types/nft";
import NFTLib "../lib/nft";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

mixin (state : NFTLib.State, factoryState : NFTLib.FactoryState, selfRef : { var selfPrincipal : Principal }) {
  public shared ({ caller }) func mintNFT(
    name : Text,
    description : Text,
    image : Blob,
    recipientOpt : ?Principal,
    isPublic : Bool,
    collectionName : ?Text,
  ) : async Types.MintResult {
    // Phase check: minter must be under the premium limit
    let mintCount = NFTLib.getMintCount(factoryState, caller);
    if (mintCount >= 25) {
      return #paymentRequired;
    };
    let owner = switch (recipientOpt) {
      case (?p) p;
      case null caller;
    };
    let mintEvent : Types.TransactionEvent = {
      eventType = #Mint;
      from = null;
      to = owner;
      timestamp = Time.now();
    };
    let result = NFTLib.mint(state, owner, name, description, image, mintEvent, isPublic, collectionName);
    // Increment count on successful mint (count is per-caller, not per-recipient)
    switch (result) {
      case (#ok _) { NFTLib.incrementMintCount(factoryState, caller) };
      case _ {};
    };
    result;
  };

  public shared ({ caller }) func getMyNFTs() : async [Types.NFTMetadataLite] {
    let cid = ?selfRef.selfPrincipal.toText();
    NFTLib.getByOwnerLite(state, caller, cid);
  };

  public query func getNFT(tokenId : Types.TokenId) : async ?Types.NFTMetadata {
    NFTLib.getById(state, tokenId);
  };

  public shared ({ caller }) func transferNFT(
    tokenId : Types.TokenId,
    to : Principal,
  ) : async Types.TransferResult {
    NFTLib.transfer(state, caller, tokenId, to);
  };

  public query func getNFTHistory(tokenId : Types.TokenId) : async ?[Types.TransactionEvent] {
    switch (NFTLib.getById(state, tokenId)) {
      case null null;
      case (?nft) ?nft.history;
    };
  };
  public query func getAllPublicNFTs() : async [Types.NFTMetadataLite] {
    let cid = ?selfRef.selfPrincipal.toText();
    NFTLib.getAllPublicLite(state, cid);
  };

  public query func getAllPublicNFTsPaginated(offset : Nat, limit : Nat) : async Types.NFTPageLite {
    let cid = ?selfRef.selfPrincipal.toText();
    NFTLib.getAllPublicPaginatedLite(state, offset, limit, cid);
  };

  public shared ({ caller }) func getMyNFTsPaginated(offset : Nat, limit : Nat) : async Types.NFTPageLite {
    let cid = ?selfRef.selfPrincipal.toText();
    NFTLib.getByOwnerPaginatedLite(state, caller, offset, limit, cid);
  };

  public query func getAllPublicNFTsByOwner(owner : Principal) : async [Types.NFTMetadataLite] {
    let cid = ?selfRef.selfPrincipal.toText();
    NFTLib.getAllPublicByOwnerLite(state, owner, cid);
  };

  /// Returns only the image Blob for a single NFT.
  /// Use this after fetching the list — avoids the 2 MB response limit.
  public query func getNFTImage(tokenId : Types.TokenId) : async ?Blob {
    NFTLib.getImageById(state, tokenId);
  };

  public shared ({ caller }) func setNFTVisibility(
    tokenId : Types.TokenId,
    isPublic : Bool,
  ) : async Types.VisibilityResult {
    NFTLib.setVisibility(state, caller, tokenId, isPublic);
  };
}
