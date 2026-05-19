import Float "mo:core/Float";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Nat32 "mo:core/Nat32";
import Nat64 "mo:core/Nat64";
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Debug "mo:core/Debug";
import Int64 "mo:core/Int64";

module {
  // ── XRC type definitions ───────────────────────────────────────────────────

  type AssetClass = { #Cryptocurrency; #FiatCurrency };

  type Asset = {
    symbol : Text;
    class_ : AssetClass;
  };

  type GetExchangeRateRequest = {
    base_asset : Asset;
    quote_asset : Asset;
    timestamp : ?Nat64;
  };

  type ExchangeRateMetadata = {
    decimals : Nat32;
    forex_timestamp : ?Nat64;
    num_received_rates : Nat64;
    base_asset_num_received_rates : Nat64;
    base_asset_num_queried_sources : Nat64;
    standard_deviation : Nat64;
    quote_asset_num_received_rates : Nat64;
    quote_asset_num_queried_sources : Nat64;
  };

  type ExchangeRate = {
    rate : Nat64;
    metadata : ExchangeRateMetadata;
    base_asset : Asset;
    quote_asset : Asset;
    timestamp : Nat64;
  };

  type ExchangeRateError = {
    #AnonymousPrincipalNotAllowed;
    #CryptoQuoteAssetNotFound;
    #FailedToAcceptCycles;
    #ForexBaseAssetNotFound;
    #CryptoBaseAssetNotFound;
    #StablecoinRateTooFewRates;
    #ForexAssetsNotFound;
    #InconsistentRatesReceived;
    #RateLimited;
    #StablecoinRateZeroRate;
    #Other : { code : Nat32; description : Text };
    #ForexInvalidTimestamp;
    #NotEnoughCycles;
    #ForexQuoteAssetNotFound;
    #StablecoinRateNotFound;
    #Pending;
  };

  type GetExchangeRateResult = {
    #Ok : ExchangeRate;
    #Err : ExchangeRateError;
  };

  // ── Treasury subaccount ──────────────────────────────────────────────────

  /// Deterministic 32-byte Treasury subaccount: 31 zero bytes + 0x01.
  /// Used for routing platform fees on-chain — identical in all three
  /// places (fee routing, balance query, withdrawal).
  public func treasurySubaccount() : Blob {
    Blob.fromArray(Array.tabulate<Nat8>(32, func(i) = if (i == 31) 1 else 0));
  };

  /// Returns the AccountIdentifier for the Treasury subaccount under `p`.
  public func treasuryAccountId(p : Principal) : Blob {
    p.toLedgerAccount(?treasurySubaccount());
  };

  // ── Constants ─────────────────────────────────────────────────────────────

  let CYCLES_PER_IMAGE : Nat = 20_000_000_000;        // 20 billion cycles
  let CYCLES_PER_TRILLION : Float = 1_000_000_000_000.0;
  let USD_PER_TRILLION : Float = 1.20;
  let PLATFORM_SURCHARGE : Float = 1.25;               // 25 % platform fee
  let FALLBACK_ICP_PRICE_USD : Float = 2.5;

  // XRC canister actor reference (used only in fetchICPPrice)
  let xrc : actor {
    get_exchange_rate : (GetExchangeRateRequest) -> async GetExchangeRateResult;
  } = actor ("uf6dk-hyaaa-aaaaq-qaaaq-cai");

  // ── Price cache state type (mutable, lives in actor/mixin) ─────────────────
  public type PriceCache = { var cachedIcpPrice : Float; var lastPriceFetchTime : Int };

  public func newPriceCache() : PriceCache {
    { var cachedIcpPrice = FALLBACK_ICP_PRICE_USD; var lastPriceFetchTime = 0 };
  };

  // ── Public functions ──────────────────────────────────────────────────────

  // ── 75 / 25 split ──────────────────────────────────────────────────────────

  public type Split = { artistE8s : Nat64; platformE8s : Nat64 };

  /// Splits a total ICP amount (in e8s) 75 % to artist, 25 % to platform.
  public func calculateSplit(totalE8s : Nat64) : Split {
    let artistE8s   = totalE8s * 75 / 100;
    let platformE8s = totalE8s - artistE8s;
    { artistE8s; platformE8s };
  };

  // ── Cycle estimation helpers ────────────────────────────────────────────────

  /// Daily idle burn rate assumed: 100 million cycles / day.
  let DAILY_BURN : Nat = 100_000_000;

  /// Returns estimated days of canister life given current cycle balance.
  public func estimateDaysFromCycles(cycles : Nat) : Nat {
    cycles / DAILY_BURN;
  };

  /// Returns how many images can still be minted given current cycle balance.
  public func estimateImagesFromCycles(cycles : Nat) : Nat {
    cycles / CYCLES_PER_IMAGE;
  };

  // ── Health colour ───────────────────────────────────────────────────────────

  public type CycleHealthStatus = { #green; #orange; #red };

  /// Percentage-based thresholds with 365 days as 100 % reference.
  /// green: daysRemaining > 182 (>50 %), orange: 73-182 (20-50 %), red: <73 (<20 %).
  public func cycleHealthStatus(cycles : Nat) : CycleHealthStatus {
    let days = estimateDaysFromCycles(cycles);
    if (days > 182) #green
    else if (days >= 73) #orange
    else #red;
  };

  /// Returns (daysRemaining / 365 * 100) capped at 100.
  public func daysPercentage(days : Nat) : Nat {
    let pct = days * 100 / 365;
    if (pct > 100) 100 else pct;
  };

  /// Estimated storage in MB: mintCount * 500 KB per image, rounded.
  public func estimateStorageMB(mintCount : Nat) : Nat {
    (mintCount * 500 + 512) / 1024;  // +512 for rounding
  };

  /// Fetch current ICP/USD price from the Exchange Rate Canister.
  /// Caches the result for 60 seconds. Returns FALLBACK_ICP_PRICE_USD on any error.
  /// Fetch current ICP/USD price from the Exchange Rate Canister.
  /// Cache (60 s) is stored in caller-provided PriceCache record.
  /// Returns FALLBACK_ICP_PRICE_USD on any error. Never attaches cycles.
  public func getICPPrice(cache : PriceCache) : async Float {
    let currentTime : Int = Time.now();
    let sixtySeconds : Int = 60_000_000_000;
    if (cache.lastPriceFetchTime > 0 and (currentTime - cache.lastPriceFetchTime) < sixtySeconds) {
      return cache.cachedIcpPrice;
    };
    let request : GetExchangeRateRequest = {
      base_asset  = { symbol = "ICP"; class_ = #Cryptocurrency };
      quote_asset = { symbol = "USD"; class_ = #FiatCurrency };
      timestamp   = null;
    };
    try {
      let result = await xrc.get_exchange_rate(request);
      switch (result) {
        case (#Ok(exchangeRate)) {
          let decimals = exchangeRate.metadata.decimals.toNat();
          let price = Float.fromInt64(Int64.fromNat64(exchangeRate.rate)) / Float.pow(10.0, Float.fromInt64(Int64.fromIntWrap(decimals)));
          Debug.print(debug_show({ raw_rate = exchangeRate.rate; raw_decimals = exchangeRate.metadata.decimals; computed_price = price }));
          cache.cachedIcpPrice := price;
          cache.lastPriceFetchTime := currentTime;
          price;
        };
        case (#Err(e)) {
          Debug.print("[getICPPrice] XRC returned error: " # debug_show(e));
          FALLBACK_ICP_PRICE_USD;
        };
      };
    } catch (e) {
      Debug.print("[getICPPrice] XRC call threw exception: " # e.message());
      FALLBACK_ICP_PRICE_USD;
    };
  };

  /// Pure function: returns the number of cycles needed for `imageCount` images.
  public func calculateCycles(imageCount : Nat) : Nat {
    imageCount * CYCLES_PER_IMAGE;
  };

  /// Pure function: returns how much ICP (including 25 % surcharge) is needed
  /// to fund `imageCount` images at the given `icpPriceUSD`.
  public func calculateICPNeeded(imageCount : Nat, icpPriceUSD : Float) : Float {
    let totalCycles  = (imageCount * CYCLES_PER_IMAGE).toFloat();
    let usdNeeded    = totalCycles / CYCLES_PER_TRILLION * USD_PER_TRILLION;
    let icpNeeded    = usdNeeded / icpPriceUSD;
    icpNeeded * PLATFORM_SURCHARGE;
  };

  /// Reverse calculation: how many images can a user fund with `icpAmount` ICP
  /// at the given `icpPriceUSD` (after deducting the 25 % platform surcharge).
  public func calculateImagesFromICP(icpAmount : Float, icpPriceUSD : Float) : Nat {
    let icpForCycles  = icpAmount / PLATFORM_SURCHARGE;
    let usdForCycles  = icpForCycles * icpPriceUSD;
    let cyclesFloat   = usdForCycles / USD_PER_TRILLION * CYCLES_PER_TRILLION;
    let images        = cyclesFloat / CYCLES_PER_IMAGE.toFloat();
    Float.floor(images).toInt().toNat();
  };
}
