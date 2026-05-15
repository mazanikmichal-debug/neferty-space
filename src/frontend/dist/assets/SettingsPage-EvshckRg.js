import { c as createLucideIcon, f as useBackend, u as useTranslation, r as reactExports, j as jsxRuntimeExports, g as useInternetIdentity, C as Check, h as Copy, T as ThemeSettingsPanel } from "./index-Dzz2Xx7E.js";
import { a as useGetMyHealthStatus, b as useGetAdminPrincipal, c as useGetPlatformFees, d as useWithdrawPlatformFees, e as useGetFactoryAccountId, f as useTopUpCollection } from "./useQueries-CRRcsVdq.js";
import { C as ChevronDown } from "./chevron-down-BNH9W-0P.js";
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
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$2);
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
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode$1);
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
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
const CYCLES_PER_NFT = 2e10;
const CYCLES_PER_TRILLION = 1e12;
const CYCLES_USD_PER_T = 1.2;
const PLATFORM_SURCHARGE = 0.25;
const FALLBACK_ICP_USD = 10;
const MONTHLY_BASELINE = 30;
function calcICPForImages(images, icpUsd) {
  if (icpUsd <= 0 || images <= 0) return 0;
  const cyclesNeeded = images * CYCLES_PER_NFT;
  const usdNeeded = cyclesNeeded / CYCLES_PER_TRILLION * CYCLES_USD_PER_T;
  const usdWithSurcharge = usdNeeded * (1 + PLATFORM_SURCHARGE);
  return usdWithSurcharge / icpUsd;
}
function calcImagesForICP(icp, icpUsd) {
  if (icpUsd <= 0 || icp <= 0) return 0;
  const usdTotal = icp * icpUsd;
  const usdForArtist = usdTotal * 0.75;
  const cyclesForArtist = usdForArtist / CYCLES_USD_PER_T * CYCLES_PER_TRILLION;
  return Math.floor(cyclesForArtist / CYCLES_PER_NFT);
}
function calcMonths(images) {
  return Math.round(images / MONTHLY_BASELINE * 10) / 10;
}
function CyclesCalculator({
  onTopUp = () => {
  },
  onClose = () => {
  },
  onIcpChange
}) {
  const { actor } = useBackend();
  const { t } = useTranslation();
  const [icpUsd, setIcpUsd] = reactExports.useState(null);
  const [priceLoading, setPriceLoading] = reactExports.useState(true);
  const [priceFallback, setPriceFallback] = reactExports.useState(false);
  const [imageCount, setImageCount] = reactExports.useState("");
  const [icpAmount, setIcpAmount] = reactExports.useState("");
  const lastEdited = reactExports.useRef("images");
  reactExports.useEffect(() => {
    let cancelled = false;
    setPriceLoading(true);
    setPriceFallback(false);
    (async () => {
      try {
        if (actor) {
          const price = await actor.getICPPrice();
          if (!cancelled && price > 0) {
            setIcpUsd(price);
            return;
          }
        }
        if (!cancelled) {
          setIcpUsd(FALLBACK_ICP_USD);
          setPriceFallback(true);
        }
      } catch {
        if (!cancelled) {
          setIcpUsd(FALLBACK_ICP_USD);
          setPriceFallback(true);
        }
      } finally {
        if (!cancelled) setPriceLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [actor]);
  const currentIcpUsd = icpUsd ?? FALLBACK_ICP_USD;
  const parsedImages = Number.parseInt(imageCount, 10);
  const parsedIcp = Number.parseFloat(icpAmount);
  const validImages = !Number.isNaN(parsedImages) && parsedImages > 0;
  const validIcp = !Number.isNaN(parsedIcp) && parsedIcp > 0;
  const displayIcp = validIcp ? parsedIcp : validImages ? calcICPForImages(parsedImages, currentIcpUsd) : 0;
  const displayImages = validImages ? parsedImages : validIcp ? calcImagesForICP(parsedIcp, currentIcpUsd) : 0;
  const artistIcp = displayIcp * 0.75;
  const platformIcp = displayIcp * 0.25;
  const estimatedMonths = calcMonths(displayImages);
  const canTopUp = displayIcp > 0;
  const handleImagesChange = (raw) => {
    lastEdited.current = "images";
    setImageCount(raw);
    const n = Number.parseInt(raw, 10);
    if (!Number.isNaN(n) && n > 0) {
      const icp = calcICPForImages(n, currentIcpUsd);
      setIcpAmount(icp.toFixed(4));
      onIcpChange == null ? void 0 : onIcpChange(icp);
    } else {
      setIcpAmount("");
      onIcpChange == null ? void 0 : onIcpChange(0);
    }
  };
  const handleIcpChange = (raw) => {
    lastEdited.current = "icp";
    setIcpAmount(raw);
    const f = Number.parseFloat(raw);
    if (!Number.isNaN(f) && f > 0) {
      const imgs = calcImagesForICP(f, currentIcpUsd);
      setImageCount(imgs > 0 ? String(imgs) : "");
      onIcpChange == null ? void 0 : onIcpChange(f);
    } else {
      setImageCount("");
      onIcpChange == null ? void 0 : onIcpChange(0);
    }
  };
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
  const priceLabel = priceLoading ? t("calculator.rateLoading") : priceFallback ? t("calculator.rateFallback", { price: FALLBACK_ICP_USD.toFixed(2) }) : t("calculator.rateLive", { price: currentIcpUsd.toFixed(2) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl px-4 py-2.5 flex items-center justify-between gap-2",
        style: {
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.10)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: priceLabel }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-2 h-2 rounded-full flex-shrink-0",
              style: {
                background: priceLoading ? "rgba(255,200,0,0.7)" : priceFallback ? "rgba(251,191,36,0.7)" : "rgba(34,197,94,0.8)",
                boxShadow: `0 0 6px ${priceFallback ? "rgba(251,191,36,0.5)" : "rgba(34,197,94,0.4)"}`
              }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "calc-images",
            className: "text-[10px] font-semibold uppercase tracking-widest",
            style: { color: "rgba(255,255,255,0.45)" },
            children: t("calculator.imageCount")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "calc-images",
            "data-ocid": "calculator.images_input",
            type: "number",
            min: 1,
            max: 1e4,
            step: 1,
            value: imageCount,
            onChange: (e) => handleImagesChange(e.target.value),
            placeholder: "napr. 100",
            className: "w-full rounded-xl px-3 py-2.5 text-sm text-white/90 placeholder:text-white/25 outline-none focus:ring-1 focus:ring-white/25 transition-all",
            style: {
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              backdropFilter: "blur(8px)"
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "calc-icp",
            className: "text-[10px] font-semibold uppercase tracking-widest",
            style: { color: "rgba(255,255,255,0.45)" },
            children: t("calculator.icpAmount")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "calc-icp",
            "data-ocid": "calculator.icp_input",
            type: "number",
            min: 0.01,
            step: 0.01,
            value: icpAmount,
            onChange: (e) => handleIcpChange(e.target.value),
            placeholder: "napr. 2.00",
            className: "w-full rounded-xl px-3 py-2.5 text-sm text-white/90 placeholder:text-white/25 outline-none focus:ring-1 focus:ring-white/25 transition-all",
            style: {
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              backdropFilter: "blur(8px)"
            }
          }
        )
      ] })
    ] }),
    displayIcp > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl p-4 space-y-2",
        style: {
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.10)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3", children: t("calculator.breakdown") }),
          [
            {
              label: t("calculator.forCanister"),
              value: artistIcp,
              color: "#22d3ee"
            },
            {
              label: t("calculator.forPlatform"),
              value: platformIcp,
              color: "#a78bfa"
            }
          ].map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: row.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-xs font-bold font-mono",
                    style: { color: row.color },
                    children: [
                      row.value.toFixed(4),
                      " ICP"
                    ]
                  }
                )
              ]
            },
            row.label
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between gap-2 pt-2",
              style: { borderTop: "1px solid rgba(255,255,255,0.08)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: t("calculator.total") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold font-mono text-white", children: [
                  displayIcp.toFixed(4),
                  " ICP"
                ] })
              ]
            }
          ),
          estimatedMonths > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-[10px] text-muted-foreground pt-1",
              style: { borderTop: "1px solid rgba(255,255,255,0.06)" },
              children: [
                t("calculator.estimatedDuration"),
                ": ~",
                estimatedMonths,
                " ",
                estimatedMonths === 1 ? t("calculator.month") : estimatedMonths < 5 ? t("calculator.months2to4") : t("calculator.months5plus")
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground leading-relaxed", children: t("calculator.calcInfo") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": "calculator.topup_button",
        disabled: !canTopUp,
        onClick: () => canTopUp && onTopUp(displayIcp),
        className: "relative overflow-hidden w-full rounded-2xl py-4 min-h-[56px] font-display font-bold text-sm uppercase tracking-widest text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-35 disabled:scale-100 disabled:cursor-not-allowed",
        style: { boxShadow: canTopUp ? "0 4px 16px rgba(0,0,0,0.2)" : "none" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "absolute inset-0 rounded-2xl",
              "aria-hidden": "true",
              style: {
                background: canTopUp ? "linear-gradient(135deg, rgb(var(--theme-color-1-rgb,180,80,220)), rgb(var(--theme-color-2-rgb,80,80,220)))" : "rgba(255,255,255,0.08)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative z-[1] flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
            t("calculator.topUp")
          ] })
        ]
      }
    )
  ] });
}
const HEALTH_HEX = {
  green: "#22c55e",
  orange: "#f97316",
  red: "#ef4444"
};
const HEALTH_GLOW = {
  green: "rgba(34,197,94,0.35)",
  orange: "rgba(249,115,22,0.35)",
  red: "rgba(239,68,68,0.35)"
};
function HealthBar({
  color,
  fillPct
}) {
  const hex = HEALTH_HEX[color];
  const glow = HEALTH_GLOW[color];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "settings.health_bar",
      className: "relative w-full h-4 rounded-full overflow-hidden",
      style: {
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.10)"
      },
      role: "progressbar",
      tabIndex: 0,
      "aria-valuenow": fillPct,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-y-0 left-0 rounded-full transition-all duration-700",
          style: {
            width: `${fillPct}%`,
            background: `linear-gradient(90deg, ${hex}cc, ${hex})`,
            boxShadow: `0 0 14px ${glow}`
          }
        }
      )
    }
  );
}
function StatCard({
  label,
  value,
  unit,
  color,
  ocid,
  expertLine
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": ocid,
      className: "flex-1 rounded-2xl p-4 flex flex-col gap-1.5",
      style: {
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.09)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-[10px] font-semibold uppercase tracking-widest leading-tight",
            style: { color: "rgba(255,255,255,0.42)" },
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-1.5 mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-4xl font-bold font-mono leading-none",
              style: { color },
              children: value.toString()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs pb-0.5",
              style: { color: "rgba(255,255,255,0.40)" },
              children: unit
            }
          )
        ] }),
        expertLine && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-xs mt-1",
            style: { color: "rgba(255,255,255,0.28)" },
            children: expertLine
          }
        )
      ]
    }
  );
}
function SectionCard({
  children,
  title,
  icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-3xl p-6 flex flex-col gap-5",
      style: {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)"
      },
      children: [
        title && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.45)" }, children: icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-display text-[10px] font-bold uppercase tracking-[0.14em]",
              style: { color: "rgba(255,255,255,0.50)" },
              children: title
            }
          )
        ] }),
        children
      ]
    }
  );
}
function TopUpFlow({
  icpAmount,
  onClose
}) {
  const [step, setStep] = reactExports.useState("address");
  const [blockIndex, setBlockIndex] = reactExports.useState("");
  const [copied, setCopied] = reactExports.useState(false);
  const [successData, setSuccessData] = reactExports.useState(null);
  const { data: factoryAccount, isLoading: accountLoading } = useGetFactoryAccountId();
  const topUp = useTopUpCollection();
  const handleCopy = () => {
    if (factoryAccount) {
      navigator.clipboard.writeText(factoryAccount).catch(() => {
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    }
  };
  const handleConfirm = async () => {
    const idx = blockIndex.trim();
    if (!idx) return;
    try {
      const result = await topUp.mutateAsync(BigInt(idx));
      setSuccessData({
        icpUsed: result.icpUsed,
        cyclesMinted: result.cyclesMinted
      });
      setStep("success");
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "settings.topup_flow",
      className: "rounded-2xl p-5 space-y-4",
      style: {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.12)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          ["address", "confirm", "success"].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors duration-300",
                style: {
                  background: step === s ? "rgba(139,92,246,0.8)" : s === "success" && step === "success" ? "rgba(34,197,94,0.7)" : "rgba(255,255,255,0.10)",
                  color: step === s || s === "success" && step === "success" ? "white" : "rgba(255,255,255,0.35)"
                },
                children: i + 1
              }
            ),
            i < 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-px w-6",
                style: { background: "rgba(255,255,255,0.12)" }
              }
            )
          ] }, s)),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "settings.topup_close_button",
              onClick: onClose,
              className: "ml-auto text-white/40 hover:text-white/70 transition-colors",
              "aria-label": "Zatvoriť",
              children: "×"
            }
          )
        ] }),
        step === "address" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-xs leading-relaxed",
              style: { color: "rgba(255,255,255,0.55)" },
              children: [
                "Pošlite",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-white/80", children: [
                  icpAmount > 0 ? icpAmount.toFixed(4) : "??",
                  " ICP"
                ] }),
                " ",
                "na túto adresu zo svojej peňaženky (Plug, Bitfinity alebo NNS)"
              ]
            }
          ),
          accountLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-10 rounded-xl animate-pulse",
              style: { background: "rgba(255,255,255,0.07)" }
            }
          ) : factoryAccount ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 rounded-xl px-3 py-2",
              style: {
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "flex-1 text-xs font-mono truncate",
                    style: { color: "rgba(255,255,255,0.80)" },
                    children: factoryAccount
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "settings.copy_address_button",
                    onClick: handleCopy,
                    className: "flex-shrink-0 flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors duration-200",
                    style: {
                      background: copied ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.10)",
                      color: copied ? "#22c55e" : "rgba(255,255,255,0.65)"
                    },
                    "aria-label": "Kopírovať adresu",
                    children: [
                      copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 10 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 10 }),
                      copied ? "Skopírované" : "Kopírovať"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "rgba(255,80,80,0.8)" }, children: "Nepodarilo sa načítať adresu. Skúste neskôr." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "settings.topup_next_button",
              onClick: () => setStep("confirm"),
              disabled: !factoryAccount,
              className: "w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.01] disabled:opacity-40",
              style: {
                background: "linear-gradient(135deg, rgb(var(--theme-color-1-rgb,120,50,200)), rgb(var(--theme-color-2-rgb,60,80,220)))",
                color: "white"
              },
              children: "Potvrdenie platby →"
            }
          )
        ] }),
        step === "confirm" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs leading-relaxed",
              style: { color: "rgba(255,255,255,0.55)" },
              children: "Po odoslaní ICP zadajte číslo bloku transakcie z histórie vašej peňaženky."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "block-index",
                className: "text-[10px] font-semibold uppercase tracking-widest",
                style: { color: "rgba(255,255,255,0.45)" },
                children: "Číslo bloku transakcie"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "block-index",
                "data-ocid": "settings.block_index_input",
                type: "number",
                min: 0,
                step: 1,
                value: blockIndex,
                onChange: (e) => setBlockIndex(e.target.value),
                placeholder: "napr. 12345678",
                className: "w-full rounded-xl px-3 py-2.5 text-sm text-white/90 placeholder:text-white/25 outline-none focus:ring-1 focus:ring-white/25 transition-all",
                style: {
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)"
                }
              }
            )
          ] }),
          topUp.error && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              "data-ocid": "settings.topup_error_state",
              className: "text-xs rounded-lg px-3 py-2",
              style: {
                background: "rgba(239,68,68,0.12)",
                color: "rgba(239,68,68,0.90)",
                border: "1px solid rgba(239,68,68,0.25)"
              },
              children: topUp.error.message
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "settings.topup_back_button",
                onClick: () => setStep("address"),
                className: "flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors",
                style: {
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.60)"
                },
                children: "← Späť"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "settings.topup_confirm_button",
                onClick: handleConfirm,
                disabled: !blockIndex.trim() || topUp.isPending,
                className: "flex-[2] rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-40",
                style: {
                  background: "linear-gradient(135deg, rgb(var(--theme-color-1-rgb,120,50,200)), rgb(var(--theme-color-2-rgb,60,80,220)))",
                  color: "white"
                },
                children: topUp.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }),
                  "Spracovávam..."
                ] }) : "Potvrdiť platbu"
              }
            )
          ] })
        ] }),
        step === "success" && successData && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "settings.topup_success_state",
            className: "space-y-3 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-12 h-12 rounded-full flex items-center justify-center mx-auto",
                  style: { background: "rgba(34,197,94,0.15)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 22, style: { color: "#22c55e" } })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-sm font-semibold leading-relaxed",
                  style: { color: "rgba(255,255,255,0.85)" },
                  children: [
                    "Úspešne sme premenili",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#22c55e" }, children: [
                      (Number(successData.icpUsed) / 1e8).toFixed(3),
                      " ICP"
                    ] }),
                    " ",
                    "na",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#38bdf8" }, children: [
                      (Number(successData.cyclesMinted) / 1e12).toFixed(
                        1
                      ),
                      " ",
                      "Trillion Cycles"
                    ] }),
                    " ",
                    "pre tvoj trezor."
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "settings.topup_done_button",
                  onClick: onClose,
                  className: "w-full rounded-xl py-2.5 text-sm font-semibold transition-all hover:scale-[1.01]",
                  style: {
                    background: "rgba(34,197,94,0.20)",
                    color: "#22c55e",
                    border: "1px solid rgba(34,197,94,0.30)"
                  },
                  children: "Zatvoriť"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function CyclesCard({
  onTopUpClick,
  calculatedIcp,
  showTopUp,
  setShowTopUp
}) {
  const { t } = useTranslation();
  const { data: health, isLoading, isError } = useGetMyHealthStatus();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionCard,
      {
        title: t("settings.cyclesManagement"),
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 animate-pulse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-4 rounded-full w-full",
              style: { background: "rgba(255,255,255,0.09)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-1 h-24 rounded-2xl",
                style: { background: "rgba(255,255,255,0.06)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-1 h-24 rounded-2xl",
                style: { background: "rgba(255,255,255,0.06)" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-12 rounded-2xl w-full",
              style: { background: "rgba(255,255,255,0.06)" }
            }
          )
        ] })
      }
    );
  }
  if (isError || !health) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionCard,
      {
        title: t("settings.cyclesManagement"),
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "settings.cycles_empty_state",
            className: "rounded-2xl p-6 text-center",
            style: {
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "rgba(255,255,255,0.45)" }, children: t("settings.cyclesCard.noCollection") })
          }
        )
      }
    );
  }
  const color = health.healthColor;
  const hex = HEALTH_HEX[color] ?? HEALTH_HEX.green;
  const fillPct = Math.min(100, Math.max(5, Number(health.daysPercentage)));
  const healthText = color === "green" ? t("settings.cyclesCard.healthGreen") : color === "orange" ? t("settings.cyclesCard.healthYellow") : t("settings.cyclesCard.healthRed");
  const trillionCycles = (Number(health.rawCycles) / 1e12).toFixed(
    2
  );
  const storageMB = Number(health.estimatedStorageMB);
  const handleTopUpClick = () => {
    setShowTopUp(true);
    onTopUpClick();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SectionCard,
    {
      title: t("settings.cyclesManagement"),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HealthBar, { color, fillPct }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "w-2.5 h-2.5 rounded-full flex-shrink-0",
              style: {
                background: hex,
                boxShadow: `0 0 8px ${HEALTH_GLOW[color]}`
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              "data-ocid": "settings.health_status_text",
              className: "text-sm font-semibold",
              style: { color: hex },
              children: healthText
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              ocid: "settings.days_remaining_card",
              label: t("settings.cyclesCard.daysRemaining"),
              value: health.daysRemaining,
              unit: t("settings.cyclesCard.days"),
              color: hex,
              expertLine: `${trillionCycles} Trillion Cycles`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              ocid: "settings.images_remaining_card",
              label: t("settings.cyclesCard.imagesRemaining"),
              value: health.imagesRemaining,
              unit: t("settings.cyclesCard.images"),
              color: "rgba(255,255,255,0.85)",
              expertLine: `${storageMB} MB voľného miesta`
            }
          )
        ] }),
        health.status && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-sm leading-relaxed",
            style: { color: "rgba(255,255,255,0.48)" },
            children: health.status
          }
        ),
        showTopUp ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          TopUpFlow,
          {
            icpAmount: calculatedIcp,
            onClose: () => setShowTopUp(false)
          }
        ) : (
          /* Top-up CTA */
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "settings.topup_open_button",
              onClick: handleTopUpClick,
              className: "relative overflow-hidden w-full rounded-2xl py-3.5 font-display font-bold text-sm uppercase tracking-widest text-white transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2",
              style: {
                background: "linear-gradient(135deg, rgb(var(--theme-color-1-rgb,120,50,200)), rgb(var(--theme-color-2-rgb,60,80,220)))",
                boxShadow: "0 4px 20px rgba(0,0,0,0.30)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16 }),
                t("settings.cyclesCard.topUpButton"),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14, className: "opacity-60" })
              ]
            }
          )
        )
      ]
    }
  );
}
function CalculatorCard({
  calcRef,
  onIcpChange,
  onTopUpRequest
}) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: calcRef, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    SectionCard,
    {
      title: t("settings.calculator.title"),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14 }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CyclesCalculator,
        {
          onTopUp: (icp) => {
            onIcpChange(icp);
            onTopUpRequest();
          },
          onIcpChange
        }
      )
    }
  ) });
}
function AdminTreasuryCard() {
  const { identity } = useInternetIdentity();
  const { data: adminPrincipal } = useGetAdminPrincipal();
  const { data: platformFees, refetch: refetchFees } = useGetPlatformFees();
  const withdraw = useWithdrawPlatformFees();
  const [withdrawSuccess, setWithdrawSuccess] = reactExports.useState(null);
  const userPrincipal = identity == null ? void 0 : identity.getPrincipal().toText();
  const isAdmin = !!userPrincipal && userPrincipal === adminPrincipal;
  if (!isAdmin) return null;
  const feesIcp = platformFees ? (Number(platformFees) / 1e8).toFixed(3) : "0.000";
  const handleWithdraw = async () => {
    if (!userPrincipal) return;
    try {
      const result = await withdraw.mutateAsync(userPrincipal);
      setWithdrawSuccess(result);
      refetchFees();
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { title: "Pokladňa platformy", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 14 }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-2xl p-4 flex items-center justify-between gap-3",
        style: {
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-[10px] font-semibold uppercase tracking-widest",
              style: { color: "rgba(255,255,255,0.40)" },
              children: "Nazbierané poplatky"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-2xl font-bold font-mono mt-0.5",
              style: { color: "rgba(255,255,255,0.85)" },
              children: [
                feesIcp,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-sm font-normal",
                    style: { color: "rgba(255,255,255,0.40)" },
                    children: "ICP"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-[10px] mt-1",
              style: { color: "rgba(255,255,255,0.25)" },
              children: "25% platforma podiel"
            }
          )
        ] })
      }
    ),
    withdraw.error && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        "data-ocid": "settings.treasury_error_state",
        className: "text-xs rounded-lg px-3 py-2",
        style: {
          background: "rgba(239,68,68,0.12)",
          color: "rgba(239,68,68,0.90)",
          border: "1px solid rgba(239,68,68,0.25)"
        },
        children: withdraw.error.message
      }
    ),
    withdrawSuccess !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "p",
      {
        "data-ocid": "settings.treasury_success_state",
        className: "text-xs rounded-lg px-3 py-2",
        style: {
          background: "rgba(34,197,94,0.12)",
          color: "rgba(34,197,94,0.90)",
          border: "1px solid rgba(34,197,94,0.25)"
        },
        children: [
          "Úspešne prevedené ",
          (Number(withdrawSuccess) / 1e8).toFixed(3),
          " ",
          "ICP na vašu peňaženku"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": "settings.withdraw_fees_button",
        onClick: handleWithdraw,
        disabled: withdraw.isPending || !platformFees || platformFees === 0n,
        className: "w-full rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed",
        style: {
          background: "linear-gradient(135deg, rgba(251,191,36,0.25), rgba(245,158,11,0.25))",
          color: "#fbbf24",
          border: "1px solid rgba(251,191,36,0.30)"
        },
        children: withdraw.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }),
          "Spracovávam..."
        ] }) : "Vybrať na moju peňaženku"
      }
    )
  ] });
}
function ThemeAccordion() {
  const { t } = useTranslation();
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-3xl overflow-hidden",
      style: {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "settings.theme_toggle_button",
            onClick: () => setOpen((v) => !v),
            className: "w-full flex items-center justify-between gap-3 px-6 py-5 transition-colors duration-200 hover:bg-white/[0.03]",
            "aria-expanded": open,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-display text-[10px] font-bold uppercase tracking-[0.14em]",
                  style: { color: "rgba(255,255,255,0.50)" },
                  children: t("aria.designSettings")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronDown,
                {
                  size: 16,
                  className: "transition-transform duration-200 flex-shrink-0",
                  style: {
                    color: "rgba(255,255,255,0.38)",
                    transform: open ? "rotate(180deg)" : "rotate(0deg)"
                  }
                }
              )
            ]
          }
        ),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "px-6 pb-6",
            style: { borderTop: "1px solid rgba(255,255,255,0.06)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeSettingsInline, {}) })
          }
        )
      ]
    }
  );
}
function ThemeSettingsInline() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ThemeSettingsPanel,
    {
      isOpen: true,
      setIsOpen: () => {
      }
    }
  );
}
function SettingsPage() {
  const { t } = useTranslation();
  const calcRef = reactExports.useRef(null);
  const [calculatedIcp, setCalculatedIcp] = reactExports.useState(0);
  const [showTopUp, setShowTopUp] = reactExports.useState(false);
  function scrollToCalc() {
    var _a;
    (_a = calcRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "settings.page",
      className: "min-h-screen bg-background px-4 py-8",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h1",
            {
              className: "font-display text-2xl font-bold tracking-tight",
              style: { color: "rgba(255,255,255,0.90)" },
              children: t("settings.title")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm mt-1",
              style: { color: "rgba(255,255,255,0.38)" },
              children: t("misc.appName")
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "settings.cycles_section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          CyclesCard,
          {
            onTopUpClick: scrollToCalc,
            calculatedIcp,
            showTopUp,
            setShowTopUp
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "settings.calculator_section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          CalculatorCard,
          {
            calcRef,
            onIcpChange: setCalculatedIcp,
            onTopUpRequest: () => {
              setShowTopUp(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "settings.treasury_section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminTreasuryCard, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "settings.theme_section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeAccordion, {}) })
      ] })
    }
  );
}
export {
  SettingsPage as default
};
