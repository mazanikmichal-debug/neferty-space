import { f as useInternetIdentity, j as jsxRuntimeExports, r as reactExports, V as Variant_Mint_Transfer, g as useNavigate, P as Principal } from "./index-CQ236Vkp.js";
import { C as Clock, I as ImageLightbox, u as useAddressHistory } from "./useAddressHistory-DkyiQF1t.js";
import { c as useGetMyNFTs, n as nftImageUrl, d as useMintNFT } from "./nftImage-Bq6LRRLt.js";
import { L as Label, I as Input, T as Textarea } from "./textarea-uw_IfjNx.js";
import "./utils-DWi2mX0G.js";
function getSentStatus(nft, callerPrincipal) {
  const history = nft.history ?? [];
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl overflow-hidden animate-pulse",
      style: {
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-44 w-full",
            style: { background: "rgba(255,255,255,0.07)" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-3 w-2/3 rounded-full",
              style: { background: "rgba(255,255,255,0.08)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-2.5 w-full rounded-full",
              style: { background: "rgba(255,255,255,0.05)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-2.5 w-3/4 rounded-full",
              style: { background: "rgba(255,255,255,0.05)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-5 w-24 rounded-full mt-1",
              style: { background: "rgba(255,255,255,0.06)" }
            }
          )
        ] })
      ]
    }
  );
}
function HistoryEntryCard({
  nft,
  index,
  callerPrincipal
}) {
  const [lightboxOpen, setLightboxOpen] = reactExports.useState(false);
  const status = getSentStatus(nft, callerPrincipal);
  const isSent = status === "sent";
  const imageUrl = nftImageUrl(nft.image);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": `history.item.${index}`,
        className: "rounded-xl overflow-hidden flex flex-col group transition-smooth",
        style: {
          background: "rgba(255,255,255,0.055)",
          border: "1px solid rgba(var(--theme-color-1-rgb,255,255,255),0.13)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 4px 18px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)",
          transition: "background 0.3s cubic-bezier(0.4,0,0.2,1), border-color 0.3s cubic-bezier(0.4,0,0.2,1)"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.09)";
          e.currentTarget.style.borderColor = "rgba(var(--theme-color-1-rgb,255,255,255),0.25)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.055)";
          e.currentTarget.style.borderColor = "rgba(var(--theme-color-1-rgb,255,255,255),0.13)";
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "relative overflow-hidden cursor-zoom-in w-full p-0 border-0 bg-transparent",
              style: { height: "172px", display: "block" },
              onClick: () => setLightboxOpen(true),
              "aria-label": `Zobraziť ${nft.name} na celú obrazovku`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: imageUrl,
                    alt: nft.name,
                    loading: "lazy",
                    className: "w-full h-full object-cover",
                    style: {
                      transition: "transform 300ms cubic-bezier(0.4,0,0.2,1)"
                    },
                    onMouseEnter: (e) => {
                      e.currentTarget.style.transform = "scale(1.25)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute inset-x-0 bottom-0 h-8 pointer-events-none",
                    style: {
                      background: "linear-gradient(to top,rgba(8,5,24,0.55),transparent)"
                    },
                    "aria-hidden": "true"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pt-2.5 pb-3 flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-display font-bold text-sm text-foreground truncate",
                title: nft.name,
                children: nft.name
              }
            ),
            nft.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-snug", children: nft.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", children: isSent ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full",
                style: {
                  background: "linear-gradient(135deg,rgba(var(--theme-color-2-rgb,230,100,180),0.18),rgba(var(--theme-color-1-rgb,180,80,220),0.12))",
                  border: "1px solid rgba(var(--theme-color-2-rgb,230,100,180),0.35)",
                  color: "rgba(var(--theme-color-2-rgb,230,100,180),0.95)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "↗" }),
                  "Odoslané inam"
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full",
                style: {
                  background: "linear-gradient(135deg,rgba(74,222,128,0.15),rgba(34,197,94,0.08))",
                  border: "1px solid rgba(74,222,128,0.35)",
                  color: "rgba(134,239,172,0.95)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "✦" }),
                  "Vymintované sem"
                ]
              }
            ) })
          ] })
        ]
      }
    ),
    lightboxOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ImageLightbox,
      {
        src: imageUrl,
        alt: nft.name,
        onClose: () => setLightboxOpen(false)
      }
    )
  ] });
}
function MintHistoryPanel() {
  const { identity } = useInternetIdentity();
  const callerPrincipal = (identity == null ? void 0 : identity.getPrincipal().toString()) ?? "";
  const { data: nfts, isLoading, isError, error } = useGetMyNFTs();
  const sorted = nfts ? [...nfts].sort((a, b) => {
    const aMs = Number(a.createdAt / 1000000n);
    const bMs = Number(b.createdAt / 1000000n);
    return bMs - aMs;
  }) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "mint.history_panel",
      className: "flex flex-col rounded-2xl overflow-hidden",
      style: {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(var(--theme-color-1-rgb,255,255,255),0.12)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow: "0 6px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.07)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2.5 px-4 py-3.5 shrink-0",
            style: {
              background: "rgba(255,255,255,0.04)",
              borderBottom: "1px solid rgba(var(--theme-color-1-rgb,255,255,255),0.10)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Clock,
                {
                  className: "w-4 h-4 shrink-0",
                  style: { color: "rgba(var(--theme-color-1-rgb,180,80,220),0.85)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-sm tracking-wide gradient-text", children: "História razenia" }),
              !isLoading && sorted.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full",
                  style: {
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.55)"
                  },
                  children: sorted.length
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "mint.history_list",
            className: "flex flex-col gap-3 p-3 overflow-y-auto",
            style: {
              height: "calc(100vh - 12rem)",
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            },
            children: [
              isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": "mint.history_loading_state",
                  className: "flex flex-col gap-3",
                  children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, i))
                }
              ),
              isError && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "mint.history_error_state",
                  className: "flex flex-col items-center justify-center gap-3 py-12 text-center px-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl",
                        style: {
                          background: "rgba(239,68,68,0.12)",
                          border: "1px solid rgba(239,68,68,0.25)"
                        },
                        "aria-hidden": "true",
                        children: "⚠"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: (error == null ? void 0 : error.message) ?? "Chyba pri načítaní" })
                  ]
                }
              ),
              !isLoading && !isError && sorted.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "mint.history_empty_state",
                  className: "flex flex-col items-center justify-center gap-3 py-16 text-center px-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl",
                        style: {
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.10)"
                        },
                        "aria-hidden": "true",
                        children: "⬡"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Zatiaľ žiadne razenia" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground/60", children: "Vyrazené NFT sa tu objavia automaticky" })
                  ]
                }
              ),
              !isLoading && !isError && sorted.map((nft, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                HistoryEntryCard,
                {
                  nft,
                  index: idx + 1,
                  callerPrincipal
                },
                nft.tokenId.toString()
              ))
            ]
          }
        )
      ]
    }
  );
}
function MintPage() {
  const navigate = useNavigate();
  const mintMutation = useMintNFT();
  const fileRef = reactExports.useRef(null);
  const [imageFile, setImageFile] = reactExports.useState(null);
  const [imagePreview, setImagePreview] = reactExports.useState(null);
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [recipientId, setRecipientId] = reactExports.useState("");
  const [phase, setPhase] = reactExports.useState("idle");
  const [errors, setErrors] = reactExports.useState({});
  const [dragOver, setDragOver] = reactExports.useState(false);
  const [isPublic, setIsPublic] = reactExports.useState(true);
  const [showSuccess, setShowSuccess] = reactExports.useState(false);
  const [recipientFocused, setRecipientFocused] = reactExports.useState(false);
  const { addresses: savedAddresses, saveAddress } = useAddressHistory();
  const filteredSuggestions = savedAddresses.filter(
    (a) => recipientId.trim() ? a.toLowerCase().includes(recipientId.trim().toLowerCase()) : true
  ).slice(0, 5);
  function truncateMid(addr, keep = 10) {
    if (addr.length <= keep * 2 + 3) return addr;
    return `${addr.slice(0, keep)}…${addr.slice(-6)}`;
  }
  const handleFileChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: void 0 }));
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: void 0 }));
  };
  const validateRecipient = (val) => {
    if (!val.trim()) return void 0;
    try {
      Principal.fromText(val.trim());
      return void 0;
    } catch {
      return "Neplatné Principal ID.";
    }
  };
  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Zadajte názov NFT.";
    if (!imageFile) errs.image = "Vyberte obrázok.";
    const recipientErr = validateRecipient(recipientId);
    if (recipientErr) errs.recipient = recipientErr;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !imageFile) return;
    setErrors((prev) => ({ ...prev, submit: void 0 }));
    setPhase("minting");
    try {
      const _tokenId = await mintMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        imageFile,
        recipientId: recipientId.trim() || void 0,
        isPublic
      });
      if (recipientId.trim()) saveAddress(recipientId.trim());
      setShowSuccess(true);
    } catch (err) {
      console.error("[MintPage] mintNFT failed:", err);
      const msg = err instanceof Error ? err.message : "Razenie sa nepodarilo. Skúste znova.";
      setErrors((prev) => ({ ...prev, submit: msg }));
      setPhase("error");
      setTimeout(() => {
        setPhase("idle");
      }, 1500);
    }
  };
  reactExports.useEffect(() => {
    if (!showSuccess) return;
    const t = setTimeout(() => navigate({ to: "/" }), 2500);
    return () => clearTimeout(t);
  }, [showSuccess, navigate]);
  const isBusy = mintMutation.isPending;
  const showProgress = phase === "minting" || phase === "error";
  const phaseLabel = phase === "minting" ? "Razenie..." : phase === "error" ? "Chyba" : "Vyraziť NFT";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    showSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "mint.success_state",
        className: "fixed inset-0 z-50 flex items-center justify-center",
        style: {
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          background: "rgba(8,5,24,0.72)"
        },
        "aria-live": "assertive",
        "aria-label": "NFT vyrazené",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center gap-6 rounded-3xl px-14 py-12",
            style: {
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(var(--theme-color-1-rgb,255,255,255),0.18)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 8px 40px 0 rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  viewBox: "0 0 80 80",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "w-24 h-24",
                  "aria-hidden": "true",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "linearGradient",
                      {
                        id: "ck-grad",
                        x1: "0%",
                        y1: "0%",
                        x2: "100%",
                        y2: "100%",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "stop",
                            {
                              offset: "0%",
                              stopColor: "rgb(var(--theme-color-1-rgb,180,80,220))"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "stop",
                            {
                              offset: "50%",
                              stopColor: "rgb(var(--theme-color-2-rgb,230,100,180))"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "stop",
                            {
                              offset: "100%",
                              stopColor: "rgb(var(--theme-color-3-rgb,255,180,60))"
                            }
                          )
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "circle",
                      {
                        cx: "40",
                        cy: "40",
                        r: "36",
                        stroke: "url(#ck-grad)",
                        strokeWidth: "3",
                        fill: "none",
                        strokeDasharray: "226",
                        strokeDashoffset: "226",
                        style: {
                          animation: "mint-circle 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) forwards"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "polyline",
                      {
                        points: "22,42 35,55 58,30",
                        stroke: "url(#ck-grad)",
                        strokeWidth: "4",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        fill: "none",
                        strokeDasharray: "55",
                        strokeDashoffset: "55",
                        style: {
                          animation: "mint-check 0.4s 0.55s cubic-bezier(0.4,0,0.2,1) forwards"
                        }
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-display font-bold text-2xl tracking-widest uppercase gradient-text",
                  style: { animation: "mint-fade 0.4s 0.85s both" },
                  children: "Vyrazené!"
                }
              )
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl", "aria-hidden": "true", children: "⧁" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight gradient-text", children: "Raziť NFT" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-6 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full lg:max-w-[448px] shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-3xl p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", noValidate: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold uppercase tracking-[0.12em] text-white/50", children: "Vyberte obrázok" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "mint.dropzone",
                tabIndex: 0,
                "aria-label": "Vyberte obrázok",
                className: `mt-1.5 w-full rounded-2xl transition-smooth cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring text-left ${dragOver ? "bg-white/[0.08]" : errors.image ? "" : ""}`,
                style: {
                  background: dragOver ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                  border: errors.image ? "1.5px dashed rgba(239,68,68,0.6)" : dragOver ? "1.5px dashed rgba(255,255,255,0.45)" : "1.5px dashed rgba(255,255,255,0.18)",
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
                children: imagePreview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video overflow-hidden", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: imagePreview,
                      alt: "Náhľad obrázka",
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
                        setImageFile(null);
                        setImagePreview(null);
                        if (fileRef.current) fileRef.current.value = "";
                      },
                      className: "absolute top-2 right-2 glass-card rounded-xl text-xs px-3 py-1.5 font-semibold uppercase hover:bg-white/10 transition-smooth text-foreground",
                      children: "Odstrániť"
                    }
                  )
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4 gap-3 text-center", children: [
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
                "data-ocid": "mint.upload_button",
                type: "file",
                accept: "image/*",
                onChange: handleFileChange,
                className: "hidden"
              }
            ),
            errors.image && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                "data-ocid": "mint.image.field_error",
                className: "text-xs text-destructive mt-1",
                children: errors.image
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "nft-name",
                className: "text-xs font-semibold uppercase tracking-[0.12em] text-white/50",
                children: "Názov NFT"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "nft-name",
                "data-ocid": "mint.name_input",
                value: name,
                onChange: (e) => {
                  setName(e.target.value);
                  if (e.target.value.trim())
                    setErrors((p) => ({ ...p, name: void 0 }));
                },
                onBlur: () => {
                  if (!name.trim())
                    setErrors((p) => ({
                      ...p,
                      name: "Zadajte názov NFT."
                    }));
                },
                placeholder: "napr. Môj prvý NFT",
                className: `mt-1.5 rounded-2xl text-sm text-white/90 placeholder:text-white/30 border-0 outline-none focus-visible:ring-1 ${errors.name ? "ring-1 ring-destructive" : "focus-visible:ring-white/30"}`,
                style: {
                  background: "rgba(255,255,255,0.08)",
                  border: errors.name ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(255,255,255,0.14)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)"
                }
              }
            ),
            errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                "data-ocid": "mint.name.field_error",
                className: "text-xs text-destructive mt-1",
                children: errors.name
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "nft-recipient",
                className: "text-xs font-semibold uppercase tracking-[0.12em] text-white/50",
                children: [
                  "Príjemca",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal normal-case tracking-normal text-white/30", children: "(voliteľné)" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "nft-recipient",
                  "data-ocid": "mint.recipient_input",
                  value: recipientId,
                  onChange: (e) => {
                    setRecipientId(e.target.value);
                    if (!e.target.value.trim())
                      setErrors((p) => ({ ...p, recipient: void 0 }));
                    else {
                      const err = validateRecipient(e.target.value);
                      if (!err)
                        setErrors((p) => ({ ...p, recipient: void 0 }));
                    }
                  },
                  onFocus: () => setRecipientFocused(true),
                  onBlur: () => {
                    setTimeout(() => setRecipientFocused(false), 150);
                    const err = validateRecipient(recipientId);
                    setErrors((p) => ({ ...p, recipient: err }));
                  },
                  placeholder: "aaaaa-bbbbb-...-cai alebo principal ID",
                  className: `rounded-2xl text-sm text-white/90 placeholder:text-white/30 border-0 outline-none focus-visible:ring-1 ${errors.recipient ? "ring-1 ring-destructive" : "focus-visible:ring-white/30"}`,
                  style: {
                    background: "rgba(255,255,255,0.08)",
                    border: errors.recipient ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(255,255,255,0.14)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)"
                  }
                }
              ),
              recipientFocused && filteredSuggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "mint.recipient_suggestions",
                  "aria-label": "Nedávne adresy",
                  className: "absolute z-30 left-0 right-0 top-full mt-1 rounded-2xl overflow-hidden flex flex-col",
                  style: {
                    background: "rgba(18,12,40,0.92)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.55)",
                    animation: "mint-fade 0.15s both"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 pt-2 pb-1 text-[9px] font-semibold uppercase tracking-widest text-white/30", children: "Nedávne adresy" }),
                    filteredSuggestions.map((addr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setRecipientId(addr);
                          setErrors((p) => ({
                            ...p,
                            recipient: void 0
                          }));
                          setRecipientFocused(false);
                        },
                        className: "flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-white/[0.07] transition-colors group",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "svg",
                            {
                              className: "w-3 h-3 text-white/30 shrink-0 group-hover:text-white/60 transition-colors",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              strokeWidth: "2",
                              "aria-hidden": "true",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "12 6 12 12 16 14" })
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] text-white/70 group-hover:text-white/95 transition-colors truncate", children: truncateMid(addr) })
                        ]
                      },
                      addr
                    ))
                  ]
                }
              )
            ] }),
            errors.recipient && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                "data-ocid": "mint.recipient.field_error",
                className: "text-xs text-destructive mt-1",
                children: errors.recipient
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "nft-desc",
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
                id: "nft-desc",
                "data-ocid": "mint.description_input",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                placeholder: "Stručný popis vášho NFT...",
                rows: 3,
                className: "mt-1.5 rounded-2xl text-sm resize-none text-white/90 placeholder:text-white/30 border-0 focus-visible:ring-1 focus-visible:ring-white/30",
                style: {
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)"
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.12em] text-white/50", children: "Viditeľnosť" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/30 mt-0.5", children: isPublic ? "Zobrazí sa v sekcii Hodnotenie" : "Vidí len vlastník" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "mint.visibility_toggle",
                role: "switch",
                "aria-checked": isPublic,
                "aria-label": "Verejné alebo súkromné NFT",
                onClick: () => setIsPublic((v) => !v),
                className: "relative flex-shrink-0 rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring outline-none",
                style: {
                  width: 52,
                  height: 28,
                  background: isPublic ? "linear-gradient(90deg, rgb(var(--theme-color-1-rgb,180,80,220)), rgb(var(--theme-color-2-rgb,230,100,180)))" : "rgba(255,255,255,0.12)",
                  border: isPublic ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.14)",
                  boxShadow: isPublic ? "0 0 12px 2px rgba(var(--theme-color-1-rgb,180,80,220),0.35)" : "none"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "absolute top-[3px] rounded-full transition-all duration-200",
                    style: {
                      width: 20,
                      height: 20,
                      left: isPublic ? 28 : 4,
                      background: isPublic ? "#fff" : "rgba(255,255,255,0.45)",
                      boxShadow: isPublic ? "0 1px 4px rgba(0,0,0,0.35)" : "none"
                    },
                    "aria-hidden": "true"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs font-semibold min-w-[60px] text-right",
                style: {
                  color: isPublic ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)"
                },
                children: isPublic ? "Verejné" : "Súkromné"
              }
            )
          ] }),
          showProgress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "mint.loading_state", className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: phase === "minting" ? "Razenie na blockchain..." : "Chyba — skúste znova" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-1 w-full overflow-hidden rounded-full",
                style: { background: "rgba(255,255,255,0.10)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-1 transition-all duration-300 rounded-full",
                    style: {
                      width: "100%",
                      background: phase === "error" ? "rgba(239,68,68,0.8)" : "linear-gradient(90deg, rgb(var(--theme-color-1-rgb,180,80,220)), rgb(var(--theme-color-2-rgb,230,100,180)), rgb(var(--theme-color-3-rgb,255,180,60)))"
                    }
                  }
                )
              }
            )
          ] }),
          errors.submit && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "mint.error_state",
              className: "rounded-2xl px-4 py-3 text-sm font-medium text-red-300",
              style: {
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.35)"
              },
              "aria-live": "polite",
              children: errors.submit
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "submit",
              "data-ocid": "mint.submit_button",
              disabled: isBusy,
              className: "relative overflow-hidden w-full rounded-2xl py-5 min-h-[60px] font-display font-bold text-base uppercase tracking-widest text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-40 disabled:scale-100",
              style: {
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-btn-inner", "aria-hidden": "true" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-[1] flex items-center justify-center gap-2", children: isBusy ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full",
                      "aria-hidden": "true"
                    }
                  ),
                  phaseLabel
                ] }) : "Vyraziť NFT" })
              ]
            }
          )
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full lg:flex-1 lg:min-w-[300px] lg:sticky lg:top-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MintHistoryPanel, {}) })
      ] })
    ] })
  ] });
}
export {
  MintPage as default
};
