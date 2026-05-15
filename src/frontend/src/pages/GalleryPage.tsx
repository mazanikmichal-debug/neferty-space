import { NFTCard } from "@/components/NFTCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useGetAllPublicNFTs, useGetMyNFTs } from "@/hooks/useQueries";
import { copyToClipboard } from "@/utils/clipboard";
import { loadEnvConfig } from "@/utils/env";
import { Check, Copy, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type GalleryTab = "collection" | "standalone" | "others";

export default function GalleryPage() {
  const {
    data: myNfts,
    isLoading: myLoading,
    isError: myError,
  } = useGetMyNFTs();
  const { data: allPublicNfts, isLoading: othersLoading } =
    useGetAllPublicNFTs();
  const { principalText } = useAuth();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<GalleryTab>("collection");
  const [canisterId, setCanisterId] = useState<string>("");
  const [copiedCanister, setCopiedCanister] = useState(false);
  const [copiedPrincipal, setCopiedPrincipal] = useState(false);

  useEffect(() => {
    loadEnvConfig().then((cfg) => setCanisterId(cfg.backend_canister_id ?? ""));
  }, []);

  const handleCopyCanister = async () => {
    const success = await copyToClipboard(canisterId);
    if (success) {
      setCopiedCanister(true);
      setTimeout(() => setCopiedCanister(false), 2000);
    }
  };

  const handleCopyPrincipal = async () => {
    if (!principalText) return;
    const success = await copyToClipboard(principalText);
    if (success) {
      setCopiedPrincipal(true);
      setTimeout(() => setCopiedPrincipal(false), 2000);
    }
  };

  // Filter my NFTs by tab
  const collectionNfts = myNfts?.filter((nft) => !!nft.collectionName) ?? [];
  const standaloneNfts = myNfts?.filter((nft) => !nft.collectionName) ?? [];

  // Others: public NFTs not owned by current user
  const otherNfts =
    allPublicNfts?.filter((nft) => nft.owner.toText() !== principalText) ?? [];

  const isLoading = activeTab === "others" ? othersLoading : myLoading;
  const isError = activeTab === "others" ? false : myError;

  const currentNfts =
    activeTab === "collection"
      ? collectionNfts
      : activeTab === "standalone"
        ? standaloneNfts
        : otherNfts;

  const tabs: { id: GalleryTab; label: string; count?: number }[] = [
    {
      id: "collection",
      label: t("tabs.myCollection"),
      count: collectionNfts.length,
    },
    {
      id: "standalone",
      label: t("tabs.standalone"),
      count: standaloneNfts.length,
    },
    { id: "others", label: t("tabs.others") },
  ];

  return (
    <div className="section-content space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <span className="text-5xl" aria-hidden="true">
          ▦
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          {t("messages.galleryTitle")}
        </h1>
      </div>

      {/* Principal ID card */}
      {principalText && (
        <div
          data-ocid="gallery.principal_card"
          className="border-2 border-primary/30 bg-card rounded-3xl px-6 py-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                {t("labels.principalId")}
              </p>
              <p className="text-xs font-mono text-foreground break-all leading-relaxed">
                {principalText}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1.5">
                {t("labels.principalShare")}
              </p>
            </div>
            <button
              type="button"
              data-ocid="gallery.copy_principal_button"
              onClick={handleCopyPrincipal}
              aria-label={t("aria.copyPrincipal")}
              className="self-start sm:self-center shrink-0 flex items-center gap-1.5 px-4 py-2 glass-card rounded-2xl hover:bg-white/10 transition-colors duration-200 text-xs text-muted-foreground hover:text-foreground"
            >
              {copiedPrincipal ? (
                <>
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span className="font-semibold text-primary">
                    {t("buttons.copied")}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t("buttons.copy")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Canister info banner */}
      <div
        data-ocid="gallery.plug_info_banner"
        className="border-2 border-border bg-card rounded-3xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
      >
        <div className="flex items-center gap-2 text-muted-foreground shrink-0">
          <Wallet className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            {t("labels.canisterId")}
          </span>
        </div>
        <p className="text-xs text-muted-foreground flex-1">
          {t("labels.canisterDesc")}
        </p>
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono bg-background border-2 border-border rounded-xl px-3 py-1.5 text-foreground select-all">
            {canisterId}
          </code>
          <button
            type="button"
            data-ocid="gallery.copy_canister_button"
            onClick={handleCopyCanister}
            aria-label={t("aria.copyCanister")}
            className="p-2.5 border-2 border-border rounded-xl bg-background hover:bg-muted transition-colors duration-200 text-muted-foreground hover:text-foreground"
          >
            {copiedCanister ? (
              <Check className="w-3.5 h-3.5 text-primary" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        data-ocid="gallery.tabs"
        className="flex gap-2"
        role="tablist"
        aria-label={t("aria.gallerySections")}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            data-ocid={`gallery.${tab.id}_tab`}
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{
              background:
                activeTab === tab.id
                  ? "linear-gradient(135deg, rgba(var(--theme-color-1-rgb,180,80,220),0.25), rgba(var(--theme-color-2-rgb,230,100,180),0.15))"
                  : "rgba(255,255,255,0.07)",
              border:
                activeTab === tab.id
                  ? "1.5px solid rgba(var(--theme-color-1-rgb,180,80,220),0.5)"
                  : "1.5px solid rgba(255,255,255,0.12)",
              color:
                activeTab === tab.id
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(255,255,255,0.5)",
            }}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className="rounded-full px-1.5 py-0.5 text-[10px] font-bold min-w-[18px] text-center"
                style={{
                  background:
                    activeTab === tab.id
                      ? "rgba(var(--theme-color-1-rgb,180,80,220),0.35)"
                      : "rgba(255,255,255,0.10)",
                  color:
                    activeTab === tab.id
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(255,255,255,0.4)",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div
          data-ocid="gallery.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        >
          {Array.from({ length: 6 }, (_, i) => i).map((i) => (
            <div
              key={`skeleton-${i}`}
              className="flex items-center gap-3 border-2 border-border rounded-2xl p-2.5"
            >
              <Skeleton className="w-[88px] h-[88px] rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <Skeleton className="h-3 w-3/4 rounded" />
                <Skeleton className="h-2.5 w-1/2 rounded" />
                <Skeleton className="h-2.5 w-2/3 rounded" />
                <Skeleton className="h-6 w-full rounded-xl mt-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div data-ocid="gallery.error_state">
          <div className="border border-destructive/50 bg-destructive/5 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm text-destructive font-semibold flex-1">
              {t("errors.loadError")}
            </p>
            <button
              type="button"
              data-ocid="gallery.manual_reload_button"
              onClick={() => window.location.reload()}
              className="shrink-0 px-4 py-2 rounded-xl border-2 border-destructive/40 bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors duration-200"
            >
              {t("buttons.reload")}
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && currentNfts.length === 0 && (
        <div
          data-ocid="gallery.empty_state"
          className="border-2 border-border bg-card rounded-3xl p-12 flex flex-col items-center text-center gap-4"
        >
          <span className="text-6xl" aria-hidden="true">
            {activeTab === "collection"
              ? "🗂️"
              : activeTab === "standalone"
                ? "🎨"
                : "🌐"}
          </span>
          <div>
            <p className="font-display font-bold text-foreground text-lg">
              {activeTab === "collection"
                ? t("messages.noCollectionNFTs")
                : activeTab === "standalone"
                  ? t("messages.noStandaloneNFTs")
                  : t("messages.noOthersNFTs")}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTab === "collection"
                ? t("messages.noCollectionNFTsDesc")
                : activeTab === "standalone"
                  ? t("messages.noStandaloneNFTsDesc")
                  : t("messages.noOthersNFTsDesc")}
            </p>
          </div>
        </div>
      )}

      {/* NFT grid */}
      {!isLoading && currentNfts.length > 0 && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            {activeTab === "collection"
              ? t("messages.myCollectionSection")
              : activeTab === "standalone"
                ? t("messages.standaloneSection")
                : t("messages.othersSection")}{" "}
            · {currentNfts.length}{" "}
            {currentNfts.length === 1 ? "token" : "tokenov"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentNfts.map((nft, i) => (
              <div key={nft.tokenId.toString()} className="relative">
                {/* Collection badge for 'Od iných' tab */}
                {activeTab === "others" && nft.collectionName && (
                  <div className="absolute top-2 left-2 z-10">
                    <span
                      className="inline-flex items-center gap-1 rounded-xl px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        background:
                          "rgba(var(--theme-color-1-rgb,180,80,220),0.28)",
                        border:
                          "1px solid rgba(var(--theme-color-1-rgb,180,80,220),0.45)",
                        color: "rgba(255,255,255,0.85)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                      }}
                    >
                      <svg
                        viewBox="0 0 12 12"
                        className="w-2.5 h-2.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <rect x="1" y="4" width="10" height="7" rx="1.5" />
                        <path d="M3.5 4V3a1.5 1.5 0 0 1 3 0v1" />
                      </svg>
                      {t("messages.collectionBadge")}: {nft.collectionName}
                    </span>
                  </div>
                )}
                <NFTCard nft={nft} index={i + 1} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
