import Types "../types/nft";
import NFTLib "../lib/nft";
import Principal "mo:core/Principal";

mixin (factoryState : NFTLib.FactoryState) {
  public shared ({ caller }) func createMyCollection() : async Text {
    switch (NFTLib.createCollection(factoryState, caller)) {
      case (#ok) "Collection created";
      case (#alreadyExists) "Collection already exists";
    };
  };

  public query func getMyCollection(user : Principal) : async ?Principal {
    NFTLib.getCollection(factoryState, user);
  };

  public query func getMyMintCount(user : Principal) : async Nat {
    NFTLib.getMintCount(factoryState, user);
  };

  public query func getCollectionPhase(user : Principal) : async Types.CollectionPhase {
    NFTLib.getCollectionPhase(factoryState, user);
  };
}
