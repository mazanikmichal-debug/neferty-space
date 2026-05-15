/**
 * SettingsPage — Full-page settings at /settings
 *
 * Sections:
 *  1. Cycles Management Card (health bar, stats, top-up CTA)
 *  2. Cycles Calculator (inline)
 *  3. Theme Settings (inline accordion)
 */
import { CyclesCalculator } from "@/components/CyclesCalculator";
import { ThemeSettingsPanel } from "@/components/ThemeSettings";
import { useGetMyHealthStatus } from "@/hooks/useQueries";
import type { CycleHealth } from "@/types/nft";
import { Activity, ChevronDown, Zap } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// ─── Color maps ────────────────────────────────────────────────────────────

const HEALTH_HEX: Record<CycleHealth, string> = {
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
};

const HEALTH_GLOW: Record<CycleHealth, string> = {
  green: "rgba(34,197,94,0.35)",
  yellow: "rgba(234,179,8,0.35)",
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
}: {
  label: string;
  value: bigint | number;
  unit: string;
  color: string;
  ocid: string;
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

// ─── CyclesCard ──────────────────────────────────────────────────────────────

function CyclesCard({ onTopUpClick }: { onTopUpClick: () => void }) {
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
  const hex = HEALTH_HEX[color];
  const fillPct = Math.min(
    100,
    Math.max(5, Math.round((Number(health.daysRemaining) / 365) * 100)),
  );
  const healthText =
    color === "green"
      ? t("settings.cyclesCard.healthGreen")
      : color === "yellow"
        ? t("settings.cyclesCard.healthYellow")
        : t("settings.cyclesCard.healthRed");

  return (
    <SectionCard
      title={t("settings.cyclesManagement")}
      icon={<Activity size={14} />}
    >
      {/* Health bar */}
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

      {/* Stats */}
      <div className="flex gap-3">
        <StatCard
          ocid="settings.days_remaining_card"
          label={t("settings.cyclesCard.daysRemaining")}
          value={health.daysRemaining}
          unit={t("settings.cyclesCard.days")}
          color={hex}
        />
        <StatCard
          ocid="settings.images_remaining_card"
          label={t("settings.cyclesCard.imagesRemaining")}
          value={health.imagesRemaining}
          unit={t("settings.cyclesCard.images")}
          color="rgba(255,255,255,0.85)"
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

      {/* Top-up CTA */}
      <button
        type="button"
        data-ocid="settings.topup_open_button"
        onClick={onTopUpClick}
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
    </SectionCard>
  );
}

// ─── CalculatorCard ──────────────────────────────────────────────────────────

function CalculatorCard({
  calcRef,
}: {
  calcRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { t } = useTranslation();

  return (
    <div ref={calcRef}>
      <SectionCard
        title={t("settings.calculator.title")}
        icon={<Zap size={14} />}
      >
        <CyclesCalculator
          onTopUp={() => {
            // Payment flow coming soon
          }}
        />
        <p
          className="text-[11px] text-center"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          {t("messages.comingSoon")}
        </p>
      </SectionCard>
    </div>
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
          {/* Render ThemeSettingsPanel in an inline mode by using its open prop */}
          <div className="pt-5">
            <ThemeSettingsInline />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ThemeSettingsInline ────────────────────────────────────────────────────────
// Renders ThemeSettingsPanel content without the fixed overlay/dialog wrapper
function ThemeSettingsInline() {
  // Render panel in a pseudo-open state but capture setIsOpen as a no-op
  // so the dialog header "X" button does nothing harmful inline.
  return (
    <ThemeSettingsPanel
      isOpen
      setIsOpen={() => {
        // no-op: inline usage — closing is handled by the accordion toggle
      }}
    />
  );
}

// ─── SettingsPage ─────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { t } = useTranslation();
  const calcRef = useRef<HTMLDivElement>(null);

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
          <CyclesCard onTopUpClick={scrollToCalc} />
        </section>

        {/* Section 2: Calculator */}
        <section data-ocid="settings.calculator_section">
          <CalculatorCard calcRef={calcRef} />
        </section>

        {/* Section 3: Theme Settings */}
        <section data-ocid="settings.theme_section">
          <ThemeAccordion />
        </section>
      </div>
    </div>
  );
}
