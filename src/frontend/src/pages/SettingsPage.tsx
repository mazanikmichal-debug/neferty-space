/**
 * SettingsPage — Full-page settings at /settings
 *
 * Sections:
 *  1. Cycles Management Card (health bar, stats, expert mode, top-up flow)
 *  2. Cycles Calculator (inline)
 *  3. Admin Treasury (admin-only)
 *  4. Theme Settings (inline accordion)
 */
import { CyclesCalculator } from "@/components/CyclesCalculator";
import { ThemeSettingsPanel } from "@/components/ThemeSettings";
import {
  useGetAdminPrincipal,
  useGetFactoryAccountId,
  useGetMyHealthStatus,
  useGetPlatformFees,
  useTopUpCollection,
  useWithdrawPlatformFees,
} from "@/hooks/useQueries";
import type { CycleHealth } from "@/types/nft";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Activity,
  Check,
  ChevronDown,
  Copy,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// ─── Color maps ────────────────────────────────────────────────────────────

const HEALTH_HEX: Record<CycleHealth, string> = {
  green: "#22c55e",
  orange: "#f97316",
  red: "#ef4444",
};

const HEALTH_GLOW: Record<CycleHealth, string> = {
  green: "rgba(34,197,94,0.35)",
  orange: "rgba(249,115,22,0.35)",
  red: "rgba(239,68,68,0.35)",
};

// ─── HealthBar ───────────────────────────────────────────────────────────────

function HealthBar({
  color,
  fillPct,
}: { color: CycleHealth; fillPct: number }) {
  const hex = HEALTH_HEX[color];
  const glow = HEALTH_GLOW[color];
  return (
    <div
      data-ocid="settings.health_bar"
      className="relative w-full h-4 rounded-full overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
      role="progressbar"
      tabIndex={0}
      aria-valuenow={fillPct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
        style={{
          width: `${fillPct}%`,
          background: `linear-gradient(90deg, ${hex}cc, ${hex})`,
          boxShadow: `0 0 14px ${glow}`,
        }}
      />
    </div>
  );
}

// ─── StatCard ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  unit,
  color,
  ocid,
  expertLine,
}: {
  label: string;
  value: bigint | number;
  unit: string;
  color: string;
  ocid: string;
  expertLine?: string;
}) {
  return (
    <div
      data-ocid={ocid}
      className="flex-1 rounded-2xl p-4 flex flex-col gap-1.5"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.09)",
      }}
    >
      <span
        className="text-[10px] font-semibold uppercase tracking-widest leading-tight"
        style={{ color: "rgba(255,255,255,0.42)" }}
      >
        {label}
      </span>
      <div className="flex items-end gap-1.5 mt-0.5">
        <span
          className="text-4xl font-bold font-mono leading-none"
          style={{ color }}
        >
          {value.toString()}
        </span>
        <span
          className="text-xs pb-0.5"
          style={{ color: "rgba(255,255,255,0.40)" }}
        >
          {unit}
        </span>
      </div>
      {expertLine && (
        <span
          className="text-xs mt-1"
          style={{ color: "rgba(255,255,255,0.28)" }}
        >
          {expertLine}
        </span>
      )}
    </div>
  );
}

// ─── SectionCard ─────────────────────────────────────────────────────────────

function SectionCard({
  children,
  title,
  icon,
}: {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-3xl p-6 flex flex-col gap-5"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
      }}
    >
      {title && (
        <div className="flex items-center gap-2">
          {icon && (
            <span style={{ color: "rgba(255,255,255,0.45)" }}>{icon}</span>
          )}
          <span
            className="font-display text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ color: "rgba(255,255,255,0.50)" }}
          >
            {title}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

// ─── TopUpModal — 3-step flow ─────────────────────────────────────────────────

type TopUpStep = "address" | "confirm" | "success";

interface TopUpSuccess {
  icpUsed: bigint;
  cyclesMinted: bigint;
}

function TopUpFlow({
  icpAmount,
  onClose,
}: {
  icpAmount: number;
  onClose: () => void;
}) {
  const [step, setStep] = useState<TopUpStep>("address");
  const [blockIndex, setBlockIndex] = useState("");
  const [copied, setCopied] = useState(false);
  const [successData, setSuccessData] = useState<TopUpSuccess | null>(null);

  const { data: factoryAccount, isLoading: accountLoading } =
    useGetFactoryAccountId();
  const topUp = useTopUpCollection();

  const handleCopy = () => {
    if (factoryAccount) {
      navigator.clipboard.writeText(factoryAccount).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirm = async () => {
    const idx = blockIndex.trim();
    if (!idx) return;
    try {
      const result = await topUp.mutateAsync(BigInt(idx));
      setSuccessData({
        icpUsed: result.icpUsed,
        cyclesMinted: result.cyclesMinted,
      });
      setStep("success");
    } catch {
      // error displayed via topUp.error
    }
  };

  return (
    <div
      data-ocid="settings.topup_flow"
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-1">
        {(["address", "confirm", "success"] as TopUpStep[]).map((s, i) => (
          <div key={s} className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors duration-300"
              style={{
                background:
                  step === s
                    ? "rgba(139,92,246,0.8)"
                    : s === "success" && step === "success"
                      ? "rgba(34,197,94,0.7)"
                      : "rgba(255,255,255,0.10)",
                color:
                  step === s || (s === "success" && step === "success")
                    ? "white"
                    : "rgba(255,255,255,0.35)",
              }}
            >
              {i + 1}
            </div>
            {i < 2 && (
              <div
                className="h-px w-6"
                style={{ background: "rgba(255,255,255,0.12)" }}
              />
            )}
          </div>
        ))}
        <button
          type="button"
          data-ocid="settings.topup_close_button"
          onClick={onClose}
          className="ml-auto text-white/40 hover:text-white/70 transition-colors"
          aria-label="Zatvoriť"
        >
          ×
        </button>
      </div>

      {/* Step 1 — Address */}
      {step === "address" && (
        <div className="space-y-3">
          <p
            className="text-xs leading-relaxed"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Pošlite{" "}
            <span className="font-bold text-white/80">
              {icpAmount > 0 ? icpAmount.toFixed(4) : "??"} ICP
            </span>{" "}
            na túto adresu zo svojej peňaženky (Plug, Bitfinity alebo NNS)
          </p>

          {accountLoading ? (
            <div
              className="h-10 rounded-xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.07)" }}
            />
          ) : factoryAccount ? (
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <span
                className="flex-1 text-xs font-mono truncate"
                style={{ color: "rgba(255,255,255,0.80)" }}
              >
                {factoryAccount}
              </span>
              <button
                type="button"
                data-ocid="settings.copy_address_button"
                onClick={handleCopy}
                className="flex-shrink-0 flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors duration-200"
                style={{
                  background: copied
                    ? "rgba(34,197,94,0.2)"
                    : "rgba(255,255,255,0.10)",
                  color: copied ? "#22c55e" : "rgba(255,255,255,0.65)",
                }}
                aria-label="Kopírovať adresu"
              >
                {copied ? <Check size={10} /> : <Copy size={10} />}
                {copied ? "Skopírované" : "Kopírovať"}
              </button>
            </div>
          ) : (
            <p className="text-xs" style={{ color: "rgba(255,80,80,0.8)" }}>
              Nepodarilo sa načítať adresu. Skúste neskôr.
            </p>
          )}

          <button
            type="button"
            data-ocid="settings.topup_next_button"
            onClick={() => setStep("confirm")}
            disabled={!factoryAccount}
            className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.01] disabled:opacity-40"
            style={{
              background:
                "linear-gradient(135deg, rgb(var(--theme-color-1-rgb,120,50,200)), rgb(var(--theme-color-2-rgb,60,80,220)))",
              color: "white",
            }}
          >
            Potvrdenie platby →
          </button>
        </div>
      )}

      {/* Step 2 — Block Index */}
      {step === "confirm" && (
        <div className="space-y-3">
          <p
            className="text-xs leading-relaxed"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Po odoslaní ICP zadajte číslo bloku transakcie z histórie vašej
            peňaženky.
          </p>
          <div className="space-y-1.5">
            <label
              htmlFor="block-index"
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Číslo bloku transakcie
            </label>
            <input
              id="block-index"
              data-ocid="settings.block_index_input"
              type="number"
              min={0}
              step={1}
              value={blockIndex}
              onChange={(e) => setBlockIndex(e.target.value)}
              placeholder="napr. 12345678"
              className="w-full rounded-xl px-3 py-2.5 text-sm text-white/90 placeholder:text-white/25 outline-none focus:ring-1 focus:ring-white/25 transition-all"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            />
          </div>

          {topUp.error && (
            <p
              data-ocid="settings.topup_error_state"
              className="text-xs rounded-lg px-3 py-2"
              style={{
                background: "rgba(239,68,68,0.12)",
                color: "rgba(239,68,68,0.90)",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              {topUp.error.message}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              data-ocid="settings.topup_back_button"
              onClick={() => setStep("address")}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.60)",
              }}
            >
              ← Späť
            </button>
            <button
              type="button"
              data-ocid="settings.topup_confirm_button"
              onClick={handleConfirm}
              disabled={!blockIndex.trim() || topUp.isPending}
              className="flex-[2] rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-40"
              style={{
                background:
                  "linear-gradient(135deg, rgb(var(--theme-color-1-rgb,120,50,200)), rgb(var(--theme-color-2-rgb,60,80,220)))",
                color: "white",
              }}
            >
              {topUp.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Spracovávam...
                </>
              ) : (
                "Potvrdiť platbu"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Success */}
      {step === "success" && successData && (
        <div
          data-ocid="settings.topup_success_state"
          className="space-y-3 text-center"
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
            style={{ background: "rgba(34,197,94,0.15)" }}
          >
            <Check size={22} style={{ color: "#22c55e" }} />
          </div>
          <p
            className="text-sm font-semibold leading-relaxed"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            Úspešne sme premenili{" "}
            <span style={{ color: "#22c55e" }}>
              {(Number(successData.icpUsed) / 100_000_000).toFixed(3)} ICP
            </span>{" "}
            na{" "}
            <span style={{ color: "#38bdf8" }}>
              {(Number(successData.cyclesMinted) / 1_000_000_000_000).toFixed(
                1,
              )}{" "}
              Trillion Cycles
            </span>{" "}
            pre tvoj trezor.
          </p>
          <button
            type="button"
            data-ocid="settings.topup_done_button"
            onClick={onClose}
            className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all hover:scale-[1.01]"
            style={{
              background: "rgba(34,197,94,0.20)",
              color: "#22c55e",
              border: "1px solid rgba(34,197,94,0.30)",
            }}
          >
            Zatvoriť
          </button>
        </div>
      )}
    </div>
  );
}

// ─── CyclesCard ──────────────────────────────────────────────────────────────

function CyclesCard({
  onTopUpClick,
  calculatedIcp,
  showTopUp,
  setShowTopUp,
}: {
  onTopUpClick: () => void;
  calculatedIcp: number;
  showTopUp: boolean;
  setShowTopUp: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  const { data: health, isLoading, isError } = useGetMyHealthStatus();

  if (isLoading) {
    return (
      <SectionCard
        title={t("settings.cyclesManagement")}
        icon={<Activity size={14} />}
      >
        <div className="space-y-3 animate-pulse">
          <div
            className="h-4 rounded-full w-full"
            style={{ background: "rgba(255,255,255,0.09)" }}
          />
          <div className="flex gap-3">
            <div
              className="flex-1 h-24 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <div
              className="flex-1 h-24 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
          </div>
          <div
            className="h-12 rounded-2xl w-full"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
        </div>
      </SectionCard>
    );
  }

  if (isError || !health) {
    return (
      <SectionCard
        title={t("settings.cyclesManagement")}
        icon={<Activity size={14} />}
      >
        <div
          data-ocid="settings.cycles_empty_state"
          className="rounded-2xl p-6 text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            {t("settings.cyclesCard.noCollection")}
          </p>
        </div>
      </SectionCard>
    );
  }

  const color = health.healthColor as CycleHealth;
  const hex = HEALTH_HEX[color] ?? HEALTH_HEX.green;
  // Use daysPercentage from backend (already capped at 100)
  const fillPct = Math.min(100, Math.max(5, Number(health.daysPercentage)));
  const healthText =
    color === "green"
      ? t("settings.cyclesCard.healthGreen")
      : color === "orange"
        ? t("settings.cyclesCard.healthYellow")
        : t("settings.cyclesCard.healthRed");

  // Expert mode lines
  const trillionCycles = (Number(health.rawCycles) / 1_000_000_000_000).toFixed(
    2,
  );
  const storageMB = Number(health.estimatedStorageMB);

  const handleTopUpClick = () => {
    setShowTopUp(true);
    onTopUpClick();
  };

  return (
    <SectionCard
      title={t("settings.cyclesManagement")}
      icon={<Activity size={14} />}
    >
      {/* Health bar — width driven by daysPercentage */}
      <HealthBar color={color} fillPct={fillPct} />

      {/* Status badge row */}
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{
            background: hex,
            boxShadow: `0 0 8px ${HEALTH_GLOW[color]}`,
          }}
        />
        <span
          data-ocid="settings.health_status_text"
          className="text-sm font-semibold"
          style={{ color: hex }}
        >
          {healthText}
        </span>
      </div>

      {/* Stats with expert mode lines */}
      <div className="flex gap-3">
        <StatCard
          ocid="settings.days_remaining_card"
          label={t("settings.cyclesCard.daysRemaining")}
          value={health.daysRemaining}
          unit={t("settings.cyclesCard.days")}
          color={hex}
          expertLine={`${trillionCycles} Trillion Cycles`}
        />
        <StatCard
          ocid="settings.images_remaining_card"
          label={t("settings.cyclesCard.imagesRemaining")}
          value={health.imagesRemaining}
          unit={t("settings.cyclesCard.images")}
          color="rgba(255,255,255,0.85)"
          expertLine={`${storageMB} MB voľného miesta`}
        />
      </div>

      {/* Human-readable status text */}
      {health.status && (
        <p
          className="text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.48)" }}
        >
          {health.status}
        </p>
      )}

      {/* Top-up flow (inline) */}
      {showTopUp ? (
        <TopUpFlow
          icpAmount={calculatedIcp}
          onClose={() => setShowTopUp(false)}
        />
      ) : (
        /* Top-up CTA */
        <button
          type="button"
          data-ocid="settings.topup_open_button"
          onClick={handleTopUpClick}
          className="relative overflow-hidden w-full rounded-2xl py-3.5 font-display font-bold text-sm uppercase tracking-widest text-white transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
          style={{
            background:
              "linear-gradient(135deg, rgb(var(--theme-color-1-rgb,120,50,200)), rgb(var(--theme-color-2-rgb,60,80,220)))",
            boxShadow: "0 4px 20px rgba(0,0,0,0.30)",
          }}
        >
          <Zap size={16} />
          {t("settings.cyclesCard.topUpButton")}
          <ChevronDown size={14} className="opacity-60" />
        </button>
      )}
    </SectionCard>
  );
}

// ─── CalculatorCard ──────────────────────────────────────────────────────────

function CalculatorCard({
  calcRef,
  onIcpChange,
  onTopUpRequest,
}: {
  calcRef: React.RefObject<HTMLDivElement | null>;
  onIcpChange: (icp: number) => void;
  onTopUpRequest: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div ref={calcRef}>
      <SectionCard
        title={t("settings.calculator.title")}
        icon={<Zap size={14} />}
      >
        <CyclesCalculator
          onTopUp={(icp) => {
            onIcpChange(icp);
            onTopUpRequest();
          }}
          onIcpChange={onIcpChange}
        />
      </SectionCard>
    </div>
  );
}

// ─── AdminTreasuryCard ───────────────────────────────────────────────────────

function AdminTreasuryCard() {
  const { identity } = useInternetIdentity();
  const { data: adminPrincipal } = useGetAdminPrincipal();
  const { data: platformFees, refetch: refetchFees } = useGetPlatformFees();
  const withdraw = useWithdrawPlatformFees();
  const [withdrawSuccess, setWithdrawSuccess] = useState<bigint | null>(null);

  const userPrincipal = identity?.getPrincipal().toText();
  const isAdmin = !!userPrincipal && userPrincipal === adminPrincipal;

  if (!isAdmin) return null;

  const feesIcp = platformFees
    ? (Number(platformFees) / 100_000_000).toFixed(3)
    : "0.000";

  const handleWithdraw = async () => {
    if (!userPrincipal) return;
    try {
      const result = await withdraw.mutateAsync(userPrincipal);
      setWithdrawSuccess(result);
      refetchFees();
    } catch {
      // error displayed via withdraw.error
    }
  };

  return (
    <SectionCard title="Pokladňa platformy" icon={<ShieldCheck size={14} />}>
      <div
        className="rounded-2xl p-4 flex items-center justify-between gap-3"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            Nazbierané poplatky
          </p>
          <p
            className="text-2xl font-bold font-mono mt-0.5"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {feesIcp}{" "}
            <span
              className="text-sm font-normal"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              ICP
            </span>
          </p>
          <p
            className="text-[10px] mt-1"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            25% platforma podiel
          </p>
        </div>
      </div>

      {withdraw.error && (
        <p
          data-ocid="settings.treasury_error_state"
          className="text-xs rounded-lg px-3 py-2"
          style={{
            background: "rgba(239,68,68,0.12)",
            color: "rgba(239,68,68,0.90)",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          {withdraw.error.message}
        </p>
      )}

      {withdrawSuccess !== null && (
        <p
          data-ocid="settings.treasury_success_state"
          className="text-xs rounded-lg px-3 py-2"
          style={{
            background: "rgba(34,197,94,0.12)",
            color: "rgba(34,197,94,0.90)",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          Úspešne prevedené {(Number(withdrawSuccess) / 100_000_000).toFixed(3)}{" "}
          ICP na vašu peňaženku
        </p>
      )}

      <button
        type="button"
        data-ocid="settings.withdraw_fees_button"
        onClick={handleWithdraw}
        disabled={withdraw.isPending || !platformFees || platformFees === 0n}
        className="w-full rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background:
            "linear-gradient(135deg, rgba(251,191,36,0.25), rgba(245,158,11,0.25))",
          color: "#fbbf24",
          border: "1px solid rgba(251,191,36,0.30)",
        }}
      >
        {withdraw.isPending ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Spracovávam...
          </>
        ) : (
          "Vybrať na moju peňaženku"
        )}
      </button>
    </SectionCard>
  );
}

// ─── ThemeAccordion ──────────────────────────────────────────────────────────

function ThemeAccordion() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
      }}
    >
      <button
        type="button"
        data-ocid="settings.theme_toggle_button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-6 py-5 transition-colors duration-200 hover:bg-white/[0.03]"
        aria-expanded={open}
      >
        <span
          className="font-display text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ color: "rgba(255,255,255,0.50)" }}
        >
          {t("aria.designSettings")}
        </span>
        <ChevronDown
          size={16}
          className="transition-transform duration-200 flex-shrink-0"
          style={{
            color: "rgba(255,255,255,0.38)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <div
          className="px-6 pb-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="pt-5">
            <ThemeSettingsInline />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ThemeSettingsInline ────────────────────────────────────────────────────────
function ThemeSettingsInline() {
  return (
    <ThemeSettingsPanel
      isOpen
      setIsOpen={() => {
        // no-op: inline usage
      }}
    />
  );
}

// ─── SettingsPage ─────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { t } = useTranslation();
  const calcRef = useRef<HTMLDivElement>(null);
  const [calculatedIcp, setCalculatedIcp] = useState<number>(0);
  const [showTopUp, setShowTopUp] = useState(false);

  function scrollToCalc() {
    calcRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      data-ocid="settings.page"
      className="min-h-screen bg-background px-4 py-8"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page heading */}
        <div className="mb-2">
          <h1
            className="font-display text-2xl font-bold tracking-tight"
            style={{ color: "rgba(255,255,255,0.90)" }}
          >
            {t("settings.title")}
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            {t("misc.appName")}
          </p>
        </div>

        {/* Section 1: Cycles Management */}
        <section data-ocid="settings.cycles_section">
          <CyclesCard
            onTopUpClick={scrollToCalc}
            calculatedIcp={calculatedIcp}
            showTopUp={showTopUp}
            setShowTopUp={setShowTopUp}
          />
        </section>

        {/* Section 2: Calculator */}
        <section data-ocid="settings.calculator_section">
          <CalculatorCard
            calcRef={calcRef}
            onIcpChange={setCalculatedIcp}
            onTopUpRequest={() => {
              setShowTopUp(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </section>

        {/* Section 3: Admin Treasury (renders null for non-admins) */}
        <section data-ocid="settings.treasury_section">
          <AdminTreasuryCard />
        </section>

        {/* Section 4: Theme Settings */}
        <section data-ocid="settings.theme_section">
          <ThemeAccordion />
        </section>
      </div>
    </div>
  );
}
