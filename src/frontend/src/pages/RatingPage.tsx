import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllPublicNFTs } from "@/hooks/useQueries";
import { useRatingDisplay } from "@/hooks/useRatingDisplay";
import type {
  RatingDisplaySettings,
  SavedProfile,
} from "@/hooks/useRatingDisplay";
import { RATING_DISPLAY_PRESETS } from "@/hooks/useRatingDisplay";
import type { NFTMetadata } from "@/types/nft";
import { nftImageUrl } from "@/utils/nftImage";
import type React from "react";
import { type ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function useShuffledNFTs(
  nfts: NFTMetadata[] | undefined,
): NFTMetadata[] | undefined {
  const [shuffled, setShuffled] = useState<NFTMetadata[] | undefined>(
    undefined,
  );
  const prevRef = useRef<NFTMetadata[] | undefined>(undefined);
  useEffect(() => {
    if (!nfts) {
      setShuffled(undefined);
      return;
    }
    if (prevRef.current === nfts) return;
    prevRef.current = nfts;
    const copy = [...nfts];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffled(copy);
  }, [nfts]);
  return shuffled;
}

const EMOTIONS = [
  {
    id: -3,
    label: "Odporné",
    size: 56,
    colorBg: "rgba(220,38,38,0.18)",
    colorBorder: "rgba(220,38,38,0.60)",
    colorFill: "rgba(220,38,38,0.92)",
    glow: "0 0 20px 6px rgba(220,38,38,0.50)",
  },
  {
    id: -2,
    label: "Nudné",
    size: 46,
    colorBg: "rgba(234,88,12,0.18)",
    colorBorder: "rgba(234,88,12,0.55)",
    colorFill: "rgba(234,88,12,0.90)",
    glow: "0 0 15px 4px rgba(234,88,12,0.42)",
  },
  {
    id: -1,
    label: "Slabé",
    size: 34,
    colorBg: "rgba(202,138,4,0.18)",
    colorBorder: "rgba(202,138,4,0.50)",
    colorFill: "rgba(202,138,4,0.88)",
    glow: "0 0 10px 3px rgba(202,138,4,0.35)",
  },
  {
    id: 0,
    label: "Jedno mi to",
    size: 64,
    colorBg: "rgba(156,163,175,0.18)",
    colorBorder: "rgba(156,163,175,0.55)",
    colorFill: "rgba(107,114,128,0.85)",
    glow: "0 0 24px 8px rgba(156,163,175,0.35)",
  },
  {
    id: 1,
    label: "Zaujímavé",
    size: 34,
    colorBg: "rgba(34,197,94,0.18)",
    colorBorder: "rgba(34,197,94,0.50)",
    colorFill: "rgba(34,197,94,0.88)",
    glow: "0 0 10px 3px rgba(34,197,94,0.35)",
  },
  {
    id: 2,
    label: "Páči sa mi",
    size: 46,
    colorBg: "rgba(6,182,212,0.18)",
    colorBorder: "rgba(6,182,212,0.55)",
    colorFill: "rgba(6,182,212,0.90)",
    glow: "0 0 15px 4px rgba(6,182,212,0.42)",
  },
  {
    id: 3,
    label: "Nádherné",
    size: 56,
    colorBg: "rgba(59,130,246,0.18)",
    colorBorder: "rgba(59,130,246,0.55)",
    colorFill: "rgba(59,130,246,0.92)",
    glow: "0 0 20px 6px rgba(59,130,246,0.52)",
  },
] as const;
type EmotionId = (typeof EMOTIONS)[number]["id"];

// ---------------------------------------------------------------------------
// ActiveCard
// ---------------------------------------------------------------------------
function ActiveCard({
  nft,
  rating,
  settings,
}: {
  nft: NFTMetadata;
  rating: EmotionId | null;
  settings: RatingDisplaySettings;
}) {
  const ratedEmotion = EMOTIONS.find((e) => e.id === rating);
  const aspectStyle =
    settings.cardAspectRatio === "auto"
      ? {}
      : settings.cardAspectRatio === "portrait"
        ? { aspectRatio: "3/4" }
        : settings.cardAspectRatio === "landscape"
          ? { aspectRatio: "4/3" }
          : { aspectRatio: "1/1" };
  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden"
      style={{
        boxShadow: `0 16px 60px rgba(0,0,0,${0.35 + settings.shadowIntensity * 0.5})`,
        background: "rgba(10,4,16,1)",
        border: settings.showCardBorder
          ? `1.5px solid ${settings.borderColor}`
          : "none",
        ...aspectStyle,
      }}
    >
      <img
        src={nftImageUrl(nft.image)}
        alt={nft.name}
        loading="eager"
        draggable={false}
        className="w-full h-full object-cover select-none"
        style={{ display: "block" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.52) 55%, transparent 100%)",
        }}
      >
        {settings.showLabels && (
          <p
            className="font-display font-bold text-white truncate leading-snug"
            style={{ fontSize: settings.labelFontSize }}
          >
            {nft.name}
          </p>
        )}
        {nft.description && settings.showLabels && (
          <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mt-0.5">
            {nft.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span
            className="inline-block text-[10px] font-mono px-1.5 py-0.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            #{nft.tokenId.toString()}
          </span>
          {ratedEmotion && (
            <span
              className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: ratedEmotion.colorBg,
                border: `1px solid ${ratedEmotion.colorBorder}`,
                color: ratedEmotion.colorFill,
              }}
            >
              {ratedEmotion.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PeekCard
// ---------------------------------------------------------------------------
function PeekCard({
  nft,
  pos,
  settings,
}: { nft: NFTMetadata; pos: number; settings: RatingDisplaySettings }) {
  const opacities = [1, 0.85, 0.65, 0.45, 0.28];
  const opacity = (opacities[pos] ?? 0.2) * settings.opacity;
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="w-full h-full rounded-2xl overflow-hidden"
      onMouseEnter={() => settings.interactiveHover && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: settings.showCardBorder
          ? "1.5px solid rgba(255,255,255,0.10)"
          : "none",
        boxShadow: `0 4px ${20 + settings.shadowIntensity * 40}px rgba(0,0,0,${0.3 + settings.shadowIntensity * 0.4})`,
        background: "rgba(8,4,18,0.95)",
        maskImage:
          "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 18%, rgba(0,0,0,0.9) 45%, black 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 18%, rgba(0,0,0,0.9) 45%, black 100%)",
        filter:
          settings.blurInactive > 0
            ? `blur(${settings.blurInactive}px)`
            : undefined,
        transform: hovered ? "translateY(-4px) scale(1.02)" : undefined,
        transition: "transform 0.2s ease",
      }}
    >
      <img
        src={nftImageUrl(nft.image)}
        alt={nft.name}
        loading="lazy"
        draggable={false}
        className="w-full h-full object-cover select-none"
        style={{ display: "block", opacity }}
      />
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 10,
          fontSize: 10,
          color: "rgba(255,255,255,0.28)",
          fontWeight: 700,
          letterSpacing: "0.05em",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {pos + 1}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmotionCircle
// ---------------------------------------------------------------------------
function EmotionCircle({
  emotion,
  selected,
  onSelect,
}: {
  emotion: (typeof EMOTIONS)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const d = emotion.size;
  return (
    <div
      className="relative flex flex-col items-center"
      style={{ minWidth: d + 8 }}
    >
      <button
        type="button"
        aria-label={emotion.label}
        aria-pressed={selected}
        onClick={onSelect}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: d,
          height: d,
          borderRadius: "50%",
          border: `2px solid ${emotion.colorBorder}`,
          background: selected ? emotion.colorFill : emotion.colorBg,
          boxShadow: selected
            ? emotion.glow
            : hovered
              ? emotion.glow.replace(/ [0-9.]+\)$/, "0.22)")
              : "none",
          transform: selected
            ? "scale(1.15)"
            : hovered
              ? "scale(1.10)"
              : "scale(1)",
          transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
          cursor: "pointer",
          flexShrink: 0,
          outline: "none",
        }}
        className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
      />
      <span
        style={{
          opacity: hovered || selected ? 1 : 0,
          transition: "opacity 0.15s ease",
          pointerEvents: "none",
          fontSize: 10,
          marginTop: 4,
          whiteSpace: "nowrap",
          color: "rgba(255,255,255,0.72)",
          fontWeight: 600,
          letterSpacing: "0.03em",
        }}
      >
        {emotion.label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shape icons
// ---------------------------------------------------------------------------
const SHAPE_ICONS: Record<
  RatingDisplaySettings["arrangementShape"],
  ReactElement
> = {
  "arc-left": (
    <svg
      viewBox="0 0 28 44"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const t = i / 4;
        const y = 2 + i * 8;
        const arc = -Math.sin(t * Math.PI) * 10;
        const x = 10 + arc;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={10}
            height={7}
            rx="1.5"
            fill="currentColor"
            opacity={1 - i * 0.15}
          />
        );
      })}
    </svg>
  ),
  "arc-right": (
    <svg
      viewBox="0 0 28 44"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const t = i / 4;
        const y = 2 + i * 8;
        const arc = Math.sin(t * Math.PI) * 10;
        const x = 10 + arc;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={10}
            height={7}
            rx="1.5"
            fill="currentColor"
            opacity={1 - i * 0.15}
          />
        );
      })}
    </svg>
  ),
  line: (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={2 + i * 8}
          y={4 + i * 4}
          width={7}
          height={10}
          rx="1.5"
          fill="currentColor"
          opacity={1 - i * 0.15}
        />
      ))}
    </svg>
  ),
  "arc-up": (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const t = i / 4;
        const x = 2 + i * 8;
        const arc = Math.sin(t * Math.PI) * 10;
        const y = 16 - arc;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={7}
            height={10}
            rx="1.5"
            fill="currentColor"
            opacity={1 - i * 0.15}
          />
        );
      })}
    </svg>
  ),
  "arc-down": (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const t = i / 4;
        const x = 2 + i * 8;
        const arc = Math.sin(t * Math.PI) * 10;
        const y = 4 + arc;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={7}
            height={10}
            rx="1.5"
            fill="currentColor"
            opacity={1 - i * 0.15}
          />
        );
      })}
    </svg>
  ),
  spiral: (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = i * 0.55;
        const r = 8 - i * 1.2;
        const cx = 22 + Math.cos(angle) * r * 2;
        const cy = 14 + Math.sin(angle) * r;
        return (
          <rect
            key={i}
            x={cx - 3.5}
            y={cy - 5}
            width={7}
            height={10}
            rx="1.5"
            fill="currentColor"
            opacity={1 - i * 0.15}
            transform={`rotate(${angle * 30},${cx},${cy})`}
          />
        );
      })}
    </svg>
  ),
  fan: (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i - 2) * 18;
        const rad = (angle * Math.PI) / 180;
        const cx = 22 + Math.sin(rad) * 14;
        const cy = 22 - Math.cos(rad) * 10;
        return (
          <rect
            key={i}
            x={cx - 3.5}
            y={cy - 8}
            width={7}
            height={11}
            rx="1.5"
            fill="currentColor"
            opacity={1 - Math.abs(i - 2) * 0.15}
            transform={`rotate(${angle},${cx},${cy + 2})`}
          />
        );
      })}
    </svg>
  ),
  wave: (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 2 + i * 8;
        const y = 14 + Math.sin(i * 1.2) * 8;
        return (
          <rect
            key={i}
            x={x}
            y={y - 5}
            width={7}
            height={10}
            rx="1.5"
            fill="currentColor"
            opacity={1 - i * 0.12}
          />
        );
      })}
    </svg>
  ),
  grid: (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <rect
            key={i}
            x={4 + col * 13}
            y={2 + row * 13}
            width={9}
            height={9}
            rx="1.5"
            fill="currentColor"
            opacity={0.9 - i * 0.08}
          />
        );
      })}
    </svg>
  ),
  steps: (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={2 + i * 9}
          y={22 - i * 5}
          width={7}
          height={10}
          rx="1.5"
          fill="currentColor"
          opacity={1 - i * 0.15}
        />
      ))}
    </svg>
  ),
  circle: (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        const cx = 22 + Math.cos(angle) * 11;
        const cy = 14 + Math.sin(angle) * 7;
        return (
          <rect
            key={i}
            x={cx - 3}
            y={cy - 4}
            width={6}
            height={8}
            rx="1.5"
            fill="currentColor"
            opacity={0.9}
          />
        );
      })}
    </svg>
  ),
  teardrop: (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const spread = i * i * 1.5;
        const x = 22 - spread / 2;
        const y = 2 + i * 5;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={Math.max(6, spread)}
            height={6}
            rx="1.5"
            fill="currentColor"
            opacity={1 - i * 0.15}
          />
        );
      })}
    </svg>
  ),
  concentric: (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 2 + i * 8;
        const y = 14 + (i % 2 === 0 ? -6 : 6);
        return (
          <rect
            key={i}
            x={x}
            y={y - 4}
            width={7}
            height={9}
            rx="1.5"
            fill="currentColor"
            opacity={1 - i * 0.14}
          />
        );
      })}
    </svg>
  ),
  diamond: (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 2 + i * 8;
        const amp = i % 2 === 0 ? 0 : 10;
        const y = 10 + amp;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={7}
            height={9}
            rx="1.5"
            fill="currentColor"
            opacity={1 - i * 0.14}
          />
        );
      })}
    </svg>
  ),
  cascade: (
    <svg
      viewBox="0 0 44 28"
      fill="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={4 + i * 8}
          y={2 + i * 4}
          width={10}
          height={12}
          rx="1.5"
          fill="currentColor"
          opacity={1 - i * 0.15}
        />
      ))}
    </svg>
  ),
};

const SHAPE_LABELS: Record<RatingDisplaySettings["arrangementShape"], string> =
  {
    line: "Priamka",
    "arc-up": "Oblúk hore",
    "arc-down": "Oblúk dole",
    "arc-left": "Oblúk ľavo",
    "arc-right": "Oblúk pravo",
    spiral: "Špirála",
    fan: "Vejár",
    wave: "Vlna",
    grid: "Mriežka",
    steps: "Stupne",
    circle: "Kruh",
    teardrop: "Kvapka",
    concentric: "Sústrečné",
    diamond: "Diamant",
    cascade: "Kaskáda",
  };

const ALL_SHAPES: RatingDisplaySettings["arrangementShape"][] = [
  "line",
  "arc-up",
  "arc-down",
  "arc-left",
  "arc-right",
  "spiral",
  "fan",
  "wave",
  "grid",
  "steps",
  "circle",
  "teardrop",
  "concentric",
  "diamond",
  "cascade",
];

const DIRECTION_OPTIONS: {
  value: RatingDisplaySettings["direction"];
  label: string;
}[] = [
  { value: "right", label: "→" },
  { value: "left", label: "←" },
  { value: "right-up", label: "↗" },
  { value: "right-down", label: "↘" },
];

// ---------------------------------------------------------------------------
// computeDepths
// ---------------------------------------------------------------------------
export function computeDepths(settings: RatingDisplaySettings): {
  scale: number;
  tz: number;
  tx: number;
  ty: number;
  rot: number;
  opacity: number;
}[] {
  const {
    visibleCards,
    cardScale,
    depthStep,
    arrangementShape,
    curveIntensity,
    spacingX,
    spacingY,
    direction,
    opacity,
    waveAmplitude,
    activeCardScale,
  } = settings;
  const dirSign = direction === "left" ? -1 : 1;
  const vertSign =
    direction === "right-up" ? -1 : direction === "right-down" ? 1 : 0;
  const curve = curveIntensity / 100;

  return Array.from({ length: visibleCards }, (_, pos) => {
    if (pos === 0)
      return {
        scale: activeCardScale,
        tz: 0,
        tx: 0,
        ty: 0,
        rot: 0,
        opacity: 1,
      };
    const t = pos / (visibleCards - 1 || 1);
    const baseScale =
      activeCardScale * (1 - (pos * (1 - cardScale)) / activeCardScale);
    const baseTz = -pos * depthStep;
    const baseOpacity = [0.85, 0.65, 0.45, 0.28, 0.18][pos - 1] ?? 0.15;
    const cardOpacity = baseOpacity * opacity;
    const cardRot = settings.cardRotation;
    let tx = dirSign * pos * spacingX;
    let ty = (spacingY !== 0 ? pos * spacingY : 0) + vertSign * pos * 30;
    let rot = cardRot;

    switch (arrangementShape) {
      case "line":
        break;

      case "arc-up": {
        const arcY = -Math.sin(t * Math.PI) * curveIntensity * 2.0;
        tx = dirSign * pos * spacingX;
        ty = arcY;
        break;
      }
      case "arc-down": {
        const arcY = Math.sin(t * Math.PI) * curveIntensity * 2.0;
        tx = dirSign * pos * spacingX;
        ty = arcY;
        break;
      }
      case "arc-left": {
        const arcX = -Math.sin(t * Math.PI) * curveIntensity * 2.0;
        tx = arcX;
        ty = pos * spacingX * 0.55;
        break;
      }
      case "arc-right": {
        const arcX = Math.sin(t * Math.PI) * curveIntensity * 2.0;
        tx = arcX;
        ty = pos * spacingX * 0.55;
        break;
      }
      case "spiral": {
        const angle = pos * curve * 0.9;
        const radius = pos * spacingX;
        tx = dirSign * Math.cos(angle) * radius;
        ty = Math.sin(angle) * radius * 0.45;
        rot = angle * (180 / Math.PI) * dirSign * 0.4 + cardRot;
        break;
      }
      case "fan": {
        const fanAngle = pos * curve * 12;
        rot = dirSign * fanAngle + cardRot;
        const rad = (fanAngle * Math.PI) / 180;
        tx = dirSign * Math.sin(rad) * spacingX * pos * 0.6;
        ty = (1 - Math.cos(rad)) * spacingX * pos * 0.15;
        break;
      }
      case "wave": {
        const amp = waveAmplitude;
        tx = dirSign * pos * spacingX;
        ty = Math.sin(pos * 1.1) * amp;
        break;
      }
      case "grid": {
        const cols = Math.ceil(Math.sqrt(visibleCards));
        const col = pos % cols;
        const row = Math.floor(pos / cols);
        tx = dirSign * col * spacingX;
        ty = row * (spacingY || spacingX * 0.8);
        break;
      }
      case "steps": {
        tx = dirSign * pos * spacingX;
        ty = pos * (spacingY !== 0 ? spacingY : spacingX * 0.4);
        rot = cardRot;
        break;
      }
      case "circle": {
        const totalAngle = (2 * Math.PI * pos) / visibleCards;
        const radius = spacingX * 1.2;
        tx = dirSign * Math.sin(totalAngle) * radius;
        ty = -Math.cos(totalAngle) * radius * 0.5 + radius * 0.5;
        rot = (totalAngle * 180) / Math.PI + cardRot;
        break;
      }
      case "teardrop": {
        const spread = pos * pos * (spacingX / 20);
        tx = dirSign * (pos % 2 === 0 ? 1 : -1) * spread * 0.5;
        ty = pos * (spacingY || spacingX * 0.3);
        break;
      }
      case "concentric": {
        tx = dirSign * pos * spacingX;
        ty = pos % 2 === 0 ? -curveIntensity * 0.8 : curveIntensity * 0.8;
        break;
      }
      case "diamond": {
        tx = dirSign * pos * spacingX;
        ty = pos % 2 === 0 ? 0 : curveIntensity * 1.5;
        rot = pos % 2 === 0 ? cardRot : -cardRot;
        break;
      }
      case "cascade": {
        tx = dirSign * pos * Math.max(spacingX, 0) * 0.6;
        ty = pos * (spacingY !== 0 ? spacingY : 28);
        rot = dirSign * pos * curve * 3 + cardRot;
        break;
      }
    }
    return { scale: baseScale, tz: baseTz, tx, ty, rot, opacity: cardOpacity };
  });
}

// ---------------------------------------------------------------------------
// Collapsible section helper
// ---------------------------------------------------------------------------
function PanelSection({
  title,
  defaultOpen = false,
  children,
}: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 4 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "7px 0 6px",
          background: "none",
          border: "none",
          cursor: "pointer",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          color: "rgba(255,255,255,0.38)",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
        }}
      >
        <span>{title}</span>
        <span
          style={{
            fontSize: 10,
            transition: "transform 0.2s ease",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          ▼
        </span>
      </button>
      {open && <div style={{ paddingTop: 10 }}>{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Slider row helper
// ---------------------------------------------------------------------------
function SliderRow({
  label,
  value,
  min,
  max,
  step,
  ocid,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  ocid?: string;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const display = format ? format(value) : String(value);
  return (
    <div style={{ marginBottom: 11 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.60)",
            fontWeight: 600,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.35)",
            fontFamily: "monospace",
          }}
        >
          {display}
        </span>
      </div>
      <input
        type="range"
        data-ocid={ocid}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          height: 4,
          borderRadius: 2,
          accentColor: "rgba(255,255,255,0.7)",
          cursor: "pointer",
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toggle row helper
// ---------------------------------------------------------------------------
function ToggleRow({
  label,
  value,
  ocid,
  onChange,
}: {
  label: string;
  value: boolean;
  ocid?: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.60)",
          fontWeight: 600,
        }}
      >
        {label}
      </span>
      <button
        type="button"
        data-ocid={ocid}
        onClick={() => onChange(!value)}
        style={{
          width: 34,
          height: 18,
          borderRadius: 9,
          border: "none",
          cursor: "pointer",
          background: value
            ? "rgba(100,220,150,0.85)"
            : "rgba(255,255,255,0.12)",
          position: "relative" as const,
          transition: "background 0.2s ease",
          flexShrink: 0,
        }}
        aria-pressed={value}
      >
        <span
          style={{
            position: "absolute" as const,
            top: 2,
            left: value ? 16 : 2,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "white",
            transition: "left 0.2s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
          }}
        />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RatingArrangementPanel
// ---------------------------------------------------------------------------
const RANDOM_SHAPES: RatingDisplaySettings["arrangementShape"][] = [
  "line",
  "arc-up",
  "arc-down",
  "arc-left",
  "arc-right",
  "spiral",
  "fan",
  "wave",
  "grid",
  "steps",
  "circle",
  "teardrop",
  "concentric",
  "diamond",
  "cascade",
];
const RANDOM_DIRECTIONS: RatingDisplaySettings["direction"][] = [
  "right",
  "left",
  "right-up",
  "right-down",
];
const RANDOM_EASINGS: RatingDisplaySettings["animationEasing"][] = [
  "ease",
  "ease-in-out",
  "spring",
  "bounce",
];
const RANDOM_ASPECTS: RatingDisplaySettings["cardAspectRatio"][] = [
  "square",
  "portrait",
  "landscape",
  "auto",
];
const RANDOM_BORDER_COLORS = [
  "oklch(0.6 0.28 320)",
  "oklch(0.65 0.25 240)",
  "oklch(0.7 0.22 160)",
  "oklch(0.65 0.25 60)",
  "rgba(255,255,255,0.4)",
  "rgba(255,255,255,0.1)",
];
function rnd(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step);
  return min + Math.floor(Math.random() * (steps + 1)) * step;
}
function rndFloat(min: number, max: number, decimals = 2): number {
  return Number.parseFloat(
    (min + Math.random() * (max - min)).toFixed(decimals),
  );
}
function rndBool(): boolean {
  return Math.random() >= 0.5;
}
function rndItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}
function buildRandomSettings(): Partial<RatingDisplaySettings> {
  return {
    arrangementShape: rndItem(RANDOM_SHAPES),
    direction: rndItem(RANDOM_DIRECTIONS),
    curveIntensity: rnd(5, 100, 5),
    waveAmplitude: rnd(20, 120, 5),
    spacingX: rnd(-50, 250, 5),
    spacingY: rnd(-30, 150, 5),
    verticalOffset: rnd(-100, 100, 5),
    horizontalOffset: rnd(-100, 100, 5),
    visibleCards: rnd(3, 20),
    activeCardScale: rndFloat(1.0, 2.2),
    cardRotation: rnd(-30, 30),
    perspectiveDepth: rnd(300, 1500, 50),
    depthStep: rnd(0, 200, 5),
    cardTilt: rnd(-20, 20),
    blurInactive: rndFloat(0, 6, 1),
    interactiveHover: rndBool(),
    shadowIntensity: rndFloat(0, 1),
    opacity: rndFloat(0.3, 1.0),
    animationDuration: rndFloat(0.15, 1.0),
    scrollCooldown: rnd(100, 1400, 100),
    showLabels: rndBool(),
    cardAspectRatio: rndItem(RANDOM_ASPECTS),
    animationEasing: rndItem(RANDOM_EASINGS),
    showCardBorder: rndBool(),
    borderColor: rndItem(RANDOM_BORDER_COLORS),
    cardScale: rndFloat(0.5, 1.0),
  };
}

function RatingArrangementPanel({
  settings,
  updateSettings,
  resetToDefault,
  savedProfiles,
  activeProfileName,
  saveProfile,
  loadProfile,
  deleteProfile,
}: {
  settings: RatingDisplaySettings;
  updateSettings: (patch: Partial<RatingDisplaySettings>) => void;
  resetToDefault: () => void;
  savedProfiles: SavedProfile[];
  activeProfileName: string | null;
  saveProfile: (name: string) => void;
  loadProfile: (name: string) => void;
  deleteProfile: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>(() => ({
    x: Math.max(0, window.innerWidth - 292),
    y: 80,
  }));
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const PANEL_WIDTH = 292;

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const nx = e.clientX - dragOffsetRef.current.x;
      const ny = e.clientY - dragOffsetRef.current.y;
      setPos({
        x: Math.max(0, Math.min(nx, window.innerWidth - PANEL_WIDTH)),
        y: Math.max(0, Math.min(ny, window.innerHeight - 48)),
      });
    };
    const onMouseUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const onDragHandleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    draggingRef.current = true;
    setIsDragging(true);
  };

  const u = updateSettings;
  const s = settings;

  const easingOptions: {
    value: RatingDisplaySettings["animationEasing"];
    label: string;
  }[] = [
    { value: "ease", label: "Ease" },
    { value: "ease-in-out", label: "EaseInOut" },
    { value: "spring", label: "Spring" },
    { value: "bounce", label: "Bounce" },
  ];

  const aspectOptions: {
    value: RatingDisplaySettings["cardAspectRatio"];
    label: string;
  }[] = [
    { value: "square", label: "1:1" },
    { value: "portrait", label: "3:4" },
    { value: "landscape", label: "4:3" },
    { value: "auto", label: "Auto" },
  ];

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
        width: PANEL_WIDTH,
        userSelect: "none",
      }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={onDragHandleMouseDown}
        title="Potiahnite pre presun"
        style={{
          width: "100%",
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: isDragging ? "grabbing" : "grab",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "12px 12px 0 0",
          border: "1px solid rgba(255,255,255,0.10)",
          borderBottom: "none",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: isDragging
              ? "rgba(255,255,255,0.50)"
              : "rgba(255,255,255,0.25)",
            transition: "background 0.15s ease",
          }}
        />
      </div>

      {/* Quick-action toolbar (reset + randomize) */}
      <div
        style={{
          display: "flex",
          gap: 5,
          padding: "4px 8px 4px",
          background: "rgba(8,4,18,0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderTop: "none",
          borderBottom: "none",
        }}
      >
        <button
          type="button"
          data-ocid="rating.reset_settings_button"
          onClick={resetToDefault}
          aria-label="Resetovať nastavenia"
          style={{
            flex: 1,
            height: 30,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.70)",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.10)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.05)";
          }}
        >
          <span style={{ fontSize: 13, lineHeight: 1 }}>↺</span>
          Resetovať
        </button>
        <button
          type="button"
          data-ocid="rating.randomize_settings_button"
          onClick={() => updateSettings(buildRandomSettings())}
          aria-label="Náhodné nastavenia"
          style={{
            flex: 1,
            height: 30,
            borderRadius: 8,
            border: "1px solid rgba(147,51,234,0.50)",
            background: "rgba(147,51,234,0.25)",
            color: "rgba(255,255,255,0.90)",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(147,51,234,0.45)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(147,51,234,0.25)";
          }}
        >
          <span style={{ fontSize: 12, lineHeight: 1 }}>🎲</span>
          Náhodné
        </button>
      </div>

      {/* Toggle row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(8,4,18,0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderTop: "none",
          borderBottom: open ? "none" : "1px solid rgba(255,255,255,0.12)",
          borderRadius: open ? 0 : "0 0 12px 12px",
          padding: "4px 8px",
          gap: 8,
        }}
      >
        <button
          type="button"
          data-ocid="rating.arrangement_settings_button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Nastavenia zoradenia"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: open
              ? "rgba(255,255,255,0.18)"
              : "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.18s ease, transform 0.18s ease",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            color: "rgba(255,255,255,0.75)",
            flexShrink: 0,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 1v2.27a5 5 0 0 1 1.59.66l1.6-1.6 1.42 1.42-1.6 1.6A5 5 0 0 1 11.73 7H14v2h-2.27a5 5 0 0 1-.66 1.59l1.6 1.6-1.42 1.42-1.6-1.6A5 5 0 0 1 9 13.73V16H7v-2.27a5 5 0 0 1-1.59-.66l-1.6 1.6-1.42-1.42 1.6-1.6A5 5 0 0 1 4.27 9H2V7h2.27a5 5 0 0 1 .66-1.59L3.33 3.81l1.42-1.42 1.6 1.6A5 5 0 0 1 7 3.27V1h1ZM8 6a2 2 0 1 0 0 4A2 2 0 0 0 8 6Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <span
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.35)",
            fontWeight: 600,
            letterSpacing: "0.05em",
            pointerEvents: "none",
          }}
        >
          Nastavenia
        </span>
      </div>

      {/* Panel content */}
      <div
        data-ocid="rating.arrangement_panel"
        style={{
          width: "100%",
          background: "rgba(8,4,18,0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderTop: "none",
          borderRadius: "0 0 16px 16px",
          overflow: "hidden",
          maxHeight: open ? 2400 : 0,
          opacity: open ? 1 : 0,
          transition:
            "max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease",
          pointerEvents: open ? "auto" : "none",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            padding: "12px 14px 14px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {/* === TVAR A ZORADENIE === */}
          <PanelSection title="Tvar a zoradenie" defaultOpen={true}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5,1fr)",
                gap: 4,
                marginBottom: 12,
              }}
            >
              {ALL_SHAPES.map((shape) => {
                const active = s.arrangementShape === shape;
                return (
                  <button
                    type="button"
                    key={shape}
                    data-ocid={`rating.shape_${shape.replace(/-/g, "_")}_button`}
                    onClick={() => u({ arrangementShape: shape })}
                    aria-label={SHAPE_LABELS[shape]}
                    style={{
                      display: "flex",
                      flexDirection: "column" as const,
                      alignItems: "center",
                      gap: 3,
                      padding: "7px 2px 5px",
                      borderRadius: 8,
                      border: active
                        ? "1.5px solid rgba(255,255,255,0.45)"
                        : "1.5px solid rgba(255,255,255,0.10)",
                      background: active
                        ? "rgba(255,255,255,0.12)"
                        : "rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      color: active
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(255,255,255,0.40)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ width: 26, height: 18 }}>
                      {SHAPE_ICONS[shape]}
                    </div>
                    <span
                      style={{
                        fontSize: 7,
                        fontWeight: 600,
                        letterSpacing: "0.03em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {SHAPE_LABELS[shape]}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Direction */}
            <div style={{ marginBottom: 10 }}>
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.60)",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                Smer
              </p>
              <div style={{ display: "flex", gap: 5 }}>
                {DIRECTION_OPTIONS.map(({ value, label }) => {
                  const active = s.direction === value;
                  return (
                    <button
                      type="button"
                      key={value}
                      data-ocid={`rating.direction_${value.replace("-", "_")}_button`}
                      onClick={() => u({ direction: value })}
                      style={{
                        flex: 1,
                        padding: "5px 0",
                        borderRadius: 7,
                        border: active
                          ? "1.5px solid rgba(255,255,255,0.45)"
                          : "1.5px solid rgba(255,255,255,0.10)",
                        background: active
                          ? "rgba(255,255,255,0.12)"
                          : "rgba(255,255,255,0.04)",
                        color: active
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(255,255,255,0.40)",
                        fontSize: 15,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <SliderRow
              label="Intenzita krivky"
              value={s.curveIntensity}
              min={0}
              max={100}
              step={5}
              ocid="rating.curveIntensity_slider"
              onChange={(v) => u({ curveIntensity: v })}
            />
            {s.arrangementShape === "wave" && (
              <SliderRow
                label="Amplituda vlny"
                value={s.waveAmplitude}
                min={0}
                max={120}
                step={5}
                ocid="rating.waveAmplitude_slider"
                onChange={(v) => u({ waveAmplitude: v })}
              />
            )}
          </PanelSection>

          {/* === ROZOSTUPY === */}
          <PanelSection title="Rozostupy a hustota" defaultOpen={true}>
            <div style={{ marginBottom: 11 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.60)",
                    fontWeight: 600,
                  }}
                >
                  Hustota X
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color:
                      s.spacingX < 0
                        ? "rgba(255,160,80,0.85)"
                        : "rgba(255,255,255,0.35)",
                    fontFamily: "monospace",
                    fontWeight: s.spacingX < 0 ? 700 : 400,
                  }}
                >
                  {s.spacingX < 0 ? `Overlap ${s.spacingX}` : `${s.spacingX}px`}
                </span>
              </div>
              <input
                type="range"
                data-ocid="rating.spacingX_slider"
                min={-80}
                max={300}
                step={5}
                value={s.spacingX}
                onChange={(e) => u({ spacingX: Number(e.target.value) })}
                style={{
                  width: "100%",
                  height: 4,
                  borderRadius: 2,
                  accentColor: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 2,
                }}
              >
                <span style={{ fontSize: 8, color: "rgba(255,160,80,0.5)" }}>
                  ←Prehustenie
                </span>
                <span style={{ fontSize: 8, color: "rgba(255,255,255,0.22)" }}>
                  Roztiahnuté→
                </span>
              </div>
            </div>
            <div style={{ marginBottom: 11 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.60)",
                    fontWeight: 600,
                  }}
                >
                  Hustota Y
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color:
                      s.spacingY < 0
                        ? "rgba(255,160,80,0.85)"
                        : "rgba(255,255,255,0.35)",
                    fontFamily: "monospace",
                    fontWeight: s.spacingY < 0 ? 700 : 400,
                  }}
                >
                  {s.spacingY < 0 ? `Overlap ${s.spacingY}` : `${s.spacingY}px`}
                </span>
              </div>
              <input
                type="range"
                data-ocid="rating.spacingY_slider"
                min={-80}
                max={300}
                step={5}
                value={s.spacingY}
                onChange={(e) => u({ spacingY: Number(e.target.value) })}
                style={{
                  width: "100%",
                  height: 4,
                  borderRadius: 2,
                  accentColor: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                }}
              />
            </div>
            <SliderRow
              label="Posun hore/dole"
              value={s.verticalOffset}
              min={-200}
              max={200}
              step={5}
              ocid="rating.verticalOffset_slider"
              onChange={(v) => u({ verticalOffset: v })}
              format={(v) => `${v > 0 ? "+" : ""}${v}px`}
            />
            <SliderRow
              label="Posun vľavo/vpravo"
              value={s.horizontalOffset}
              min={-300}
              max={300}
              step={5}
              ocid="rating.horizontalOffset_slider"
              onChange={(v) => u({ horizontalOffset: v })}
              format={(v) => `${v > 0 ? "+" : ""}${v}px`}
            />
          </PanelSection>

          {/* === KARTY === */}
          <PanelSection title="Karty" defaultOpen={true}>
            <SliderRow
              label="Počet kariet"
              value={s.visibleCards}
              min={1}
              max={50}
              step={1}
              ocid="rating.visibleCards_slider"
              onChange={(v) => u({ visibleCards: v })}
            />
            <SliderRow
              label="Veľkosť aktívnej"
              value={s.activeCardScale}
              min={1.0}
              max={2.5}
              step={0.05}
              ocid="rating.activeCardScale_slider"
              onChange={(v) => u({ activeCardScale: v })}
              format={(v) => `${v.toFixed(2)}x`}
            />
            <SliderRow
              label="Rotácia kariet"
              value={s.cardRotation}
              min={-45}
              max={45}
              step={1}
              ocid="rating.cardRotation_slider"
              onChange={(v) => u({ cardRotation: v })}
              format={(v) => `${v}°`}
            />
            {/* Aspect ratio */}
            <div style={{ marginBottom: 11 }}>
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.60)",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                Pomer strán
              </p>
              <div style={{ display: "flex", gap: 5 }}>
                {aspectOptions.map(({ value, label }) => {
                  const active = s.cardAspectRatio === value;
                  return (
                    <button
                      type="button"
                      key={value}
                      data-ocid={`rating.aspect_${value}_button`}
                      onClick={() => u({ cardAspectRatio: value })}
                      style={{
                        flex: 1,
                        padding: "5px 2px",
                        borderRadius: 7,
                        fontSize: 10,
                        border: active
                          ? "1.5px solid rgba(255,255,255,0.45)"
                          : "1.5px solid rgba(255,255,255,0.10)",
                        background: active
                          ? "rgba(255,255,255,0.12)"
                          : "rgba(255,255,255,0.04)",
                        color: active
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(255,255,255,0.40)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <ToggleRow
              label="Rám kariet"
              value={s.showCardBorder}
              ocid="rating.showCardBorder_toggle"
              onChange={(v) => u({ showCardBorder: v })}
            />
            {s.showCardBorder && (
              <div style={{ marginBottom: 11 }}>
                <p
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.60)",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  Farba rámu
                </p>
                <div
                  style={{ display: "flex", gap: 5, flexWrap: "wrap" as const }}
                >
                  {[
                    "oklch(0.6 0.28 320)",
                    "oklch(0.65 0.25 240)",
                    "oklch(0.7 0.22 160)",
                    "oklch(0.65 0.25 60)",
                    "rgba(255,255,255,0.4)",
                    "rgba(255,255,255,0.1)",
                  ].map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => u({ borderColor: color })}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: color,
                        border:
                          s.borderColor === color
                            ? "2px solid white"
                            : "2px solid transparent",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    />
                  ))}
                  <input
                    type="color"
                    value={
                      s.borderColor.startsWith("#") ? s.borderColor : "#ffffff"
                    }
                    onChange={(e) => u({ borderColor: e.target.value })}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      background: "none",
                    }}
                    title="Vlastná farba"
                  />
                </div>
              </div>
            )}
          </PanelSection>

          {/* === 3D A HĽBKA === */}
          <PanelSection title="3D a hľbka" defaultOpen={false}>
            <SliderRow
              label="Perspektíva"
              value={s.perspectiveDepth}
              min={200}
              max={2000}
              step={50}
              ocid="rating.perspectiveDepth_slider"
              onChange={(v) => u({ perspectiveDepth: v })}
              format={(v) => `${v}px`}
            />
            <SliderRow
              label="Hľbkový krok"
              value={s.depthStep}
              min={0}
              max={300}
              step={5}
              ocid="rating.depthStep_slider"
              onChange={(v) => u({ depthStep: v })}
              format={(v) => `${v}px`}
            />
            <SliderRow
              label="Náklon (tilt)"
              value={s.cardTilt}
              min={-30}
              max={30}
              step={1}
              ocid="rating.cardTilt_slider"
              onChange={(v) => u({ cardTilt: v })}
              format={(v) => `${v}°`}
            />
            <SliderRow
              label="Rozostrenie"
              value={s.blurInactive}
              min={0}
              max={10}
              step={0.5}
              ocid="rating.blurInactive_slider"
              onChange={(v) => u({ blurInactive: v })}
              format={(v) => `${v}px`}
            />
            <SliderRow
              label="Tieň"
              value={s.shadowIntensity}
              min={0}
              max={1}
              step={0.05}
              ocid="rating.shadowIntensity_slider"
              onChange={(v) => u({ shadowIntensity: v })}
              format={(v) => v.toFixed(2)}
            />
            <SliderRow
              label="Zmenšenie"
              value={s.cardScale}
              min={0.3}
              max={1.0}
              step={0.02}
              ocid="rating.cardScale_slider"
              onChange={(v) => u({ cardScale: v })}
              format={(v) => v.toFixed(2)}
            />
          </PanelSection>

          {/* === ANIMÁCIA === */}
          <PanelSection title="Animácia" defaultOpen={false}>
            <SliderRow
              label="Trvanie"
              value={s.animationDuration}
              min={0.1}
              max={1.2}
              step={0.05}
              ocid="rating.animationDuration_slider"
              onChange={(v) => u({ animationDuration: v })}
              format={(v) => `${v.toFixed(2)}s`}
            />
            <SliderRow
              label="Rýchlosť kolečka"
              value={1600 - s.scrollCooldown}
              min={100}
              max={1500}
              step={50}
              ocid="rating.scroll_speed_slider"
              onChange={(v) => u({ scrollCooldown: 1600 - v })}
              format={(_v) =>
                s.scrollCooldown <= 200
                  ? "Rýchle"
                  : s.scrollCooldown >= 1100
                    ? "Pomaly"
                    : `${s.scrollCooldown}ms`
              }
            />
            <div style={{ marginBottom: 11 }}>
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.60)",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                Easing
              </p>
              <div
                style={{ display: "flex", gap: 4, flexWrap: "wrap" as const }}
              >
                {easingOptions.map(({ value, label }) => {
                  const active = s.animationEasing === value;
                  return (
                    <button
                      type="button"
                      key={value}
                      data-ocid={`rating.easing_${value.replace("-", "_")}_button`}
                      onClick={() => u({ animationEasing: value })}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontSize: 10,
                        border: active
                          ? "1.5px solid rgba(255,255,255,0.45)"
                          : "1.5px solid rgba(255,255,255,0.10)",
                        background: active
                          ? "rgba(255,255,255,0.12)"
                          : "rgba(255,255,255,0.04)",
                        color: active
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(255,255,255,0.40)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <ToggleRow
              label="Hover efekt"
              value={s.interactiveHover}
              ocid="rating.interactiveHover_toggle"
              onChange={(v) => u({ interactiveHover: v })}
            />
          </PanelSection>

          {/* === ZOBRAZENIE === */}
          <PanelSection title="Zobrazenie" defaultOpen={false}>
            <div style={{ marginBottom: 11 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.60)",
                    fontWeight: 600,
                  }}
                >
                  Priehľadnosť
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color:
                      s.opacity >= 1.0
                        ? "rgba(100,220,150,0.85)"
                        : "rgba(255,255,255,0.35)",
                    fontFamily: "monospace",
                    fontWeight: s.opacity >= 1.0 ? 700 : 400,
                    transition: "color 0.15s ease",
                  }}
                >
                  {s.opacity >= 1.0 ? "Orig" : s.opacity.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                data-ocid="rating.opacity_slider"
                min={0}
                max={1}
                step={0.05}
                value={s.opacity}
                onChange={(e) => u({ opacity: Number(e.target.value) })}
                style={{
                  width: "100%",
                  height: 4,
                  borderRadius: 2,
                  accentColor: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                }}
              />
            </div>
            <ToggleRow
              label="Nápisy"
              value={s.showLabels}
              ocid="rating.showLabels_toggle"
              onChange={(v) => u({ showLabels: v })}
            />
            {s.showLabels && (
              <SliderRow
                label="Veľkosť nápisov"
                value={s.labelFontSize}
                min={8}
                max={24}
                step={1}
                ocid="rating.labelFontSize_slider"
                onChange={(v) => u({ labelFontSize: v })}
                format={(v) => `${v}px`}
              />
            )}
          </PanelSection>

          {/* === PROFILY === */}
          <PanelSection title="Profily" defaultOpen={false}>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              <input
                type="text"
                data-ocid="rating.profile_name_input"
                placeholder="Názov profilu"
                value={profileNameInput}
                onChange={(e) => setProfileNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && profileNameInput.trim()) {
                    saveProfile(profileNameInput.trim());
                    setProfileNameInput("");
                  }
                }}
                maxLength={30}
                style={{
                  flex: 1,
                  height: 30,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 11,
                  padding: "0 8px",
                  outline: "none",
                }}
              />
              <button
                type="button"
                data-ocid="rating.save_profile_button"
                disabled={!profileNameInput.trim()}
                onClick={() => {
                  if (!profileNameInput.trim()) return;
                  saveProfile(profileNameInput.trim());
                  setProfileNameInput("");
                }}
                style={{
                  height: 30,
                  padding: "0 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.20)",
                  background: profileNameInput.trim()
                    ? "rgba(255,255,255,0.14)"
                    : "rgba(255,255,255,0.04)",
                  color: profileNameInput.trim()
                    ? "rgba(255,255,255,0.90)"
                    : "rgba(255,255,255,0.25)",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: profileNameInput.trim() ? "pointer" : "default",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap" as const,
                }}
              >
                Uložiť
              </button>
            </div>
            {savedProfiles.length === 0 ? (
              <p
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.22)",
                  textAlign: "center" as const,
                  padding: "6px 0",
                  fontStyle: "italic",
                }}
              >
                Žiadne uložené profily
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column" as const,
                  gap: 4,
                  maxHeight: 150,
                  overflowY: "auto" as const,
                }}
              >
                {savedProfiles.map((profile) => {
                  const isActive = activeProfileName === profile.name;
                  return (
                    <div
                      key={profile.name}
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <button
                        type="button"
                        data-ocid="rating.profile_load_button"
                        onClick={() => loadProfile(profile.name)}
                        style={{
                          flex: 1,
                          height: 26,
                          borderRadius: 7,
                          border: isActive
                            ? "1.5px solid rgba(100,220,150,0.55)"
                            : "1px solid rgba(255,255,255,0.10)",
                          background: isActive
                            ? "rgba(100,220,150,0.12)"
                            : "rgba(255,255,255,0.04)",
                          color: isActive
                            ? "rgba(100,220,150,0.90)"
                            : "rgba(255,255,255,0.65)",
                          fontSize: 11,
                          fontWeight: isActive ? 700 : 500,
                          cursor: "pointer",
                          textAlign: "left" as const,
                          padding: "0 8px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap" as const,
                          transition: "all 0.15s ease",
                        }}
                      >
                        {isActive ? `✓ ${profile.name}` : profile.name}
                      </button>
                      <button
                        type="button"
                        data-ocid="rating.profile_delete_button"
                        onClick={() => deleteProfile(profile.name)}
                        aria-label={`Zmazať profil ${profile.name}`}
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 5,
                          border: "1px solid rgba(255,255,255,0.10)",
                          background: "rgba(255,255,255,0.04)",
                          color: "rgba(255,255,255,0.35)",
                          fontSize: 12,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Quick presets */}
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase" as const,
                marginTop: 12,
                marginBottom: 6,
              }}
            >
              Rýchle prednastavené
            </p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4 }}>
              {RATING_DISPLAY_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  data-ocid={`rating.preset_${preset.name.replace(/\s+/g, "_").toLowerCase()}_button`}
                  onClick={() => {
                    updateSettings({ ...preset.settings, preset: preset.name });
                  }}
                  style={{
                    padding: "3px 7px",
                    borderRadius: 5,
                    fontSize: 9,
                    fontWeight: 600,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.50)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </PanelSection>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// getEasingValue
// ---------------------------------------------------------------------------
function getEasingValue(
  easing: RatingDisplaySettings["animationEasing"],
): string {
  switch (easing) {
    case "ease-in-out":
      return "cubic-bezier(0.4,0,0.2,1)";
    case "spring":
      return "cubic-bezier(0.34, 1.56, 0.64, 1)";
    case "bounce":
      return "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    default:
      return "ease";
  }
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function RatingPage() {
  const { data: rawNfts, isLoading, isError } = useGetAllPublicNFTs();
  const nfts = useShuffledNFTs(rawNfts);
  const {
    settings: ratingSettings,
    updateSettings,
    resetToDefault,
    savedProfiles,
    activeProfileName,
    saveProfile,
    loadProfile,
    deleteProfile,
  } = useRatingDisplay();
  const [ratings, setRatings] = useState<Record<string, EmotionId>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitState, setExitState] = useState<{
    nft: NFTMetadata;
    dir: "left" | "right";
  } | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrollingRef = useRef(false);
  const scrollCooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (scrollCooldownRef.current) clearTimeout(scrollCooldownRef.current);
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const cooldown = ratingSettings.scrollCooldown;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (!nfts || isScrollingRef.current) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      setActiveIndex((prev) => {
        const next = prev + dir;
        if (next < 0 || next >= nfts.length) return prev;
        return next;
      });
      isScrollingRef.current = true;
      if (scrollCooldownRef.current) clearTimeout(scrollCooldownRef.current);
      scrollCooldownRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, cooldown);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [nfts, ratingSettings.scrollCooldown]);

  const handleRate = (tokenId: bigint, emotionId: EmotionId) => {
    if (!nfts) return;
    const key = tokenId.toString();
    setRatings((prev) => ({ ...prev, [key]: emotionId }));
    const emotion = EMOTIONS.find((e) => e.id === emotionId);
    if (emotion)
      toast.success(emotion.label, {
        duration: 2000,
        description: "Hodnotenie uložené",
      });
    const dir: "left" | "right" = emotionId < 0 ? "left" : "right";
    const currentNft = nfts[activeIndex];
    if (!currentNft) return;
    setExitState({ nft: currentNft, dir });
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = setTimeout(() => {
      setExitState(null);
      setActiveIndex((prev) => Math.min(prev + 1, nfts.length));
    }, 460);
  };

  const visibleNFTs = nfts
    ? nfts.slice(activeIndex, activeIndex + ratingSettings.visibleCards)
    : [];
  const allRated = nfts ? activeIndex >= nfts.length : false;
  const DEPTHS = useMemo(() => computeDepths(ratingSettings), [ratingSettings]);

  const easingValue = getEasingValue(ratingSettings.animationEasing);
  const TRANSITION = `transform ${ratingSettings.animationDuration}s ${easingValue}, opacity ${(ratingSettings.animationDuration * 0.9).toFixed(2)}s ${easingValue}`;

  function getDepthStyle(pos: number): React.CSSProperties {
    const d = DEPTHS[pos] ?? DEPTHS[DEPTHS.length - 1];
    if (!d) return {};
    return {
      position: "absolute" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      transform: `perspective(${ratingSettings.perspectiveDepth}px) translateZ(${d.tz}px) translateX(${d.tx}px) translateY(${d.ty}px) scale(${d.scale}) rotate(${d.rot}deg)`,
      opacity: d.opacity,
      transition: TRANSITION,
      zIndex: ratingSettings.visibleCards - pos,
      pointerEvents: pos === 0 ? "auto" : "none",
      transformOrigin:
        ratingSettings.arrangementShape === "fan"
          ? "center bottom"
          : "center center",
    };
  }

  function getExitStyle(dir: "left" | "right"): React.CSSProperties {
    const tx = dir === "left" ? "-130%" : "130%";
    const rot = dir === "left" ? -8 : 8;
    return {
      position: "absolute" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      transform: `perspective(${ratingSettings.perspectiveDepth}px) translateX(${tx}) rotate(${rot}deg) scale(0.92)`,
      opacity: 0,
      transition: TRANSITION,
      zIndex: 20,
      pointerEvents: "none" as const,
      transformOrigin: "center center",
    };
  }

  const containerTiltStyle: React.CSSProperties = {
    transform: `translateX(${ratingSettings.horizontalOffset}px) translateY(${ratingSettings.verticalOffset}px) rotateX(${ratingSettings.cardTilt}deg)`,
    transition: "transform 0.3s ease",
  };

  return (
    <div className="section-content max-w-4xl mx-auto">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight gradient-text">
            Hodnotenie
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Vyjadrite pocit z každého umeleckého diela
          </p>
        </div>
        {nfts && nfts.length > 0 && (
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {Math.min(activeIndex + 1, nfts.length)}&thinsp;/&thinsp;
            {nfts.length}
          </span>
        )}
      </div>

      {isLoading && (
        <div data-ocid="rating.loading_state" className="flex justify-center">
          <div
            style={{
              position: "relative",
              width: "min(60vw, 440px)",
              height: "min(60vw, 440px)",
            }}
          >
            <Skeleton className="w-full h-full rounded-2xl" />
          </div>
        </div>
      )}

      {isError && (
        <div data-ocid="rating.error_state">
          <div className="glass-card border border-destructive/50 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm text-destructive font-semibold flex-1">
              Chyba pri načítaní NFT. Skúste obnoviť stránku.
            </p>
            <button
              type="button"
              data-ocid="rating.manual_reload_button"
              onClick={() => window.location.reload()}
              className="shrink-0 px-4 py-2 rounded-xl border-2 border-destructive/40 bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors duration-200"
            >
              Obnoviť stránku
            </button>
          </div>
        </div>
      )}

      {!isLoading && !isError && nfts && nfts.length === 0 && (
        <div
          data-ocid="rating.empty_state"
          className="glass-card rounded-2xl p-12 flex flex-col items-center text-center gap-4"
        >
          <p className="font-display font-bold text-foreground text-lg">
            Žiadne verejné NFT na hodnotenie
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Zatiaľ neboli vyrazené žiadne verejné NFT
          </p>
        </div>
      )}

      {!isLoading && !isError && allRated && nfts && nfts.length > 0 && (
        <div
          data-ocid="rating.success_state"
          className="glass-card rounded-2xl p-12 flex flex-col items-center text-center gap-4"
        >
          <div
            className="w-16 h-16 rounded-full mb-2"
            style={{
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.4)",
              boxShadow: "0 0 32px 8px rgba(59,130,246,0.2)",
            }}
          />
          <p className="font-display font-bold text-foreground text-lg">
            Všetky NFT ohodnotené
          </p>
          <p className="text-xs text-muted-foreground">
            {nfts.length} {nfts.length === 1 ? "hodnotenie" : "hodnotení"}{" "}
            uložených
          </p>
        </div>
      )}

      {/* Floating settings panel via portal */}
      {!isLoading &&
        !isError &&
        !allRated &&
        visibleNFTs.length > 0 &&
        createPortal(
          <RatingArrangementPanel
            settings={ratingSettings}
            updateSettings={updateSettings}
            resetToDefault={resetToDefault}
            savedProfiles={savedProfiles}
            activeProfileName={activeProfileName}
            saveProfile={saveProfile}
            loadProfile={loadProfile}
            deleteProfile={deleteProfile}
          />,
          document.body,
        )}

      {/* 3D Stack */}
      {!isLoading && !isError && !allRated && visibleNFTs.length > 0 && (
        <div data-ocid="rating.section" className="flex flex-col items-center">
          <div
            ref={containerRef}
            style={{
              position: "relative",
              width: "min(calc(60vw + 320px), 780px)",
              height: "min(calc(60vw + 80px), 540px)",
              overflow: "visible",
              perspective: `${ratingSettings.perspectiveDepth}px`,
              cursor: "ns-resize",
              ...containerTiltStyle,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "min(60vw, 440px)",
                height: "min(60vw, 440px)",
              }}
            >
              {[...visibleNFTs].reverse().map((nft, revIdx) => {
                const pos = visibleNFTs.length - 1 - revIdx;
                return (
                  <div
                    key={nft.tokenId.toString()}
                    data-ocid={`rating.item.${activeIndex + pos + 1}`}
                    style={getDepthStyle(pos)}
                  >
                    {pos === 0 ? (
                      <ActiveCard
                        nft={nft}
                        rating={ratings[nft.tokenId.toString()] ?? null}
                        settings={ratingSettings}
                      />
                    ) : (
                      <PeekCard nft={nft} pos={pos} settings={ratingSettings} />
                    )}
                  </div>
                );
              })}
              {exitState && (
                <div
                  key={`exit-${exitState.nft.tokenId.toString()}`}
                  style={getExitStyle(exitState.dir)}
                >
                  <ActiveCard
                    nft={exitState.nft}
                    rating={ratings[exitState.nft.tokenId.toString()] ?? null}
                    settings={ratingSettings}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Scroll hint */}
          <div
            aria-hidden="true"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginTop: 12,
              opacity: 0.38,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            <svg
              aria-hidden="true"
              width="14"
              height="18"
              viewBox="0 0 14 18"
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <rect
                x="1"
                y="1"
                width="12"
                height="16"
                rx="6"
                stroke="white"
                strokeWidth="1.4"
              />
              <line
                x1="7"
                y1="4"
                x2="7"
                y2="7"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <span
              style={{
                fontSize: 10,
                color: "white",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              kolečko na prechádzanie
            </span>
          </div>

          {/* Rating circles */}
          {!exitState && visibleNFTs[0] && (
            <div
              className="flex items-end justify-center"
              style={{ gap: 10, marginTop: 28 }}
              role="radiogroup"
              aria-label="Emočné hodnotenie"
              data-ocid="rating.circles"
            >
              {EMOTIONS.map((emotion) => {
                const activeNft = visibleNFTs[0];
                if (!activeNft) return null;
                return (
                  <EmotionCircle
                    key={emotion.id}
                    emotion={emotion}
                    selected={
                      ratings[activeNft.tokenId.toString()] === emotion.id
                    }
                    onSelect={() => handleRate(activeNft.tokenId, emotion.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
