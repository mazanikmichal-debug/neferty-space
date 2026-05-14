import {
  RATING_DISPLAY_PRESETS,
  useRatingDisplay,
} from "@/hooks/useRatingDisplay";
import type { RatingDisplaySettings } from "@/hooks/useRatingDisplay";
import { buildGradient, shiftHex, useTheme } from "@/hooks/useTheme";
import type { SavedDesign } from "@/hooks/useTheme";
import { X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";

// ─── Sub-components ────────────────────────────────────────────────────────

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
      {children}
    </span>
  );
}

function Swatch({
  color,
  label,
  onChange,
  onRemove,
}: {
  color: string;
  label: string;
  onChange: (c: string) => void;
  onRemove?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-center gap-2 group/swatch">
      <div className="relative">
        <button
          type="button"
          aria-label={label}
          data-ocid="theme.color_swatch"
          onClick={() => inputRef.current?.click()}
          className="transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          style={{
            width: 68,
            height: 68,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${color}ee, ${color})`,
            boxShadow: `0 0 0 3px rgba(0,0,0,0.45), 0 0 0 4.5px ${color}55, 0 6px 20px ${color}60, inset 0 1px 0 rgba(255,255,255,0.25)`,
            cursor: "pointer",
          }}
        />
        <input
          ref={inputRef}
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
        {onRemove && (
          <button
            type="button"
            aria-label="Odstrániť tretiu farbu"
            data-ocid="theme.remove_color3_button"
            onClick={onRemove}
            className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full flex items-center justify-center transition-all duration-150 opacity-0 group-hover/swatch:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
            style={{
              background: "rgba(15,10,25,0.82)",
              border: "1px solid rgba(255,255,255,0.22)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
            }}
          >
            <X size={9} strokeWidth={2.8} className="text-white/80" />
          </button>
        )}
      </div>
      <span className="font-display text-[9px] uppercase tracking-[0.1em] text-white/40">
        {label}
      </span>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  ocid,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  ocid: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
          {label}
        </span>
        <span className="font-display text-xs text-white/70 tabular-nums">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        data-ocid={ocid}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
        style={{ accentColor: "var(--theme-color-1, #9b30ff)" }}
      />
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-white/[0.08] rounded-full" />;
}

// ─── SaveDesignRow ────────────────────────────────────────────────────────────

function SaveDesignRow({ onSave }: { onSave: (name: string) => void }) {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
    setSaved(true);
    setTimeout(() => setSaved(false), 1000);
  }

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
        }}
        placeholder="Napr. Citron"
        data-ocid="theme.save_name_input"
        maxLength={32}
        className="flex-1 bg-white/[0.08] border border-white/[0.14] rounded-xl px-3 py-2 text-[12px] font-display text-white/90 placeholder:text-white/30 outline-none focus:border-white/30 focus:bg-white/[0.12] transition-all duration-200"
      />
      <button
        type="button"
        data-ocid="theme.save_button"
        disabled={!name.trim()}
        onClick={handleSave}
        className="relative overflow-hidden rounded-xl px-4 py-2 font-display text-[12px] font-semibold tracking-wide text-white transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        style={{
          background: "var(--theme-gradient)",
          boxShadow: saved
            ? "0 4px 14px rgba(var(--theme-color-1-rgb, 0,0,0), 0.40)"
            : "0 4px 14px rgba(0,0,0,0.25)",
          border: saved
            ? "1px solid rgba(255,255,255,0.35)"
            : "1px solid rgba(255,255,255,0.2)",
          minWidth: 70,
          opacity: saved ? 0.92 : 1,
        }}
      >
        {saved ? "✓" : "Uložiť"}
      </button>
    </div>
  );
}

// ─── SavedDesignCard ─────────────────────────────────────────────────────────

function SavedDesignCard({
  design,
  isActive,
  onApply,
  onDelete,
}: {
  design: SavedDesign;
  isActive: boolean;
  onApply: () => void;
  onDelete: () => void;
}) {
  const gradient = buildGradient(design);
  const c1 = shiftHex(design.color1, design.hueShift);
  const c2 = shiftHex(design.color2, design.hueShift);
  const c3 = shiftHex(design.color3, design.hueShift);

  return (
    <div className="relative group">
      <button
        type="button"
        data-ocid="theme.saved_design_card"
        onClick={onApply}
        className="w-full rounded-xl px-3 py-2.5 text-left cursor-pointer transition-all duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 flex flex-col gap-2"
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${c1}, ${c2})`
            : "rgba(255,255,255,0.07)",
          border: isActive
            ? "1px solid rgba(255,255,255,0.25)"
            : "1px solid rgba(255,255,255,0.12)",
          boxShadow: isActive
            ? "0 4px 16px rgba(0,0,0,0.2)"
            : "0 2px 8px rgba(0,0,0,0.15)",
          transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <span className="font-display text-[11px] font-semibold text-white truncate pr-4">
          {design.name}
        </span>
        {/* Gradient bar preview */}
        <div
          className="h-2 rounded-full w-full"
          style={{ background: gradient, opacity: 0.85 }}
          aria-hidden="true"
        />
        <div className="flex gap-1">
          <span
            className="block w-3 h-3 rounded-full ring-1 ring-black/20"
            style={{ background: c1 }}
          />
          <span
            className="block w-3 h-3 rounded-full ring-1 ring-black/20"
            style={{ background: c2 }}
          />
          <span
            className="block w-3 h-3 rounded-full ring-1 ring-black/20"
            style={{ background: c3 }}
          />
        </div>
      </button>
      {/* Delete button */}
      <button
        type="button"
        aria-label={`Zmazať dizajn ${design.name}`}
        data-ocid="theme.delete_saved_button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all duration-150 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
      >
        <X size={10} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ─── Rating Tab: DepthPreviewMini ────────────────────────────────────────────

function DepthPreviewMini({ color }: { color: string }) {
  // Fan-right queue preview: cards offset to the right like a side queue
  const cards = [
    { w: 28, h: 28, tx: 0, ty: 0, opacity: 1, border: `2px solid ${color}` },
    {
      w: 24,
      h: 24,
      tx: 20,
      ty: 3,
      opacity: 0.72,
      border: "1px solid rgba(255,255,255,0.15)",
    },
    {
      w: 20,
      h: 20,
      tx: 36,
      ty: 6,
      opacity: 0.5,
      border: "1px solid rgba(255,255,255,0.10)",
    },
    {
      w: 15,
      h: 15,
      tx: 48,
      ty: 9,
      opacity: 0.3,
      border: "1px solid rgba(255,255,255,0.07)",
    },
  ];
  return (
    <div
      className="relative"
      style={{ width: 66, height: 36 }}
      aria-hidden="true"
    >
      {[...cards].reverse().map((c, ri) => {
        const i = cards.length - 1 - ri;
        return (
          <div
            key={c.tx}
            style={{
              position: "absolute",
              top: c.ty,
              left: c.tx,
              width: c.w,
              height: c.h,
              borderRadius: 4,
              background:
                i === 0
                  ? color
                  : `${color}${i === 1 ? "66" : i === 2 ? "44" : "28"}`,
              border: c.border,
              opacity: c.opacity,
              flexShrink: 0,
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Rating Tab: FrameColorSwatch ───────────────────────────────────────────

const FRAME_COLORS = [
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#16a34a",
  "#ea580c",
  "#db2777",
];

function FrameColorSwatch({
  color,
  active,
  onClick,
}: { color: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={color}
      data-ocid="rating_settings.frame_color_swatch"
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: color,
        border: active
          ? "2.5px solid rgba(255,255,255,0.90)"
          : "2px solid rgba(255,255,255,0.18)",
        boxShadow: active
          ? `0 0 0 3px rgba(255,255,255,0.22), 0 0 16px 4px ${color}88`
          : `0 0 8px 2px ${color}55`,
        cursor: "pointer",
        transition: "all 0.15s ease",
        flexShrink: 0,
      }}
      className="hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    />
  );
}

// ─── Rating Settings Tab Content ─────────────────────────────────────────────

function RatingSettingsTab() {
  const { settings, updateSettings, applyPreset, resetToDefault } =
    useRatingDisplay();

  function handleSliderChange(
    field: keyof RatingDisplaySettings,
    rawValue: number,
  ) {
    let value: number = rawValue;
    if (field === "cardScale") value = rawValue / 100;
    if (field === "animationDuration") value = rawValue / 100;
    updateSettings({ [field]: value, preset: "custom" });
  }

  const scaleInt = Math.round(settings.cardScale * 100);
  const durationInt = Math.round(settings.animationDuration * 100);

  return (
    <div className="flex flex-col gap-4">
      {/* Presets */}
      <SectionCard>
        <SectionLabel>Prednastavenia</SectionLabel>
        <div className="grid grid-cols-2 gap-2">
          {RATING_DISPLAY_PRESETS.map((preset) => {
            const isActive = settings.preset === preset.name;
            return (
              <button
                key={preset.name}
                type="button"
                data-ocid="rating_settings.preset_button"
                onClick={() => applyPreset(preset.name)}
                className="rounded-xl px-3 py-2.5 text-left cursor-pointer transition-all duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 flex flex-col gap-2"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${preset.settings.activeFrameColor}55, ${preset.settings.activeFrameColor}22)`
                    : "rgba(255,255,255,0.06)",
                  border: isActive
                    ? `1.5px solid ${preset.settings.activeFrameColor}99`
                    : "1px solid rgba(255,255,255,0.10)",
                  boxShadow: isActive
                    ? `0 4px 16px ${preset.settings.activeFrameColor}33`
                    : "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <span className="font-display text-[11px] font-semibold text-white">
                  {preset.name}
                </span>
                <DepthPreviewMini color={preset.settings.activeFrameColor} />
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Frame color */}
      <SectionCard>
        <SectionLabel>Farba rámu</SectionLabel>
        <div className="flex gap-2 flex-wrap pt-1">
          {FRAME_COLORS.map((c) => (
            <FrameColorSwatch
              key={c}
              color={c}
              active={settings.activeFrameColor === c}
              onClick={() =>
                updateSettings({ activeFrameColor: c, preset: "custom" })
              }
            />
          ))}
        </div>
      </SectionCard>

      {/* Sliders */}
      <SectionCard>
        <SectionLabel>Úpravy zobrazenia</SectionLabel>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
                Viditeľné karty
              </span>
              <span className="font-display text-xs text-white/70 tabular-nums">
                {settings.visibleCards}
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={50}
              step={1}
              value={settings.visibleCards}
              data-ocid="rating_settings.visible_cards_slider"
              onChange={(e) =>
                updateSettings({
                  visibleCards: Number(e.target.value),
                  preset: "custom",
                })
              }
              className="w-full cursor-pointer"
              style={{ accentColor: settings.activeFrameColor }}
            />
          </div>
          <Divider />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
                Zmenšenie kariet
              </span>
              <span className="font-display text-xs text-white/70 tabular-nums">
                {scaleInt}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              step={1}
              value={scaleInt}
              data-ocid="rating_settings.card_scale_slider"
              onChange={(e) =>
                handleSliderChange("cardScale", Number(e.target.value))
              }
              className="w-full cursor-pointer"
              style={{ accentColor: settings.activeFrameColor }}
            />
          </div>
          <Divider />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
                Hĺbka
              </span>
              <span className="font-display text-xs text-white/70 tabular-nums">
                {settings.depthStep}px
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={200}
              step={5}
              value={settings.depthStep}
              data-ocid="rating_settings.depth_slider"
              onChange={(e) =>
                updateSettings({
                  depthStep: Number(e.target.value),
                  preset: "custom",
                })
              }
              className="w-full cursor-pointer"
              style={{ accentColor: settings.activeFrameColor }}
            />
          </div>
          <Divider />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
                Posun do strany
              </span>
              <span className="font-display text-xs text-white/70 tabular-nums">
                {settings.sideStep}px
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={200}
              step={5}
              value={settings.sideStep}
              data-ocid="rating_settings.side_step_slider"
              onChange={(e) =>
                updateSettings({
                  sideStep: Number(e.target.value),
                  preset: "custom",
                })
              }
              className="w-full cursor-pointer"
              style={{ accentColor: settings.activeFrameColor }}
            />
          </div>
          <Divider />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
                Zvislý posun
              </span>
              <span className="font-display text-xs text-white/70 tabular-nums">
                {settings.verticalStep}px
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={2}
              value={settings.verticalStep}
              data-ocid="rating_settings.vertical_step_slider"
              onChange={(e) =>
                updateSettings({
                  verticalStep: Number(e.target.value),
                  preset: "custom",
                })
              }
              className="w-full cursor-pointer"
              style={{ accentColor: settings.activeFrameColor }}
            />
          </div>
          <Divider />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
                Rýchlosť animácie
              </span>
              <span className="font-display text-xs text-white/70 tabular-nums">
                {settings.animationDuration.toFixed(2)}s
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={durationInt}
              data-ocid="rating_settings.animation_slider"
              onChange={(e) =>
                handleSliderChange("animationDuration", Number(e.target.value))
              }
              className="w-full cursor-pointer"
              style={{ accentColor: settings.activeFrameColor }}
            />
          </div>
        </div>
      </SectionCard>

      {/* Reset */}
      <button
        type="button"
        data-ocid="rating_settings.reset_button"
        onClick={resetToDefault}
        className="w-full rounded-xl py-2.5 font-display text-[11px] font-semibold uppercase tracking-widest text-white/50 hover:text-white/80 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        Obnoviť predvolené
      </button>
    </div>
  );
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ThemeSettingsPanelProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

// ─── Panel ──────────────────────────────────────────────────────────────────

export function ThemeSettingsPanel({
  isOpen,
  setIsOpen,
}: ThemeSettingsPanelProps) {
  const {
    settings,
    update,
    applyPreset,
    presets,
    savedDesigns,
    saveDesign,
    deleteSavedDesign,
  } = useTheme();

  const [activeTab, setActiveTab] = useState<"dizajn" | "hodnotenie">("dizajn");

  if (!isOpen) return null;

  const activeGradient = buildGradient(settings);
  const c1shifted = shiftHex(settings.color1, settings.hueShift);

  const isActivePreset = (ps: (typeof presets)[0]) =>
    settings.color1 === ps.settings.color1 &&
    settings.color2 === ps.settings.color2;

  const isActiveSaved = (d: SavedDesign) =>
    settings.color1 === d.color1 &&
    settings.color2 === d.color2 &&
    settings.color3 === d.color3 &&
    settings.hueShift === d.hueShift;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[99] bg-black/20 backdrop-blur-[2px]"
        onClick={() => setIsOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setIsOpen(false);
        }}
        aria-hidden="true"
        role="presentation"
      />

      {/* Panel wrapper */}
      <div className="fixed inset-0 z-[100] flex items-start justify-end p-[80px_16px_16px] pointer-events-none">
        <dialog
          open
          className="relative pointer-events-auto w-full max-w-sm max-h-[calc(100vh-96px)] overflow-y-auto overflow-x-hidden rounded-3xl p-6 flex flex-col gap-5 glass-card"
          data-ocid="theme.dialog"
          aria-label="Nastavenia"
        >
          {/* Gradient top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl"
            style={{ background: activeGradient }}
            aria-hidden="true"
          />

          {/* Header */}
          <div className="flex justify-between items-center">
            <span className="font-display text-sm font-bold uppercase tracking-widest text-white">
              Nastavenia
            </span>
            <button
              type="button"
              data-ocid="theme.close_button"
              onClick={() => setIsOpen(false)}
              aria-label="Zavrieť"
              className="glass-card w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-200 hover:bg-white/15 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* Tab switcher */}
          <div
            className="flex rounded-xl p-[3px] gap-[3px]"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            {(["dizajn", "hodnotenie"] as const).map((tab) => {
              const labels = { dizajn: "Dizajn", hodnotenie: "Hodnotenie" };
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  data-ocid={`theme.tab.${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 rounded-[9px] py-2 font-display text-[11px] font-bold uppercase tracking-widest transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  style={{
                    background: isActive ? activeGradient : "transparent",
                    color: isActive
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.38)",
                    boxShadow: isActive
                      ? "0 2px 12px rgba(0,0,0,0.28)"
                      : "none",
                    border: isActive
                      ? "1px solid rgba(255,255,255,0.18)"
                      : "1px solid transparent",
                  }}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          {/* ── DIZAJN TAB ── */}
          {activeTab === "dizajn" && (
            <>
              {/* Color swatches */}
              <SectionCard>
                <SectionLabel>Farby</SectionLabel>
                <div className="flex gap-6 justify-center py-2">
                  <Swatch
                    color={shiftHex(settings.color1, settings.hueShift)}
                    label="Farba 1"
                    onChange={(c) => update({ color1: c, hueShift: 0 })}
                  />
                  <Swatch
                    color={shiftHex(settings.color2, settings.hueShift)}
                    label="Farba 2"
                    onChange={(c) => update({ color2: c, hueShift: 0 })}
                  />
                  {settings.useThirdColor ? (
                    <Swatch
                      color={shiftHex(settings.color3, settings.hueShift)}
                      label="Farba 3"
                      onChange={(c) => update({ color3: c, hueShift: 0 })}
                      onRemove={() => update({ useThirdColor: false })}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <button
                        type="button"
                        aria-label="Pridať tretiu farbu"
                        data-ocid="theme.add_color3_button"
                        onClick={() => update({ useThirdColor: true })}
                        className="transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 flex items-center justify-center"
                        style={{
                          width: 68,
                          height: 68,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.04)",
                          border: "1.5px dashed rgba(255,255,255,0.18)",
                          boxShadow: "0 0 0 3px rgba(0,0,0,0.35)",
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 26,
                            fontWeight: 300,
                            color: "rgba(255,255,255,0.3)",
                            lineHeight: 1,
                            userSelect: "none",
                          }}
                        >
                          +
                        </span>
                      </button>
                      <span className="font-display text-[9px] uppercase tracking-[0.1em] text-white/20">
                        Pridať
                      </span>
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* Sliders */}
              <SectionCard>
                <SliderRow
                  label="🎨 Odtieň farieb"
                  value={settings.hueShift}
                  min={0}
                  max={360}
                  ocid="theme.hue_shift_slider"
                  onChange={(v) => update({ hueShift: v })}
                />
                <Divider />
                <SliderRow
                  label="Posun gradientu"
                  value={settings.shift}
                  min={0}
                  max={100}
                  ocid="theme.shift_slider"
                  onChange={(v) => update({ shift: v })}
                />
              </SectionCard>

              {/* Live preview button */}
              <SectionCard>
                <SectionLabel>Skúšobné tlačidlo</SectionLabel>
                <div className="flex items-center justify-center py-2">
                  <button
                    type="button"
                    data-ocid="theme.preview_button"
                    className="relative overflow-hidden font-display font-bold text-white cursor-default select-none"
                    style={{
                      borderRadius: 20,
                      padding: "20px 52px",
                      fontSize: 15,
                      border: "1px solid rgba(255,255,255,0.28)",
                      boxShadow: `0 8px 32px rgba(0,0,0,0.28), 0 2px 8px ${c1shifted}55, inset 0 1px 0 rgba(255,255,255,0.18)`,
                      letterSpacing: "0.04em",
                      minWidth: 240,
                      textAlign: "center",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: -20,
                        background: activeGradient,
                        borderRadius: "inherit",
                        zIndex: 0,
                        pointerEvents: "none",
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.10) 100%)",
                        borderRadius: "inherit",
                        zIndex: 1,
                      }}
                    />
                    <span className="relative" style={{ zIndex: 2 }}>
                      Ukážka
                    </span>
                  </button>
                </div>
                <Divider />
                <SectionLabel>Uložiť dizajn</SectionLabel>
                <SaveDesignRow onSave={saveDesign} />
              </SectionCard>

              {/* Built-in presets */}
              <SectionCard>
                <SectionLabel>Predvolené štýly</SectionLabel>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset) => {
                    const isActive = isActivePreset(preset);
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        data-ocid="theme.preset_button"
                        onClick={() => applyPreset(preset.settings)}
                        className="rounded-xl px-3 py-2.5 text-left cursor-pointer transition-all duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 flex flex-col gap-2"
                        style={{
                          background: isActive
                            ? `linear-gradient(135deg, ${preset.settings.color1}, ${preset.settings.color2})`
                            : "rgba(255,255,255,0.07)",
                          border: isActive
                            ? "1px solid rgba(255,255,255,0.25)"
                            : "1px solid rgba(255,255,255,0.12)",
                          boxShadow: isActive
                            ? "0 4px 16px rgba(0,0,0,0.2)"
                            : "0 2px 8px rgba(0,0,0,0.15)",
                          transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{preset.emoji}</span>
                          <span className="font-display text-[11px] font-semibold text-white truncate">
                            {preset.name}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[
                            preset.settings.color1,
                            preset.settings.color2,
                            preset.settings.color3,
                          ].map((c) => (
                            <span
                              key={c}
                              className="block w-3 h-3 rounded-full ring-1 ring-black/20"
                              style={{ background: c }}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </SectionCard>

              {/* Saved designs library */}
              <SectionCard>
                <SectionLabel>Moje dizajny</SectionLabel>
                {savedDesigns.length === 0 ? (
                  <p
                    className="text-center font-display text-[11px] text-white/30 py-3"
                    data-ocid="theme.saved_empty_state"
                  >
                    Zatiaľ žiadne uložené dizajny
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-0.5">
                    {savedDesigns.map((design) => (
                      <SavedDesignCard
                        key={design.name}
                        design={design}
                        isActive={isActiveSaved(design)}
                        onApply={() => applyPreset(design)}
                        onDelete={() => deleteSavedDesign(design.name)}
                      />
                    ))}
                  </div>
                )}
              </SectionCard>
            </>
          )}

          {/* ── HODNOTENIE TAB ── */}
          {activeTab === "hodnotenie" && <RatingSettingsTab />}
        </dialog>
      </div>
    </>
  );
}
