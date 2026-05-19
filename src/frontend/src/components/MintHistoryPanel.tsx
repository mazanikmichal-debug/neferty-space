import { ImageLightbox } from "@/components/ImageLightbox";
import { useGetMyNFTs, useGetNFTImage } from "@/hooks/useQueries";
import type { NFTMetadataLite, TransactionEvent } from "@/types/nft";
import { Variant_Mint_Transfer } from "@/types/nft";
import { nftImageUrlById } from "@/utils/nftImage";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

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

interface HistoryEntryCardProps {
  nft: NFTMetadataLite;
  index: number;
  callerPrincipal: string;
}

function HistoryEntryCard({
  nft,
  index,
  callerPrincipal,
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

  /** Truncate principal: first 10 chars + … + last 5 chars */
  function truncatePrincipal(addr: string): string {
    if (addr.length <= 18) return addr;
    return `${addr.slice(0, 10)}\u2026${addr.slice(-5)}`;
  }

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

  const ownerText = nft.owner.toText();
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

          {/* Owner address — truncated first 10 + … + last 5 */}
          <p
            className="text-[10px] font-mono truncate"
            title={ownerText}
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            <span className="text-white/25 uppercase tracking-wider text-[8px] font-semibold mr-1 not-italic">
              {t("messages.ownerBadge") || "Own"}:
            </span>
            {truncatePrincipal(ownerText)}
          </p>

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

export function MintHistoryPanel() {
  const { identity } = useInternetIdentity();
  const callerPrincipal = identity?.getPrincipal().toString() ?? "";
  const { t } = useTranslation();

  const { data: nfts, isLoading, isError, error } = useGetMyNFTs();

  // Sort by createdAt descending (most recent first)
  const sorted = nfts
    ? [...nfts].sort((a, b) => {
        const aMs = Number(a.createdAt / 1_000_000n);
        const bMs = Number(b.createdAt / 1_000_000n);
        return bMs - aMs;
      })
    : [];

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
            className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            {sorted.length}
          </span>
        )}
      </div>

      {/* Scrollable content */}
      <div
        data-ocid="mint.history_list"
        className="flex flex-col gap-3 p-3 overflow-y-auto"
        style={{
          height: "calc(100vh - 12rem)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Loading skeletons */}
        {isLoading && (
          <div
            data-ocid="mint.history_loading_state"
            className="flex flex-col gap-3"
          >
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
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

        {/* Cards */}
        {!isLoading &&
          !isError &&
          sorted.map((nft, idx) => (
            <HistoryEntryCard
              key={nft.tokenId.toString()}
              nft={nft}
              index={idx + 1}
              callerPrincipal={callerPrincipal}
            />
          ))}
      </div>
    </div>
  );
}
