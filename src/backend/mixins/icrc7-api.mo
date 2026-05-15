import Principal "mo:core/Principal";
import NFTLib "../lib/nft";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import NFTTypes "../types/nft";

mixin (state : NFTLib.State) {
  // ICRC-7 Value variant for token metadata
  public type Value = {
    #Nat : Nat;
    #Int : Int;
    #Text : Text;
    #Blob : Blob;
    #Bool : Bool;
    #Array : [(Text, Value)];
    #Map : [(Text, Value)];
  };

  // ICRC-7 Account type
  public type Account = {
    owner : Principal;
    subaccount : ?Blob;
  };

  // Standard info
  public type Standard = {
    name : Text;
    url : Text;
  };

  public query func icrc7_name() : async Text {
    "ICP NFT Test";
  };

  public query func icrc7_symbol() : async Text {
    "INFT";
  };

  public query func icrc7_description() : async ?Text {
    ?"Test NFT collection on Internet Computer";
  };

  public query func icrc7_total_supply() : async Nat {
    state.nfts.size();
  };

  public query func icrc7_owner_of(tokenId : Nat) : async ?Account {
    switch (state.nfts.get(tokenId)) {
      case null null;
      case (?nft) ?{ owner = nft.owner; subaccount = null };
    };
  };

  public query func icrc7_tokens(prev : ?Nat, take : ?Nat) : async [Nat] {
    let allKeys = state.nfts.keys().toArray();
    let startIndex = switch (prev) {
      case null 0;
      case (?p) {
        var idx = 0;
        var found = false;
        label search for (k in allKeys.values()) {
          if (k == p) { found := true; break search };
          idx += 1;
        };
        if (found) idx + 1 else allKeys.size();
      };
    };
    let limit = switch (take) {
      case null 100;
      case (?t) t;
    };
    if (startIndex >= allKeys.size()) return [];
    let endIndex = Nat.min(startIndex + limit, allKeys.size());
    allKeys.sliceToArray(startIndex, endIndex);
  };

  public query func icrc7_tokens_of(account : Account, prev : ?Nat, take : ?Nat) : async [Nat] {
    let owned = state.nfts.entries()
      .filter(func((_, nft)) { Principal.equal(nft.owner, account.owner) })
      .map(func(entry) { entry.0 })
      .toArray();
    let startIndex = switch (prev) {
      case null 0;
      case (?p) {
        var idx = 0;
        var found = false;
        label search for (k in owned.values()) {
          if (k == p) { found := true; break search };
          idx += 1;
        };
        if (found) idx + 1 else owned.size();
      };
    };
    let limit = switch (take) {
      case null 100;
      case (?t) t;
    };
    if (startIndex >= owned.size()) return [];
    let endIndex = Nat.min(startIndex + limit, owned.size());
    owned.sliceToArray(startIndex, endIndex);
  };

  public query func icrc7_token_metadata(tokenIds : [Nat]) : async [?[(Text, Value)]] {
    tokenIds.map<Nat, ?[(Text, Value)]>(func(tokenId) {
      switch (state.nfts.get(tokenId)) {
        case null null;
        case (?nft) {
          ?[
            ("icrc7:name", #Text(nft.name)),
            ("icrc7:description", #Text(nft.description)),
            ("icrc7:image", #Blob(nft.image)),
            ("icrc7:owner", #Text(nft.owner.toText())),
            ("created_at", #Nat(Int.abs(nft.createdAt))),
          ];
        };
      };
    });
  };

  public query func icrc10_supported_standards() : async [Standard] {
    [
      { name = "ICRC-7"; url = "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-7/ICRC-7.md" },
      { name = "ICRC-10"; url = "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-10/ICRC-10.md" },
    ];
  };
}
