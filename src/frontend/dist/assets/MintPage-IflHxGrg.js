import { i as useInternetIdentity, u as useTranslation, j as jsxRuntimeExports, r as reactExports, V as Variant_Mint_Transfer, k as React, P as Principal } from "./index-d4CSy73B.js";
import { C as Clock, I as ImageLightbox, u as useAddressHistory } from "./useAddressHistory-Dws-voMY.js";
import { e as useGetMyNFTs, a as useGetNFTImage, f as useMintNFT } from "./useQueries-eFwKLunX.js";
import { n as nftImageUrlById, c as cn } from "./utils-CFaqURYB.js";
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
  const [aspectLabel, setAspectLabel] = reactExports.useState(null);
  const imgRef = reactExports.useRef(null);
  const status = getSentStatus(nft, callerPrincipal);
  const isSent = status === "sent";
  const { data: imageBytes } = useGetNFTImage(nft.tokenId);
  const imageUrl = imageBytes ? nftImageUrlById(nft.tokenId, imageBytes) : "";
  const { t } = useTranslation();
  reactExports.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      const standards = [
        { label: "1:1", value: 1 },
        { label: "4:3", value: 4 / 3 },
        { label: "16:9", value: 16 / 9 }
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
  function truncatePrincipal(addr) {
    if (addr.length <= 18) return addr;
    return `${addr.slice(0, 10)}…${addr.slice(-5)}`;
  }
  function formatDate(ns) {
    if (!ns) return null;
    try {
      const ms = Number(ns / 1000000n);
      if (!Number.isFinite(ms) || ms <= 0) return null;
      return new Date(ms).toLocaleDateString(void 0, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return null;
    }
  }
  const ownerText = nft.owner.toText();
  const mintDate = formatDate(nft.createdAt);
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
              className: "relative overflow-hidden cursor-zoom-in w-full p-0 border-0 bg-transparent block",
              style: { paddingTop: "100%" },
              onClick: () => setLightboxOpen(true),
              "aria-label": t("messages.imagePreviewFullscreen", { name: nft.name }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    ref: imgRef,
                    src: imageUrl,
                    alt: nft.name,
                    loading: "lazy",
                    className: "absolute inset-0 w-full h-full",
                    style: {
                      objectFit: "cover",
                      objectPosition: "center",
                      transition: "transform 300ms cubic-bezier(0.4,0,0.2,1)"
                    },
                    onMouseEnter: (e) => {
                      e.currentTarget.style.transform = "scale(1.08)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute inset-x-0 bottom-0 h-10 pointer-events-none",
                    style: {
                      background: "linear-gradient(to top,rgba(8,5,24,0.65),transparent)"
                    },
                    "aria-hidden": "true"
                  }
                ),
                aspectLabel && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "absolute top-2 right-2 text-[11px] font-bold tracking-wide px-2 py-0.5 rounded-full pointer-events-none select-none",
                    style: {
                      background: "rgba(0,0,0,0.78)",
                      color: "#ffffff",
                      letterSpacing: "0.04em",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
                      lineHeight: "1.5"
                    },
                    "aria-label": `${t("messages.imageFormat")} ${aspectLabel}`,
                    children: aspectLabel
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pt-2.5 pb-3 flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-display font-bold text-sm text-foreground truncate leading-snug",
                title: nft.name,
                children: nft.name
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-[11px] truncate",
                title: nft.collectionName ?? t("messages.standalone"),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/30 uppercase tracking-wider text-[9px] font-semibold mr-1", children: [
                    t("messages.collectionBadge"),
                    ":"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        color: nft.collectionName ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
                        fontStyle: nft.collectionName ? "normal" : "italic"
                      },
                      children: nft.collectionName ?? t("messages.standalone")
                    }
                  )
                ]
              }
            ),
            nft.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 leading-snug", children: nft.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-[10px] font-mono truncate",
                title: ownerText,
                style: { color: "rgba(255,255,255,0.38)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/25 uppercase tracking-wider text-[8px] font-semibold mr-1 not-italic", children: [
                    t("messages.ownerBadge") || "Own",
                    ":"
                  ] }),
                  truncatePrincipal(ownerText)
                ]
              }
            ),
            mintDate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-[10px] flex items-center gap-1",
                style: { color: "rgba(255,255,255,0.28)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "svg",
                    {
                      className: "w-2.5 h-2.5 shrink-0",
                      viewBox: "0 0 16 16",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      "aria-hidden": "true",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "8", r: "6.5" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "8 4.5 8 8 10.5 10" })
                      ]
                    }
                  ),
                  mintDate
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: isSent ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
                  t("messages.sentElsewhere")
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
                  t("messages.mintedHere")
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
  const { t } = useTranslation();
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-sm tracking-wide gradient-text", children: t("messages.historyTitle") }),
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
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: (error == null ? void 0 : error.message) ?? t("errors.loadErrorShort") })
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
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: t("messages.noNFTs") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground/60", children: t("messages.noNFTsDesc") })
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
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
var use = React[" use ".trim().toString()];
function isPromiseLike(value) {
  return typeof value === "object" && value !== null && "then" in value;
}
function isLazyComponent(element) {
  return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  var _a, _b;
  let getter = (_a = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = /* @__PURE__ */ createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        var _a;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a = props.onMouseDown) == null ? void 0 : _a.call(props, event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
function MintPage() {
  const mintMutation = useMintNFT();
  const fileRef = reactExports.useRef(null);
  const { t } = useTranslation();
  const [mintMode, setMintMode] = reactExports.useState(null);
  const [blinkMode, setBlinkMode] = reactExports.useState(false);
  const [imageFile, setImageFile] = reactExports.useState(null);
  const [imagePreview, setImagePreview] = reactExports.useState(null);
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [collectionName, setCollectionName] = reactExports.useState("");
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
    const autoName = file.name.replace(/\.[^.]*$/, "");
    if (!name) setName(autoName);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: void 0 }));
    const autoName = file.name.replace(/\.[^.]*$/, "");
    if (!name) setName(autoName);
  };
  const validateRecipient = (val) => {
    if (!val.trim()) return void 0;
    try {
      Principal.fromText(val.trim());
      return void 0;
    } catch {
      return t("errors.invalidPrincipal");
    }
  };
  const validate = () => {
    const errs = {};
    if (!mintMode) errs.submit = t("errors.selectMode");
    if (!name.trim()) errs.name = t("errors.enterNftName");
    if (!imageFile) errs.image = t("errors.selectImage");
    if (mintMode === "collection" && !collectionName.trim())
      errs.collectionName = t("errors.enterCollectionName");
    const recipientErr = validateRecipient(recipientId);
    if (recipientErr) errs.recipient = recipientErr;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const isSubmitDisabled = mintMutation.isPending || !name.trim() || !imageFile || mintMode === "collection" && !collectionName.trim();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mintMode) {
      setBlinkMode(true);
      setTimeout(() => setBlinkMode(false), 1200);
      return;
    }
    if (!validate() || !imageFile) return;
    setErrors((prev) => ({ ...prev, submit: void 0 }));
    setPhase("minting");
    try {
      await mintMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        imageFile,
        recipientId: recipientId.trim() || void 0,
        isPublic,
        collectionName: mintMode === "collection" ? collectionName.trim() : void 0
      });
      if (recipientId.trim()) saveAddress(recipientId.trim());
      setShowSuccess(true);
      setName("");
      setDescription("");
      setCollectionName("");
      setRecipientId("");
      setImageFile(null);
      setImagePreview(null);
      setMintMode(null);
      setPhase("idle");
      if (fileRef.current) fileRef.current.value = "";
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (err) {
      console.error("[MintPage] mintNFT failed:", err);
      const msg = err instanceof Error ? err.message : t("errors.mintFailed");
      setErrors((prev) => ({ ...prev, submit: msg }));
      setPhase("error");
      setTimeout(() => {
        setPhase("idle");
      }, 1500);
    }
  };
  const isBusy = mintMutation.isPending;
  const showProgress = phase === "minting" || phase === "error";
  const phaseLabel = phase === "minting" ? t("messages.minting") : phase === "error" ? "Chyba" : t("buttons.mintNFT");
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
        "aria-label": t("messages.minted"),
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
                  children: t("messages.minted")
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight gradient-text", children: t("messages.mintTitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-6 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full lg:max-w-[448px] shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-3xl p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", noValidate: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.12em] text-white/50 mb-3", children: t("labels.mintMode") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "mint.mode_collection_button",
                  onClick: () => {
                    setMintMode("collection");
                    setBlinkMode(false);
                  },
                  className: `relative flex flex-col items-center gap-2 rounded-2xl py-5 px-3 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring${blinkMode ? " blink-highlight" : ""}`,
                  style: {
                    background: mintMode === "collection" ? "linear-gradient(135deg, rgba(var(--theme-color-1-rgb,180,80,220),0.22), rgba(var(--theme-color-2-rgb,230,100,180),0.12))" : "rgba(255,255,255,0.06)",
                    border: mintMode === "collection" ? "1.5px solid rgba(var(--theme-color-1-rgb,180,80,220),0.55)" : "1.5px solid rgba(255,255,255,0.13)",
                    boxShadow: mintMode === "collection" ? "0 0 18px 2px rgba(var(--theme-color-1-rgb,180,80,220),0.18)" : "none"
                  },
                  "aria-pressed": mintMode === "collection",
                  children: [
                    mintMode === "collection" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center",
                        style: {
                          background: "linear-gradient(135deg, rgb(var(--theme-color-1-rgb,180,80,220)), rgb(var(--theme-color-2-rgb,230,100,180)))"
                        },
                        "aria-hidden": "true",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "svg",
                          {
                            viewBox: "0 0 10 10",
                            className: "w-2.5 h-2.5",
                            fill: "none",
                            role: "presentation",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "polyline",
                              {
                                points: "1.5,5.5 4,8 8.5,2",
                                stroke: "white",
                                strokeWidth: "1.5",
                                strokeLinecap: "round",
                                strokeLinejoin: "round"
                              }
                            )
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "svg",
                      {
                        viewBox: "0 0 24 24",
                        className: "w-8 h-8",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.4",
                        "aria-hidden": "true",
                        style: {
                          color: mintMode === "collection" ? "rgb(var(--theme-color-1-rgb,180,80,220))" : "rgba(255,255,255,0.45)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "7", width: "20", height: "14", rx: "3" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "12", x2: "12", y2: "16" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "10", y1: "14", x2: "14", y2: "14" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[11px] font-bold uppercase tracking-wider text-center leading-tight",
                        style: {
                          color: mintMode === "collection" ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.5)"
                        },
                        children: t("labels.toCollection")
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "mint.mode_standalone_button",
                  onClick: () => {
                    setMintMode("standalone");
                    setBlinkMode(false);
                  },
                  className: `relative flex flex-col items-center gap-2 rounded-2xl py-5 px-3 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring${blinkMode ? " blink-highlight" : ""}`,
                  style: {
                    background: mintMode === "standalone" ? "linear-gradient(135deg, rgba(var(--theme-color-2-rgb,230,100,180),0.22), rgba(var(--theme-color-3-rgb,255,180,60),0.12))" : "rgba(255,255,255,0.06)",
                    border: mintMode === "standalone" ? "1.5px solid rgba(var(--theme-color-2-rgb,230,100,180),0.55)" : "1.5px solid rgba(255,255,255,0.13)",
                    boxShadow: mintMode === "standalone" ? "0 0 18px 2px rgba(var(--theme-color-2-rgb,230,100,180),0.18)" : "none"
                  },
                  "aria-pressed": mintMode === "standalone",
                  children: [
                    mintMode === "standalone" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center",
                        style: {
                          background: "linear-gradient(135deg, rgb(var(--theme-color-2-rgb,230,100,180)), rgb(var(--theme-color-3-rgb,255,180,60)))"
                        },
                        "aria-hidden": "true",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "svg",
                          {
                            viewBox: "0 0 10 10",
                            className: "w-2.5 h-2.5",
                            fill: "none",
                            role: "presentation",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "polyline",
                              {
                                points: "1.5,5.5 4,8 8.5,2",
                                stroke: "white",
                                strokeWidth: "1.5",
                                strokeLinecap: "round",
                                strokeLinejoin: "round"
                              }
                            )
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "svg",
                      {
                        viewBox: "0 0 24 24",
                        className: "w-8 h-8",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.4",
                        "aria-hidden": "true",
                        style: {
                          color: mintMode === "standalone" ? "rgb(var(--theme-color-2-rgb,230,100,180))" : "rgba(255,255,255,0.45)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "9" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[11px] font-bold uppercase tracking-wider text-center leading-tight",
                        style: {
                          color: mintMode === "standalone" ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.5)"
                        },
                        children: t("labels.standalone")
                      }
                    )
                  ]
                }
              )
            ] }),
            mintMode === "collection" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "nft-collection",
                  className: "text-xs font-semibold uppercase tracking-[0.12em] text-white/50",
                  children: t("labels.collectionName")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "nft-collection",
                  "data-ocid": "mint.collection_name_input",
                  value: collectionName,
                  onChange: (e) => {
                    setCollectionName(e.target.value);
                    if (e.target.value.trim())
                      setErrors((p) => ({
                        ...p,
                        collectionName: void 0
                      }));
                  },
                  onBlur: () => {
                    if (!collectionName.trim())
                      setErrors((p) => ({
                        ...p,
                        collectionName: t("errors.enterCollectionName")
                      }));
                  },
                  placeholder: "napr. Moja prvá zbierka",
                  className: `mt-1.5 rounded-2xl text-sm text-white/90 placeholder:text-white/30 border-0 outline-none focus-visible:ring-1 ${errors.collectionName ? "ring-1 ring-destructive" : "focus-visible:ring-white/30"}`,
                  style: {
                    background: "rgba(255,255,255,0.08)",
                    border: errors.collectionName ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(255,255,255,0.14)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)"
                  }
                }
              ),
              errors.collectionName && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  "data-ocid": "mint.collection_name.field_error",
                  className: "text-xs text-destructive mt-1",
                  children: errors.collectionName
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold uppercase tracking-[0.12em] text-white/50", children: t("labels.image") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "mint.dropzone",
                tabIndex: 0,
                "aria-label": t("labels.image"),
                className: "mt-1.5 w-full rounded-2xl transition-smooth cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring text-left",
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
                      alt: t("messages.imagePreviewAlt"),
                      className: "w-full h-full object-contain bg-muted"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": t("messages.imageRemove"),
                      onClick: (e) => {
                        e.stopPropagation();
                        setImageFile(null);
                        setImagePreview(null);
                        if (fileRef.current) fileRef.current.value = "";
                      },
                      className: "absolute top-2 right-2 glass-card rounded-xl text-xs px-3 py-1.5 font-semibold uppercase hover:bg-white/10 transition-smooth text-foreground",
                      children: t("messages.imageRemove")
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
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: t("messages.uploadImage") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: t("messages.uploadImageDrop") })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60", children: t("messages.uploadImageFormats") })
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
                children: t("labels.nftName")
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
                      name: t("errors.enterNftName")
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
                  t("labels.recipient"),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal normal-case tracking-normal text-white/30", children: t("labels.recipientOptional") })
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
                        setErrors((p) => ({
                          ...p,
                          recipient: void 0
                        }));
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
                  "aria-label": t("labels.recentAddresses"),
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
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-3 pt-2 pb-1 text-[9px] font-semibold uppercase tracking-widest text-white/30", children: t("labels.recentAddresses") }),
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "nft-desc",
                className: "text-xs font-semibold uppercase tracking-[0.12em] text-white/50",
                children: t("labels.descriptionOptional")
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.12em] text-white/50", children: t("labels.visibility") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/30 mt-0.5", children: isPublic ? t("labels.visibilityPublic") : t("labels.visibilityPrivate") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "mint.visibility_toggle",
                role: "switch",
                "aria-checked": isPublic,
                "aria-label": t("labels.visibility"),
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
                children: isPublic ? t("labels.publicNFT") : t("labels.privateNFT")
              }
            )
          ] }),
          showProgress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "mint.loading_state", className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: phase === "minting" ? t("messages.mintingOnChain") : t("messages.mintingError") }) }),
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
              disabled: isSubmitDisabled,
              title: !mintMode ? t("messages.selectMintMode") : void 0,
              className: "relative overflow-hidden w-full rounded-2xl py-5 min-h-[60px] font-display font-bold text-base uppercase tracking-widest text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed",
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
                ] }) : t("buttons.mintNFT") })
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
