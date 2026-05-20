import { CollectionPhase } from "@/backend";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBackend } from "@/context/BackendContext";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Principal } from "@dfinity/principal";
import { Layers, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CyclesCalculator } from "../components/CyclesCalculator";

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
  [CollectionPhase.Free]: {
    limit: 10,
    label: "Fáza 1: 0–10 NFT zadarmo",
    color: "#22d3ee",
  },
  [CollectionPhase.Bonus]: {
    limit: 25,
    label: "Fáza 2: 10–25 NFT (bonus cycles)",
    color: "#a78bfa",
  },
  [CollectionPhase.Premium]: {
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
        {phase === CollectionPhase.Premium ? (
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

// ---------- Payment Modal (wraps CyclesCalculator) ----------
function PaymentModal({
  onClose,
  onTopUp,
}: { onClose: () => void; onTopUp: (icpAmount: number) => void }) {
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
      aria-labelledby="payment-modal-title"
      open
      className="fixed inset-0 z-50 flex items-center justify-center p-4 m-0 w-full h-full max-w-none max-h-none border-0 bg-transparent"
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
        {/* Close button */}
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

        {/* Header */}
        <div className="flex items-center gap-3 pr-10">
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
            Dobiť zbierku
          </h2>
        </div>

        {/* Calculator */}
        <CyclesCalculator onTopUp={onTopUp} onClose={onClose} />
      </div>
    </dialog>
  );
}

// ---------- Main page ----------
export default function MyCollectionPage() {
  const { actor, isLoading: backendLoading, canisterId } = useBackend();
  const { identity } = useInternetIdentity();

  // collection state
  const [collectionIds, setCollectionIds] = useState<string[]>([]);
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [phase, setPhase] = useState<CollectionPhase>(CollectionPhase.Free);
  const [mintCount, setMintCount] = useState(0);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [collectionError, setCollectionError] = useState<string | null>(null);

  // create collection
  const [_creating, setCreating] = useState(false);

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

  // Hybrid architecture: Factory IS the default collection.
  // We always show the mint form — no "create collection first" gate.
  // collectionId = Factory canister ID when using default, or explicit ID when Premium.
  const FACTORY_CANISTER_ID = canisterId ?? "3shfw-daaaa-aaaag-aywla-cai";

  // Load collection info
  useEffect(() => {
    if (backendLoading || !actor || !principal) return;
    let cancelled = false;
    setLoadingCollection(true);
    setCollectionError(null);

    (async () => {
      try {
        // getMyCollection now returns Principal[] (array, never null)
        const rawResult = await actor.getMyCollection(principal);
        if (cancelled) return;

        // Normalise: backend may return array or single Principal depending on binding version
        const cids: string[] = (() => {
          const arr: string[] = [];
          const items = Array.isArray(rawResult)
            ? rawResult
            : rawResult
              ? [rawResult]
              : [];
          for (const p of items) {
            const t = (p as { toText?: () => string }).toText?.() ?? String(p);
            if (t && t !== "aaaaa-aa") arr.push(t);
          }
          return arr;
        })();

        // If no valid dedicated collection — fall back to Factory (always-on default)
        const primary = cids.length > 0 ? cids[0] : FACTORY_CANISTER_ID;
        if (!cancelled) {
          setCollectionIds(cids.length > 0 ? cids : [FACTORY_CANISTER_ID]);
          setCollectionId(primary);
        }

        // Load phase + mint count regardless
        const [ph, mc] = await Promise.all([
          actor.getCollectionPhase(principal),
          actor.getMyMintCount(principal),
        ]);
        if (!cancelled) {
          setPhase(ph);
          setMintCount(Number(mc));
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
  }, [actor, backendLoading, principal, FACTORY_CANISTER_ID]);

  // Delete a collection from registry
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteCollection = async (cidToDelete: string) => {
    if (!actor) return;
    const confirmed = window.confirm("Naozaj chcete vymazať túto zbierku?");
    if (!confirmed) return;
    setDeletingId(cidToDelete);
    setDeleteError(null);
    try {
      const result = await actor.removeMyCollection(
        Principal.fromText(cidToDelete),
      );
      if ("err" in result) {
        setDeleteError(
          typeof result.err === "string"
            ? result.err
            : "Nepodarilo sa vymazať zbierku.",
        );
        return;
      }
      // Refresh collection list from backend
      if (principal) {
        const rawResult = await actor.getMyCollection(principal);
        const cids: string[] = (() => {
          const arr: string[] = [];
          const items = Array.isArray(rawResult)
            ? rawResult
            : rawResult
              ? [rawResult]
              : [];
          for (const p of items) {
            const t = (p as { toText?: () => string }).toText?.() ?? String(p);
            if (t && t !== "aaaaa-aa") arr.push(t);
          }
          return arr;
        })();
        const updated = cids.length > 0 ? cids : [FACTORY_CANISTER_ID];
        setCollectionIds(updated);
        if (collectionId === cidToDelete) {
          setCollectionId(updated[0] ?? FACTORY_CANISTER_ID);
        }
      }
    } catch (e) {
      setDeleteError(
        e instanceof Error ? e.message : "Nepodarilo sa vymazať zbierku.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Create a NEW dedicated collection canister (always available — one user can have many)
  const handleCreateCollection = async () => {
    if (!actor) return;
    setCreating(true);
    setCollectionError(null);
    try {
      const createResult = await actor.createMyCollection();
      if (createResult.__kind__ === "err") throw new Error(createResult.err);
      const newPrincipal = createResult.ok;
      const newId = newPrincipal.toText();
      if (principal) {
        const rawResult = await actor.getMyCollection(principal);
        const cids: string[] = (() => {
          const arr: string[] = [];
          const items = Array.isArray(rawResult)
            ? rawResult
            : rawResult
              ? [rawResult]
              : [];
          for (const p of items) {
            const t = (p as { toText?: () => string }).toText?.() ?? String(p);
            if (t && t !== "aaaaa-aa") arr.push(t);
          }
          return arr;
        })();
        if (cids.length > 0) {
          setCollectionIds(cids);
          // Select the newly created one if we can identify it
          setCollectionId(
            newId && newId !== "aaaaa-aa" ? newId : cids[cids.length - 1],
          );
          const [ph, mc] = await Promise.all([
            actor.getCollectionPhase(principal),
            actor.getMyMintCount(principal),
          ]);
          setPhase(ph);
          setMintCount(Number(mc));
        }
      }
    } catch (e) {
      setCollectionError(
        e instanceof Error ? e.message : "Nepodarilo sa vytvoriť zbierku.",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleTopUp = (_icpAmount: number) => {
    setShowPaymentModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMintFile(file);
    setMintPreview(URL.createObjectURL(file));
    setMintFormErrors((p) => ({ ...p, image: undefined }));
    const autoName = file.name.replace(/\.[^.]*$/, "");
    if (!mintName) setMintName(autoName);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setMintFile(file);
    setMintPreview(URL.createObjectURL(file));
    setMintFormErrors((p) => ({ ...p, image: undefined }));
    const autoName = file.name.replace(/\.[^.]*$/, "");
    if (!mintName) setMintName(autoName);
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
        null,
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
      {/* Payment modal — always available since Factory is the default collection */}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onTopUp={handleTopUp}
        />
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

        {/* Hybrid architecture: no "create collection" gate — Factory is always available */}

        {/* Section 1 — Collection cards (one per collectionId, each with correct cids[i]) */}
        {!isPageLoading && !collectionError && (
          <div className="space-y-4">
            {/* Delete error banner */}
            {deleteError && (
              <div
                data-ocid="mycollection.delete.error_state"
                className="rounded-2xl px-5 py-4 text-sm text-red-300"
                style={{
                  background: "rgba(239,68,68,0.10)",
                  border: "1px solid rgba(239,68,68,0.30)",
                }}
                aria-live="polite"
              >
                {deleteError}
              </div>
            )}

            {collectionIds.map((cid, i) => (
              <GlassCard key={cid}>
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-display text-lg font-bold text-foreground">
                      {cid === FACTORY_CANISTER_ID
                        ? "Predvolená zbierka"
                        : `Zbierka ${i + 1}`}
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

                  {/* Canister ID — uses cids[i] (correct per-card index) */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {cid === FACTORY_CANISTER_ID
                        ? "Predvolená zbierka · Canister ID"
                        : "Canister ID"}
                    </p>
                    {cid === FACTORY_CANISTER_ID && (
                      <p
                        className="text-[10px]"
                        style={{ color: "rgba(34,197,94,0.70)" }}
                      >
                        Tvoje NFT sú uložené v hlavnom canistri Neferty Space
                      </p>
                    )}
                    <p
                      className="font-mono text-xs break-all px-3 py-2 rounded-xl"
                      style={{
                        background:
                          cid === FACTORY_CANISTER_ID
                            ? "rgba(34,197,94,0.05)"
                            : "rgba(255,255,255,0.05)",
                        border:
                          cid === FACTORY_CANISTER_ID
                            ? "1px solid rgba(34,197,94,0.18)"
                            : "1px solid rgba(255,255,255,0.10)",
                        color:
                          cid === FACTORY_CANISTER_ID
                            ? "rgba(34,197,94,0.80)"
                            : undefined,
                      }}
                    >
                      {cid}
                    </p>
                  </div>

                  {/* Phase indicator — shown on first/active card only */}
                  {i === 0 && (
                    <div
                      className="rounded-2xl p-4"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.10)",
                      }}
                    >
                      <PhaseIndicator phase={phase} mintCount={mintCount} />
                    </div>
                  )}

                  {/* Premium phase — top-up CTA (first card only) */}
                  {i === 0 && phase === CollectionPhase.Premium && (
                    <button
                      type="button"
                      data-ocid="mycollection.topup_button"
                      onClick={() => setShowPaymentModal(true)}
                      className="relative overflow-hidden w-full rounded-2xl py-3.5 font-display font-bold text-sm uppercase tracking-widest text-white transition-all duration-200 hover:scale-[1.02]"
                      style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
                    >
                      <span
                        className="absolute inset-0 rounded-2xl"
                        aria-hidden="true"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(251,191,36,0.85), rgba(245,158,11,0.75))",
                        }}
                      />
                      <span className="relative z-[1] flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Dobiť zbierku
                      </span>
                    </button>
                  )}

                  {/* Delete Collection button — always visible so users can clean up any entry */}
                  <button
                    type="button"
                    data-ocid={`mycollection.delete_button.${i + 1}`}
                    disabled={deletingId === cid}
                    onClick={() => handleDeleteCollection(cid)}
                    className="w-full rounded-2xl py-3 font-semibold text-sm uppercase tracking-wider text-white transition-all duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                    style={{
                      background:
                        deletingId === cid
                          ? "rgba(185,28,28,0.50)"
                          : "rgba(220,38,38,0.20)",
                      border: "1px solid rgba(239,68,68,0.50)",
                      color:
                        deletingId === cid
                          ? "rgba(255,255,255,0.60)"
                          : "#fca5a5",
                    }}
                  >
                    {deletingId === cid ? (
                      <>
                        <div className="animate-spin h-3.5 w-3.5 border-2 border-red-300 border-t-transparent rounded-full" />
                        Mazanie...
                      </>
                    ) : (
                      "Vymazať zbierku"
                    )}
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Section 1b — Create new collection button (always available) */}
        {!isPageLoading && !collectionError && (
          <div className="flex justify-end">
            <button
              type="button"
              data-ocid="mycollection.create_collection_button"
              onClick={handleCreateCollection}
              className="text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-[1.02]"
              style={{
                background: "rgba(139,92,246,0.15)",
                border: "1px solid rgba(139,92,246,0.30)",
                color: "rgba(167,139,250,0.90)",
              }}
            >
              + Vytvoriť novú zbierku
            </button>
          </div>
        )}

        {/* Section 2 — Mint form (always available, Factory is the default collection) */}
        {!isPageLoading && !collectionError && (
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
