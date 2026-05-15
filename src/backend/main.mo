import Map "mo:core/Map";
import NFTMixin "mixins/nft-api";
import NFTLib "lib/nft";
import NFTTypes "types/nft";
import ICRC7Mixin "mixins/icrc7-api";
import FactoryMixin "mixins/factory-api";
import FactoryLib "lib/factory";
import PaymentsMixin "mixins/payments-api";
import Principal "mo:core/Principal";

actor {
  // ── NFT state (single-canister gallery) ─────────────────────────────────
  let nfts = Map.empty<NFTTypes.TokenId, NFTTypes.NFTMetadata>();
  let counter = { var nextId : Nat = 0 };
  let nftState : NFTLib.State = { nfts; counter };

  let collectionRegistry = Map.empty<Principal, Principal>();
  let mintCounts = Map.empty<Principal, Nat>();
  let factoryState : NFTLib.FactoryState = { collectionRegistry; mintCounts };

  // ── Factory state (multi-canister registry) ──────────────────────────────
  // admin is the anonymous principal by default; update after deploy
  let factory : FactoryLib.State = FactoryLib.init([], Principal.fromText("aaaaa-aa"));

  include NFTMixin(nftState, factoryState);
  include ICRC7Mixin(nftState);
  include FactoryMixin(factory);
  include PaymentsMixin();
}
