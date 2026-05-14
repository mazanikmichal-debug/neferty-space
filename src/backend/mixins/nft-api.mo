import Types "../types/nft";
import NFTLib "../lib/nft";
import Time "mo:core/Time";

mixin (state : NFTLib.State, factoryState : NFTLib.FactoryState) {
  public shared ({ caller }) func mintNFT(
    name : Text,
    description : Text,
    image : Blob,
    recipientOpt : ?Principal,
    isPublic : Bool,
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
    let result = NFTLib.mint(state, owner, name, description, image, mintEvent, isPublic);
    // Increment count on successful mint (count is per-caller, not per-recipient)
    switch (result) {
      case (#ok _) { NFTLib.incrementMintCount(factoryState, caller) };
      case _ {};
    };
    result;
  };

  public shared query ({ caller }) func getMyNFTs() : async [Types.NFTMetadata] {
    NFTLib.getByOwner(state, caller);
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
  public query func getAllPublicNFTs() : async [Types.NFTMetadata] {
    NFTLib.getAllPublic(state);
  };

  public query func getAllPublicNFTsPaginated(offset : Nat, limit : Nat) : async Types.NFTPage {
    NFTLib.getAllPublicPaginated(state, offset, limit);
  };

  public shared query ({ caller }) func getMyNFTsPaginated(offset : Nat, limit : Nat) : async Types.NFTPage {
    NFTLib.getByOwnerPaginated(state, caller, offset, limit);
  };

  public shared ({ caller }) func setNFTVisibility(
    tokenId : Types.TokenId,
    isPublic : Bool,
  ) : async Types.VisibilityResult {
    NFTLib.setVisibility(state, caller, tokenId, isPublic);
  };
}
