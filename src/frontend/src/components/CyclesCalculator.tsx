/**
 * CyclesCalculator — Simplified two-field calculator: ICP ↔ GB
 *
 * Two linked inputs: ICP payment ↔ Storage (GB)
 * Pricing model:
 *   GB_PRICE_USD = 6.66  (1 GB storage/year, incl. 75/25 platform markup)
 *   ICP conversion via live XRC price from useGetICPPrice()
 */
import { useGetICPPrice } from "@/hooks/useQueries";
import {
  CMC_CANISTER_ID,
  computeCmcDepositAddress,
  isPlugAvailable,
  requestPlugConnect,
  sendICPViaPlug,
} from "@/utils/plug-wallet";
import { AlertTriangle, Check, Loader2, Zap } from "lucide-react";
import { useState } from "react";

// ── Constants ──────────────────────────────────────────────────────────────
const GB_PRICE_USD = 6.66; // 1 GB per year including 75/25 platform markup
const FACTORY_CANISTER_ID = "3shfw-daaaa-aaaag-aywla-cai";

// ── Conversion helpers ─────────────────────────────────────────────────────
function icpToGb(icp: number, icpPrice: number): number {
  if (icpPrice <= 0) return 0;
  return (icp * icpPrice) / GB_PRICE_USD;
}
function gbToIcp(gb: number, icpPrice: number): number {
  if (icpPrice <= 0) return 0;
  return (gb * GB_PRICE_USD) / icpPrice;
}

// ── Shared input field style ───────────────────────────────────────────────
const inputBase =
  "w-full rounded-xl px-3 py-3 text-sm text-white/90 placeholder:text-white/25 outline-none focus:ring-1 focus:ring-white/30 transition-all bg-transparent";
const inputWrap = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.13)",
  backdropFilter: "blur(8px)",
};
const addonStyle = {
  color: "rgba(255,255,255,0.45)",
  borderLeft: "1px solid rgba(255,255,255,0.10)",
};

// ── Props ──────────────────────────────────────────────────────────────────
interface CyclesCalculatorProps {
  onTopUp?: (icpAmount: number) => void;
  onClose?: () => void;
  onIcpChange?: (icp: number) => void;
}

// ── Component ─────────────────────────────────────────────────────────────
export function CyclesCalculator({
  onTopUp = () => {},
  onClose = () => {},
  onIcpChange,
}: CyclesCalculatorProps) {
  // ── ICP price ──────────────────────────────────────────────────────────
  const { data: icpPrice, isLoading: icpPriceLoading } = useGetICPPrice();
  const priceReady = icpPrice != null && icpPrice > 0;
  const currentIcpPrice = icpPrice ?? 2.5;

  // ── Input state (ICP ↔ GB two-way binding) ─────────────────────────────
  const [icpRaw, setIcpRaw] = useState("1");
  const [gbRaw, setGbRaw] = useState(() => icpToGb(1, 2.5).toFixed(3));

  // ── Payment flow state ─────────────────────────────────────────────────
  type FlowState =
    | "idle"
    | "signing"
    | "processing"
    | "success"
    | "error"
    | "rejected";
  const [flowState, setFlowState] = useState<FlowState>("idle");
  const [flowError, setFlowError] = useState("");
  const [successData, setSuccessData] = useState<{
    icpUsed: bigint;
    cyclesMinted: bigint;
  } | null>(null);
  const [failedBlockIndex, setFailedBlockIndex] = useState<bigint | null>(null);

  // ── Two-way binding handlers ───────────────────────────────────────────
  function onIcpChangeHandler(raw: string) {
    setIcpRaw(raw);
    const val = Number.parseFloat(raw);
    if (!Number.isNaN(val) && val > 0) {
      setGbRaw(icpToGb(val, currentIcpPrice).toFixed(3));
      onIcpChange?.(val);
    } else {
      setGbRaw("");
      onIcpChange?.(0);
    }
  }

  function onGbChangeHandler(raw: string) {
    setGbRaw(raw);
    const val = Number.parseFloat(raw);
    if (!Number.isNaN(val) && val > 0) {
      const icp = gbToIcp(val, currentIcpPrice);
      setIcpRaw(icp.toFixed(4));
      onIcpChange?.(icp);
    } else {
      setIcpRaw("");
      onIcpChange?.(0);
    }
  }

  // ── Derived computed ICP amount for payment ───────────────────────────
  const parsedIcp = Number.parseFloat(icpRaw);
  const computedIcp = !Number.isNaN(parsedIcp) && parsedIcp > 0 ? parsedIcp : 0;
  const usdEquiv = (computedIcp * currentIcpPrice).toFixed(2);
  const canPay = computedIcp > 0 && flowState === "idle" && priceReady;

  // ── Payment handler ────────────────────────────────────────────────────
  const depositAddress = computeCmcDepositAddress(FACTORY_CANISTER_ID);
  const plugInstalled = isPlugAvailable();

  async function handlePay() {
    if (!canPay) return;
    setFlowState("signing");
    setFlowError("");
    setFailedBlockIndex(null);

    try {
      const connected = await requestPlugConnect([CMC_CANISTER_ID]);
      if (!connected) {
        setFlowState("rejected");
        return;
      }

      const amountE8s = Math.round(computedIcp * 100_000_000);
      const transferResult = await sendICPViaPlug(depositAddress, amountE8s);
      if (!transferResult) {
        setFlowState("rejected");
        return;
      }

      setFlowState("processing");
      const { blockIndex } = transferResult;

      try {
        onTopUp(computedIcp);
        setSuccessData({ icpUsed: BigInt(amountE8s), cyclesMinted: 0n });
        setFlowState("success");
      } catch (topUpErr) {
        setFlowError(
          topUpErr instanceof Error
            ? topUpErr.message
            : "Nepodarilo sa spracovať platbu",
        );
        setFailedBlockIndex(blockIndex);
        setFlowState("error");
      }
    } catch (err) {
      setFlowError(err instanceof Error ? err.message : "Neznáma chyba");
      setFlowState("error");
    }
  }

  function resetFlow() {
    setFlowState("idle");
    setFlowError("");
    setSuccessData(null);
    setFailedBlockIndex(null);
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      {/* ── Two inputs side-by-side ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* ICP field */}
        <div className="space-y-1.5">
          <label
            htmlFor="calc-icp"
            className="text-[10px] font-bold uppercase tracking-widest block"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            ICP
          </label>
          <div
            className="flex items-center rounded-xl overflow-hidden"
            style={inputWrap}
          >
            {icpPriceLoading && !priceReady ? (
              <div className="flex items-center gap-1.5 px-3 py-3 flex-1">
                <Loader2
                  size={12}
                  className="animate-spin"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                />
              </div>
            ) : (
              <input
                id="calc-icp"
                data-ocid="calculator.icp_input"
                type="number"
                min={0}
                step={0.0001}
                value={icpRaw}
                onChange={(e) => onIcpChangeHandler(e.target.value)}
                placeholder="1"
                disabled={!priceReady}
                className={inputBase}
              />
            )}
            <span
              className="px-3 text-xs font-bold flex-shrink-0"
              style={addonStyle}
            >
              ICP
            </span>
          </div>
          {/* USD equivalent */}
          <p
            className="text-[10px] pl-1"
            style={{ color: "rgba(255,255,255,0.30)" }}
          >
            ≈ {usdEquiv} USD
          </p>
        </div>

        {/* GB field */}
        <div className="space-y-1.5">
          <label
            htmlFor="calc-gb"
            className="text-[10px] font-bold uppercase tracking-widest block"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            GB
          </label>
          <div
            className="flex items-center rounded-xl overflow-hidden"
            style={inputWrap}
          >
            <input
              id="calc-gb"
              data-ocid="calculator.gb_input"
              type="number"
              min={0}
              step={0.001}
              value={gbRaw}
              onChange={(e) => onGbChangeHandler(e.target.value)}
              placeholder="1"
              className={inputBase}
            />
            <span
              className="px-3 text-xs font-bold flex-shrink-0"
              style={addonStyle}
            >
              GB
            </span>
          </div>
          <p
            className="text-[10px] pl-1"
            style={{ color: "rgba(255,255,255,0.30)" }}
          >
            &nbsp;
          </p>
        </div>
      </div>

      {/* ── Payment flow states ── */}

      {/* Plug not installed */}
      {!plugInstalled && flowState === "idle" && computedIcp > 0 && (
        <div
          className="flex items-start gap-2.5 rounded-xl px-4 py-3"
          style={{
            background: "rgba(251,191,36,0.10)",
            border: "1px solid rgba(251,191,36,0.28)",
          }}
        >
          <AlertTriangle
            size={13}
            style={{ color: "#fbbf24", flexShrink: 0, marginTop: 1 }}
          />
          <p className="text-xs" style={{ color: "rgba(251,191,36,0.88)" }}>
            Plug Wallet nie je nainštalovaný.{" "}
            <a
              href="https://plugwallet.ooo/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              Nainštaluj Plug Wallet
            </a>
          </p>
        </div>
      )}

      {/* Signing */}
      {flowState === "signing" && (
        <div
          data-ocid="calculator.loading_state"
          className="flex flex-col items-center gap-3 py-3"
        >
          <Loader2
            size={26}
            className="animate-spin"
            style={{ color: "rgba(167,139,250,0.80)" }}
          />
          <p
            className="text-xs text-center"
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
            Čakáme na tvoj podpis v Plug peňaženke...
          </p>
        </div>
      )}

      {/* Processing */}
      {flowState === "processing" && (
        <div
          data-ocid="calculator.loading_state"
          className="flex flex-col items-center gap-3 py-3"
        >
          <Loader2
            size={26}
            className="animate-spin"
            style={{ color: "#38bdf8" }}
          />
          <p
            className="text-xs text-center"
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
            Spracovávam platbu...
          </p>
        </div>
      )}

      {/* Success */}
      {flowState === "success" && successData && (
        <div
          data-ocid="calculator.success_state"
          className="rounded-2xl p-4 text-center space-y-3"
          style={{
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mx-auto"
            style={{ background: "rgba(34,197,94,0.15)" }}
          >
            <Check size={18} style={{ color: "#22c55e" }} />
          </div>
          <p
            className="text-sm font-semibold"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            Platba odoslaná!
          </p>
          <button
            type="button"
            data-ocid="calculator.done_button"
            onClick={onClose}
            className="w-full rounded-xl py-2 text-xs font-semibold transition-all hover:scale-[1.01]"
            style={{
              background: "rgba(34,197,94,0.18)",
              color: "#22c55e",
              border: "1px solid rgba(34,197,94,0.28)",
            }}
          >
            Zatvoriť
          </button>
        </div>
      )}

      {/* Rejected */}
      {flowState === "rejected" && (
        <div data-ocid="calculator.error_state" className="space-y-2">
          <p
            className="text-xs rounded-xl px-3 py-2"
            style={{
              background: "rgba(239,68,68,0.10)",
              color: "rgba(239,68,68,0.88)",
              border: "1px solid rgba(239,68,68,0.22)",
            }}
          >
            Platba zamietnutá. Skús znova.
          </p>
          <button
            type="button"
            data-ocid="calculator.retry_button"
            onClick={resetFlow}
            className="w-full rounded-xl py-2 text-xs font-semibold transition-colors"
            style={{
              background: "rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.60)",
            }}
          >
            Skúsiť znova
          </button>
        </div>
      )}

      {/* Error */}
      {flowState === "error" && (
        <div data-ocid="calculator.error_state" className="space-y-2">
          {failedBlockIndex !== null && (
            <div
              className="flex items-start gap-2 rounded-xl px-3 py-2.5"
              style={{
                background: "rgba(251,191,36,0.10)",
                border: "1px solid rgba(251,191,36,0.26)",
              }}
            >
              <AlertTriangle
                size={12}
                style={{ color: "#fbbf24", flexShrink: 0, marginTop: 1 }}
              />
              <p className="text-xs" style={{ color: "rgba(251,191,36,0.88)" }}>
                Platba prebehla (block #{failedBlockIndex.toString()}), ale
                premena na cycles zlyhala. Použi núdzovú synchronizáciu.
              </p>
            </div>
          )}
          <p
            className="text-xs rounded-xl px-3 py-2"
            style={{
              background: "rgba(239,68,68,0.10)",
              color: "rgba(239,68,68,0.88)",
              border: "1px solid rgba(239,68,68,0.22)",
            }}
          >
            {flowError || "Neznáma chyba pri platbe."}
          </p>
          <button
            type="button"
            data-ocid="calculator.retry_button"
            onClick={resetFlow}
            className="w-full rounded-xl py-2 text-xs font-semibold transition-colors"
            style={{
              background: "rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.60)",
            }}
          >
            Skúsiť znova
          </button>
        </div>
      )}

      {/* ── Dobiť button (idle only) ── */}
      {(flowState === "idle" ||
        flowState === "rejected" ||
        flowState === "error") && (
        <button
          type="button"
          data-ocid="calculator.topup_button"
          disabled={!canPay || !plugInstalled}
          onClick={handlePay}
          className="relative overflow-hidden w-full rounded-2xl py-4 min-h-[52px] font-display font-bold text-sm uppercase tracking-widest text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-35 disabled:scale-100 disabled:cursor-not-allowed"
          style={{
            boxShadow: canPay ? "0 4px 16px rgba(0,0,0,0.2)" : "none",
          }}
        >
          <span
            className="absolute inset-0 rounded-2xl"
            aria-hidden="true"
            style={{
              background: canPay
                ? "linear-gradient(135deg, rgb(var(--theme-color-1-rgb,180,80,220)), rgb(var(--theme-color-2-rgb,80,80,220)))"
                : "rgba(255,255,255,0.08)",
            }}
          />
          <span className="relative z-[1] flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            Dobiť
          </span>
        </button>
      )}
    </div>
  );
}
