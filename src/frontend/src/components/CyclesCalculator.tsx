/**
 * CyclesCalculator — Mirror calculator: images ↔ ICP amount
 *
 * Local math (no backend call needed):
 *   costPerNFT = 20_000_000_000 cycles
 *   1 T cycles  = ~1.20 USD (ICP network rate)
 *   25% platform surcharge on top
 *
 * Fetches live ICP/USD price via backend getICPPrice when available,
 * falls back to $10.00 estimate.
 */
import { useBackend } from "@/context/BackendContext";
import { X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// ---- constants ----
const CYCLES_PER_NFT = 20_000_000_000; // 20 B cycles
const CYCLES_PER_TRILLION = 1_000_000_000_000;
const CYCLES_USD_PER_T = 1.2; // 1 T cycles ≈ $1.20
const PLATFORM_SURCHARGE = 0.25; // 25% surcharge (platform keeps 25%)
const FALLBACK_ICP_USD = 10.0;
const MONTHLY_BASELINE = 30; // estimated NFTs minted per month

function calcICPForImages(images: number, icpUsd: number): number {
  if (icpUsd <= 0 || images <= 0) return 0;
  const cyclesNeeded = images * CYCLES_PER_NFT;
  const usdNeeded = (cyclesNeeded / CYCLES_PER_TRILLION) * CYCLES_USD_PER_T;
  const usdWithSurcharge = usdNeeded * (1 + PLATFORM_SURCHARGE);
  return usdWithSurcharge / icpUsd;
}

function calcImagesForICP(icp: number, icpUsd: number): number {
  if (icpUsd <= 0 || icp <= 0) return 0;
  const usdTotal = icp * icpUsd;
  const usdForArtist = usdTotal * 0.75; // after 25% taken by platform
  const cyclesForArtist =
    (usdForArtist / CYCLES_USD_PER_T) * CYCLES_PER_TRILLION;
  return Math.floor(cyclesForArtist / CYCLES_PER_NFT);
}

function calcMonths(images: number): number {
  if (MONTHLY_BASELINE <= 0) return 0;
  return Math.round((images / MONTHLY_BASELINE) * 10) / 10;
}

interface CyclesCalculatorProps {
  onTopUp?: (icpAmount: number) => void;
  onClose?: () => void;
}

export function CyclesCalculator({
  onTopUp = () => {},
  onClose = () => {},
}: CyclesCalculatorProps) {
  const { actor } = useBackend();
  const { t } = useTranslation();

  const [icpUsd, setIcpUsd] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const [priceFallback, setPriceFallback] = useState(false);

  const [imageCount, setImageCount] = useState("");
  const [icpAmount, setIcpAmount] = useState("");
  const lastEdited = useRef<"images" | "icp">("images");

  useEffect(() => {
    let cancelled = false;
    setPriceLoading(true);
    setPriceFallback(false);

    (async () => {
      try {
        if (actor) {
          const price = await actor.getICPPrice();
          if (!cancelled && price > 0) {
            setIcpUsd(price);
            return;
          }
        }
        if (!cancelled) {
          setIcpUsd(FALLBACK_ICP_USD);
          setPriceFallback(true);
        }
      } catch {
        if (!cancelled) {
          setIcpUsd(FALLBACK_ICP_USD);
          setPriceFallback(true);
        }
      } finally {
        if (!cancelled) setPriceLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [actor]);

  const currentIcpUsd = icpUsd ?? FALLBACK_ICP_USD;

  const parsedImages = Number.parseInt(imageCount, 10);
  const parsedIcp = Number.parseFloat(icpAmount);
  const validImages = !Number.isNaN(parsedImages) && parsedImages > 0;
  const validIcp = !Number.isNaN(parsedIcp) && parsedIcp > 0;

  const displayIcp = validIcp
    ? parsedIcp
    : validImages
      ? calcICPForImages(parsedImages, currentIcpUsd)
      : 0;
  const displayImages = validImages
    ? parsedImages
    : validIcp
      ? calcImagesForICP(parsedIcp, currentIcpUsd)
      : 0;

  const artistIcp = displayIcp * 0.75;
  const platformIcp = displayIcp * 0.25;
  const estimatedMonths = calcMonths(displayImages);

  const canTopUp = displayIcp > 0;

  const handleImagesChange = (raw: string) => {
    lastEdited.current = "images";
    setImageCount(raw);
    const n = Number.parseInt(raw, 10);
    if (!Number.isNaN(n) && n > 0) {
      const icp = calcICPForImages(n, currentIcpUsd);
      setIcpAmount(icp.toFixed(4));
    } else {
      setIcpAmount("");
    }
  };

  const handleIcpChange = (raw: string) => {
    lastEdited.current = "icp";
    setIcpAmount(raw);
    const f = Number.parseFloat(raw);
    if (!Number.isNaN(f) && f > 0) {
      const imgs = calcImagesForICP(f, currentIcpUsd);
      setImageCount(imgs > 0 ? String(imgs) : "");
    } else {
      setImageCount("");
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const priceLabel = priceLoading
    ? t("calculator.rateLoading")
    : priceFallback
      ? t("calculator.rateFallback", { price: FALLBACK_ICP_USD.toFixed(2) })
      : t("calculator.rateLive", { price: currentIcpUsd.toFixed(2) });

  return (
    <div className="space-y-5">
      {/* Price row */}
      <div
        className="rounded-xl px-4 py-2.5 flex items-center justify-between gap-2"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <span className="text-xs text-muted-foreground">{priceLabel}</span>
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{
            background: priceLoading
              ? "rgba(255,200,0,0.7)"
              : priceFallback
                ? "rgba(251,191,36,0.7)"
                : "rgba(34,197,94,0.8)",
            boxShadow: `0 0 6px ${priceFallback ? "rgba(251,191,36,0.5)" : "rgba(34,197,94,0.4)"}`,
          }}
        />
      </div>

      {/* Mirror inputs */}
      <div className="grid grid-cols-2 gap-3">
        {/* Image count */}
        <div className="space-y-1.5">
          <label
            htmlFor="calc-images"
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {t("calculator.imageCount")}
          </label>
          <input
            id="calc-images"
            data-ocid="calculator.images_input"
            type="number"
            min={1}
            max={10000}
            step={1}
            value={imageCount}
            onChange={(e) => handleImagesChange(e.target.value)}
            placeholder="napr. 100"
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white/90 placeholder:text-white/25 outline-none focus:ring-1 focus:ring-white/25 transition-all"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              backdropFilter: "blur(8px)",
            }}
          />
        </div>

        {/* ICP amount */}
        <div className="space-y-1.5">
          <label
            htmlFor="calc-icp"
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {t("calculator.icpAmount")}
          </label>
          <input
            id="calc-icp"
            data-ocid="calculator.icp_input"
            type="number"
            min={0.01}
            step={0.01}
            value={icpAmount}
            onChange={(e) => handleIcpChange(e.target.value)}
            placeholder="napr. 2.00"
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white/90 placeholder:text-white/25 outline-none focus:ring-1 focus:ring-white/25 transition-all"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              backdropFilter: "blur(8px)",
            }}
          />
        </div>
      </div>

      {/* Breakdown */}
      {displayIcp > 0 && (
        <div
          className="rounded-2xl p-4 space-y-2"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            {t("calculator.breakdown")}
          </p>

          {[
            {
              label: t("calculator.forCanister"),
              value: artistIcp,
              color: "#22d3ee",
            },
            {
              label: t("calculator.forPlatform"),
              value: platformIcp,
              color: "#a78bfa",
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-2"
            >
              <span className="text-xs text-muted-foreground">{row.label}</span>
              <span
                className="text-xs font-bold font-mono"
                style={{ color: row.color }}
              >
                {row.value.toFixed(4)} ICP
              </span>
            </div>
          ))}

          <div
            className="flex items-center justify-between gap-2 pt-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="text-xs font-semibold text-foreground">
              {t("calculator.total")}
            </span>
            <span className="text-xs font-bold font-mono text-white">
              {displayIcp.toFixed(4)} ICP
            </span>
          </div>

          {estimatedMonths > 0 && (
            <p
              className="text-[10px] text-muted-foreground pt-1"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              {t("calculator.estimatedDuration")}: ~{estimatedMonths}{" "}
              {estimatedMonths === 1
                ? t("calculator.month")
                : estimatedMonths < 5
                  ? t("calculator.months2to4")
                  : t("calculator.months5plus")}
            </p>
          )}
        </div>
      )}

      {/* Info */}
      <p className="text-[10px] text-muted-foreground leading-relaxed">
        {t("calculator.calcInfo")}
      </p>

      {/* CTA */}
      <button
        type="button"
        data-ocid="calculator.topup_button"
        disabled={!canTopUp}
        onClick={() => canTopUp && onTopUp(displayIcp)}
        className="relative overflow-hidden w-full rounded-2xl py-4 min-h-[56px] font-display font-bold text-sm uppercase tracking-widest text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-35 disabled:scale-100 disabled:cursor-not-allowed"
        style={{ boxShadow: canTopUp ? "0 4px 16px rgba(0,0,0,0.2)" : "none" }}
      >
        <span
          className="absolute inset-0 rounded-2xl"
          aria-hidden="true"
          style={{
            background: canTopUp
              ? "linear-gradient(135deg, rgb(var(--theme-color-1-rgb,180,80,220)), rgb(var(--theme-color-2-rgb,80,80,220)))"
              : "rgba(255,255,255,0.08)",
          }}
        />
        <span className="relative z-[1] flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />
          {t("calculator.topUp")}
        </span>
      </button>
    </div>
  );
}
