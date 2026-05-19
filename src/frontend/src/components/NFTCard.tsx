import { ImageLightbox } from "@/components/ImageLightbox";
import { useAddressHistory } from "@/hooks/useAddressHistory";
import {
  useGetNFTHistory,
  useGetNFTImage,
  useSetNFTVisibility,
  useTransferNFT,
} from "@/hooks/useQueries";
import { Variant_Mint_Transfer } from "@/types/nft";
import type { NFTMetadataLite } from "@/types/nft";
import { copyToClipboard } from "@/utils/clipboard";
import { nftImageUrlById } from "@/utils/nftImage";
import { Principal } from "@icp-sdk/core/principal";
import {
  Check,
  ChevronDown,
  Clock,
  Copy,
  Eye,
  EyeOff,
  Maximize2,
  Send,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const isValidPrincipal = (val: string) => {
  try {
    Principal.fromText(val.trim());
    return true;
  } catch {
    return false;
  }
};

function truncatePrincipal(p: string) {
  if (p.length <= 14) return p;
  return `${p.slice(0, 6)}…${p.slice(-4)}`;
}

function formatTimestamp(ts: bigint) {
  // ICP timestamps are in nanoseconds
  const ms = Number(ts / 1_000_000n);
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("sk-SK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PrincipalChip({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-foreground/80">
      <span title={value}>{truncatePrincipal(value)}</span>
      <button
        type="button"
        aria-label="Kopírovať"
        onClick={handleCopy}
        className="p-0.5 rounded opacity-50 hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <Check className="w-2.5 h-2.5 text-primary" />
        ) : (
          <Copy className="w-2.5 h-2.5" />
        )}
      </button>
    </span>
  );
}

interface NFTCardProps {
  nft: NFTMetadataLite;
  index: number;
  /** @deprecated — inline send panel is used instead */
  onQuickTransfer?: (tokenId: bigint) => void;
}

export function NFTCard({ nft, index }: NFTCardProps) {
  const ownerShort = `${nft.owner.toString().slice(0, 6)}…${nft.owner.toString().slice(-4)}`;

  const transferMutation = useTransferNFT();
  const visibilityMutation = useSetNFTVisibility();
  const [panelOpen, setPanelOpen] = useState<"send" | "history" | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [succeeded, setSucceeded] = useState(false);
  const [sendInputFocused, setSendInputFocused] = useState(false);
  const { addresses: savedAddresses, saveAddress } = useAddressHistory();

  // Lazy-load image separately — getMyNFTs no longer returns image bytes
  const { data: imageBytes, isLoading: imageLoading } = useGetNFTImage(
    nft.tokenId,
  );
  const imageSrc = imageBytes ? nftImageUrlById(nft.tokenId, imageBytes) : null;

  const filteredSuggestions = savedAddresses
    .filter((a) =>
      recipient.trim()
        ? a.toLowerCase().includes(recipient.trim().toLowerCase())
        : true,
    )
    .slice(0, 5);

  const truncateMid = (addr: string, keep = 8): string => {
    if (addr.length <= keep * 2 + 3) return addr;
    return `${addr.slice(0, keep)}…${addr.slice(-5)}`;
  };

  const { data: history, isLoading: historyLoading } = useGetNFTHistory(
    panelOpen === "history" ? nft.tokenId : null,
  );

  const displayHistory =
    panelOpen === "history"
      ? history && history.length > 0
        ? history
        : (nft.history ?? [])
      : [];

  const historyPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (panelOpen !== "history") return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelOpen(null);
    };
    const handleClick = (e: MouseEvent) => {
      if (
        historyPanelRef.current &&
        !historyPanelRef.current.contains(e.target as Node)
      ) {
        setPanelOpen(null);
      }
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [panelOpen]);

  const openSend = () => {
    setPanelOpen("send");
    setRecipient("");
    setFieldError("");
    setSucceeded(false);
  };

  const closePanel = () => {
    setPanelOpen(null);
    setRecipient("");
    setFieldError("");
    setSucceeded(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError("");
    const trimmed = recipient.trim();
    if (!isValidPrincipal(trimmed)) {
      setFieldError("Neplatná adresa príjemcu");
      return;
    }
    try {
      await transferMutation.mutateAsync({
        tokenId: nft.tokenId,
        to: Principal.fromText(trimmed),
      });
      saveAddress(trimmed);
      setSucceeded(true);
      setTimeout(closePanel, 1800);
    } catch (err) {
      setFieldError(
        err instanceof Error ? err.message : "Prevod zlyhal. Skúste znova.",
      );
    }
  };

  return (
    <div
      data-ocid={`nft.item.${index}`}
      className="glass-card rounded-2xl overflow-hidden transition-smooth hover:scale-[1.01]"
    >
      {/* Horizontal card row */}
      <div className="flex flex-row items-stretch gap-0">
        {/* Square thumbnail — fixed size, left side */}
        <div
          className="relative shrink-0 group"
          style={{ width: 88, height: 88 }}
        >
          <button
            type="button"
            data-ocid={`nft.image.${index}`}
            aria-label={`Zobraziť ${nft.name}`}
            className="w-full h-full p-0 border-0 bg-transparent cursor-zoom-in block overflow-hidden rounded-tl-2xl rounded-bl-2xl"
            onClick={() => imageSrc && setLightboxOpen(true)}
          >
            {imageLoading || !imageSrc ? (
              <div
                data-ocid={`nft.image_skeleton.${index}`}
                className="w-full h-full animate-pulse"
                style={{ background: "rgba(255,255,255,0.08)" }}
                aria-hidden="true"
              />
            ) : (
              <img
                src={imageSrc}
                alt={nft.name}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.08]"
                loading="lazy"
              />
            )}
          </button>
          {/* Visibility toggle — overlaid top-left on thumbnail */}
          <button
            type="button"
            data-ocid={`nft.visibility_toggle.${index}`}
            aria-label={nft.isPublic ? "Spraviť súkromné" : "Spraviť verejné"}
            onClick={(e) => {
              e.stopPropagation();
              visibilityMutation.mutate({
                tokenId: nft.tokenId,
                isPublic: !nft.isPublic,
              });
            }}
            disabled={visibilityMutation.isPending}
            className="absolute top-1.5 left-1.5 z-10 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-30"
            style={{
              background: nft.isPublic
                ? "rgba(99,102,241,0.30)"
                : "rgba(234,179,8,0.26)",
              border: nft.isPublic
                ? "1px solid rgba(99,102,241,0.50)"
                : "1px solid rgba(234,179,8,0.45)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {visibilityMutation.isPending ? (
              <span className="inline-block w-2.5 h-2.5 border border-white/30 border-t-white rounded-full animate-spin" />
            ) : nft.isPublic ? (
              <Eye className="w-2.5 h-2.5 text-indigo-300" />
            ) : (
              <EyeOff className="w-2.5 h-2.5 text-yellow-300" />
            )}
          </button>
          {/* Expand hint */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-end justify-end p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <span
              className="flex items-center justify-center w-5 h-5 rounded-lg"
              style={{
                background: "rgba(0,0,0,0.52)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <Maximize2 className="w-2.5 h-2.5 text-white" />
            </span>
          </div>
        </div>

        {/* Right side — NFT data */}
        <div className="flex flex-col justify-between flex-1 min-w-0 px-3 py-2.5">
          {/* Top: name + token ID */}
          <div className="flex items-start justify-between gap-1.5 min-w-0">
            <h3 className="font-display font-bold text-sm text-foreground truncate leading-tight">
              {nft.name}
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground shrink-0 leading-tight mt-0.5">
              #{nft.tokenId.toString()}
            </span>
          </div>

          {/* Description */}
          {nft.description && (
            <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
              {nft.description}
            </p>
          )}

          {/* Owner row */}
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70 shrink-0">
              Vlastník
            </span>
            <span className="text-[10px] font-mono text-foreground/80 truncate">
              {ownerShort}
            </span>
          </div>

          {/* Action buttons */}
          {panelOpen === null && (
            <div className="flex gap-1.5 mt-2">
              <button
                type="button"
                data-ocid={`nft.send_button.${index}`}
                onClick={openSend}
                className="flex-1 relative overflow-hidden rounded-xl py-1.5 text-[10px] uppercase tracking-widest font-display font-bold text-white transition-all duration-200 hover:scale-[1.02]"
                style={{ boxShadow: "0 3px 12px rgba(0,0,0,0.22)" }}
              >
                <span className="gradient-btn-inner" aria-hidden="true" />
                <span className="relative z-[1] flex items-center justify-center gap-1">
                  <Send className="w-2.5 h-2.5" />
                  Odoslať
                </span>
              </button>
              <button
                type="button"
                data-ocid={`nft.history_button.${index}`}
                onClick={() => setPanelOpen("history")}
                aria-label="História transakcií"
                className="shrink-0 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-[9px] font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:text-foreground"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <Clock className="w-2.5 h-2.5" />
                <ChevronDown className="w-2 h-2" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full-screen lightbox */}
      {lightboxOpen && imageSrc && (
        <ImageLightbox
          src={imageSrc}
          alt={nft.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Send panel — full width below the row */}
      {panelOpen === "send" && (
        <form
          data-ocid={`nft.send_panel.${index}`}
          onSubmit={handleSend}
          className="mx-2.5 mb-2.5 rounded-xl p-3 flex flex-col gap-2.5"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          {succeeded ? (
            <div
              data-ocid={`nft.success_state.${index}`}
              className="flex flex-col items-center gap-1.5 py-2"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(74,222,128,0.2),rgba(34,197,94,0.15))",
                  border: "1px solid rgba(74,222,128,0.4)",
                }}
              >
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-[11px] font-semibold text-green-400 text-center">
                Odoslané!
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Principal ID príjemcu
                </span>
                <button
                  type="button"
                  data-ocid={`nft.close_button.${index}`}
                  onClick={closePanel}
                  aria-label="Zavrieť"
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="relative">
                <input
                  data-ocid={`nft.send_input.${index}`}
                  type="text"
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    setFieldError("");
                  }}
                  onFocus={() => setSendInputFocused(true)}
                  onBlur={() => {
                    setTimeout(() => setSendInputFocused(false), 150);
                    if (recipient.trim() && !isValidPrincipal(recipient)) {
                      setFieldError("Neplatná adresa príjemcu");
                    }
                  }}
                  placeholder="principal ID príjemcu"
                  className="w-full bg-white/5 border border-white/20 text-foreground text-[11px] font-mono px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors placeholder:text-muted-foreground/50"
                />

                {sendInputFocused && filteredSuggestions.length > 0 && (
                  <div
                    data-ocid={`nft.send_suggestions.${index}`}
                    aria-label="Nedávne adresy"
                    className="absolute z-30 left-0 right-0 top-full mt-1 rounded-xl overflow-hidden flex flex-col"
                    style={{
                      background: "rgba(12,8,30,0.94)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                      animation: "mint-fade 0.12s both",
                    }}
                  >
                    <p className="px-2.5 pt-1.5 pb-0.5 text-[8px] font-semibold uppercase tracking-widest text-white/30">
                      Nedávne
                    </p>
                    {filteredSuggestions.map((addr) => (
                      <button
                        key={addr}
                        type="button"
                        aria-selected={recipient === addr}
                        onClick={() => {
                          setRecipient(addr);
                          setFieldError("");
                          setSendInputFocused(false);
                        }}
                        className="flex items-center gap-2 px-2.5 py-2 text-left hover:bg-white/[0.07] transition-colors group"
                      >
                        <svg
                          className="w-2.5 h-2.5 text-white/30 shrink-0 group-hover:text-white/60 transition-colors"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span className="font-mono text-[10px] text-white/65 group-hover:text-white/90 transition-colors truncate">
                          {truncateMid(addr)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {fieldError && (
                <p
                  data-ocid={`nft.field_error.${index}`}
                  className="text-[10px] text-destructive leading-tight"
                >
                  {fieldError}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  data-ocid={`nft.cancel_button.${index}`}
                  onClick={closePanel}
                  className="flex-1 py-2 rounded-xl text-[11px] font-semibold text-muted-foreground border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Zrušiť
                </button>
                <button
                  type="submit"
                  data-ocid={`nft.submit_button.${index}`}
                  disabled={transferMutation.isPending || !recipient.trim()}
                  className="flex-[2] relative overflow-hidden rounded-xl py-2 text-[11px] uppercase tracking-widest font-display font-bold text-white transition-all duration-200 hover:scale-[1.01] disabled:opacity-40 disabled:scale-100"
                  style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.20)" }}
                >
                  <span className="gradient-btn-inner" aria-hidden="true" />
                  <span className="relative z-[1] flex items-center justify-center gap-1.5">
                    {transferMutation.isPending ? (
                      <span
                        data-ocid={`nft.loading_state.${index}`}
                        className="inline-flex items-center gap-1.5"
                      >
                        <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Odosielam...
                      </span>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        Odoslať
                      </>
                    )}
                  </span>
                </button>
              </div>
            </>
          )}
        </form>
      )}

      {/* History panel */}
      {panelOpen === "history" && (
        <div
          ref={historyPanelRef}
          data-ocid={`nft.history_panel.${index}`}
          className="mx-2.5 mb-2.5 rounded-xl p-3 flex flex-col gap-2"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              História
            </span>
            <button
              type="button"
              data-ocid={`nft.history_close_button.${index}`}
              onClick={closePanel}
              aria-label="Zavrieť históriu"
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {historyLoading && (
            <div
              data-ocid={`nft.history_loading.${index}`}
              className="flex items-center justify-center py-3"
            >
              <span className="inline-block w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {!historyLoading && displayHistory.length === 0 && (
            <p className="text-[10px] text-muted-foreground text-center py-2">
              Žiadna história
            </p>
          )}

          {!historyLoading && displayHistory.length > 0 && (
            <ol className="relative flex flex-col gap-0">
              {displayHistory.map((event, ei) => {
                const isMint = event.eventType === Variant_Mint_Transfer.Mint;
                const isLast = ei === displayHistory.length - 1;
                return (
                  <li
                    key={`${event.timestamp.toString()}-${ei}`}
                    data-ocid={`nft.history_event.${index}.${ei + 1}`}
                    className="relative flex gap-2.5 pb-3"
                  >
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="absolute left-[7px] top-[16px] bottom-0 w-px"
                        style={{
                          background:
                            "linear-gradient(to bottom,rgba(255,255,255,0.18),transparent)",
                        }}
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{
                        background: isMint
                          ? "linear-gradient(135deg,rgba(168,85,247,0.4),rgba(99,102,241,0.3))"
                          : "linear-gradient(135deg,rgba(234,179,8,0.35),rgba(249,115,22,0.25))",
                        border: isMint
                          ? "1px solid rgba(168,85,247,0.5)"
                          : "1px solid rgba(234,179,8,0.45)",
                      }}
                    />
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          color: isMint
                            ? "rgba(196,130,255,0.9)"
                            : "rgba(250,200,60,0.9)",
                        }}
                      >
                        {isMint ? "Vyrazené" : "Odoslané"}
                      </span>
                      {isMint ? (
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-muted-foreground">
                            od:
                          </span>
                          <PrincipalChip value={event.to.toString()} />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-0.5">
                          {event.from && (
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] text-muted-foreground">
                                od:
                              </span>
                              <PrincipalChip value={event.from.toString()} />
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] text-muted-foreground">
                              na:
                            </span>
                            <PrincipalChip value={event.to.toString()} />
                          </div>
                        </div>
                      )}
                      <span className="text-[9px] text-muted-foreground/60 mt-0.5">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
