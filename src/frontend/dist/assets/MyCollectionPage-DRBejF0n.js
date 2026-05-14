import { H as useBackend, f as useInternetIdentity, r as reactExports, J as CollectionPhase, j as jsxRuntimeExports, K as Layers, X, S as Sparkles } from "./index-CQ236Vkp.js";
import { L as Label, I as Input, T as Textarea } from "./textarea-uw_IfjNx.js";
import "./utils-DWi2mX0G.js";
function glassInput(hasError = false) {
  return {
    background: "rgba(255,255,255,0.08)",
    border: hasError ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(255,255,255,0.14)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)"
  };
}
function GlassCard({
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `rounded-3xl p-8 ${className}`,
      style: {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(var(--theme-color-1-rgb,255,255,255),0.15)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 4px 16px 0 rgba(0,0,0,0.25),0 1.5px 4px 0 rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.1)"
      },
      children
    }
  );
}
function GradientButton({
  children,
  disabled,
  onClick,
  type = "button",
  dataOcid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type,
      "data-ocid": dataOcid,
      disabled,
      onClick,
      className: "relative overflow-hidden w-full rounded-2xl py-4 min-h-[56px] font-display font-bold text-sm uppercase tracking-widest text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-40 disabled:scale-100",
      style: { boxShadow: "0 4px 16px rgba(0,0,0,0.2)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-btn-inner", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-[1] flex items-center justify-center gap-2", children })
      ]
    }
  );
}
const PHASE_CONFIG = {
  [CollectionPhase.free]: {
    limit: 10,
    label: "Fáza 1: 0–10 NFT zadarmo",
    color: "#22d3ee"
  },
  [CollectionPhase.bonus]: {
    limit: 25,
    label: "Fáza 2: 10–25 NFT (bonus cycles)",
    color: "#a78bfa"
  },
  [CollectionPhase.premium]: {
    limit: null,
    label: "Fáza 3: Prémiový umelec",
    color: "#fbbf24"
  }
};
function PhaseIndicator({
  phase,
  mintCount
}) {
  const cfg = PHASE_CONFIG[phase];
  const progress = cfg.limit ? Math.min(mintCount / cfg.limit, 1) : 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-xs font-semibold uppercase tracking-wider",
          style: { color: cfg.color },
          children: cfg.label
        }
      ),
      phase === CollectionPhase.premium ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
          style: {
            background: "rgba(251,191,36,0.15)",
            border: "1px solid rgba(251,191,36,0.4)",
            color: "#fbbf24"
          },
          children: "Premium"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono", children: [
        mintCount,
        "/",
        cfg.limit
      ] })
    ] }),
    cfg.limit && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-1.5 w-full overflow-hidden rounded-full",
        style: { background: "rgba(255,255,255,0.10)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-1.5 rounded-full transition-all duration-500",
            style: {
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${cfg.color}, rgba(255,255,255,0.6))`
            }
          }
        )
      }
    )
  ] });
}
function PaymentModal({ onClose }) {
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "dialog",
    {
      "data-ocid": "mycollection.payment_dialog",
      open: true,
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 m-0 max-w-none w-full h-full border-none bg-transparent",
      "aria-labelledby": "payment-modal-title",
      style: {
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative w-full max-w-md rounded-3xl p-8 space-y-5",
          style: {
            background: "rgba(18,10,40,0.96)",
            border: "1px solid rgba(var(--theme-color-1-rgb,255,255,255),0.20)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "mycollection.payment_modal.close_button",
                onClick: onClose,
                "aria-label": "Zavrieť",
                className: "absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200",
                style: {
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-white" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                  style: {
                    background: "rgba(251,191,36,0.15)",
                    border: "1px solid rgba(251,191,36,0.3)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5", style: { color: "#fbbf24" } })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  id: "payment-modal-title",
                  className: "font-display font-bold text-xl text-foreground",
                  children: "Limit dosiahnutý"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
              "Dosiahol si limit",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: "25 NFT" }),
              ". Pre ďalšiu tvorbu prosím vlož ICP."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-2xl p-4 space-y-2",
                style: {
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3", children: "Ako sa rozdeľujú prostriedky" }),
                  [
                    { pct: "70%", desc: "Cycles pre tvoju zbierku", color: "#22d3ee" },
                    {
                      pct: "20%",
                      desc: "Komunitný fond pre nových umelcov",
                      color: "#a78bfa"
                    },
                    {
                      pct: "10%",
                      desc: "Rozvoj platformy Neferty Space",
                      color: "#fbbf24"
                    }
                  ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-sm font-bold font-mono min-w-[40px]",
                        style: { color: item.color },
                        children: item.pct
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: item.desc })
                  ] }, item.pct))
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "mycollection.payment_modal.confirm_button",
                onClick: onClose,
                className: "relative overflow-hidden w-full rounded-2xl py-4 font-display font-bold text-sm uppercase tracking-widest text-white transition-all duration-200 hover:scale-[1.02]",
                style: { boxShadow: "0 4px 16px rgba(0,0,0,0.2)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-btn-inner", "aria-hidden": "true" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-[1]", children: "Rozumiem" })
                ]
              }
            )
          ]
        }
      )
    }
  );
}
function MyCollectionPage() {
  const { actor, isLoading: backendLoading } = useBackend();
  const { identity } = useInternetIdentity();
  const [collectionId, setCollectionId] = reactExports.useState(null);
  const [phase, setPhase] = reactExports.useState(CollectionPhase.free);
  const [mintCount, setMintCount] = reactExports.useState(0);
  const [loadingCollection, setLoadingCollection] = reactExports.useState(true);
  const [collectionError, setCollectionError] = reactExports.useState(null);
  const [creating, setCreating] = reactExports.useState(false);
  const [mintName, setMintName] = reactExports.useState("");
  const [mintDesc, setMintDesc] = reactExports.useState("");
  const [mintFile, setMintFile] = reactExports.useState(null);
  const [mintPreview, setMintPreview] = reactExports.useState(null);
  const [minting, setMinting] = reactExports.useState(false);
  const [mintError, setMintError] = reactExports.useState(null);
  const [mintSuccess, setMintSuccess] = reactExports.useState(false);
  const [mintFormErrors, setMintFormErrors] = reactExports.useState({});
  const [showPaymentModal, setShowPaymentModal] = reactExports.useState(false);
  const [dragOver, setDragOver] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  const principal = (identity == null ? void 0 : identity.getPrincipal()) ?? null;
  reactExports.useEffect(() => {
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
            actor.getMyMintCount(principal)
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
            e instanceof Error ? e.message : "Nepodarilo sa načítať zbierku."
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
      if (principal) {
        const cid = await actor.getMyCollection(principal);
        if (cid) {
          setCollectionId(cid.toString());
          const [ph, mc] = await Promise.all([
            actor.getCollectionPhase(principal),
            actor.getMyMintCount(principal)
          ]);
          setPhase(ph);
          setMintCount(Number(mc));
        }
      }
    } catch (e) {
      setCollectionError(
        e instanceof Error ? e.message : "Nepodarilo sa vytvoriť zbierku."
      );
    } finally {
      setCreating(false);
    }
  };
  const handleFileChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setMintFile(file);
    setMintPreview(URL.createObjectURL(file));
    setMintFormErrors((p) => ({ ...p, image: void 0 }));
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setMintFile(file);
    setMintPreview(URL.createObjectURL(file));
    setMintFormErrors((p) => ({ ...p, image: void 0 }));
  };
  const handleMintSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
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
        true
      );
      if (result.__kind__ === "paymentRequired") {
        setShowPaymentModal(true);
        return;
      }
      if (result.__kind__ === "err") {
        setMintError(result.err);
        return;
      }
      setMintSuccess(true);
      setMintName("");
      setMintDesc("");
      setMintFile(null);
      setMintPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      if (principal) {
        const [ph, mc] = await Promise.all([
          actor.getCollectionPhase(principal),
          actor.getMyMintCount(principal)
        ]);
        setPhase(ph);
        setMintCount(Number(mc));
      }
      setTimeout(() => setMintSuccess(false), 3500);
    } catch (err) {
      setMintError(
        err instanceof Error ? err.message : "Razenie sa nepodarilo."
      );
    } finally {
      setMinting(false);
    }
  };
  const isPageLoading = backendLoading || loadingCollection;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    showPaymentModal && /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentModal, { onClose: () => setShowPaymentModal(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
            style: {
              background: "rgba(var(--theme-color-1-rgb,180,80,220),0.15)",
              border: "1px solid rgba(var(--theme-color-1-rgb,180,80,220),0.30)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Layers,
              {
                className: "w-6 h-6",
                style: { color: "rgb(var(--theme-color-1-rgb,180,80,220))" }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight gradient-text", children: "Moja Zbierka" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Správa tvojej osobnej NFT zbierky na blockchaine ICP" })
        ] })
      ] }),
      isPageLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "mycollection.loading_state", className: "space-y-4", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-32 rounded-3xl animate-pulse",
          style: { background: "rgba(255,255,255,0.05)" }
        },
        i
      )) }),
      !isPageLoading && collectionError && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "mycollection.error_state",
          className: "rounded-2xl px-5 py-4 text-sm text-red-300",
          style: {
            background: "rgba(239,68,68,0.10)",
            border: "1px solid rgba(239,68,68,0.30)"
          },
          "aria-live": "polite",
          children: collectionError
        }
      ),
      !isPageLoading && !collectionError && collectionId === null && /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center gap-6 py-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-20 h-20 rounded-3xl flex items-center justify-center",
            style: {
              background: "rgba(var(--theme-color-1-rgb,180,80,220),0.12)",
              border: "1px solid rgba(var(--theme-color-1-rgb,180,80,220),0.25)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Layers,
              {
                className: "w-9 h-9",
                style: { color: "rgb(var(--theme-color-1-rgb,180,80,220))" }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Ešte nemáš vlastnú zbierku" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm", children: "Vytvor si svoju vlastnú zbierku NFT na blockchaine ICP. Prvých 10 NFT je zadarmo." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          GradientButton,
          {
            dataOcid: "mycollection.create_collection_button",
            onClick: handleCreateCollection,
            disabled: creating,
            children: creating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" }),
              "Vytváranie..."
            ] }) : "Vytvoriť zbierku"
          }
        )
      ] }) }),
      !isPageLoading && !collectionError && collectionId !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground", children: "Tvoja zbierka" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex-shrink-0",
              style: {
                background: "rgba(34,211,238,0.12)",
                border: "1px solid rgba(34,211,238,0.30)",
                color: "#22d3ee"
              },
              children: "Aktívna"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground", children: "Canister ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "font-mono text-xs break-all px-3 py-2 rounded-xl",
              style: {
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)"
              },
              children: collectionId
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-2xl p-4",
            style: {
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.10)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(PhaseIndicator, { phase, mintCount })
          }
        )
      ] }) }),
      !isPageLoading && !collectionError && collectionId !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground mb-6", children: "Vyraziť NFT do zbierky" }),
        mintSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "mycollection.mint.success_state",
            className: "mb-5 rounded-2xl px-4 py-3 text-sm font-medium flex items-center gap-2",
            style: {
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.30)",
              color: "#86efac"
            },
            "aria-live": "polite",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✓" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "NFT úspešne vyrazené do zbierky!" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleMintSubmit, className: "space-y-5", noValidate: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold uppercase tracking-[0.12em] text-white/50", children: "Obrázok NFT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "mycollection.mint.dropzone",
                "aria-label": "Vyberte obrázok",
                className: "mt-1.5 w-full rounded-2xl transition-smooth cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring text-left",
                style: {
                  background: dragOver ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                  border: mintFormErrors.image ? "1.5px dashed rgba(239,68,68,0.6)" : dragOver ? "1.5px dashed rgba(255,255,255,0.45)" : "1.5px dashed rgba(255,255,255,0.18)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)"
                },
                onClick: () => {
                  var _a;
                  return (_a = fileRef.current) == null ? void 0 : _a.click();
                },
                onKeyDown: (e) => {
                  var _a;
                  return e.key === "Enter" && ((_a = fileRef.current) == null ? void 0 : _a.click());
                },
                onDrop: handleDrop,
                onDragOver: (e) => {
                  e.preventDefault();
                  setDragOver(true);
                },
                onDragLeave: () => setDragOver(false),
                children: mintPreview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video overflow-hidden rounded-2xl", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: mintPreview,
                      alt: "Náhľad",
                      className: "w-full h-full object-contain bg-muted"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Odstrániť obrázok",
                      onClick: (e) => {
                        e.stopPropagation();
                        setMintFile(null);
                        setMintPreview(null);
                        if (fileRef.current) fileRef.current.value = "";
                      },
                      className: "absolute top-2 right-2 glass-card rounded-xl text-xs px-3 py-1.5 font-semibold uppercase hover:bg-white/10 transition-smooth text-foreground",
                      children: "Odstrániť"
                    }
                  )
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-10 px-4 gap-3 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl glass-card flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      className: "w-5 h-5 text-muted-foreground",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      strokeWidth: 1.5,
                      "aria-hidden": "true",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          d: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        }
                      )
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: "Nahrať obrázok" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "alebo pretáhnite súbor sem" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60", children: "PNG, JPG, GIF, WEBP" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: fileRef,
                type: "file",
                accept: "image/*",
                onChange: handleFileChange,
                className: "hidden"
              }
            ),
            mintFormErrors.image && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                "data-ocid": "mycollection.mint.image.field_error",
                className: "text-xs text-destructive mt-1",
                children: mintFormErrors.image
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "col-mint-name",
                className: "text-xs font-semibold uppercase tracking-[0.12em] text-white/50",
                children: "Názov NFT"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "col-mint-name",
                "data-ocid": "mycollection.mint.name_input",
                value: mintName,
                onChange: (e) => {
                  setMintName(e.target.value);
                  if (e.target.value.trim())
                    setMintFormErrors((p) => ({ ...p, name: void 0 }));
                },
                onBlur: () => {
                  if (!mintName.trim())
                    setMintFormErrors((p) => ({
                      ...p,
                      name: "Zadajte názov NFT."
                    }));
                },
                placeholder: "napr. Môj prvý NFT",
                className: "mt-1.5 rounded-2xl text-sm text-white/90 placeholder:text-white/30 border-0 outline-none focus-visible:ring-1 focus-visible:ring-white/30",
                style: glassInput(!!mintFormErrors.name)
              }
            ),
            mintFormErrors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                "data-ocid": "mycollection.mint.name.field_error",
                className: "text-xs text-destructive mt-1",
                children: mintFormErrors.name
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "col-mint-desc",
                className: "text-xs font-semibold uppercase tracking-[0.12em] text-white/50",
                children: [
                  "Popis",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal normal-case tracking-normal text-white/30", children: "(voliteľný)" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "col-mint-desc",
                "data-ocid": "mycollection.mint.description_input",
                value: mintDesc,
                onChange: (e) => setMintDesc(e.target.value),
                placeholder: "Stručný popis vášho NFT...",
                rows: 3,
                className: "mt-1.5 rounded-2xl text-sm resize-none text-white/90 placeholder:text-white/30 border-0 focus-visible:ring-1 focus-visible:ring-white/30",
                style: glassInput()
              }
            )
          ] }),
          mintError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "mycollection.mint.error_state",
              className: "rounded-2xl px-4 py-3 text-sm font-medium text-red-300",
              style: {
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.35)"
              },
              "aria-live": "polite",
              children: mintError
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GradientButton,
            {
              type: "submit",
              disabled: minting,
              dataOcid: "mycollection.mint.submit_button",
              children: minting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" }),
                "Razenie..."
              ] }) : "Vyraziť do zbierky"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  MyCollectionPage as default
};
