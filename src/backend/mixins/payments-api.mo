import Payments "../lib/payments";

mixin () {
  /// Fetch current ICP/USD price from the Exchange Rate Canister (XRC).
  /// Falls back to 10.0 USD on error.
  public func getICPPrice() : async Float {
    await Payments.getICPPrice();
  };

  /// Returns the total cycles needed for `imageCount` images.
  public query func estimateCycles(imageCount : Nat) : async Nat {
    Payments.calculateCycles(imageCount);
  };

  /// Returns the ICP amount needed (incl. 25 % surcharge) for `imageCount`
  /// images at the given `icpPriceUSD`.
  public query func estimateICPForImages(imageCount : Nat, icpPriceUSD : Float) : async Float {
    Payments.calculateICPNeeded(imageCount, icpPriceUSD);
  };

  /// Returns how many images a user can fund with `icpAmount` ICP
  /// at the given `icpPriceUSD`.
  public query func estimateImagesForICP(icpAmount : Float, icpPriceUSD : Float) : async Nat {
    Payments.calculateImagesFromICP(icpAmount, icpPriceUSD);
  };
}
