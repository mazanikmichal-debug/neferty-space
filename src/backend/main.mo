import Map "mo:core/Map";
import NFTMixin "mixins/nft-api";
import NFTLib "lib/nft";
import NFTTypes "types/nft";
import ICRC7Mixin "mixins/icrc7-api";
import FactoryMixin "mixins/factory-api";

actor {
  let nfts = Map.empty<NFTTypes.TokenId, NFTTypes.NFTMetadata>();
  let counter = { var nextId : Nat = 0 };
  let nftState : NFTLib.State = { nfts; counter };

  let collectionRegistry = Map.empty<Principal, Principal>();
  let mintCounts = Map.empty<Principal, Nat>();
  let factoryState : NFTLib.FactoryState = { collectionRegistry; mintCounts };

  include NFTMixin(nftState, factoryState);
  include ICRC7Mixin(nftState);
  include FactoryMixin(factoryState);
}
