import { c as createLucideIcon, r as reactExports, e as reactDomExports, j as jsxRuntimeExports, X, f as useInternetIdentity, u as useTranslation, _ as __vitePreload, g as useBackend, h as useQueryClient, P as Principal, V as Variant_Mint_Transfer } from "./index-CuZWHZ-E.js";
import { b as useGetMyNFTs, a as useGetNFTImage } from "./useQueries-BGckKVfw.js";
import { n as nftImageUrlById } from "./nftImage-qKgxaRHy.js";
import { C as Clock } from "./clock-B6UiFjhh.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$2);
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
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 18h.01", key: "1tta3j" }],
  ["path", { d: "M3 6h.01", key: "1rqtza" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 18h13", key: "1lx6n3" }],
  ["path", { d: "M8 6h13", key: "ik3vkj" }]
];
const List = createLucideIcon("list", __iconNode);
function ImageLightbox({ src, alt, onClose }) {
  reactExports.useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);
  const overlayRoot = document.getElementById("overlay-root") ?? document.body;
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "dialog",
      {
        "data-ocid": "lightbox.dialog",
        "aria-label": alt,
        open: true,
        className: "lightbox-overlay",
        onClick: onClose,
        onKeyDown: (e) => e.key === "Escape" && onClose(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lightbox-backdrop", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "lightbox.close_button",
              "aria-label": "Zatvoriť",
              onClick: onClose,
              className: "lightbox-close-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5", style: { color: "rgba(255,255,255,0.9)" } })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "lightbox-img-wrap",
              onClick: (e) => e.stopPropagation(),
              onKeyDown: (e) => e.stopPropagation(),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt, className: "lightbox-img" })
            }
          )
        ]
      }
    ),
    overlayRoot
  );
}
function shortenCanisterId(id) {
  if (!id || id.length <= 14) return id;
  return `${id.slice(0, 8)}...${id.slice(-4)}`;
}
const VIEW_MODE_KEY = "galleryViewMode";
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
function SkeletonThumb() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "rounded-lg animate-pulse",
      style: {
        paddingTop: "100%",
        position: "relative",
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.08)"
      }
    }
  );
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
function NFTThumb({ nft, index, canisterId }) {
  const [lightboxOpen, setLightboxOpen] = reactExports.useState(false);
  const { data: imageBytes } = useGetNFTImage(nft.tokenId);
  const imageUrl = imageBytes ? nftImageUrlById(nft.tokenId, imageBytes) : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": `history.thumb.${index}`,
          "aria-label": nft.name,
          onClick: () => imageUrl && setLightboxOpen(true),
          className: "block w-full rounded-lg overflow-hidden cursor-zoom-in group",
          style: {
            border: "1px solid rgba(255,255,255,0.10)",
            position: "relative",
            paddingTop: "100%",
            background: "rgba(255,255,255,0.06)"
          },
          children: imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: imageUrl,
              alt: nft.name,
              loading: "lazy",
              className: "absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-110",
              style: { objectFit: "cover", objectPosition: "center" }
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 animate-pulse",
              style: { background: "rgba(255,255,255,0.08)" },
              "aria-hidden": "true"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-[11px] text-gray-400 truncate max-w-full leading-tight px-0.5",
          title: nft.name,
          children: nft.name
        }
      ),
      canisterId && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-zinc-500 truncate leading-tight mt-0.5", children: shortenCanisterId(canisterId) })
    ] }),
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
function NFTListRow({ nft, index, canisterId }) {
  const [lightboxOpen, setLightboxOpen] = reactExports.useState(false);
  const { data: imageBytes } = useGetNFTImage(nft.tokenId);
  const imageUrl = imageBytes ? nftImageUrlById(nft.tokenId, imageBytes) : "";
  const { t } = useTranslation();
  function formatDateTime(ns) {
    if (!ns) return null;
    try {
      const ms = Number(ns / 1000000n);
      if (!Number.isFinite(ms) || ms <= 0) return null;
      const d = new Date(ms);
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return { date: `${day}.${month}.${year}`, time: `${hh}:${mm}` };
    } catch {
      return null;
    }
  }
  const dt = formatDateTime(nft.createdAt);
  const collectionLabel = nft.collectionName || t("messages.standalone");
  const minterPrincipal = (() => {
    var _a, _b, _c;
    const from = (_c = (_b = (_a = nft.history) == null ? void 0 : _a[0]) == null ? void 0 : _b.from) == null ? void 0 : _c.toString();
    if (from) return from;
    return null;
  })();
  function truncatePrincipal(addr) {
    if (addr.length <= 18) return addr;
    return `${addr.slice(0, 10)}…${addr.slice(-5)}`;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": `history.item.${index}`,
        "aria-label": nft.name,
        onClick: () => imageUrl && setLightboxOpen(true),
        className: "flex items-center gap-3 py-2.5 px-1 w-full rounded-lg hover:bg-white/5 transition-colors duration-200 cursor-pointer text-left",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "shrink-0 rounded-md overflow-hidden",
              style: {
                width: 96,
                height: 96,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)"
              },
              children: imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: imageUrl,
                  alt: nft.name,
                  loading: "lazy",
                  className: "w-full h-full object-cover rounded"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-full h-full animate-pulse",
                  style: { background: "rgba(255,255,255,0.08)" }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0 flex-1 gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-base text-white truncate", children: nft.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-sm truncate",
                style: { color: "rgba(255,255,255,0.60)" },
                children: collectionLabel
              }
            ),
            dt && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-xs",
                style: { color: "rgba(255,255,255,0.45)" },
                children: [
                  dt.date,
                  " ",
                  dt.time
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-xs font-mono truncate",
                style: { color: "rgba(255,255,255,0.40)" },
                children: [
                  "#",
                  nft.tokenId.toString()
                ]
              }
            ),
            minterPrincipal && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs font-mono truncate",
                style: { color: "rgba(255,255,255,0.40)" },
                children: truncatePrincipal(minterPrincipal)
              }
            ),
            canisterId && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-zinc-500 font-mono", children: [
              "Canister: ",
              shortenCanisterId(canisterId)
            ] })
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
const VIEW_MODES = [
  {
    id: "grid3",
    label: "3×3",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        viewBox: "0 0 14 14",
        className: "w-3.5 h-3.5",
        fill: "currentColor",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "0", width: "3.5", height: "3.5", rx: "0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5.25", y: "0", width: "3.5", height: "3.5", rx: "0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "10.5", y: "0", width: "3.5", height: "3.5", rx: "0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "5.25", width: "3.5", height: "3.5", rx: "0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5.25", y: "5.25", width: "3.5", height: "3.5", rx: "0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "10.5", y: "5.25", width: "3.5", height: "3.5", rx: "0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "10.5", width: "3.5", height: "3.5", rx: "0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5.25", y: "10.5", width: "3.5", height: "3.5", rx: "0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "10.5", y: "10.5", width: "3.5", height: "3.5", rx: "0.5" })
        ]
      }
    )
  },
  {
    id: "grid4",
    label: "4×4",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        viewBox: "0 0 14 14",
        className: "w-3.5 h-3.5",
        fill: "currentColor",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "0", width: "2.8", height: "2.8", rx: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3.73", y: "0", width: "2.8", height: "2.8", rx: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "7.47", y: "0", width: "2.8", height: "2.8", rx: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "11.2", y: "0", width: "2.8", height: "2.8", rx: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "3.73", width: "2.8", height: "2.8", rx: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3.73", y: "3.73", width: "2.8", height: "2.8", rx: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "7.47", y: "3.73", width: "2.8", height: "2.8", rx: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "11.2", y: "3.73", width: "2.8", height: "2.8", rx: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "7.47", width: "2.8", height: "2.8", rx: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3.73", y: "7.47", width: "2.8", height: "2.8", rx: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "7.47", y: "7.47", width: "2.8", height: "2.8", rx: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "11.2", y: "7.47", width: "2.8", height: "2.8", rx: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "11.2", width: "2.8", height: "2.8", rx: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3.73", y: "11.2", width: "2.8", height: "2.8", rx: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "7.47", y: "11.2", width: "2.8", height: "2.8", rx: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "11.2", y: "11.2", width: "2.8", height: "2.8", rx: "0.4" })
        ]
      }
    )
  },
  {
    id: "grid5",
    label: "5×5",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        viewBox: "0 0 14 14",
        fill: "currentColor",
        className: "w-4 h-4",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "0", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2.95", y: "0", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5.9", y: "0", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8.85", y: "0", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "11.8", y: "0", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "2.95", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2.95", y: "2.95", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5.9", y: "2.95", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8.85", y: "2.95", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "11.8", y: "2.95", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "5.9", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2.95", y: "5.9", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5.9", y: "5.9", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8.85", y: "5.9", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "11.8", y: "5.9", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "8.85", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2.95", y: "8.85", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5.9", y: "8.85", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8.85", y: "8.85", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "11.8", y: "8.85", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "11.8", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2.95", y: "11.8", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5.9", y: "11.8", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8.85", y: "11.8", width: "2.2", height: "2.2", rx: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "11.8", y: "11.8", width: "2.2", height: "2.2", rx: "0.35" })
        ]
      }
    )
  },
  {
    id: "grid6",
    label: "6×6",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        viewBox: "0 0 14 14",
        className: "w-3.5 h-3.5",
        fill: "currentColor",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "0", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2.44", y: "0", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4.88", y: "0", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "7.32", y: "0", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9.76", y: "0", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12.2", y: "0", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "2.44", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2.44", y: "2.44", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4.88", y: "2.44", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "7.32", y: "2.44", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9.76", y: "2.44", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12.2", y: "2.44", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "4.88", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2.44", y: "4.88", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4.88", y: "4.88", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "7.32", y: "4.88", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9.76", y: "4.88", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12.2", y: "4.88", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "7.32", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2.44", y: "7.32", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4.88", y: "7.32", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "7.32", y: "7.32", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9.76", y: "7.32", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12.2", y: "7.32", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "9.76", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2.44", y: "9.76", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4.88", y: "9.76", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "7.32", y: "9.76", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9.76", y: "9.76", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12.2", y: "9.76", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "12.2", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2.44", y: "12.2", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4.88", y: "12.2", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "7.32", y: "12.2", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9.76", y: "12.2", width: "1.8", height: "1.8", rx: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12.2", y: "12.2", width: "1.8", height: "1.8", rx: "0.3" })
        ]
      }
    )
  },
  {
    id: "collection",
    label: "Zbierky",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-3.5 h-3.5" })
  },
  { id: "stack", label: "Pod sebou", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "w-3.5 h-3.5" }) }
];
function ViewToggle({ current, onChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "mint.view_toggle",
      className: "flex items-center gap-0.5 p-0.5 rounded-lg",
      style: {
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.10)"
      },
      children: VIEW_MODES.map((vm) => {
        const active = current === vm.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": `mint.view_mode.${vm.id}`,
            "aria-label": vm.label,
            "aria-pressed": active,
            title: vm.label,
            onClick: () => onChange(vm.id),
            className: "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-all duration-200 shrink-0",
            style: {
              background: active ? "linear-gradient(135deg,rgba(var(--theme-color-1-rgb,180,80,220),0.32),rgba(var(--theme-color-2-rgb,230,100,180),0.22))" : "transparent",
              border: active ? "1px solid rgba(var(--theme-color-1-rgb,180,80,220),0.45)" : "1px solid transparent",
              color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
              boxShadow: active ? "0 2px 8px rgba(0,0,0,0.25)" : "none"
            },
            children: [
              vm.icon,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline ml-0.5", children: vm.label })
            ]
          },
          vm.id
        );
      })
    }
  );
}
function HistoryEntryCard({
  nft,
  index,
  callerPrincipal,
  canisterId
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
            canisterId && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-zinc-500 truncate mt-0.5", children: shortenCanisterId(canisterId) }),
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
function CollectionCard({
  groupKey,
  displayName,
  firstNft,
  count,
  onClick,
  canisterId,
  onDelete,
  factoryCanisterId
}) {
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const { data: imageBytes } = useGetNFTImage(
    firstNft ? firstNft.tokenId : null
  );
  const imageUrl = imageBytes && firstNft ? nftImageUrlById(firstNft.tokenId, imageBytes) : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `history.collection_card.${groupKey}`,
      className: "aspect-square flex flex-col rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.03] text-left w-full",
      style: {
        background: "rgba(255,255,255,0.055)",
        border: "1px solid rgba(255,255,255,0.12)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick,
            className: "flex-1 flex flex-col w-full min-h-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 w-full overflow-hidden relative", children: [
                imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: imageUrl,
                    alt: displayName,
                    loading: "lazy",
                    className: "w-full h-full object-cover"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-full h-full flex items-center justify-center",
                    style: { background: "rgba(255,255,255,0.04)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Layers,
                      {
                        className: "w-5 h-5",
                        style: {
                          color: "rgba(var(--theme-color-1-rgb,180,80,220),0.45)"
                        }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                    style: {
                      background: "rgba(0,0,0,0.60)",
                      color: "rgba(255,255,255,0.80)"
                    },
                    children: count
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "px-1.5 py-1 flex flex-col gap-0.5 w-full",
                  title: displayName,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs font-medium truncate",
                        style: { color: "rgba(255,255,255,0.75)" },
                        children: displayName
                      }
                    ),
                    canisterId ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[9px] font-mono truncate",
                        style: { color: "rgba(255,255,255,0.35)" },
                        children: shortenCanisterId(canisterId)
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[9px] italic",
                        style: { color: "rgba(255,255,255,0.28)" },
                        children: "Predvolená zbierka"
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        canisterId && canisterId !== factoryCanisterId && onDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": `history.collection_card.${groupKey}.delete_button`,
            disabled: isDeleting,
            onClick: async (e) => {
              e.stopPropagation();
              if (!window.confirm("Naozaj chceš vymazať túto zbierku?")) return;
              setIsDeleting(true);
              try {
                await onDelete(canisterId);
              } finally {
                setIsDeleting(false);
              }
            },
            className: "mt-2 w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-medium py-1.5 px-3 rounded-lg transition-colors",
            children: isDeleting ? "Mazanie..." : "Vymazať zbierku"
          }
        )
      ]
    }
  );
}
function MintHistoryPanel() {
  const { identity } = useInternetIdentity();
  const callerPrincipal = (identity == null ? void 0 : identity.getPrincipal().toString()) ?? "";
  const { t } = useTranslation();
  const [factoryCanisterId, setFactoryCanisterId] = reactExports.useState("");
  reactExports.useEffect(() => {
    __vitePreload(() => import("./env-DkAEPqUl.js"), true ? [] : void 0).then((m) => m.loadEnvConfig()).then((cfg) => {
      setFactoryCanisterId(cfg.backend_canister_id ?? "");
    }).catch(() => {
    });
  }, []);
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const handleDeleteCollection = async (cid) => {
    if (!actor) return;
    try {
      const result = await actor.removeMyCollection(Principal.fromText(cid));
      if ("err" in result) {
        alert(`Chyba: ${result.err}`);
      } else {
        queryClient.invalidateQueries({ queryKey: ["myNFTs"] });
      }
    } catch (e) {
      alert(`Chyba: ${e instanceof Error ? e.message : String(e)}`);
    }
  };
  const { data: nfts, isLoading, isError, error } = useGetMyNFTs();
  const [viewMode, setViewMode] = reactExports.useState(() => {
    const saved = localStorage.getItem(VIEW_MODE_KEY);
    if (saved === "grid3" || saved === "grid4" || saved === "grid5" || saved === "grid6" || saved === "collection" || saved === "stack")
      return saved;
    return "grid3";
  });
  const [selectedCollection, setSelectedCollection] = reactExports.useState(
    null
  );
  const handleViewChange = (mode) => {
    setViewMode(mode);
    if (mode === "collection") {
      setSelectedCollection(null);
    }
    localStorage.setItem(VIEW_MODE_KEY, mode);
  };
  const sorted = nfts ? [...nfts].sort((a, b) => {
    const aMs = Number(a.createdAt / 1000000n);
    const bMs = Number(b.createdAt / 1000000n);
    return bMs - aMs;
  }) : [];
  const resolveCanisterId = (nft) => {
    const cid = nft.collectionCanisterId;
    if (!cid || cid === "aaaaa-aa") return void 0;
    return cid;
  };
  const groupKeyFor = (nft) => {
    const cid = resolveCanisterId(nft);
    if (cid) return `cid:${cid}`;
    const name = nft.collectionName ?? "";
    if (name) return `name:${name}`;
    return "__standalone__";
  };
  const collectionGroups = [];
  if (viewMode === "collection") {
    const map = /* @__PURE__ */ new Map();
    for (const nft of sorted) {
      const key = groupKeyFor(nft);
      const existing = map.get(key);
      if (existing) {
        existing.nfts.push(nft);
      } else {
        map.set(key, {
          name: nft.collectionName ?? "",
          canisterId: resolveCanisterId(nft),
          nfts: [nft]
        });
      }
    }
    for (const [groupKey, { name, canisterId, nfts: nfts2 }] of map)
      collectionGroups.push({ groupKey, name, canisterId, nfts: nfts2 });
  }
  const activeCollectionNfts = selectedCollection !== null ? sorted.filter((nft) => groupKeyFor(nft) === selectedCollection) : [];
  const showContent = !isLoading && !isError && sorted.length > 0;
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
                  className: "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                  style: {
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.55)"
                  },
                  children: sorted.length
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
              showContent && /* @__PURE__ */ jsxRuntimeExports.jsx(ViewToggle, { current: viewMode, onChange: handleViewChange })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "mint.history_list",
            className: "p-3 overflow-y-auto",
            style: {
              height: "calc(100vh - 12rem)",
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            },
            children: [
              isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "mint.history_loading_state", children: viewMode === "stack" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `grid gap-2 ${viewMode === "grid4" ? "grid-cols-4" : viewMode === "collection" ? "grid-cols-2" : "grid-cols-3"}`,
                  children: Array.from({ length: viewMode === "grid4" ? 8 : 6 }).map(
                    (_, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonThumb, {}, i)
                    )
                  )
                }
              ) }),
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
              showContent && viewMode === "grid3" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                selectedCollection !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "history.collection_back_button_grid",
                    onClick: () => {
                      setViewMode("collection");
                      setSelectedCollection(null);
                    },
                    className: "flex items-center gap-2 text-sm mb-1 transition-colors duration-200",
                    style: { color: "rgba(255,255,255,0.55)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
                      "Späť na zbierky"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5", children: (selectedCollection !== null ? activeCollectionNfts : sorted).map((nft, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NFTThumb,
                  {
                    nft,
                    index: idx + 1,
                    canisterId: resolveCanisterId(nft) ?? factoryCanisterId
                  },
                  nft.tokenId.toString()
                )) })
              ] }),
              showContent && viewMode === "grid4" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                selectedCollection !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "history.collection_back_button_grid",
                    onClick: () => {
                      setViewMode("collection");
                      setSelectedCollection(null);
                    },
                    className: "flex items-center gap-2 text-sm mb-1 transition-colors duration-200",
                    style: { color: "rgba(255,255,255,0.55)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
                      "Späť na zbierky"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-1", children: (selectedCollection !== null ? activeCollectionNfts : sorted).map((nft, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NFTThumb,
                  {
                    nft,
                    index: idx + 1,
                    canisterId: resolveCanisterId(nft) ?? factoryCanisterId
                  },
                  nft.tokenId.toString()
                )) })
              ] }),
              showContent && viewMode === "grid5" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                selectedCollection !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "history.collection_back_button_grid",
                    onClick: () => {
                      setViewMode("collection");
                      setSelectedCollection(null);
                    },
                    className: "flex items-center gap-2 text-sm mb-1 transition-colors duration-200",
                    style: { color: "rgba(255,255,255,0.55)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
                      "Späť na zbierky"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-1", children: (selectedCollection !== null ? activeCollectionNfts : sorted).map((nft, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NFTThumb,
                  {
                    nft,
                    index: idx + 1,
                    canisterId: resolveCanisterId(nft) ?? factoryCanisterId
                  },
                  nft.tokenId.toString()
                )) })
              ] }),
              showContent && viewMode === "collection" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: selectedCollection === null ? (
                /* Collection grid cards */
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: collectionGroups.map((group) => {
                  const displayName = group.name === "" ? "Samostatné" : group.name;
                  const firstNft = group.nfts[0];
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CollectionCard,
                    {
                      groupKey: group.groupKey,
                      displayName,
                      firstNft: firstNft ?? null,
                      count: group.nfts.length,
                      canisterId: group.canisterId,
                      factoryCanisterId,
                      onClick: () => setSelectedCollection(group.groupKey),
                      onDelete: handleDeleteCollection
                    },
                    group.groupKey
                  );
                }) })
              ) : (
                /* NFTs of selected collection */
                /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "history.collection_back_button",
                      onClick: () => setSelectedCollection(null),
                      className: "flex items-center gap-2 text-sm mb-1 transition-colors duration-200",
                      style: { color: "rgba(255,255,255,0.55)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
                        "Späť na zbierky"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: activeCollectionNfts.map((nft, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    HistoryEntryCard,
                    {
                      nft,
                      index: i + 1,
                      callerPrincipal,
                      canisterId: resolveCanisterId(nft) ?? factoryCanisterId
                    },
                    nft.tokenId.toString()
                  )) })
                ] })
              ) }),
              showContent && viewMode === "grid6" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                selectedCollection !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "history.collection_back_button_grid",
                    onClick: () => {
                      setViewMode("collection");
                      setSelectedCollection(null);
                    },
                    className: "flex items-center gap-2 text-sm mb-1 transition-colors duration-200",
                    style: { color: "rgba(255,255,255,0.55)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
                      "Späť na zbierky"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-6 gap-1", children: (selectedCollection !== null ? activeCollectionNfts : sorted).map((nft, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  NFTThumb,
                  {
                    nft,
                    index: idx + 1,
                    canisterId: resolveCanisterId(nft) ?? factoryCanisterId
                  },
                  nft.tokenId.toString()
                )) })
              ] }),
              showContent && viewMode === "stack" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                selectedCollection !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "history.collection_back_button_stack",
                    onClick: () => {
                      setViewMode("collection");
                      setSelectedCollection(null);
                    },
                    className: "flex items-center gap-2 text-sm mb-1 transition-colors duration-200",
                    style: { color: "rgba(255,255,255,0.55)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
                      "Späť na zbierky"
                    ]
                  }
                ),
                (selectedCollection !== null ? activeCollectionNfts : sorted).map(
                  (nft, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    NFTListRow,
                    {
                      nft,
                      index: idx + 1,
                      canisterId: resolveCanisterId(nft) ?? factoryCanisterId
                    },
                    nft.tokenId.toString()
                  )
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
function GalleryPage() {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-content space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl", "aria-hidden": "true", children: "▦" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight", children: t("messages.galleryTitle") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MintHistoryPanel, {})
  ] });
}
export {
  GalleryPage as default
};
