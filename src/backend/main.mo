import Map "mo:core/Map";
import Set "mo:core/Set";
import NFTMixin "mixins/nft-api";
import NFTLib "lib/nft";
import NFTTypes "types/nft";
import ICRC7Mixin "mixins/icrc7-api";
import FactoryMixin "mixins/factory-api";
import FactoryLib "lib/factory";
import PaymentsMixin "mixins/payments-api";
import Principal "mo:core/Principal";
import Nat64 "mo:core/Nat64";
import Int "mo:core/Int";



actor NefertyFactory {
  // ── NFT state (single-canister gallery) ─────────────────────────────────
  let nfts = Map.empty<NFTTypes.TokenId, NFTTypes.NFTMetadata>();
  let counter = { var nextId : Nat = 0 };
  let nftState : NFTLib.State = { nfts; counter };

  let collectionRegistry = Map.empty<Principal, Principal>();
  let mintCounts = Map.empty<Principal, Nat>();
  let factoryState : NFTLib.FactoryState = { collectionRegistry; mintCounts };

  // ── Factory state (multi-canister registry) ──────────────────────────────
  // admin is wired to the actor's own principal so it is always correct after deploy/upgrade
  let factory : FactoryLib.State = FactoryLib.init([], Principal.fromActor(NefertyFactory));

  // ── Platform treasury: accumulates 25 % of all top-up payments ──────────
  let treasury = { var platformFeesE8s : Nat64 = 0 };

  // ── Self-principal — initialised at actor construction time so it is always
  //    correct on first deploy and after every upgrade without manual initSelf(). ───
  let selfRef = { var selfPrincipal : Principal = Principal.fromActor(NefertyFactory) };

  // ── Cycles snapshot for burn-rate estimation in getStatus() ─────────────
  let cyclesSnap = { var lastCycles : Nat = 0; var lastSnapshotTime : Int = 0 };

  // ── Double-spend protection: tracks all processed Ledger block indexes ────
  let usedBlockIndexes = Set.empty<Nat64>();

  // ── Pending / completed top-up transaction log ────────────────────────────
  let pendingTransactions = Map.empty<Nat64, NFTTypes.PendingTx>();

  include NFTMixin(nftState, factoryState);
  include ICRC7Mixin(nftState);
  include FactoryMixin(factory, treasury, selfRef, cyclesSnap, factoryState);
  include PaymentsMixin(treasury, factory, selfRef, usedBlockIndexes, pendingTransactions);

  /// Manual trigger — available for emergency use via Candid UI / frontend.
  /// Also purges any corrupted aaaaa-aa registry entries left from failed createMyCollection calls.
  public func initSelf() : async () {
    selfRef.selfPrincipal := Principal.fromActor(NefertyFactory);
    factory.admin.principal := Principal.fromActor(NefertyFactory);
    ignore FactoryLib.removeCorruptedEntries(factory);
  };
}
