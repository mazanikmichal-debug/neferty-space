import { ImageLightbox } from "@/components/ImageLightbox";
import { useGetMyNFTs, useGetNFTImage } from "@/hooks/useQueries";
import type { NFTMetadataLite, TransactionEvent } from "@/types/nft";
import { Variant_Mint_Transfer } from "@/types/nft";
import { nftImageUrlById } from "@/utils/nftImage";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { ChevronLeft, ChevronRight, Clock, Layers, List } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type React from "react";
import { useTranslation } from "react-i18next";
function shortenCanisterId(id: string): string {
  if (!id || id.length <= 14) return id;
  return `${id.slice(0, 8)}...${id.slice(-4)}`;
}

type ViewMode = "grid3" | "grid4" | "grid5" | "grid6" | "collection" | "stack";
const VIEW_MODE_KEY = "galleryViewMode";

/** Determine whether an NFT is still owned by caller or was sent elsewhere */
function getSentStatus(
  nft: NFTMetadataLite,
  callerPrincipal: string,
): "minted" | "sent" {
  const history: TransactionEvent[] = nft.history ?? [];
  // Walk history in reverse to find the last Transfer event
  for (let i = history.length - 1; i >= 0; i--) {
    const evt = history[i];
    if (evt.eventType === Variant_Mint_Transfer.Transfer) {
      const dest = evt.to.toString();
      return dest !== callerPrincipal ? "sent" : "minted";
    }
  }
  return "minted";
}

function SkeletonThumb() {
  return (
    <div
      className="rounded-lg animate-pulse"
      style={{
        paddingTop: "100%",
        position: "relative",
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    />
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-xl overflow-hidden animate-pulse"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="h-44 w-full"
        style={{ background: "rgba(255,255,255,0.07)" }}
      />
      <div className="p-3 flex flex-col gap-2">
        <div
          className="h-3 w-2/3 rounded-full"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        <div
          className="h-2.5 w-full rounded-full"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <div
          className="h-2.5 w-3/4 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <div
          className="h-5 w-24 rounded-full mt-1"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
      </div>
    </div>
  );
}

// ── Thumbnail-only square (for grid3/grid4 modes) ────────────────────────────
interface ThumbProps {
  nft: NFTMetadataLite;
  index: number;
  canisterId?: string;
}
function NFTThumb({ nft, index, canisterId }: ThumbProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { data: imageBytes } = useGetNFTImage(nft.tokenId);
  const imageUrl = imageBytes ? nftImageUrlById(nft.tokenId, imageBytes) : "";
  return (
    <>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          data-ocid={`history.thumb.${index}`}
          aria-label={nft.name}
          onClick={() => imageUrl && setLightboxOpen(true)}
          className="block w-full rounded-lg overflow-hidden cursor-zoom-in group"
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            position: "relative",
            paddingTop: "100%",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={nft.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-110"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          ) : (
            <div
              className="absolute inset-0 animate-pulse"
              style={{ background: "rgba(255,255,255,0.08)" }}
              aria-hidden="true"
            />
          )}
        </button>
        <p
          className="text-[11px] text-gray-400 truncate max-w-full leading-tight px-0.5"
          title={nft.name}
        >
          {nft.name}
        </p>
        {canisterId && (
          <p className="text-[10px] font-mono text-zinc-500 truncate leading-tight mt-0.5">
            {shortenCanisterId(canisterId)}
          </p>
        )}
      </div>
      {lightboxOpen && (
        <ImageLightbox
          src={imageUrl}
          alt={nft.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}

// ── Compact list row (for stack/"Pod sebou" mode) ───────────────────────────
interface NFTListRowProps {
  nft: NFTMetadataLite;
  index: number;
  canisterId?: string;
}
function NFTListRow({ nft, index, canisterId }: NFTListRowProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { data: imageBytes } = useGetNFTImage(nft.tokenId);
  const imageUrl = imageBytes ? nftImageUrlById(nft.tokenId, imageBytes) : "";
  const { t } = useTranslation();

  function formatDateTime(
    ns: bigint | undefined,
  ): { date: string; time: string } | null {
    if (!ns) return null;
    try {
      const ms = Number(ns / 1_000_000n);
      if (!Number.isFinite(ms) || ms <= 0) return null;
      const d = new Date(ms);
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return { date: `${day}.${month}.${year}`, time: `${hh}:${mm}` };
    } catch {
      return null;
    }
  }

  const dt = formatDateTime(nft.createdAt);
  const collectionLabel = nft.collectionName || t("messages.standalone");
  const minterPrincipal = (() => {
    const from = nft.history?.[0]?.from?.toString();
    if (from) return from;
    return null;
  })();

  function truncatePrincipal(addr: string): string {
    if (addr.length <= 18) return addr;
    return `${addr.slice(0, 10)}\u2026${addr.slice(-5)}`;
  }

  return (
    <>
      <button
        type="button"
        data-ocid={`history.item.${index}`}
        aria-label={nft.name}
        onClick={() => imageUrl && setLightboxOpen(true)}
        className="flex items-center gap-3 py-2.5 px-1 w-full rounded-lg hover:bg-white/5 transition-colors duration-200 cursor-pointer text-left"
      >
        <div
          className="shrink-0 rounded-md overflow-hidden"
          style={{
            width: 96,
            height: 96,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={nft.name}
              loading="lazy"
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div
              className="w-full h-full animate-pulse"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
          )}
        </div>
        <div className="flex flex-col min-w-0 flex-1 gap-0.5">
          <span className="font-medium text-base text-white truncate">
            {nft.name}
          </span>
          <span
            className="text-sm truncate"
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
            {collectionLabel}
          </span>
          {dt && (
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {dt.date} {dt.time}
            </span>
          )}
          <span
            className="text-xs font-mono truncate"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            #{nft.tokenId.toString()}
          </span>
          {minterPrincipal && (
            <span
              className="text-xs font-mono truncate"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              {truncatePrincipal(minterPrincipal)}
            </span>
          )}
          {canisterId && (
            <span className="text-xs text-zinc-500 font-mono">
              Canister: {shortenCanisterId(canisterId)}
            </span>
          )}
        </div>
      </button>
      {lightboxOpen && (
        <ImageLightbox
          src={imageUrl}
          alt={nft.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}

// ── View mode toggle bar ──────────────────────────────────────────────────────
const VIEW_MODES: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  {
    id: "grid3",
    label: "3×3",
    icon: (
      <svg
        viewBox="0 0 14 14"
        className="w-3.5 h-3.5"
        fill="currentColor"
        aria-hidden="true"
      >
        <rect x="0" y="0" width="3.5" height="3.5" rx="0.5" />
        <rect x="5.25" y="0" width="3.5" height="3.5" rx="0.5" />
        <rect x="10.5" y="0" width="3.5" height="3.5" rx="0.5" />
        <rect x="0" y="5.25" width="3.5" height="3.5" rx="0.5" />
        <rect x="5.25" y="5.25" width="3.5" height="3.5" rx="0.5" />
        <rect x="10.5" y="5.25" width="3.5" height="3.5" rx="0.5" />
        <rect x="0" y="10.5" width="3.5" height="3.5" rx="0.5" />
        <rect x="5.25" y="10.5" width="3.5" height="3.5" rx="0.5" />
        <rect x="10.5" y="10.5" width="3.5" height="3.5" rx="0.5" />
      </svg>
    ),
  },
  {
    id: "grid4",
    label: "4×4",
    icon: (
      <svg
        viewBox="0 0 14 14"
        className="w-3.5 h-3.5"
        fill="currentColor"
        aria-hidden="true"
      >
        <rect x="0" y="0" width="2.8" height="2.8" rx="0.4" />
        <rect x="3.73" y="0" width="2.8" height="2.8" rx="0.4" />
        <rect x="7.47" y="0" width="2.8" height="2.8" rx="0.4" />
        <rect x="11.2" y="0" width="2.8" height="2.8" rx="0.4" />
        <rect x="0" y="3.73" width="2.8" height="2.8" rx="0.4" />
        <rect x="3.73" y="3.73" width="2.8" height="2.8" rx="0.4" />
        <rect x="7.47" y="3.73" width="2.8" height="2.8" rx="0.4" />
        <rect x="11.2" y="3.73" width="2.8" height="2.8" rx="0.4" />
        <rect x="0" y="7.47" width="2.8" height="2.8" rx="0.4" />
        <rect x="3.73" y="7.47" width="2.8" height="2.8" rx="0.4" />
        <rect x="7.47" y="7.47" width="2.8" height="2.8" rx="0.4" />
        <rect x="11.2" y="7.47" width="2.8" height="2.8" rx="0.4" />
        <rect x="0" y="11.2" width="2.8" height="2.8" rx="0.4" />
        <rect x="3.73" y="11.2" width="2.8" height="2.8" rx="0.4" />
        <rect x="7.47" y="11.2" width="2.8" height="2.8" rx="0.4" />
        <rect x="11.2" y="11.2" width="2.8" height="2.8" rx="0.4" />
      </svg>
    ),
  },
  {
    id: "grid5" as ViewMode,
    label: "5×5",
    icon: (
      <svg
        viewBox="0 0 14 14"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <rect x="0" y="0" width="2.2" height="2.2" rx="0.35" />
        <rect x="2.95" y="0" width="2.2" height="2.2" rx="0.35" />
        <rect x="5.9" y="0" width="2.2" height="2.2" rx="0.35" />
        <rect x="8.85" y="0" width="2.2" height="2.2" rx="0.35" />
        <rect x="11.8" y="0" width="2.2" height="2.2" rx="0.35" />
        <rect x="0" y="2.95" width="2.2" height="2.2" rx="0.35" />
        <rect x="2.95" y="2.95" width="2.2" height="2.2" rx="0.35" />
        <rect x="5.9" y="2.95" width="2.2" height="2.2" rx="0.35" />
        <rect x="8.85" y="2.95" width="2.2" height="2.2" rx="0.35" />
        <rect x="11.8" y="2.95" width="2.2" height="2.2" rx="0.35" />
        <rect x="0" y="5.9" width="2.2" height="2.2" rx="0.35" />
        <rect x="2.95" y="5.9" width="2.2" height="2.2" rx="0.35" />
        <rect x="5.9" y="5.9" width="2.2" height="2.2" rx="0.35" />
        <rect x="8.85" y="5.9" width="2.2" height="2.2" rx="0.35" />
        <rect x="11.8" y="5.9" width="2.2" height="2.2" rx="0.35" />
        <rect x="0" y="8.85" width="2.2" height="2.2" rx="0.35" />
        <rect x="2.95" y="8.85" width="2.2" height="2.2" rx="0.35" />
        <rect x="5.9" y="8.85" width="2.2" height="2.2" rx="0.35" />
        <rect x="8.85" y="8.85" width="2.2" height="2.2" rx="0.35" />
        <rect x="11.8" y="8.85" width="2.2" height="2.2" rx="0.35" />
        <rect x="0" y="11.8" width="2.2" height="2.2" rx="0.35" />
        <rect x="2.95" y="11.8" width="2.2" height="2.2" rx="0.35" />
        <rect x="5.9" y="11.8" width="2.2" height="2.2" rx="0.35" />
        <rect x="8.85" y="11.8" width="2.2" height="2.2" rx="0.35" />
        <rect x="11.8" y="11.8" width="2.2" height="2.2" rx="0.35" />
      </svg>
    ),
  },
  {
    id: "grid6",
    label: "6×6",
    icon: (
      <svg
        viewBox="0 0 14 14"
        className="w-3.5 h-3.5"
        fill="currentColor"
        aria-hidden="true"
      >
        <rect x="0" y="0" width="1.8" height="1.8" rx="0.3" />
        <rect x="2.44" y="0" width="1.8" height="1.8" rx="0.3" />
        <rect x="4.88" y="0" width="1.8" height="1.8" rx="0.3" />
        <rect x="7.32" y="0" width="1.8" height="1.8" rx="0.3" />
        <rect x="9.76" y="0" width="1.8" height="1.8" rx="0.3" />
        <rect x="12.2" y="0" width="1.8" height="1.8" rx="0.3" />
        <rect x="0" y="2.44" width="1.8" height="1.8" rx="0.3" />
        <rect x="2.44" y="2.44" width="1.8" height="1.8" rx="0.3" />
        <rect x="4.88" y="2.44" width="1.8" height="1.8" rx="0.3" />
        <rect x="7.32" y="2.44" width="1.8" height="1.8" rx="0.3" />
        <rect x="9.76" y="2.44" width="1.8" height="1.8" rx="0.3" />
        <rect x="12.2" y="2.44" width="1.8" height="1.8" rx="0.3" />
        <rect x="0" y="4.88" width="1.8" height="1.8" rx="0.3" />
        <rect x="2.44" y="4.88" width="1.8" height="1.8" rx="0.3" />
        <rect x="4.88" y="4.88" width="1.8" height="1.8" rx="0.3" />
        <rect x="7.32" y="4.88" width="1.8" height="1.8" rx="0.3" />
        <rect x="9.76" y="4.88" width="1.8" height="1.8" rx="0.3" />
        <rect x="12.2" y="4.88" width="1.8" height="1.8" rx="0.3" />
        <rect x="0" y="7.32" width="1.8" height="1.8" rx="0.3" />
        <rect x="2.44" y="7.32" width="1.8" height="1.8" rx="0.3" />
        <rect x="4.88" y="7.32" width="1.8" height="1.8" rx="0.3" />
        <rect x="7.32" y="7.32" width="1.8" height="1.8" rx="0.3" />
        <rect x="9.76" y="7.32" width="1.8" height="1.8" rx="0.3" />
        <rect x="12.2" y="7.32" width="1.8" height="1.8" rx="0.3" />
        <rect x="0" y="9.76" width="1.8" height="1.8" rx="0.3" />
        <rect x="2.44" y="9.76" width="1.8" height="1.8" rx="0.3" />
        <rect x="4.88" y="9.76" width="1.8" height="1.8" rx="0.3" />
        <rect x="7.32" y="9.76" width="1.8" height="1.8" rx="0.3" />
        <rect x="9.76" y="9.76" width="1.8" height="1.8" rx="0.3" />
        <rect x="12.2" y="9.76" width="1.8" height="1.8" rx="0.3" />
        <rect x="0" y="12.2" width="1.8" height="1.8" rx="0.3" />
        <rect x="2.44" y="12.2" width="1.8" height="1.8" rx="0.3" />
        <rect x="4.88" y="12.2" width="1.8" height="1.8" rx="0.3" />
        <rect x="7.32" y="12.2" width="1.8" height="1.8" rx="0.3" />
        <rect x="9.76" y="12.2" width="1.8" height="1.8" rx="0.3" />
        <rect x="12.2" y="12.2" width="1.8" height="1.8" rx="0.3" />
      </svg>
    ),
  },
  {
    id: "collection",
    label: "Zbierky",
    icon: <Layers className="w-3.5 h-3.5" />,
  },
  { id: "stack", label: "Pod sebou", icon: <List className="w-3.5 h-3.5" /> },
];

interface ViewToggleProps {
  current: ViewMode;
  onChange: (mode: ViewMode) => void;
}
function ViewToggle({ current, onChange }: ViewToggleProps) {
  return (
    <div
      data-ocid="mint.view_toggle"
      className="flex items-center gap-0.5 p-0.5 rounded-lg"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      {VIEW_MODES.map((vm) => {
        const active = current === vm.id;
        return (
          <button
            key={vm.id}
            type="button"
            data-ocid={`mint.view_mode.${vm.id}`}
            aria-label={vm.label}
            aria-pressed={active}
            title={vm.label}
            onClick={() => onChange(vm.id)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-all duration-200 shrink-0"
            style={{
              background: active
                ? "linear-gradient(135deg,rgba(var(--theme-color-1-rgb,180,80,220),0.32),rgba(var(--theme-color-2-rgb,230,100,180),0.22))"
                : "transparent",
              border: active
                ? "1px solid rgba(var(--theme-color-1-rgb,180,80,220),0.45)"
                : "1px solid transparent",
              color: active
                ? "rgba(255,255,255,0.95)"
                : "rgba(255,255,255,0.45)",
              boxShadow: active ? "0 2px 8px rgba(0,0,0,0.25)" : "none",
            }}
          >
            {vm.icon}
            <span className="hidden sm:inline ml-0.5">{vm.label}</span>
          </button>
        );
      })}
    </div>
  );
}

interface HistoryEntryCardProps {
  nft: NFTMetadataLite;
  index: number;
  callerPrincipal: string;
  canisterId?: string;
}

function HistoryEntryCard({
  nft,
  index,
  callerPrincipal,
  canisterId,
}: HistoryEntryCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [aspectLabel, setAspectLabel] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const status = getSentStatus(nft, callerPrincipal);
  const isSent = status === "sent";
  const { data: imageBytes } = useGetNFTImage(nft.tokenId);
  const imageUrl = imageBytes ? nftImageUrlById(nft.tokenId, imageBytes) : "";
  const { t } = useTranslation();

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      const standards: { label: string; value: number }[] = [
        { label: "1:1", value: 1 },
        { label: "4:3", value: 4 / 3 },
        { label: "16:9", value: 16 / 9 },
      ];
      let closest = standards[0];
      let minDiff = Math.abs(ratio - standards[0].value);
      for (const s of standards) {
        const diff = Math.abs(ratio - s.value);
        if (diff < minDiff) {
          minDiff = diff;
          closest = s;
        }
      }
      setAspectLabel(closest.label);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  /** Format nanosecond bigint timestamp to locale date string */
  function formatDate(ns: bigint | undefined): string | null {
    if (!ns) return null;
    try {
      const ms = Number(ns / 1_000_000n);
      if (!Number.isFinite(ms) || ms <= 0) return null;
      return new Date(ms).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return null;
    }
  }

  const mintDate = formatDate(nft.createdAt);

  return (
    <>
      <div
        data-ocid={`history.item.${index}`}
        className="rounded-xl overflow-hidden flex flex-col group transition-smooth"
        style={{
          background: "rgba(255,255,255,0.055)",
          border: "1px solid rgba(var(--theme-color-1-rgb,255,255,255),0.13)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow:
            "0 4px 18px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)",
          transition:
            "background 0.3s cubic-bezier(0.4,0,0.2,1), border-color 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(255,255,255,0.09)";
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "rgba(var(--theme-color-1-rgb,255,255,255),0.25)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(255,255,255,0.055)";
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "rgba(var(--theme-color-1-rgb,255,255,255),0.13)";
        }}
      >
        {/* Image — always 1:1 square via padding-top trick, object-cover centered */}
        <button
          type="button"
          className="relative overflow-hidden cursor-zoom-in w-full p-0 border-0 bg-transparent block"
          style={{ paddingTop: "100%" }}
          onClick={() => setLightboxOpen(true)}
          aria-label={t("messages.imagePreviewFullscreen", { name: nft.name })}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt={nft.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              transition: "transform 300ms cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform =
                "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform =
                "scale(1)";
            }}
          />
          {/* Bottom gradient overlay for readability */}
          <div
            className="absolute inset-x-0 bottom-0 h-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top,rgba(8,5,24,0.65),transparent)",
            }}
            aria-hidden="true"
          />
          {/* Aspect ratio badge — top right corner */}
          {aspectLabel && (
            <span
              className="absolute top-2 right-2 text-[11px] font-bold tracking-wide px-2 py-0.5 rounded-full pointer-events-none select-none"
              style={{
                background: "rgba(0,0,0,0.78)",
                color: "#ffffff",
                letterSpacing: "0.04em",
                boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
                lineHeight: "1.5",
              }}
              aria-label={`${t("messages.imageFormat")} ${aspectLabel}`}
            >
              {aspectLabel}
            </span>
          )}
        </button>

        {/* Card metadata — always visible, no hover required */}
        <div className="px-3 pt-2.5 pb-3 flex flex-col gap-1">
          {/* NFT name */}
          <p
            className="font-display font-bold text-sm text-foreground truncate leading-snug"
            title={nft.name}
          >
            {nft.name}
          </p>

          {/* Collection name — always shown, fallback to „Samostatné“ */}
          <p
            className="text-[11px] truncate"
            title={nft.collectionName ?? t("messages.standalone")}
          >
            <span className="text-white/30 uppercase tracking-wider text-[9px] font-semibold mr-1">
              {t("messages.collectionBadge")}:
            </span>
            <span
              style={{
                color: nft.collectionName
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(255,255,255,0.35)",
                fontStyle: nft.collectionName ? "normal" : "italic",
              }}
            >
              {nft.collectionName ?? t("messages.standalone")}
            </span>
          </p>

          {/* Description — if present */}
          {nft.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">
              {nft.description}
            </p>
          )}

          {/* Canister ID */}
          {canisterId && (
            <p className="text-[10px] font-mono text-zinc-500 truncate mt-0.5">
              {shortenCanisterId(canisterId)}
            </p>
          )}

          {/* Mint date */}
          {mintDate && (
            <p
              className="text-[10px] flex items-center gap-1"
              style={{ color: "rgba(255,255,255,0.28)" }}
            >
              <svg
                className="w-2.5 h-2.5 shrink-0"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="8" cy="8" r="6.5" />
                <polyline points="8 4.5 8 8 10.5 10" />
              </svg>
              {mintDate}
            </p>
          )}

          {/* Status badge */}
          <div className="mt-1">
            {isSent ? (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(var(--theme-color-2-rgb,230,100,180),0.18),rgba(var(--theme-color-1-rgb,180,80,220),0.12))",
                  border:
                    "1px solid rgba(var(--theme-color-2-rgb,230,100,180),0.35)",
                  color: "rgba(var(--theme-color-2-rgb,230,100,180),0.95)",
                }}
              >
                <span aria-hidden="true">↗</span>
                {t("messages.sentElsewhere")}
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(74,222,128,0.15),rgba(34,197,94,0.08))",
                  border: "1px solid rgba(74,222,128,0.35)",
                  color: "rgba(134,239,172,0.95)",
                }}
              >
                <span aria-hidden="true">✦</span>
                {t("messages.mintedHere")}
              </span>
            )}
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          src={imageUrl}
          alt={nft.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}

// ── Collection square card (for collection grid view) ───────────────────────
interface CollectionCardProps {
  groupKey: string;
  displayName: string;
  firstNft: NFTMetadataLite | null;
  count: number;
  onClick: () => void;
}
function CollectionCard({
  groupKey,
  displayName,
  firstNft,
  count,
  onClick,
}: CollectionCardProps) {
  const { data: imageBytes } = useGetNFTImage(
    firstNft ? firstNft.tokenId : null,
  );
  const imageUrl =
    imageBytes && firstNft ? nftImageUrlById(firstNft.tokenId, imageBytes) : "";

  return (
    <button
      type="button"
      data-ocid={`history.collection_card.${groupKey}`}
      onClick={onClick}
      className="aspect-square flex flex-col rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.03] text-left w-full"
      style={{
        background: "rgba(255,255,255,0.055)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {/* Image area */}
      <div className="flex-1 w-full overflow-hidden relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={displayName}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <Layers
              className="w-5 h-5"
              style={{
                color: "rgba(var(--theme-color-1-rgb,180,80,220),0.45)",
              }}
            />
          </div>
        )}
        {/* Count badge */}
        <span
          className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{
            background: "rgba(0,0,0,0.60)",
            color: "rgba(255,255,255,0.80)",
          }}
        >
          {count}
        </span>
      </div>
      {/* Label */}
      <div
        className="px-1.5 py-1 text-xs font-medium truncate w-full"
        style={{ color: "rgba(255,255,255,0.75)" }}
        title={displayName}
      >
        {displayName}
      </div>
    </button>
  );
}

export function MintHistoryPanel() {
  const { identity } = useInternetIdentity();
  const callerPrincipal = identity?.getPrincipal().toString() ?? "";
  const { t } = useTranslation();
  const [factoryCanisterId, setFactoryCanisterId] = useState<string>("");
  useEffect(() => {
    import("../utils/env")
      .then((m) => m.loadEnvConfig())
      .then((cfg) => {
        setFactoryCanisterId(cfg.backend_canister_id ?? "");
      })
      .catch(() => {});
  }, []);

  const { data: nfts, isLoading, isError, error } = useGetMyNFTs();

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(VIEW_MODE_KEY);
    if (
      saved === "grid3" ||
      saved === "grid4" ||
      saved === "grid5" ||
      saved === "grid6" ||
      saved === "collection" ||
      saved === "stack"
    )
      return saved;
    return "grid3";
  });

  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    // Only reset collection drill-down when switching TO the collection overview.
    // Switching between grid/stack layouts must preserve the current collection filter.
    if (mode === "collection") {
      setSelectedCollection(null);
    }
    localStorage.setItem(VIEW_MODE_KEY, mode);
  };

  const sorted = nfts
    ? [...nfts].sort((a, b) => {
        const aMs = Number(a.createdAt / 1_000_000n);
        const bMs = Number(b.createdAt / 1_000_000n);
        return bMs - aMs;
      })
    : [];

  const collectionGroups: { name: string; nfts: NFTMetadataLite[] }[] = [];
  if (viewMode === "collection") {
    const map = new Map<string, NFTMetadataLite[]>();
    for (const nft of sorted) {
      const key = nft.collectionName ?? "";
      const arr = map.get(key) ?? [];
      arr.push(nft);
      map.set(key, arr);
    }
    for (const [name, items] of map)
      collectionGroups.push({ name, nfts: items });
  }

  const activeCollectionNfts =
    selectedCollection !== null
      ? sorted.filter(
          (nft) =>
            (nft.collectionName ?? "") ===
            (selectedCollection === "__standalone__" ? "" : selectedCollection),
        )
      : [];

  const showContent = !isLoading && !isError && sorted.length > 0;

  return (
    <div
      data-ocid="mint.history_panel"
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(var(--theme-color-1-rgb,255,255,255),0.12)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow:
          "0 6px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.07)",
      }}
    >
      {/* Panel header */}
      <div
        className="flex items-center gap-2.5 px-4 py-3.5 shrink-0"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderBottom:
            "1px solid rgba(var(--theme-color-1-rgb,255,255,255),0.10)",
        }}
      >
        <Clock
          className="w-4 h-4 shrink-0"
          style={{ color: "rgba(var(--theme-color-1-rgb,180,80,220),0.85)" }}
        />
        <span className="font-display font-bold text-sm tracking-wide gradient-text">
          {t("messages.historyTitle")}
        </span>
        {!isLoading && sorted.length > 0 && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            {sorted.length}
          </span>
        )}
        <div className="flex-1" />
        {showContent && (
          <ViewToggle current={viewMode} onChange={handleViewChange} />
        )}
      </div>

      {/* Scrollable content */}
      <div
        data-ocid="mint.history_list"
        className="p-3 overflow-y-auto"
        style={{
          height: "calc(100vh - 12rem)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Loading skeletons */}
        {isLoading && (
          <div data-ocid="mint.history_loading_state">
            {viewMode === "stack" ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div
                className={`grid gap-2 ${viewMode === "grid4" ? "grid-cols-4" : viewMode === "collection" ? "grid-cols-2" : "grid-cols-3"}`}
              >
                {Array.from({ length: viewMode === "grid4" ? 8 : 6 }).map(
                  (_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
                    <SkeletonThumb key={i} />
                  ),
                )}
              </div>
            )}
          </div>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <div
            data-ocid="mint.history_error_state"
            className="flex flex-col items-center justify-center gap-3 py-12 text-center px-4"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
              aria-hidden="true"
            >
              ⚠
            </div>
            <p className="text-xs text-muted-foreground">
              {error?.message ?? t("errors.loadErrorShort")}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && sorted.length === 0 && (
          <div
            data-ocid="mint.history_empty_state"
            className="flex flex-col items-center justify-center gap-3 py-16 text-center px-4"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
              aria-hidden="true"
            >
              ⬡
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("messages.noNFTs")}
            </p>
            <p className="text-[11px] text-muted-foreground/60">
              {t("messages.noNFTsDesc")}
            </p>
          </div>
        )}

        {/* 3×3 grid */}
        {showContent && viewMode === "grid3" && (
          <div className="flex flex-col gap-2">
            {selectedCollection !== null && (
              <button
                type="button"
                data-ocid="history.collection_back_button_grid"
                onClick={() => {
                  setViewMode("collection");
                  setSelectedCollection(null);
                }}
                className="flex items-center gap-2 text-sm mb-1 transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <ChevronLeft className="w-4 h-4" />
                Späť na zbierky
              </button>
            )}
            <div className="grid grid-cols-3 gap-1.5">
              {(selectedCollection !== null
                ? activeCollectionNfts
                : sorted
              ).map((nft, idx) => (
                <NFTThumb
                  key={nft.tokenId.toString()}
                  nft={nft}
                  index={idx + 1}
                  canisterId={factoryCanisterId}
                />
              ))}
            </div>
          </div>
        )}

        {/* 4×4 grid */}
        {showContent && viewMode === "grid4" && (
          <div className="flex flex-col gap-2">
            {selectedCollection !== null && (
              <button
                type="button"
                data-ocid="history.collection_back_button_grid"
                onClick={() => {
                  setViewMode("collection");
                  setSelectedCollection(null);
                }}
                className="flex items-center gap-2 text-sm mb-1 transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <ChevronLeft className="w-4 h-4" />
                Späť na zbierky
              </button>
            )}
            <div className="grid grid-cols-4 gap-1">
              {(selectedCollection !== null
                ? activeCollectionNfts
                : sorted
              ).map((nft, idx) => (
                <NFTThumb
                  key={nft.tokenId.toString()}
                  nft={nft}
                  index={idx + 1}
                  canisterId={factoryCanisterId}
                />
              ))}
            </div>
          </div>
        )}

        {/* 5×5 grid */}
        {showContent && viewMode === "grid5" && (
          <div className="flex flex-col gap-2">
            {selectedCollection !== null && (
              <button
                type="button"
                data-ocid="history.collection_back_button_grid"
                onClick={() => {
                  setViewMode("collection");
                  setSelectedCollection(null);
                }}
                className="flex items-center gap-2 text-sm mb-1 transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <ChevronLeft className="w-4 h-4" />
                Späť na zbierky
              </button>
            )}
            <div className="grid grid-cols-5 gap-1">
              {(selectedCollection !== null
                ? activeCollectionNfts
                : sorted
              ).map((nft, idx) => (
                <NFTThumb
                  key={nft.tokenId.toString()}
                  nft={nft}
                  index={idx + 1}
                  canisterId={factoryCanisterId}
                />
              ))}
            </div>
          </div>
        )}

        {/* By collection — drill-down */}
        {showContent && viewMode === "collection" && (
          <div className="flex flex-col gap-3">
            {selectedCollection === null ? (
              /* Collection grid cards */
              <div className="grid grid-cols-3 gap-2">
                {collectionGroups.map((group) => {
                  const isStandalone = group.name === "";
                  const displayName = isStandalone ? "Samostatné" : group.name;
                  const key = isStandalone ? "__standalone__" : group.name;
                  const firstNft = group.nfts[0];
                  return (
                    <CollectionCard
                      key={key}
                      groupKey={key}
                      displayName={displayName}
                      firstNft={firstNft ?? null}
                      count={group.nfts.length}
                      onClick={() => setSelectedCollection(key)}
                    />
                  );
                })}
              </div>
            ) : (
              /* NFTs of selected collection */
              <>
                <button
                  type="button"
                  data-ocid="history.collection_back_button"
                  onClick={() => setSelectedCollection(null)}
                  className="flex items-center gap-2 text-sm mb-1 transition-colors duration-200"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Späť na zbierky
                </button>
                <div className="grid grid-cols-2 gap-2">
                  {activeCollectionNfts.map((nft, i) => (
                    <HistoryEntryCard
                      key={nft.tokenId.toString()}
                      nft={nft}
                      index={i + 1}
                      callerPrincipal={callerPrincipal}
                      canisterId={factoryCanisterId}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* 6×6 grid */}
        {showContent && viewMode === "grid6" && (
          <div className="flex flex-col gap-2">
            {selectedCollection !== null && (
              <button
                type="button"
                data-ocid="history.collection_back_button_grid"
                onClick={() => {
                  setViewMode("collection");
                  setSelectedCollection(null);
                }}
                className="flex items-center gap-2 text-sm mb-1 transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <ChevronLeft className="w-4 h-4" />
                Späť na zbierky
              </button>
            )}
            <div className="grid grid-cols-6 gap-1">
              {(selectedCollection !== null
                ? activeCollectionNfts
                : sorted
              ).map((nft, idx) => (
                <NFTThumb
                  key={nft.tokenId.toString()}
                  nft={nft}
                  index={idx + 1}
                  canisterId={factoryCanisterId}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stack (single column compact rows) */}
        {showContent && viewMode === "stack" && (
          <div className="flex flex-col gap-1">
            {selectedCollection !== null && (
              <button
                type="button"
                data-ocid="history.collection_back_button_stack"
                onClick={() => {
                  setViewMode("collection");
                  setSelectedCollection(null);
                }}
                className="flex items-center gap-2 text-sm mb-1 transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <ChevronLeft className="w-4 h-4" />
                Späť na zbierky
              </button>
            )}
            {(selectedCollection !== null ? activeCollectionNfts : sorted).map(
              (nft, idx) => (
                <NFTListRow
                  key={nft.tokenId.toString()}
                  nft={nft}
                  index={idx + 1}
                  canisterId={factoryCanisterId}
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
