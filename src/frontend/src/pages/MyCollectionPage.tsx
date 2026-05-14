import { CollectionPhase } from "@/backend";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBackend } from "@/context/BackendContext";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Layers, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ---------- helpers ----------
function glassInput(hasError = false) {
  return {
    background: "rgba(255,255,255,0.08)",
    border: hasError
      ? "1px solid rgba(239,68,68,0.6)"
      : "1px solid rgba(255,255,255,0.14)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  };
}

function GlassCard({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl p-8 ${className}`}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(var(--theme-color-1-rgb,255,255,255),0.15)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow:
          "0 4px 16px 0 rgba(0,0,0,0.25),0 1.5px 4px 0 rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
    >
      {children}
    </div>
  );
}

function GradientButton({
  children,
  disabled,
  onClick,
  type = "button",
  dataOcid,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  dataOcid?: string;
}) {
  return (
    <button
      type={type}
      data-ocid={dataOcid}
      disabled={disabled}
      onClick={onClick}
      className="relative overflow-hidden w-full rounded-2xl py-4 min-h-[56px] font-display font-bold text-sm uppercase tracking-widest text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-40 disabled:scale-100"
      style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
    >
      <span className="gradient-btn-inner" aria-hidden="true" />
      <span className="relative z-[1] flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}

// ---------- phase helpers ----------
const PHASE_CONFIG = {
  [CollectionPhase.free]: {
    limit: 10,
    label: "Fáza 1: 0–10 NFT zadarmo",
    color: "#22d3ee",
  },
  [CollectionPhase.bonus]: {
    limit: 25,
    label: "Fáza 2: 10–25 NFT (bonus cycles)",
    color: "#a78bfa",
  },
  [CollectionPhase.premium]: {
    limit: null,
    label: "Fáza 3: Prémiový umelec",
    color: "#fbbf24",
  },
};

function PhaseIndicator({
  phase,
  mintCount,
}: { phase: CollectionPhase; mintCount: number }) {
  const cfg = PHASE_CONFIG[phase];
  const progress = cfg.limit ? Math.min(mintCount / cfg.limit, 1) : 1;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: cfg.color }}
        >
          {cfg.label}
        </span>
        {phase === CollectionPhase.premium ? (
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(251,191,36,0.15)",
              border: "1px solid rgba(251,191,36,0.4)",
              color: "#fbbf24",
            }}
          >
            Premium
          </span>
        ) : (
          <span className="text-xs text-muted-foreground font-mono">
            {mintCount}/{cfg.limit}
          </span>
        )}
      </div>
      {cfg.limit && (
        <div
          className="h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: "rgba(255,255,255,0.10)" }}
        >
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${cfg.color}, rgba(255,255,255,0.6))`,
            }}
          />
        </div>
      )}
    </div>
  );
}

// ---------- Payment Required Modal ----------
function PaymentModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <dialog
      data-ocid="mycollection.payment_dialog"
      open
      className="fixed inset-0 z-50 flex items-center justify-center p-4 m-0 max-w-none w-full h-full border-none bg-transparent"
      aria-labelledby="payment-modal-title"
      style={{
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl p-8 space-y-5"
        style={{
          background: "rgba(18,10,40,0.96)",
          border: "1px solid rgba(var(--theme-color-1-rgb,255,255,255),0.20)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
      >
        <button
          type="button"
          data-ocid="mycollection.payment_modal.close_button"
          onClick={onClose}
          aria-label="Zavrieť"
          className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(251,191,36,0.15)",
              border: "1px solid rgba(251,191,36,0.3)",
            }}
          >
            <Sparkles className="w-5 h-5" style={{ color: "#fbbf24" }} />
          </div>
          <h2
            id="payment-modal-title"
            className="font-display font-bold text-xl text-foreground"
          >
            Limit dosiahnutý
          </h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Dosiahol si limit{" "}
          <span className="text-foreground font-semibold">25 NFT</span>. Pre
          ďalšiu tvorbu prosím vlož ICP.
        </p>

        <div
          className="rounded-2xl p-4 space-y-2"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Ako sa rozdeľujú prostriedky
          </p>
          {[
            { pct: "70%", desc: "Cycles pre tvoju zbierku", color: "#22d3ee" },
            {
              pct: "20%",
              desc: "Komunitný fond pre nových umelcov",
              color: "#a78bfa",
            },
            {
              pct: "10%",
              desc: "Rozvoj platformy Neferty Space",
              color: "#fbbf24",
            },
          ].map((item) => (
            <div key={item.pct} className="flex items-center gap-3">
              <span
                className="text-sm font-bold font-mono min-w-[40px]"
                style={{ color: item.color }}
              >
                {item.pct}
              </span>
              <span className="text-sm text-muted-foreground">{item.desc}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          data-ocid="mycollection.payment_modal.confirm_button"
          onClick={onClose}
          className="relative overflow-hidden w-full rounded-2xl py-4 font-display font-bold text-sm uppercase tracking-widest text-white transition-all duration-200 hover:scale-[1.02]"
          style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
        >
          <span className="gradient-btn-inner" aria-hidden="true" />
          <span className="relative z-[1]">Rozumiem</span>
        </button>
      </div>
    </dialog>
  );
}

// ---------- Main page ----------
export default function MyCollectionPage() {
  const { actor, isLoading: backendLoading } = useBackend();
  const { identity } = useInternetIdentity();

  // collection state
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [phase, setPhase] = useState<CollectionPhase>(CollectionPhase.free);
  const [mintCount, setMintCount] = useState(0);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [collectionError, setCollectionError] = useState<string | null>(null);

  // create collection
  const [creating, setCreating] = useState(false);

  // mint form
  const [mintName, setMintName] = useState("");
  const [mintDesc, setMintDesc] = useState("");
  const [mintFile, setMintFile] = useState<File | null>(null);
  const [mintPreview, setMintPreview] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintFormErrors, setMintFormErrors] = useState<{
    name?: string;
    image?: string;
  }>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const principal = identity?.getPrincipal() ?? null;

  // Load collection info
  useEffect(() => {
    if (backendLoading || !actor || !principal) return;
    let cancelled = false;
    setLoadingCollection(true);
    setCollectionError(null);

    (async () => {
      try {
        const cid = await actor.getMyCollection(principal);
        if (cancelled) return;
        if (cid) {
          setCollectionId(cid.toString());
          const [ph, mc] = await Promise.all([
            actor.getCollectionPhase(principal),
            actor.getMyMintCount(principal),
          ]);
          if (!cancelled) {
            setPhase(ph);
            setMintCount(Number(mc));
          }
        } else {
          setCollectionId(null);
        }
      } catch (e) {
        if (!cancelled)
          setCollectionError(
            e instanceof Error ? e.message : "Nepodarilo sa načítať zbierku.",
          );
      } finally {
        if (!cancelled) setLoadingCollection(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [actor, backendLoading, principal]);

  const handleCreateCollection = async () => {
    if (!actor) return;
    setCreating(true);
    setCollectionError(null);
    try {
      const result = await actor.createMyCollection();
      // result is Text (success message or ID)
      // Reload collection info
      if (principal) {
        const cid = await actor.getMyCollection(principal);
        if (cid) {
          setCollectionId(cid.toString());
          const [ph, mc] = await Promise.all([
            actor.getCollectionPhase(principal),
            actor.getMyMintCount(principal),
          ]);
          setPhase(ph);
          setMintCount(Number(mc));
        }
      }
      void result;
    } catch (e) {
      setCollectionError(
        e instanceof Error ? e.message : "Nepodarilo sa vytvoriť zbierku.",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMintFile(file);
    setMintPreview(URL.createObjectURL(file));
    setMintFormErrors((p) => ({ ...p, image: undefined }));
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setMintFile(file);
    setMintPreview(URL.createObjectURL(file));
    setMintFormErrors((p) => ({ ...p, image: undefined }));
  };

  const handleMintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { name?: string; image?: string } = {};
    if (!mintName.trim()) errs.name = "Zadajte názov NFT.";
    if (!mintFile) errs.image = "Vyberte obrázok.";
    setMintFormErrors(errs);
    if (Object.keys(errs).length > 0 || !mintFile || !actor) return;

    setMinting(true);
    setMintError(null);
    setMintSuccess(false);
    try {
      const bytes = new Uint8Array(await mintFile.arrayBuffer());
      const result = await actor.mintNFT(
        mintName.trim(),
        mintDesc.trim(),
        bytes,
        null,
        true,
      );

      if (result.__kind__ === "paymentRequired") {
        setShowPaymentModal(true);
        return;
      }
      if (result.__kind__ === "err") {
        setMintError(result.err);
        return;
      }
      // ok
      setMintSuccess(true);
      setMintName("");
      setMintDesc("");
      setMintFile(null);
      setMintPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      // refresh phase/count
      if (principal) {
        const [ph, mc] = await Promise.all([
          actor.getCollectionPhase(principal),
          actor.getMyMintCount(principal),
        ]);
        setPhase(ph);
        setMintCount(Number(mc));
      }
      setTimeout(() => setMintSuccess(false), 3500);
    } catch (err) {
      setMintError(
        err instanceof Error ? err.message : "Razenie sa nepodarilo.",
      );
    } finally {
      setMinting(false);
    }
  };

  // ---- render states ----
  const isPageLoading = backendLoading || loadingCollection;

  return (
    <>
      {showPaymentModal && (
        <PaymentModal onClose={() => setShowPaymentModal(false)} />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Page header */}
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(var(--theme-color-1-rgb,180,80,220),0.15)",
              border:
                "1px solid rgba(var(--theme-color-1-rgb,180,80,220),0.30)",
            }}
          >
            <Layers
              className="w-6 h-6"
              style={{ color: "rgb(var(--theme-color-1-rgb,180,80,220))" }}
            />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight gradient-text">
              Moja Zbierka
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Správa tvojej osobnej NFT zbierky na blockchaine ICP
            </p>
          </div>
        </div>

        {/* Loading */}
        {isPageLoading && (
          <div data-ocid="mycollection.loading_state" className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-32 rounded-3xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!isPageLoading && collectionError && (
          <div
            data-ocid="mycollection.error_state"
            className="rounded-2xl px-5 py-4 text-sm text-red-300"
            style={{
              background: "rgba(239,68,68,0.10)",
              border: "1px solid rgba(239,68,68,0.30)",
            }}
            aria-live="polite"
          >
            {collectionError}
          </div>
        )}

        {/* Section 1 — No collection yet */}
        {!isPageLoading && !collectionError && collectionId === null && (
          <GlassCard>
            <div className="flex flex-col items-center text-center gap-6 py-6">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center"
                style={{
                  background: "rgba(var(--theme-color-1-rgb,180,80,220),0.12)",
                  border:
                    "1px solid rgba(var(--theme-color-1-rgb,180,80,220),0.25)",
                }}
              >
                <Layers
                  className="w-9 h-9"
                  style={{ color: "rgb(var(--theme-color-1-rgb,180,80,220))" }}
                />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-xl font-bold text-foreground">
                  Ešte nemáš vlastnú zbierku
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Vytvor si svoju vlastnú zbierku NFT na blockchaine ICP. Prvých
                  10 NFT je zadarmo.
                </p>
              </div>
              <GradientButton
                dataOcid="mycollection.create_collection_button"
                onClick={handleCreateCollection}
                disabled={creating}
              >
                {creating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Vytváranie...
                  </>
                ) : (
                  "Vytvoriť zbierku"
                )}
              </GradientButton>
            </div>
          </GlassCard>
        )}

        {/* Section 1 — Collection exists */}
        {!isPageLoading && !collectionError && collectionId !== null && (
          <GlassCard>
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-lg font-bold text-foreground">
                  Tvoja zbierka
                </h2>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{
                    background: "rgba(34,211,238,0.12)",
                    border: "1px solid rgba(34,211,238,0.30)",
                    color: "#22d3ee",
                  }}
                >
                  Aktívna
                </span>
              </div>

              {/* Collection ID */}
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Canister ID
                </p>
                <p
                  className="font-mono text-xs break-all px-3 py-2 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  {collectionId}
                </p>
              </div>

              {/* Phase indicator */}
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <PhaseIndicator phase={phase} mintCount={mintCount} />
              </div>
            </div>
          </GlassCard>
        )}

        {/* Section 2 — Mint form (only when collection exists) */}
        {!isPageLoading && !collectionError && collectionId !== null && (
          <GlassCard>
            <h2 className="font-display text-lg font-bold text-foreground mb-6">
              Vyraziť NFT do zbierky
            </h2>

            {/* Success banner */}
            {mintSuccess && (
              <div
                data-ocid="mycollection.mint.success_state"
                className="mb-5 rounded-2xl px-4 py-3 text-sm font-medium flex items-center gap-2"
                style={{
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.30)",
                  color: "#86efac",
                }}
                aria-live="polite"
              >
                <span>✓</span>
                <span>NFT úspešne vyrazené do zbierky!</span>
              </div>
            )}

            <form onSubmit={handleMintSubmit} className="space-y-5" noValidate>
              {/* Image upload */}
              <div>
                <Label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                  Obrázok NFT
                </Label>
                <button
                  type="button"
                  data-ocid="mycollection.mint.dropzone"
                  aria-label="Vyberte obrázok"
                  className="mt-1.5 w-full rounded-2xl transition-smooth cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring text-left"
                  style={{
                    background: dragOver
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.04)",
                    border: mintFormErrors.image
                      ? "1.5px dashed rgba(239,68,68,0.6)"
                      : dragOver
                        ? "1.5px dashed rgba(255,255,255,0.45)"
                        : "1.5px dashed rgba(255,255,255,0.18)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                  onClick={() => fileRef.current?.click()}
                  onKeyDown={(e) =>
                    e.key === "Enter" && fileRef.current?.click()
                  }
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                >
                  {mintPreview ? (
                    <div className="relative aspect-video overflow-hidden rounded-2xl">
                      <img
                        src={mintPreview}
                        alt="Náhľad"
                        className="w-full h-full object-contain bg-muted"
                      />
                      <button
                        type="button"
                        aria-label="Odstrániť obrázok"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMintFile(null);
                          setMintPreview(null);
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                        className="absolute top-2 right-2 glass-card rounded-xl text-xs px-3 py-1.5 font-semibold uppercase hover:bg-white/10 transition-smooth text-foreground"
                      >
                        Odstrániť
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 px-4 gap-3 text-center">
                      <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="text-foreground font-semibold">
                          Nahrať obrázok
                        </span>
                        <br />
                        <span className="text-xs">
                          alebo pretáhnite súbor sem
                        </span>
                      </p>
                      <span className="text-xs text-muted-foreground/60">
                        PNG, JPG, GIF, WEBP
                      </span>
                    </div>
                  )}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {mintFormErrors.image && (
                  <p
                    data-ocid="mycollection.mint.image.field_error"
                    className="text-xs text-destructive mt-1"
                  >
                    {mintFormErrors.image}
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <Label
                  htmlFor="col-mint-name"
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50"
                >
                  Názov NFT
                </Label>
                <Input
                  id="col-mint-name"
                  data-ocid="mycollection.mint.name_input"
                  value={mintName}
                  onChange={(e) => {
                    setMintName(e.target.value);
                    if (e.target.value.trim())
                      setMintFormErrors((p) => ({ ...p, name: undefined }));
                  }}
                  onBlur={() => {
                    if (!mintName.trim())
                      setMintFormErrors((p) => ({
                        ...p,
                        name: "Zadajte názov NFT.",
                      }));
                  }}
                  placeholder="napr. Môj prvý NFT"
                  className="mt-1.5 rounded-2xl text-sm text-white/90 placeholder:text-white/30 border-0 outline-none focus-visible:ring-1 focus-visible:ring-white/30"
                  style={glassInput(!!mintFormErrors.name)}
                />
                {mintFormErrors.name && (
                  <p
                    data-ocid="mycollection.mint.name.field_error"
                    className="text-xs text-destructive mt-1"
                  >
                    {mintFormErrors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label
                  htmlFor="col-mint-desc"
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50"
                >
                  Popis{" "}
                  <span className="font-normal normal-case tracking-normal text-white/30">
                    (voliteľný)
                  </span>
                </Label>
                <Textarea
                  id="col-mint-desc"
                  data-ocid="mycollection.mint.description_input"
                  value={mintDesc}
                  onChange={(e) => setMintDesc(e.target.value)}
                  placeholder="Stručný popis vášho NFT..."
                  rows={3}
                  className="mt-1.5 rounded-2xl text-sm resize-none text-white/90 placeholder:text-white/30 border-0 focus-visible:ring-1 focus-visible:ring-white/30"
                  style={glassInput()}
                />
              </div>

              {/* Mint error */}
              {mintError && (
                <div
                  data-ocid="mycollection.mint.error_state"
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-red-300"
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.35)",
                  }}
                  aria-live="polite"
                >
                  {mintError}
                </div>
              )}

              {/* Submit */}
              <GradientButton
                type="submit"
                disabled={minting}
                dataOcid="mycollection.mint.submit_button"
              >
                {minting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Razenie...
                  </>
                ) : (
                  "Vyraziť do zbierky"
                )}
              </GradientButton>
            </form>
          </GlassCard>
        )}
      </div>
    </>
  );
}
