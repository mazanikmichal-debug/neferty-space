import { e as createLucideIcon, r as reactExports, d as reactDomExports, j as jsxRuntimeExports, X } from "./index-d4CSy73B.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode);
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
const STORAGE_KEY = "nft-address-history";
const MAX_ENTRIES = 10;
function saveAddress(address) {
  const trimmed = address.trim();
  if (!trimmed) return;
  const current = getAddresses();
  const deduped = [trimmed, ...current.filter((a) => a !== trimmed)];
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(deduped.slice(0, MAX_ENTRIES))
  );
}
function getAddresses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item === "string");
  } catch {
    return [];
  }
}
function clearAddresses() {
  localStorage.removeItem(STORAGE_KEY);
}
function useAddressHistory() {
  const [addresses, setAddresses] = reactExports.useState(() => getAddresses());
  const saveAddress$1 = reactExports.useCallback((address) => {
    saveAddress(address);
    setAddresses(getAddresses());
  }, []);
  const clearAddresses$1 = reactExports.useCallback(() => {
    clearAddresses();
    setAddresses([]);
  }, []);
  return { addresses, saveAddress: saveAddress$1, clearAddresses: clearAddresses$1 };
}
export {
  Clock as C,
  ImageLightbox as I,
  useAddressHistory as u
};
