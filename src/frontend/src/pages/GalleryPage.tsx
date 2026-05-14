import { NFTCard } from "@/components/NFTCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useGetMyNFTs } from "@/hooks/useQueries";
import { copyToClipboard } from "@/utils/clipboard";
import { loadEnvConfig } from "@/utils/env";
import { Check, Copy, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

export default function GalleryPage() {
  const { data: nfts, isLoading, isError } = useGetMyNFTs();
  const { principalText } = useAuth();

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

  return (
    <div className="section-content space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <span className="text-5xl" aria-hidden="true">
          ▦
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          Galéria
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
                Vaše Principal ID
              </p>
              <p className="text-xs font-mono text-foreground break-all leading-relaxed">
                {principalText}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1.5">
                Zddieľajte toto ID s ostatnými, aby vám mohli previesť NFT.
              </p>
            </div>
            <button
              type="button"
              data-ocid="gallery.copy_principal_button"
              onClick={handleCopyPrincipal}
              aria-label="Kopírovať Principal ID"
              className="self-start sm:self-center shrink-0 flex items-center gap-1.5 px-4 py-2 glass-card rounded-2xl hover:bg-white/10 transition-colors duration-200 text-xs text-muted-foreground hover:text-foreground"
            >
              {copiedPrincipal ? (
                <>
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span className="font-semibold text-primary">
                    Skopírované!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopírovať</span>
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
            Canister ID
          </span>
        </div>
        <p className="text-xs text-muted-foreground flex-1">
          Canister tejto kolekcie na ICP blockchaine.
        </p>
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono bg-background border-2 border-border rounded-xl px-3 py-1.5 text-foreground select-all">
            {canisterId}
          </code>
          <button
            type="button"
            data-ocid="gallery.copy_canister_button"
            onClick={handleCopyCanister}
            aria-label="Kopírovať canister ID"
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

      {isError && (
        <div data-ocid="gallery.error_state">
          <div className="border border-destructive/50 bg-destructive/5 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm text-destructive font-semibold flex-1">
              Chyba pri načítávaní NFT. Skúste obnoviť stránku.
            </p>
            <button
              type="button"
              data-ocid="gallery.manual_reload_button"
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
          data-ocid="gallery.empty_state"
          className="border-2 border-border bg-card rounded-3xl p-12 flex flex-col items-center text-center gap-4"
        >
          <span className="text-6xl" aria-hidden="true">
            🎨
          </span>
          <div>
            <p className="font-display font-bold text-foreground text-lg">
              Žiadne NFT
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Zatiaľ ste nevyrazili žiadne NFT. Vyrazte svoje prvé NFT!
            </p>
          </div>
        </div>
      )}

      {!isLoading && nfts && nfts.length > 0 && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Galéria · {nfts.length} {nfts.length === 1 ? "token" : "tokenov"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {nfts.map((nft, i) => (
              <NFTCard key={nft.tokenId.toString()} nft={nft} index={i + 1} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
