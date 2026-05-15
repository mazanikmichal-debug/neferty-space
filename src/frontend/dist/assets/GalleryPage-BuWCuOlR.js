import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, C as Check, X, V as Variant_Mint_Transfer, P as Principal, h as Copy, i as copyToClipboard, k as useAuth, u as useTranslation } from "./index-Dzz2Xx7E.js";
import { u as useAddressHistory, C as Clock, I as ImageLightbox } from "./useAddressHistory-BogifUMq.js";
import { g as useTransferNFT, h as useSetNFTVisibility, i as useGetNFTHistory, j as useGetMyNFTs, u as useGetAllPublicNFTs } from "./useQueries-CRRcsVdq.js";
import { n as nftImageUrl } from "./utils-BsXaUsmB.js";
import { C as ChevronDown } from "./chevron-down-BNH9W-0P.js";
import { S as Skeleton } from "./skeleton-Dl3FbxI0.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "m21 3-7 7", key: "1l2asr" }],
  ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
  ["path", { d: "M9 21H3v-6", key: "wtvkvv" }]
];
const Maximize2 = createLucideIcon("maximize-2", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
      key: "18etb6"
    }
  ],
  ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }]
];
const Wallet = createLucideIcon("wallet", __iconNode);
const isValidPrincipal = (val) => {
  try {
    Principal.fromText(val.trim());
    return true;
  } catch {
    return false;
  }
};
function truncatePrincipal(p) {
  if (p.length <= 14) return p;
  return `${p.slice(0, 6)}…${p.slice(-4)}`;
}
function formatTimestamp(ts) {
  const ms = Number(ts / 1000000n);
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("sk-SK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function PrincipalChip({ value }) {
  const [copied, setCopied] = reactExports.useState(false);
  const handleCopy = async () => {
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 font-mono text-[10px] text-foreground/80", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: value, children: truncatePrincipal(value) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "aria-label": "Kopírovať",
        onClick: handleCopy,
        className: "p-0.5 rounded opacity-50 hover:opacity-100 transition-opacity",
        children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-2.5 h-2.5 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-2.5 h-2.5" })
      }
    )
  ] });
}
function NFTCard({ nft, index }) {
  const ownerShort = `${nft.owner.toString().slice(0, 6)}…${nft.owner.toString().slice(-4)}`;
  const transferMutation = useTransferNFT();
  const visibilityMutation = useSetNFTVisibility();
  const [panelOpen, setPanelOpen] = reactExports.useState(null);
  const [lightboxOpen, setLightboxOpen] = reactExports.useState(false);
  const [recipient, setRecipient] = reactExports.useState("");
  const [fieldError, setFieldError] = reactExports.useState("");
  const [succeeded, setSucceeded] = reactExports.useState(false);
  const [sendInputFocused, setSendInputFocused] = reactExports.useState(false);
  const { addresses: savedAddresses, saveAddress } = useAddressHistory();
  const filteredSuggestions = savedAddresses.filter(
    (a) => recipient.trim() ? a.toLowerCase().includes(recipient.trim().toLowerCase()) : true
  ).slice(0, 5);
  const truncateMid = (addr, keep = 8) => {
    if (addr.length <= keep * 2 + 3) return addr;
    return `${addr.slice(0, keep)}…${addr.slice(-5)}`;
  };
  const { data: history, isLoading: historyLoading } = useGetNFTHistory(
    panelOpen === "history" ? nft.tokenId : null
  );
  const displayHistory = panelOpen === "history" ? history && history.length > 0 ? history : nft.history ?? [] : [];
  const historyPanelRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (panelOpen !== "history") return;
    const handleKey = (e) => {
      if (e.key === "Escape") setPanelOpen(null);
    };
    const handleClick = (e) => {
      if (historyPanelRef.current && !historyPanelRef.current.contains(e.target)) {
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
  const handleSend = async (e) => {
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
        to: Principal.fromText(trimmed)
      });
      saveAddress(trimmed);
      setSucceeded(true);
      setTimeout(closePanel, 1800);
    } catch (err) {
      setFieldError(
        err instanceof Error ? err.message : "Prevod zlyhal. Skúste znova."
      );
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `nft.item.${index}`,
      className: "glass-card rounded-2xl overflow-hidden transition-smooth hover:scale-[1.01]",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-row items-stretch gap-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative shrink-0 group",
              style: { width: 88, height: 88 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `nft.image.${index}`,
                    "aria-label": `Zobraziť ${nft.name}`,
                    className: "w-full h-full p-0 border-0 bg-transparent cursor-zoom-in block overflow-hidden rounded-tl-2xl rounded-bl-2xl",
                    onClick: () => setLightboxOpen(true),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: nftImageUrl(nft.image),
                        alt: nft.name,
                        className: "w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.08]",
                        loading: "lazy"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `nft.visibility_toggle.${index}`,
                    "aria-label": nft.isPublic ? "Spraviť súkromné" : "Spraviť verejné",
                    onClick: (e) => {
                      e.stopPropagation();
                      visibilityMutation.mutate({
                        tokenId: nft.tokenId,
                        isPublic: !nft.isPublic
                      });
                    },
                    disabled: visibilityMutation.isPending,
                    className: "absolute top-1.5 left-1.5 z-10 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-30",
                    style: {
                      background: nft.isPublic ? "rgba(99,102,241,0.30)" : "rgba(234,179,8,0.26)",
                      border: nft.isPublic ? "1px solid rgba(99,102,241,0.50)" : "1px solid rgba(234,179,8,0.45)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)"
                    },
                    children: visibilityMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-2.5 h-2.5 border border-white/30 border-t-white rounded-full animate-spin" }) : nft.isPublic ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-2.5 h-2.5 text-indigo-300" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-2.5 h-2.5 text-yellow-300" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    "aria-hidden": "true",
                    className: "pointer-events-none absolute inset-0 flex items-end justify-end p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "flex items-center justify-center w-5 h-5 rounded-lg",
                        style: {
                          background: "rgba(0,0,0,0.52)",
                          backdropFilter: "blur(6px)",
                          WebkitBackdropFilter: "blur(6px)"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "w-2.5 h-2.5 text-white" })
                      }
                    )
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-between flex-1 min-w-0 px-3 py-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-1.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm text-foreground truncate leading-tight", children: nft.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-muted-foreground shrink-0 leading-tight mt-0.5", children: [
                "#",
                nft.tokenId.toString()
              ] })
            ] }),
            nft.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground line-clamp-1 mt-0.5", children: nft.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/70 shrink-0", children: "Vlastník" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-foreground/80 truncate", children: ownerShort })
            ] }),
            panelOpen === null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `nft.send_button.${index}`,
                  onClick: openSend,
                  className: "flex-1 relative overflow-hidden rounded-xl py-1.5 text-[10px] uppercase tracking-widest font-display font-bold text-white transition-all duration-200 hover:scale-[1.02]",
                  style: { boxShadow: "0 3px 12px rgba(0,0,0,0.22)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-btn-inner", "aria-hidden": "true" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative z-[1] flex items-center justify-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-2.5 h-2.5" }),
                      "Odoslať"
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `nft.history_button.${index}`,
                  onClick: () => setPanelOpen("history"),
                  "aria-label": "História transakcií",
                  className: "shrink-0 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-[9px] font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:text-foreground",
                  style: {
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-2.5 h-2.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-2 h-2" })
                  ]
                }
              )
            ] })
          ] })
        ] }),
        lightboxOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ImageLightbox,
          {
            src: nftImageUrl(nft.image),
            alt: nft.name,
            onClose: () => setLightboxOpen(false)
          }
        ),
        panelOpen === "send" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "form",
          {
            "data-ocid": `nft.send_panel.${index}`,
            onSubmit: handleSend,
            className: "mx-2.5 mb-2.5 rounded-xl p-3 flex flex-col gap-2.5",
            style: {
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.14)"
            },
            children: succeeded ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `nft.success_state.${index}`,
                className: "flex flex-col items-center gap-1.5 py-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-9 h-9 rounded-full flex items-center justify-center",
                      style: {
                        background: "linear-gradient(135deg,rgba(74,222,128,0.2),rgba(34,197,94,0.15))",
                        border: "1px solid rgba(74,222,128,0.4)"
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-green-400" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold text-green-400 text-center", children: "Odoslané!" })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Principal ID príjemcu" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `nft.close_button.${index}`,
                    onClick: closePanel,
                    "aria-label": "Zavrieť",
                    className: "p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    "data-ocid": `nft.send_input.${index}`,
                    type: "text",
                    value: recipient,
                    onChange: (e) => {
                      setRecipient(e.target.value);
                      setFieldError("");
                    },
                    onFocus: () => setSendInputFocused(true),
                    onBlur: () => {
                      setTimeout(() => setSendInputFocused(false), 150);
                      if (recipient.trim() && !isValidPrincipal(recipient)) {
                        setFieldError("Neplatná adresa príjemcu");
                      }
                    },
                    placeholder: "principal ID príjemcu",
                    className: "w-full bg-white/5 border border-white/20 text-foreground text-[11px] font-mono px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/60 transition-colors placeholder:text-muted-foreground/50"
                  }
                ),
                sendInputFocused && filteredSuggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": `nft.send_suggestions.${index}`,
                    "aria-label": "Nedávne adresy",
                    className: "absolute z-30 left-0 right-0 top-full mt-1 rounded-xl overflow-hidden flex flex-col",
                    style: {
                      background: "rgba(12,8,30,0.94)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                      animation: "mint-fade 0.12s both"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-2.5 pt-1.5 pb-0.5 text-[8px] font-semibold uppercase tracking-widest text-white/30", children: "Nedávne" }),
                      filteredSuggestions.map((addr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          "aria-selected": recipient === addr,
                          onClick: () => {
                            setRecipient(addr);
                            setFieldError("");
                            setSendInputFocused(false);
                          },
                          className: "flex items-center gap-2 px-2.5 py-2 text-left hover:bg-white/[0.07] transition-colors group",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "svg",
                              {
                                className: "w-2.5 h-2.5 text-white/30 shrink-0 group-hover:text-white/60 transition-colors",
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
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-white/65 group-hover:text-white/90 transition-colors truncate", children: truncateMid(addr) })
                          ]
                        },
                        addr
                      ))
                    ]
                  }
                )
              ] }),
              fieldError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  "data-ocid": `nft.field_error.${index}`,
                  className: "text-[10px] text-destructive leading-tight",
                  children: fieldError
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `nft.cancel_button.${index}`,
                    onClick: closePanel,
                    className: "flex-1 py-2 rounded-xl text-[11px] font-semibold text-muted-foreground border border-white/10 bg-white/5 hover:bg-white/10 transition-colors",
                    children: "Zrušiť"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "submit",
                    "data-ocid": `nft.submit_button.${index}`,
                    disabled: transferMutation.isPending || !recipient.trim(),
                    className: "flex-[2] relative overflow-hidden rounded-xl py-2 text-[11px] uppercase tracking-widest font-display font-bold text-white transition-all duration-200 hover:scale-[1.01] disabled:opacity-40 disabled:scale-100",
                    style: { boxShadow: "0 2px 10px rgba(0,0,0,0.20)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-btn-inner", "aria-hidden": "true" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-[1] flex items-center justify-center gap-1.5", children: transferMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          "data-ocid": `nft.loading_state.${index}`,
                          className: "inline-flex items-center gap-1.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
                            "Odosielam..."
                          ]
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3 h-3" }),
                        "Odoslať"
                      ] }) })
                    ]
                  }
                )
              ] })
            ] })
          }
        ),
        panelOpen === "history" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: historyPanelRef,
            "data-ocid": `nft.history_panel.${index}`,
            className: "mx-2.5 mb-2.5 rounded-xl p-3 flex flex-col gap-2",
            style: {
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.14)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-2.5 h-2.5" }),
                  "História"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `nft.history_close_button.${index}`,
                    onClick: closePanel,
                    "aria-label": "Zavrieť históriu",
                    className: "p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                  }
                )
              ] }),
              historyLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": `nft.history_loading.${index}`,
                  className: "flex items-center justify-center py-3",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" })
                }
              ),
              !historyLoading && displayHistory.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground text-center py-2", children: "Žiadna história" }),
              !historyLoading && displayHistory.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "relative flex flex-col gap-0", children: displayHistory.map((event, ei) => {
                const isMint = event.eventType === Variant_Mint_Transfer.Mint;
                const isLast = ei === displayHistory.length - 1;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    "data-ocid": `nft.history_event.${index}.${ei + 1}`,
                    className: "relative flex gap-2.5 pb-3",
                    children: [
                      !isLast && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          "aria-hidden": "true",
                          className: "absolute left-[7px] top-[16px] bottom-0 w-px",
                          style: {
                            background: "linear-gradient(to bottom,rgba(255,255,255,0.18),transparent)"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          "aria-hidden": "true",
                          className: "mt-0.5 shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center",
                          style: {
                            background: isMint ? "linear-gradient(135deg,rgba(168,85,247,0.4),rgba(99,102,241,0.3))" : "linear-gradient(135deg,rgba(234,179,8,0.35),rgba(249,115,22,0.25))",
                            border: isMint ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(234,179,8,0.45)"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0 flex-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "text-[10px] font-bold uppercase tracking-wider",
                            style: {
                              color: isMint ? "rgba(196,130,255,0.9)" : "rgba(250,200,60,0.9)"
                            },
                            children: isMint ? "Vyrazené" : "Odoslané"
                          }
                        ),
                        isMint ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "od:" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(PrincipalChip, { value: event.to.toString() })
                        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                          event.from && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "od:" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(PrincipalChip, { value: event.from.toString() })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "na:" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(PrincipalChip, { value: event.to.toString() })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground/60 mt-0.5", children: formatTimestamp(event.timestamp) })
                      ] })
                    ]
                  },
                  `${event.timestamp.toString()}-${ei}`
                );
              }) })
            ]
          }
        )
      ]
    }
  );
}
async function loadEnvConfig() {
  const res = await fetch("/env.json", { cache: "no-store" });
  if (res.redirected) {
    throw new Error("Konfigurácia chýba");
  }
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    throw new Error("Konfigurácia chýba");
  }
  if (!res.ok) {
    throw new Error("Konfigurácia chýba");
  }
  const raw = await res.json();
  const canisterId = raw.backend_canister_id && raw.backend_canister_id !== "undefined" ? raw.backend_canister_id : "";
  if (!canisterId) {
    throw new Error("Konfigurácia chýba");
  }
  return {
    backend_canister_id: canisterId,
    backend_host: raw.backend_host && raw.backend_host !== "undefined" ? raw.backend_host : void 0,
    storage_gateway_url: raw.storage_gateway_url && raw.storage_gateway_url !== "undefined" ? raw.storage_gateway_url : void 0,
    project_id: raw.project_id && raw.project_id !== "undefined" ? raw.project_id : void 0,
    ii_derivation_origin: raw.ii_derivation_origin && raw.ii_derivation_origin !== "undefined" ? raw.ii_derivation_origin : void 0
  };
}
function GalleryPage() {
  const {
    data: myNfts,
    isLoading: myLoading,
    isError: myError
  } = useGetMyNFTs();
  const { data: allPublicNfts, isLoading: othersLoading } = useGetAllPublicNFTs();
  const { principalText } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = reactExports.useState("collection");
  const [canisterId, setCanisterId] = reactExports.useState("");
  const [copiedCanister, setCopiedCanister] = reactExports.useState(false);
  const [copiedPrincipal, setCopiedPrincipal] = reactExports.useState(false);
  reactExports.useEffect(() => {
    loadEnvConfig().then((cfg) => setCanisterId(cfg.backend_canister_id ?? ""));
  }, []);
  const handleCopyCanister = async () => {
    const success = await copyToClipboard(canisterId);
    if (success) {
      setCopiedCanister(true);
      setTimeout(() => setCopiedCanister(false), 2e3);
    }
  };
  const handleCopyPrincipal = async () => {
    if (!principalText) return;
    const success = await copyToClipboard(principalText);
    if (success) {
      setCopiedPrincipal(true);
      setTimeout(() => setCopiedPrincipal(false), 2e3);
    }
  };
  const collectionNfts = (myNfts == null ? void 0 : myNfts.filter((nft) => !!nft.collectionName)) ?? [];
  const standaloneNfts = (myNfts == null ? void 0 : myNfts.filter((nft) => !nft.collectionName)) ?? [];
  const otherNfts = (allPublicNfts == null ? void 0 : allPublicNfts.filter((nft) => nft.owner.toText() !== principalText)) ?? [];
  const isLoading = activeTab === "others" ? othersLoading : myLoading;
  const isError = activeTab === "others" ? false : myError;
  const currentNfts = activeTab === "collection" ? collectionNfts : activeTab === "standalone" ? standaloneNfts : otherNfts;
  const tabs = [
    {
      id: "collection",
      label: t("tabs.myCollection"),
      count: collectionNfts.length
    },
    {
      id: "standalone",
      label: t("tabs.standalone"),
      count: standaloneNfts.length
    },
    { id: "others", label: t("tabs.others") }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-content space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl", "aria-hidden": "true", children: "▦" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight", children: t("messages.galleryTitle") })
    ] }),
    principalText && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "gallery.principal_card",
        className: "border-2 border-primary/30 bg-card rounded-3xl px-6 py-5",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1", children: t("labels.principalId") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-foreground break-all leading-relaxed", children: principalText }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1.5", children: t("labels.principalShare") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "gallery.copy_principal_button",
              onClick: handleCopyPrincipal,
              "aria-label": t("aria.copyPrincipal"),
              className: "self-start sm:self-center shrink-0 flex items-center gap-1.5 px-4 py-2 glass-card rounded-2xl hover:bg-white/10 transition-colors duration-200 text-xs text-muted-foreground hover:text-foreground",
              children: copiedPrincipal ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: t("buttons.copied") })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("buttons.copy") })
              ] })
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "gallery.plug_info_banner",
        className: "border-2 border-border bg-card rounded-3xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-foreground", children: t("labels.canisterId") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground flex-1", children: t("labels.canisterDesc") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-xs font-mono bg-background border-2 border-border rounded-xl px-3 py-1.5 text-foreground select-all", children: canisterId }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "gallery.copy_canister_button",
                onClick: handleCopyCanister,
                "aria-label": t("aria.copyCanister"),
                className: "p-2.5 border-2 border-border rounded-xl bg-background hover:bg-muted transition-colors duration-200 text-muted-foreground hover:text-foreground",
                children: copiedCanister ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" })
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "gallery.tabs",
        className: "flex gap-2",
        role: "tablist",
        "aria-label": t("aria.gallerySections"),
        children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            role: "tab",
            "data-ocid": `gallery.${tab.id}_tab`,
            "aria-selected": activeTab === tab.id,
            onClick: () => setActiveTab(tab.id),
            className: "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring",
            style: {
              background: activeTab === tab.id ? "linear-gradient(135deg, rgba(var(--theme-color-1-rgb,180,80,220),0.25), rgba(var(--theme-color-2-rgb,230,100,180),0.15))" : "rgba(255,255,255,0.07)",
              border: activeTab === tab.id ? "1.5px solid rgba(var(--theme-color-1-rgb,180,80,220),0.5)" : "1.5px solid rgba(255,255,255,0.12)",
              color: activeTab === tab.id ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.label }),
              tab.count !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "rounded-full px-1.5 py-0.5 text-[10px] font-bold min-w-[18px] text-center",
                  style: {
                    background: activeTab === tab.id ? "rgba(var(--theme-color-1-rgb,180,80,220),0.35)" : "rgba(255,255,255,0.10)",
                    color: activeTab === tab.id ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)"
                  },
                  children: tab.count
                }
              )
            ]
          },
          tab.id
        ))
      }
    ),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "gallery.loading_state",
        className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5",
        children: Array.from({ length: 6 }, (_, i) => i).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 border-2 border-border rounded-2xl p-2.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-[88px] h-[88px] rounded-xl shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4 rounded" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2.5 w-1/2 rounded" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2.5 w-2/3 rounded" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-full rounded-xl mt-1" })
              ] })
            ]
          },
          `skeleton-${i}`
        ))
      }
    ),
    isError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "gallery.error_state", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-destructive/50 bg-destructive/5 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive font-semibold flex-1", children: t("errors.loadError") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "gallery.manual_reload_button",
          onClick: () => window.location.reload(),
          className: "shrink-0 px-4 py-2 rounded-xl border-2 border-destructive/40 bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors duration-200",
          children: t("buttons.reload")
        }
      )
    ] }) }),
    !isLoading && !isError && currentNfts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "gallery.empty_state",
        className: "border-2 border-border bg-card rounded-3xl p-12 flex flex-col items-center text-center gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-6xl", "aria-hidden": "true", children: activeTab === "collection" ? "🗂️" : activeTab === "standalone" ? "🎨" : "🌐" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-lg", children: activeTab === "collection" ? t("messages.noCollectionNFTs") : activeTab === "standalone" ? t("messages.noStandaloneNFTs") : t("messages.noOthersNFTs") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: activeTab === "collection" ? t("messages.noCollectionNFTsDesc") : activeTab === "standalone" ? t("messages.noStandaloneNFTsDesc") : t("messages.noOthersNFTsDesc") })
          ] })
        ]
      }
    ),
    !isLoading && currentNfts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4", children: [
        activeTab === "collection" ? t("messages.myCollectionSection") : activeTab === "standalone" ? t("messages.standaloneSection") : t("messages.othersSection"),
        " ",
        "· ",
        currentNfts.length,
        " ",
        currentNfts.length === 1 ? "token" : "tokenov"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5", children: currentNfts.map((nft, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        activeTab === "others" && nft.collectionName && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "inline-flex items-center gap-1 rounded-xl px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            style: {
              background: "rgba(var(--theme-color-1-rgb,180,80,220),0.28)",
              border: "1px solid rgba(var(--theme-color-1-rgb,180,80,220),0.45)",
              color: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  viewBox: "0 0 12 12",
                  className: "w-2.5 h-2.5",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "1.5",
                  "aria-hidden": "true",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "1", y: "4", width: "10", height: "7", rx: "1.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3.5 4V3a1.5 1.5 0 0 1 3 0v1" })
                  ]
                }
              ),
              t("messages.collectionBadge"),
              ": ",
              nft.collectionName
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NFTCard, { nft, index: i + 1 })
      ] }, nft.tokenId.toString())) })
    ] })
  ] });
}
export {
  GalleryPage as default
};
