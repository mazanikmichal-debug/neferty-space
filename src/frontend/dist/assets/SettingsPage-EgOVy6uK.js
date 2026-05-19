import { e as createLucideIcon, P as Principal, r as reactExports, j as jsxRuntimeExports, C as Check, u as useTranslation, l as useBackend, i as useInternetIdentity, m as useQueryClient, f as Copy, g as copyToClipboard } from "./index-d4CSy73B.js";
import { g as useGetICPPrice, h as useQuery, i as useGetMyHealthStatus, j as useGetStatus, k as useProcessTopUp, l as useGetMyPendingTransactions, m as useRetryTopUp, n as useListAdmins, o as useAddAdmin, p as useRemoveAdmin, q as useGetPlatformFees, r as useWithdrawPlatformFees, s as useGetAllPendingTransactions, t as useAdminRetryTopUp } from "./useQueries-eFwKLunX.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["line", { x1: "22", x2: "2", y1: "12", y2: "12", key: "1y58io" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ],
  ["line", { x1: "6", x2: "6.01", y1: "16", y2: "16", key: "sgf278" }],
  ["line", { x1: "10", x2: "10.01", y1: "16", y2: "16", key: "1l4acy" }]
];
const HardDrive = createLucideIcon("hard-drive", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode$2);
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
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode$1);
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
function isPlugAvailable() {
  var _a;
  return typeof window !== "undefined" && !!((_a = window.ic) == null ? void 0 : _a.plug);
}
async function requestPlugConnect(whitelist) {
  if (!isPlugAvailable()) return false;
  try {
    const result = await window.ic.plug.requestConnect({
      whitelist,
      host: "https://icp-api.io"
    });
    return !!result;
  } catch {
    return false;
  }
}
async function sendICPViaPlug(to, amount) {
  if (!isPlugAvailable()) return null;
  try {
    const result = await window.ic.plug.requestTransfer({
      to,
      amount,
      // CMC top-up MUST use memo 1347768404 (0x50555054 = "PUPT").
      // Any other value — computed ratio, 0, or wrong constant — causes CMC to
      // immediately refund with "Memo does not correspond to any CMC operation".
      opts: { fee: 1e4, memo: 1347768404 }
    });
    const raw = (result == null ? void 0 : result.blockIndex) ?? (result == null ? void 0 : result.block_index) ?? (result == null ? void 0 : result.height) ?? (result == null ? void 0 : result.blockHeight);
    if (raw == null) {
      console.warn(
        "[Plug] No blockIndex found in requestTransfer response:",
        result
      );
      throw new Error(
        "Plug Wallet nevrátil block index. Skús znova alebo použi núdzové pole."
      );
    }
    return { blockIndex: BigInt(raw) };
  } catch (err) {
    if (err instanceof Error && err.message.includes("Plug Wallet nevrátil"))
      throw err;
    return null;
  }
}
const CMC_CANISTER_ID = "rkp4c-7iaaa-aaaaa-aaaca-cai";
const SHA224_K = [
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
];
function sha224(data) {
  let h0 = 3238371032;
  let h1 = 914150663;
  let h2 = 812702999;
  let h3 = 4144912697;
  let h4 = 4290775857;
  let h5 = 1750603025;
  let h6 = 1694076839;
  let h7 = 3204075428;
  const len = data.length;
  const bitLen = len * 8;
  const padLen = len + 9 + 63 & -64;
  const padded = new Uint8Array(padLen);
  padded.set(data);
  padded[len] = 128;
  const dv = new DataView(padded.buffer);
  dv.setUint32(padLen - 4, bitLen >>> 0, false);
  dv.setUint32(padLen - 8, Math.floor(bitLen / 4294967296), false);
  const rotr32 = (x, n) => x >>> n | x << 32 - n;
  for (let i = 0; i < padLen; i += 64) {
    const w = new Uint32Array(64);
    for (let j = 0; j < 16; j++) {
      w[j] = dv.getUint32(i + j * 4, false);
    }
    for (let j = 16; j < 64; j++) {
      const s0 = rotr32(w[j - 15], 7) ^ rotr32(w[j - 15], 18) ^ w[j - 15] >>> 3;
      const s1 = rotr32(w[j - 2], 17) ^ rotr32(w[j - 2], 19) ^ w[j - 2] >>> 10;
      w[j] = w[j - 16] + s0 + w[j - 7] + s1 >>> 0;
    }
    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;
    for (let j = 0; j < 64; j++) {
      const S1 = rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25);
      const ch = e & f ^ ~e & g;
      const temp1 = h + S1 + ch + SHA224_K[j] + w[j] >>> 0;
      const S0 = rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22);
      const maj = a & b ^ a & c ^ b & c;
      const temp2 = S0 + maj >>> 0;
      h = g;
      g = f;
      f = e;
      e = d + temp1 >>> 0;
      d = c;
      c = b;
      b = a;
      a = temp1 + temp2 >>> 0;
    }
    h0 = h0 + a >>> 0;
    h1 = h1 + b >>> 0;
    h2 = h2 + c >>> 0;
    h3 = h3 + d >>> 0;
    h4 = h4 + e >>> 0;
    h5 = h5 + f >>> 0;
    h6 = h6 + g >>> 0;
  }
  const result = new Uint8Array(28);
  const rv = new DataView(result.buffer);
  rv.setUint32(0, h0, false);
  rv.setUint32(4, h1, false);
  rv.setUint32(8, h2, false);
  rv.setUint32(12, h3, false);
  rv.setUint32(16, h4, false);
  rv.setUint32(20, h5, false);
  rv.setUint32(24, h6, false);
  return result;
}
function crc32(data) {
  let crc = 4294967295;
  for (const byte of data) {
    crc ^= byte;
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? crc >>> 1 ^ 3988292384 : crc >>> 1;
    }
  }
  crc = (crc ^ 4294967295) >>> 0;
  const out = new Uint8Array(4);
  out[0] = crc >>> 24 & 255;
  out[1] = crc >>> 16 & 255;
  out[2] = crc >>> 8 & 255;
  out[3] = crc & 255;
  return out;
}
function computeCmcDepositAddress(targetCanisterPrincipalText) {
  const cmcBytes = Principal.fromText(CMC_CANISTER_ID).toUint8Array();
  const targetBytes = Principal.fromText(
    targetCanisterPrincipalText
  ).toUint8Array();
  const subaccount = new Uint8Array(32);
  subaccount[0] = targetBytes.length;
  subaccount.set(targetBytes, 1);
  const domainBytes = new Uint8Array([
    10,
    97,
    99,
    99,
    111,
    117,
    110,
    116,
    45,
    105,
    100
  ]);
  const msg = new Uint8Array(domainBytes.length + cmcBytes.length + 32);
  let offset = 0;
  msg.set(domainBytes, offset);
  offset += domainBytes.length;
  msg.set(cmcBytes, offset);
  offset += cmcBytes.length;
  msg.set(subaccount, offset);
  const hash28 = sha224(msg);
  const crc = crc32(hash28);
  const accountId = new Uint8Array(32);
  accountId.set(crc, 0);
  accountId.set(hash28, 4);
  return Array.from(accountId).map((b) => b.toString(16).padStart(2, "0")).join("");
}
const GB_PRICE_USD = 6.66;
const FACTORY_CANISTER_ID = "3shfw-daaaa-aaaag-aywla-cai";
function icpToGb(icp, icpPrice) {
  if (icpPrice <= 0) return 0;
  return icp * icpPrice / GB_PRICE_USD;
}
function gbToIcp(gb, icpPrice) {
  if (icpPrice <= 0) return 0;
  return gb * GB_PRICE_USD / icpPrice;
}
const inputBase = "w-full rounded-xl px-3 py-3 text-sm text-white/90 placeholder:text-white/25 outline-none focus:ring-1 focus:ring-white/30 transition-all bg-transparent";
const inputWrap = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.13)",
  backdropFilter: "blur(8px)"
};
const addonStyle = {
  color: "rgba(255,255,255,0.45)",
  borderLeft: "1px solid rgba(255,255,255,0.10)"
};
function CyclesCalculator({
  onTopUp = () => {
  },
  onClose = () => {
  },
  onIcpChange
}) {
  const { data: icpPrice, isLoading: icpPriceLoading } = useGetICPPrice();
  const priceReady = icpPrice != null && icpPrice > 0;
  const currentIcpPrice = icpPrice ?? 2.5;
  const [icpRaw, setIcpRaw] = reactExports.useState("1");
  const [gbRaw, setGbRaw] = reactExports.useState(() => icpToGb(1, 2.5).toFixed(3));
  const [flowState, setFlowState] = reactExports.useState("idle");
  const [flowError, setFlowError] = reactExports.useState("");
  const [successData, setSuccessData] = reactExports.useState(null);
  const [failedBlockIndex, setFailedBlockIndex] = reactExports.useState(null);
  function onIcpChangeHandler(raw) {
    setIcpRaw(raw);
    const val = Number.parseFloat(raw);
    if (!Number.isNaN(val) && val > 0) {
      setGbRaw(icpToGb(val, currentIcpPrice).toFixed(3));
      onIcpChange == null ? void 0 : onIcpChange(val);
    } else {
      setGbRaw("");
      onIcpChange == null ? void 0 : onIcpChange(0);
    }
  }
  function onGbChangeHandler(raw) {
    setGbRaw(raw);
    const val = Number.parseFloat(raw);
    if (!Number.isNaN(val) && val > 0) {
      const icp = gbToIcp(val, currentIcpPrice);
      setIcpRaw(icp.toFixed(4));
      onIcpChange == null ? void 0 : onIcpChange(icp);
    } else {
      setIcpRaw("");
      onIcpChange == null ? void 0 : onIcpChange(0);
    }
  }
  const parsedIcp = Number.parseFloat(icpRaw);
  const computedIcp = !Number.isNaN(parsedIcp) && parsedIcp > 0 ? parsedIcp : 0;
  const usdEquiv = (computedIcp * currentIcpPrice).toFixed(2);
  const canPay = computedIcp > 0 && flowState === "idle" && priceReady;
  const depositAddress = computeCmcDepositAddress(FACTORY_CANISTER_ID);
  const plugInstalled = isPlugAvailable();
  async function handlePay() {
    if (!canPay) return;
    setFlowState("signing");
    setFlowError("");
    setFailedBlockIndex(null);
    try {
      const connected = await requestPlugConnect([CMC_CANISTER_ID]);
      if (!connected) {
        setFlowState("rejected");
        return;
      }
      const amountE8s = Math.round(computedIcp * 1e8);
      const transferResult = await sendICPViaPlug(depositAddress, amountE8s);
      if (!transferResult) {
        setFlowState("rejected");
        return;
      }
      setFlowState("processing");
      const { blockIndex } = transferResult;
      try {
        onTopUp(computedIcp);
        setSuccessData({ icpUsed: BigInt(amountE8s), cyclesMinted: 0n });
        setFlowState("success");
      } catch (topUpErr) {
        setFlowError(
          topUpErr instanceof Error ? topUpErr.message : "Nepodarilo sa spracovať platbu"
        );
        setFailedBlockIndex(blockIndex);
        setFlowState("error");
      }
    } catch (err) {
      setFlowError(err instanceof Error ? err.message : "Neznáma chyba");
      setFlowState("error");
    }
  }
  function resetFlow() {
    setFlowState("idle");
    setFlowError("");
    setSuccessData(null);
    setFailedBlockIndex(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "calc-icp",
            className: "text-[10px] font-bold uppercase tracking-widest block",
            style: { color: "rgba(255,255,255,0.40)" },
            children: "ICP"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center rounded-xl overflow-hidden",
            style: inputWrap,
            children: [
              icpPriceLoading && !priceReady ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 px-3 py-3 flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                LoaderCircle,
                {
                  size: 12,
                  className: "animate-spin",
                  style: { color: "rgba(255,255,255,0.35)" }
                }
              ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "calc-icp",
                  "data-ocid": "calculator.icp_input",
                  type: "number",
                  min: 0,
                  step: 1e-4,
                  value: icpRaw,
                  onChange: (e) => onIcpChangeHandler(e.target.value),
                  placeholder: "1",
                  disabled: !priceReady,
                  className: inputBase
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "px-3 text-xs font-bold flex-shrink-0",
                  style: addonStyle,
                  children: "ICP"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: "text-[10px] pl-1",
            style: { color: "rgba(255,255,255,0.30)" },
            children: [
              "≈ ",
              usdEquiv,
              " USD"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "calc-gb",
            className: "text-[10px] font-bold uppercase tracking-widest block",
            style: { color: "rgba(255,255,255,0.40)" },
            children: "GB"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center rounded-xl overflow-hidden",
            style: inputWrap,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "calc-gb",
                  "data-ocid": "calculator.gb_input",
                  type: "number",
                  min: 0,
                  step: 1e-3,
                  value: gbRaw,
                  onChange: (e) => onGbChangeHandler(e.target.value),
                  placeholder: "1",
                  className: inputBase
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "px-3 text-xs font-bold flex-shrink-0",
                  style: addonStyle,
                  children: "GB"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-[10px] pl-1",
            style: { color: "rgba(255,255,255,0.30)" },
            children: " "
          }
        )
      ] })
    ] }),
    !plugInstalled && flowState === "idle" && computedIcp > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-2.5 rounded-xl px-4 py-3",
        style: {
          background: "rgba(251,191,36,0.10)",
          border: "1px solid rgba(251,191,36,0.28)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TriangleAlert,
            {
              size: 13,
              style: { color: "#fbbf24", flexShrink: 0, marginTop: 1 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", style: { color: "rgba(251,191,36,0.88)" }, children: [
            "Plug Wallet nie je nainštalovaný.",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://plugwallet.ooo/",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "underline font-semibold",
                children: "Nainštaluj Plug Wallet"
              }
            )
          ] })
        ]
      }
    ),
    flowState === "signing" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "calculator.loading_state",
        className: "flex flex-col items-center gap-3 py-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            LoaderCircle,
            {
              size: 26,
              className: "animate-spin",
              style: { color: "rgba(167,139,250,0.80)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-center",
              style: { color: "rgba(255,255,255,0.60)" },
              children: "Čakáme na tvoj podpis v Plug peňaženke..."
            }
          )
        ]
      }
    ),
    flowState === "processing" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "calculator.loading_state",
        className: "flex flex-col items-center gap-3 py-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            LoaderCircle,
            {
              size: 26,
              className: "animate-spin",
              style: { color: "#38bdf8" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-center",
              style: { color: "rgba(255,255,255,0.60)" },
              children: "Spracovávam platbu..."
            }
          )
        ]
      }
    ),
    flowState === "success" && successData && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "calculator.success_state",
        className: "rounded-2xl p-4 text-center space-y-3",
        style: {
          background: "rgba(34,197,94,0.08)",
          border: "1px solid rgba(34,197,94,0.25)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-10 h-10 rounded-full flex items-center justify-center mx-auto",
              style: { background: "rgba(34,197,94,0.15)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 18, style: { color: "#22c55e" } })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm font-semibold",
              style: { color: "rgba(255,255,255,0.85)" },
              children: "Platba odoslaná!"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "calculator.done_button",
              onClick: onClose,
              className: "w-full rounded-xl py-2 text-xs font-semibold transition-all hover:scale-[1.01]",
              style: {
                background: "rgba(34,197,94,0.18)",
                color: "#22c55e",
                border: "1px solid rgba(34,197,94,0.28)"
              },
              children: "Zatvoriť"
            }
          )
        ]
      }
    ),
    flowState === "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "calculator.error_state", className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs rounded-xl px-3 py-2",
          style: {
            background: "rgba(239,68,68,0.10)",
            color: "rgba(239,68,68,0.88)",
            border: "1px solid rgba(239,68,68,0.22)"
          },
          children: "Platba zamietnutá. Skús znova."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "calculator.retry_button",
          onClick: resetFlow,
          className: "w-full rounded-xl py-2 text-xs font-semibold transition-colors",
          style: {
            background: "rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.60)"
          },
          children: "Skúsiť znova"
        }
      )
    ] }),
    flowState === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "calculator.error_state", className: "space-y-2", children: [
      failedBlockIndex !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-2 rounded-xl px-3 py-2.5",
          style: {
            background: "rgba(251,191,36,0.10)",
            border: "1px solid rgba(251,191,36,0.26)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TriangleAlert,
              {
                size: 12,
                style: { color: "#fbbf24", flexShrink: 0, marginTop: 1 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", style: { color: "rgba(251,191,36,0.88)" }, children: [
              "Platba prebehla (block #",
              failedBlockIndex.toString(),
              "), ale premena na cycles zlyhala. Použi núdzovú synchronizáciu."
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs rounded-xl px-3 py-2",
          style: {
            background: "rgba(239,68,68,0.10)",
            color: "rgba(239,68,68,0.88)",
            border: "1px solid rgba(239,68,68,0.22)"
          },
          children: flowError || "Neznáma chyba pri platbe."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "calculator.retry_button",
          onClick: resetFlow,
          className: "w-full rounded-xl py-2 text-xs font-semibold transition-colors",
          style: {
            background: "rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.60)"
          },
          children: "Skúsiť znova"
        }
      )
    ] }),
    (flowState === "idle" || flowState === "rejected" || flowState === "error") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": "calculator.topup_button",
        disabled: !canPay || !plugInstalled,
        onClick: handlePay,
        className: "relative overflow-hidden w-full rounded-2xl py-4 min-h-[52px] font-display font-bold text-sm uppercase tracking-widest text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-35 disabled:scale-100 disabled:cursor-not-allowed",
        style: {
          boxShadow: canPay ? "0 4px 16px rgba(0,0,0,0.2)" : "none"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "absolute inset-0 rounded-2xl",
              "aria-hidden": "true",
              style: {
                background: canPay ? "linear-gradient(135deg, rgb(var(--theme-color-1-rgb,180,80,220)), rgb(var(--theme-color-2-rgb,80,80,220)))" : "rgba(255,255,255,0.08)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative z-[1] flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
            "Dobiť"
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
function CorruptedRegistryBanner() {
  return null;
}
function PendingTransactionsSection() {
  const { data: pending } = useGetMyPendingTransactions();
  const retryTopUp = useRetryTopUp();
  const queryClient = useQueryClient();
  if (!pending || pending.length === 0) return null;
  const handleRetry = (tx) => {
    retryTopUp.mutate(tx.blockIndex, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["myPendingTransactions"] });
        queryClient.invalidateQueries({ queryKey: ["myHealthStatus"] });
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SectionCard,
    {
      title: "Problematické platby",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 14, style: { color: "#f97316" } }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: pending.map((tx, i) => {
        const amountIcp = (Number(tx.amount) / 1e8).toFixed(4);
        const retryCount = Number(tx.retryCount);
        const date = new Date(
          Number(tx.createdAt / 1000000n)
        ).toLocaleString("sk-SK");
        const maxed = retryCount >= 3;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `settings.pending_tx.item.${i + 1}`,
            className: "rounded-xl px-4 py-3 flex flex-col gap-2",
            style: {
              background: "rgba(251,191,36,0.07)",
              border: "1px solid rgba(251,191,36,0.22)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-sm font-mono font-semibold",
                      style: { color: "rgba(255,255,255,0.85)" },
                      children: [
                        amountIcp,
                        " ICP"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-[10px]",
                      style: { color: "rgba(255,255,255,0.38)" },
                      children: date
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full",
                    style: {
                      background: "rgba(251,191,36,0.15)",
                      color: "rgba(251,191,36,0.90)",
                      border: "1px solid rgba(251,191,36,0.28)"
                    },
                    children: "Čaká na spracovanie"
                  }
                )
              ] }),
              maxed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-[10px]",
                  style: { color: "rgba(239,68,68,0.80)" },
                  children: "Maximálny počet pokusov. Kontaktujte podporu."
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-[10px]",
                    style: { color: "rgba(255,255,255,0.35)" },
                    children: [
                      "Pokus ",
                      retryCount,
                      "/3"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `settings.pending_tx_retry_button.${i + 1}`,
                    onClick: () => handleRetry(tx),
                    disabled: retryTopUp.isPending,
                    className: "text-[10px] font-semibold px-3 py-1 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-40",
                    style: {
                      background: "rgba(251,191,36,0.15)",
                      color: "rgba(251,191,36,0.90)",
                      border: "1px solid rgba(251,191,36,0.28)"
                    },
                    children: retryTopUp.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 10, className: "animate-spin" }),
                      "Spracovávam..."
                    ] }) : "Skúsiť znova"
                  }
                )
              ] })
            ]
          },
          tx.blockIndex.toString()
        );
      }) })
    }
  );
}
function AdminPaymentMonitor() {
  const { identity } = useInternetIdentity();
  const { data: allPending } = useGetAllPendingTransactions();
  const adminRetryTopUp = useAdminRetryTopUp();
  const { data: adminList } = useListAdmins();
  const userPrincipal = identity == null ? void 0 : identity.getPrincipal().toText();
  const isAdmin = !!userPrincipal && (adminList ?? []).some((p) => p.toText() === userPrincipal);
  if (!isAdmin) return null;
  const txList = allPending ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Platobný monitoring", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 14 }), children: txList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "settings.admin_payments_empty_state",
      className: "flex items-center gap-2 py-2",
      style: { color: "rgba(34,197,94,0.75)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Všetky platby spracované" })
      ]
    }
  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "tr",
      {
        style: {
          borderBottom: "1px solid rgba(255,255,255,0.08)"
        },
        children: ["Principal", "Suma ICP", "Dátum", "Stav", "Pokusy", ""].map(
          (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: "pb-2 text-left font-semibold uppercase tracking-wider",
              style: { color: "rgba(255,255,255,0.35)" },
              children: h
            },
            h
          )
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: txList.map((tx, i) => {
      const amountIcp = (Number(tx.amount) / 1e8).toFixed(2);
      const callerText = tx.caller.toText();
      const shortCaller = callerText.length > 12 ? `${callerText.slice(0, 12)}...` : callerText;
      const date = new Date(
        Number(tx.createdAt / 1000000n)
      ).toLocaleDateString("sk-SK");
      const retryCount = Number(tx.retryCount);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `settings.admin_payment_row.${i + 1}`,
          style: {
            borderBottom: "1px solid rgba(255,255,255,0.05)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: "py-2 pr-3 font-mono",
                style: { color: "rgba(255,255,255,0.70)" },
                children: shortCaller
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: "py-2 pr-3 font-mono",
                style: { color: "rgba(255,255,255,0.80)" },
                children: amountIcp
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: "py-2 pr-3",
                style: { color: "rgba(255,255,255,0.50)" },
                children: date
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                style: {
                  background: "rgba(251,191,36,0.15)",
                  color: "rgba(251,191,36,0.90)"
                },
                children: "Čaká"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: "py-2 pr-3 text-center",
                style: { color: "rgba(255,255,255,0.45)" },
                children: retryCount
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `settings.admin_retry_button.${i + 1}`,
                onClick: () => adminRetryTopUp.mutate(tx.blockIndex),
                disabled: adminRetryTopUp.isPending,
                className: "text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-40",
                style: {
                  background: "rgba(139,92,246,0.18)",
                  color: "rgba(167,139,250,0.90)",
                  border: "1px solid rgba(139,92,246,0.30)"
                },
                children: "Retry"
              }
            ) })
          ]
        },
        tx.blockIndex.toString()
      );
    }) })
  ] }) }) });
}
const MAX_CYCLES = 10000000000000n;
const ZERO_PRINCIPAL_TEXT = "aaaaa-aa";
function isZeroPrincipal(p) {
  if (!p) return false;
  try {
    return p.toText() === ZERO_PRINCIPAL_TEXT;
  } catch {
    return false;
  }
}
function cyclesPercent(cycles) {
  return Math.min(100, Math.round(Number(cycles * 100n / MAX_CYCLES)));
}
function cyclesColor(pct) {
  if (pct > 50) return "green";
  if (pct >= 20) return "orange";
  return "red";
}
function CanisterStatusCard() {
  const { t } = useTranslation();
  const [expertMode, setExpertMode] = reactExports.useState(false);
  const { data: status, isLoading, isError } = useGetStatus();
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
          ] })
        ] })
      }
    );
  }
  if (isError || status === null || status === void 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionCard,
      {
        title: t("settings.cyclesManagement"),
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            "data-ocid": "settings.cycles_error_state",
            className: "text-sm text-center py-4",
            style: { color: "rgba(255,255,255,0.38)" },
            children: "Štatistiky nedostupné"
          }
        )
      }
    );
  }
  const { cycles, memory, heap_memory } = status;
  const pct = cyclesPercent(cycles);
  const color = cyclesColor(pct);
  const hex = HEALTH_HEX[color];
  const isCritical = pct < 20;
  const trillionCycles = (Number(cycles) / 1e12).toFixed(2);
  const memoryMB = (Number(memory) / (1024 * 1024)).toFixed(1);
  const heapMB = (Number(heap_memory) / (1024 * 1024)).toFixed(1);
  const prepaidMB = Math.round(Number(cycles) / 4e12 * 1024);
  const usedMB = Math.round(Number(memory) / 1048576);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SectionCard,
    {
      title: t("settings.cyclesManagement"),
      icon: isCritical ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 14, style: { color: "#ef4444" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HealthBar, { color, fillPct: pct }),
        isCritical && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "settings.cycles_critical_alert",
            className: "flex items-center gap-2.5 rounded-xl px-4 py-3",
            style: {
              background: "rgba(239,68,68,0.13)",
              border: "1px solid rgba(239,68,68,0.35)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TriangleAlert,
                {
                  size: 15,
                  style: { color: "#ef4444", flexShrink: 0 }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs font-semibold",
                  style: { color: "rgba(239,68,68,0.92)" },
                  children: "Pozor: Zásoby cycles sú kriticky nízke! Doplňte čo najskôr."
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
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
                children: color === "green" ? t("settings.cyclesCard.healthGreen") : color === "orange" ? t("settings.cyclesCard.healthYellow") : t("settings.cyclesCard.healthRed")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs", style: { color: "rgba(255,255,255,0.30)" }, children: [
              pct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "settings.expert_mode_toggle",
              onClick: () => setExpertMode((v) => !v),
              className: "text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors duration-200",
              style: {
                background: expertMode ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.07)",
                color: expertMode ? "rgba(167,139,250,0.90)" : "rgba(255,255,255,0.38)",
                border: expertMode ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.10)"
              },
              children: "Expert"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-xl overflow-hidden",
            style: {
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "w-full text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { borderBottom: "1px solid rgba(255,255,255,0.06)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    className: "px-3 py-2",
                    style: { color: "rgba(255,255,255,0.38)", width: "35%" },
                    children: "Cycles"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "td",
                  {
                    className: "px-3 py-2 font-mono font-semibold",
                    style: { color: hex },
                    children: [
                      trillionCycles,
                      " T"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    className: "px-3 py-2",
                    style: { color: "rgba(255,255,255,0.38)" },
                    children: expertMode ? "Heap" : "Pamäť"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "td",
                  {
                    className: "px-3 py-2 font-mono font-semibold",
                    style: { color: "rgba(255,255,255,0.75)" },
                    children: [
                      expertMode ? heapMB : memoryMB,
                      " MB"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    className: "px-3 py-2",
                    style: { color: "rgba(255,255,255,0.38)" },
                    children: "Využité MB"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "td",
                  {
                    className: "px-3 py-2 font-mono font-semibold",
                    style: { color: "rgba(255,255,255,0.75)" },
                    children: [
                      usedMB,
                      " MB"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    className: "px-3 py-2",
                    style: { color: "rgba(255,255,255,0.38)" },
                    children: "Predplatené MB"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "td",
                  {
                    className: "px-3 py-2 font-mono font-semibold",
                    style: { color: "rgba(255,255,255,0.75)" },
                    children: [
                      prepaidMB,
                      " MB"
                    ]
                  }
                )
              ] })
            ] }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: "1rem"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-[10px] font-semibold uppercase tracking-widest mb-3",
                  style: { color: "rgba(255,255,255,0.35)" },
                  children: "Dobiť cycles"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CyclesCalculator, { onTopUp: () => {
              }, onClose: () => {
              } })
            ]
          }
        )
      ]
    }
  );
}
function CyclesCard() {
  const { t } = useTranslation();
  const { actor } = useBackend();
  const { identity } = useInternetIdentity();
  const { data: collectionPrincipal, isLoading: collectionLoading } = useQuery({
    queryKey: ["myCollectionPrincipal"],
    queryFn: async () => {
      if (!actor || !identity) return null;
      const callerPrincipal = identity.getPrincipal();
      try {
        const result = await actor.getMyCollection(callerPrincipal);
        return result ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !!identity,
    staleTime: 3e5
  });
  const collectionIsZero = isZeroPrincipal(collectionPrincipal);
  const {
    data: health,
    isLoading: healthLoading,
    isError: healthError,
    error: healthErrorObj,
    refetch: healthRefetch
  } = useGetMyHealthStatus();
  const { data: status, isError: statusAdminError } = useGetStatus();
  const [emergencyBlockIndex, setEmergencyBlockIndex] = reactExports.useState("");
  const [emergencyBlockIndexError, setEmergencyBlockIndexError] = reactExports.useState("");
  const [syncOpen, setSyncOpen] = reactExports.useState(false);
  const [emergencyResult, setEmergencyResult] = reactExports.useState(null);
  const processTopUpEmergency = useProcessTopUp();
  const isAdmin = !statusAdminError && status !== null && status !== void 0;
  if (isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CanisterStatusCard, {});
  }
  const isLoading = collectionLoading || healthLoading;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionCard,
      {
        title: t("settings.cyclesManagement"),
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "settings.cycles_loading_state",
            className: "flex flex-col items-center gap-3 py-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                LoaderCircle,
                {
                  size: 28,
                  className: "animate-spin",
                  style: { color: "rgba(167,139,250,0.80)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-sm text-center",
                  style: { color: "rgba(255,255,255,0.55)" },
                  children: "Načítavam živé dáta z blockchainu..."
                }
              )
            ]
          }
        )
      }
    );
  }
  const isNoCollection = !collectionLoading && (!collectionPrincipal || collectionIsZero) || healthError && (healthErrorObj == null ? void 0 : healthErrorObj.message) === "NO_COLLECTION";
  if (isNoCollection && !health) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionCard,
      {
        title: t("settings.cyclesManagement"),
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "settings.cycles_empty_state",
            className: "rounded-2xl p-6 text-center space-y-4",
            style: {
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-12 h-12 rounded-full flex items-center justify-center mx-auto",
                  style: { background: "rgba(34,197,94,0.12)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 20, style: { color: "rgba(34,197,94,0.70)" } })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm font-semibold",
                    style: { color: "rgba(34,197,94,0.85)" },
                    children: "Predvolená zbierka Neferty Space"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs leading-relaxed",
                    style: { color: "rgba(255,255,255,0.38)" },
                    children: "Tvoje NFT sú uložené v hlavnom canistri. Načítavam stav cycles..."
                  }
                )
              ] })
            ]
          }
        )
      }
    );
  }
  if (healthError && (healthErrorObj == null ? void 0 : healthErrorObj.message) !== "NO_COLLECTION" && !health) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionCard,
      {
        title: t("settings.cyclesManagement"),
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "settings.cycles_error_state",
            className: "rounded-2xl p-6 text-center space-y-3",
            style: {
              background: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.20)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "rgba(239,68,68,0.85)" }, children: "Nepodarilo sa načítať stav cycles" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "settings.cycles_retry_button",
                  onClick: () => healthRefetch(),
                  className: "text-xs px-4 py-1.5 rounded-full transition-colors",
                  style: {
                    background: "rgba(239,68,68,0.15)",
                    color: "rgba(239,68,68,0.9)",
                    border: "1px solid rgba(239,68,68,0.30)"
                  },
                  children: "Skúsiť znova"
                }
              )
            ]
          }
        )
      }
    );
  }
  const displayHealth = health ? {
    rawCycles: health.rawCycles,
    estimatedStorageMB: health.estimatedStorageMB,
    healthColor: health.healthColor
  } : null;
  if (!displayHealth) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionCard,
      {
        title: t("settings.cyclesManagement"),
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "settings.cycles_empty_state",
            className: "rounded-2xl p-6 text-center space-y-4",
            style: {
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-12 h-12 rounded-full flex items-center justify-center mx-auto",
                  style: { background: "rgba(34,197,94,0.12)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 20, style: { color: "rgba(34,197,94,0.70)" } })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm font-semibold",
                    style: { color: "rgba(34,197,94,0.85)" },
                    children: "Predvolená zbierka Neferty Space"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs leading-relaxed",
                    style: { color: "rgba(255,255,255,0.38)" },
                    children: "Tvoje NFT sú uložené v hlavnom canistri."
                  }
                )
              ] })
            ]
          }
        )
      }
    );
  }
  const rawCyclesNum = Number(displayHealth.rawCycles);
  const usedMB = Math.round(Number(displayHealth.estimatedStorageMB));
  const prepaidMB = Math.round(rawCyclesNum / 4e12 * 1024);
  const color = displayHealth.healthColor;
  const hex = HEALTH_HEX[color] ?? HEALTH_HEX.green;
  function formatCycles(n) {
    if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
    return n.toLocaleString("sk-SK");
  }
  const cyclesDisplay = formatCycles(rawCyclesNum);
  const glassCard = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)"
  };
  const handleEmergencySync = async () => {
    const trimmed = emergencyBlockIndex.trim();
    setEmergencyBlockIndexError("");
    setEmergencyResult(null);
    if (!trimmed) {
      setEmergencyBlockIndexError("Zadaj číslo bloku");
      return;
    }
    if (!/^\d+$/.test(trimmed)) {
      setEmergencyBlockIndexError(
        "Číslo bloku musí byť celé číslo (napr. 36503278)"
      );
      return;
    }
    try {
      const result = await processTopUpEmergency.mutateAsync({
        blockIndex: BigInt(trimmed),
        collectionId: Principal.fromText("3shfw-daaaa-aaaag-aywla-cai")
      });
      setEmergencyResult({
        ok: `Platba synchronizovaná! +${result.cyclesMinted.toLocaleString()} cycles`
      });
      setEmergencyBlockIndex("");
    } catch (e) {
      setEmergencyResult({
        err: e instanceof Error ? e.message : "Neznáma chyba"
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SectionCard,
    {
      title: t("settings.cyclesManagement"),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "settings.cycles_stats_grid",
            className: "grid grid-cols-2 gap-3 mb-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-6 min-h-[120px]",
                  style: glassCard,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-10 h-10 rounded-xl flex items-center justify-center",
                        style: {
                          background: `rgba(${color === "green" ? "34,197,94" : color === "orange" ? "249,115,22" : "239,68,68"},0.15)`
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 22, strokeWidth: 1.5, style: { color: hex } })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        "data-ocid": "settings.cycles_value",
                        className: "text-2xl font-bold font-mono leading-none tracking-tight",
                        style: { color: hex },
                        children: cyclesDisplay
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[10px] font-bold uppercase tracking-widest",
                        style: { color: "rgba(255,255,255,0.38)" },
                        children: "CYCLES"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-6 min-h-[120px]",
                  style: glassCard,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-10 h-10 rounded-xl flex items-center justify-center",
                        style: { background: "rgba(56,189,248,0.15)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          HardDrive,
                          {
                            size: 22,
                            strokeWidth: 1.5,
                            style: { color: "#38bdf8" }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        "data-ocid": "settings.storage_value",
                        className: "text-2xl font-bold font-mono leading-none tracking-tight",
                        style: { color: "rgba(255,255,255,0.90)" },
                        children: [
                          prepaidMB,
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-base font-semibold",
                              style: { color: "rgba(255,255,255,0.45)" },
                              children: "MB"
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[10px] font-bold uppercase tracking-widest",
                        style: { color: "rgba(255,255,255,0.38)" },
                        children: "STORAGE"
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        usedMB > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: "text-center text-[10px] mb-4",
            style: { color: "rgba(255,255,255,0.28)" },
            children: [
              "Využité:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "rgba(255,255,255,0.55)" }, children: [
                usedMB,
                " MB"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: "1rem"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-[10px] font-bold uppercase tracking-widest mb-3",
                  style: { color: "rgba(255,255,255,0.35)" },
                  children: "Doplniť cycles"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CyclesCalculator, { onTopUp: () => {
              }, onClose: () => {
              } })
            ]
          }
        ),
        actor && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "settings.emergency_sync_section", className: "mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "settings.emergency_sync_toggle",
              onClick: () => setSyncOpen((v) => !v),
              className: "text-[11px] transition-opacity hover:opacity-80",
              style: { color: "rgba(255,255,255,0.28)" },
              children: "Zasekla sa platba? →"
            }
          ),
          syncOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mt-3 rounded-2xl p-4 space-y-3",
              style: {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs",
                    style: { color: "rgba(255,255,255,0.45)" },
                    children: "Zadaj číslo bloku z tvojej peňaženky a klikni Synchronizovať."
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      "data-ocid": "settings.emergency_block_index_input",
                      type: "text",
                      value: emergencyBlockIndex,
                      onChange: (e) => {
                        setEmergencyBlockIndex(e.target.value);
                        setEmergencyBlockIndexError("");
                        setEmergencyResult(null);
                      },
                      placeholder: "napr. 36503278",
                      className: "flex-1 px-3 py-2 text-sm rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-white/20",
                      style: {
                        background: "rgba(255,255,255,0.07)",
                        border: emergencyBlockIndexError ? "1px solid rgba(239,68,68,0.70)" : "1px solid rgba(255,255,255,0.12)"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "settings.emergency_sync_button",
                      onClick: handleEmergencySync,
                      disabled: processTopUpEmergency.isPending,
                      className: "px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                      style: {
                        background: "rgba(251,191,36,0.15)",
                        border: "1px solid rgba(251,191,36,0.35)",
                        color: "rgba(251,191,36,0.90)"
                      },
                      children: processTopUpEmergency.isPending ? "Spracovávam..." : "Synchronizovať"
                    }
                  )
                ] }),
                emergencyBlockIndexError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    "data-ocid": "settings.emergency_block_index_error",
                    className: "text-xs",
                    style: { color: "rgba(239,68,68,0.85)" },
                    children: emergencyBlockIndexError
                  }
                ),
                (emergencyResult == null ? void 0 : emergencyResult.ok) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    "data-ocid": "settings.emergency_sync_success_state",
                    className: "text-xs font-medium",
                    style: { color: "rgba(34,197,94,0.85)" },
                    children: [
                      "✓ ",
                      emergencyResult.ok
                    ]
                  }
                ),
                (emergencyResult == null ? void 0 : emergencyResult.err) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    "data-ocid": "settings.emergency_sync_error_state",
                    className: "text-xs",
                    style: { color: "rgba(239,68,68,0.85)" },
                    children: [
                      "Chyba: ",
                      emergencyResult.err
                    ]
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  );
}
function AdminManagementCard() {
  const { identity } = useInternetIdentity();
  const { data: adminList, isLoading: adminsLoading } = useListAdmins();
  const addAdmin = useAddAdmin();
  const removeAdmin = useRemoveAdmin();
  const userPrincipal = identity == null ? void 0 : identity.getPrincipal().toText();
  const isAdmin = !!userPrincipal && (adminList ?? []).some((p) => p.toText() === userPrincipal);
  const [newPrincipal, setNewPrincipal] = reactExports.useState("");
  const [addError, setAddError] = reactExports.useState("");
  const [addSuccess, setAddSuccess] = reactExports.useState(false);
  const [confirmRemove, setConfirmRemove] = reactExports.useState(null);
  const [removeErrors, setRemoveErrors] = reactExports.useState({});
  if (!isAdmin) return null;
  const handleAdd = async () => {
    setAddError("");
    setAddSuccess(false);
    if (!newPrincipal.trim()) {
      setAddError("Zadajte Principal ID");
      return;
    }
    try {
      const result = await addAdmin.mutateAsync(newPrincipal.trim());
      if ("err" in result) {
        setAddError(result.err);
      } else {
        setAddSuccess(true);
        setNewPrincipal("");
        setTimeout(() => setAddSuccess(false), 3e3);
      }
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Neznáma chyba");
    }
  };
  const handleRemoveConfirm = async (principalText) => {
    setRemoveErrors((prev) => ({ ...prev, [principalText]: "" }));
    try {
      const result = await removeAdmin.mutateAsync(principalText);
      if ("err" in result) {
        setRemoveErrors((prev) => ({ ...prev, [principalText]: result.err }));
      }
    } catch (err) {
      setRemoveErrors((prev) => ({
        ...prev,
        [principalText]: err instanceof Error ? err.message : "Neznáma chyba"
      }));
    } finally {
      setConfirmRemove(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { title: "Správa adminov", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 14 }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-[10px] font-semibold uppercase tracking-widest mb-3",
          style: { color: "rgba(255,255,255,0.35)" },
          children: "Aktuálni admini"
        }
      ),
      adminsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "settings.admin_list_loading_state",
          className: "flex items-center gap-2 py-2",
          style: { color: "rgba(255,255,255,0.40)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 12, className: "animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Načítavam..." })
          ]
        }
      ) : (adminList ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          "data-ocid": "settings.admin_list_empty_state",
          className: "text-xs py-2",
          style: { color: "rgba(255,255,255,0.35)" },
          children: "Žiadni admini nenájdení"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: (adminList ?? []).map((admin, i) => {
        const txt = admin.toText();
        const short = txt.length > 16 ? `${txt.slice(0, 16)}...` : txt;
        const isRemoving = removeAdmin.isPending && confirmRemove === txt;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `settings.admin_item.${i + 1}`,
            className: "flex items-center justify-between gap-2 rounded-xl px-3 py-2",
            style: {
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-mono truncate",
                    style: { color: "rgba(255,255,255,0.70)" },
                    title: txt,
                    children: short
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `settings.admin_copy_button.${i + 1}`,
                    onClick: () => copyToClipboard(txt),
                    className: "flex-shrink-0 p-1 rounded-lg transition-colors hover:bg-white/10",
                    "aria-label": "Kopírovať Principal ID",
                    style: { color: "rgba(255,255,255,0.35)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 11 })
                  }
                )
              ] }),
              removeErrors[txt] && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[10px] px-2 py-0.5 rounded-lg",
                  style: {
                    color: "rgba(239,68,68,0.90)",
                    background: "rgba(239,68,68,0.10)",
                    border: "1px solid rgba(239,68,68,0.20)"
                  },
                  children: removeErrors[txt]
                }
              ),
              confirmRemove === txt ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px]",
                    style: { color: "rgba(255,255,255,0.45)" },
                    children: "Ste si istý?"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `settings.admin_remove_confirm_button.${i + 1}`,
                    onClick: () => handleRemoveConfirm(txt),
                    disabled: isRemoving,
                    className: "text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-40",
                    style: {
                      background: "rgba(239,68,68,0.18)",
                      color: "rgba(239,68,68,0.90)",
                      border: "1px solid rgba(239,68,68,0.30)"
                    },
                    children: isRemoving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 10, className: "animate-spin" }) : "Áno"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `settings.admin_remove_cancel_button.${i + 1}`,
                    onClick: () => setConfirmRemove(null),
                    className: "text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-[1.02]",
                    style: {
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(255,255,255,0.12)"
                    },
                    children: "Nie"
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `settings.admin_remove_button.${i + 1}`,
                  onClick: () => {
                    setConfirmRemove(txt);
                    setRemoveErrors((prev) => ({ ...prev, [txt]: "" }));
                  },
                  disabled: removeAdmin.isPending,
                  className: "flex-shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-40",
                  style: {
                    background: "rgba(239,68,68,0.10)",
                    color: "rgba(239,68,68,0.75)",
                    border: "1px solid rgba(239,68,68,0.20)"
                  },
                  children: "Odstrániť"
                }
              )
            ]
          },
          txt
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "my-1",
        style: { borderTop: "1px solid rgba(255,255,255,0.06)" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-[10px] font-semibold uppercase tracking-widest",
          style: { color: "rgba(255,255,255,0.35)" },
          children: "Pridať admina"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            "data-ocid": "settings.add_admin_input",
            type: "text",
            value: newPrincipal,
            onChange: (e) => {
              setNewPrincipal(e.target.value);
              setAddError("");
              setAddSuccess(false);
            },
            placeholder: "Principal ID nového admina",
            className: "flex-1 rounded-xl px-3 py-2 text-xs font-mono outline-none transition-all",
            style: {
              background: "rgba(255,255,255,0.06)",
              border: addError ? "1px solid rgba(239,68,68,0.50)" : "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.80)"
            },
            onKeyDown: (e) => {
              if (e.key === "Enter") handleAdd();
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "settings.add_admin_button",
            onClick: handleAdd,
            disabled: addAdmin.isPending || !newPrincipal.trim(),
            className: "flex-shrink-0 rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed",
            style: {
              background: "rgba(139,92,246,0.20)",
              color: "rgba(167,139,250,0.90)",
              border: "1px solid rgba(139,92,246,0.35)"
            },
            children: [
              addAdmin.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 12, className: "animate-spin" }) : null,
              "Pridať admina"
            ]
          }
        )
      ] }),
      addError && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          "data-ocid": "settings.add_admin_error_state",
          className: "text-xs rounded-lg px-3 py-2",
          style: {
            background: "rgba(239,68,68,0.12)",
            color: "rgba(239,68,68,0.90)",
            border: "1px solid rgba(239,68,68,0.25)"
          },
          children: addError
        }
      ),
      addSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "p",
        {
          "data-ocid": "settings.add_admin_success_state",
          className: "text-xs rounded-lg px-3 py-2 flex items-center gap-1.5",
          style: {
            background: "rgba(34,197,94,0.12)",
            color: "rgba(34,197,94,0.90)",
            border: "1px solid rgba(34,197,94,0.25)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12 }),
            "Admin úspešne pridaný"
          ]
        }
      )
    ] })
  ] });
}
function AdminTreasuryCard() {
  const { identity } = useInternetIdentity();
  const { data: platformFees, refetch: refetchFees } = useGetPlatformFees();
  const withdraw = useWithdrawPlatformFees();
  const [withdrawSuccess, setWithdrawSuccess] = reactExports.useState(null);
  const { data: adminList } = useListAdmins();
  const userPrincipal = identity == null ? void 0 : identity.getPrincipal().toText();
  const isAdmin = !!userPrincipal && (adminList ?? []).some((p) => p.toText() === userPrincipal);
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
function SettingsPage() {
  const { t } = useTranslation();
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "settings.corrupted_registry_section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CorruptedRegistryBanner, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "settings.cycles_section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CyclesCard, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "settings.pending_transactions_section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PendingTransactionsSection, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "settings.admin_management_section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminManagementCard, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "settings.treasury_section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminTreasuryCard, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "settings.admin_payments_section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminPaymentMonitor, {}) })
      ] })
    }
  );
}
export {
  SettingsPage as default
};
