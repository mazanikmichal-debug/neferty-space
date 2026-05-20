import { j as jsxRuntimeExports, o, r as reactExports, v as vt, u as useTranslation, d as useRatingDisplay, e as reactDomExports, R as RATING_DISPLAY_PRESETS } from "./index-brzfvpFf.js";
import { c as cn } from "./utils-DWi2mX0G.js";
import { u as useGetAllPublicNFTs, a as useGetNFTImage } from "./useQueries-BF2kAjPo.js";
import { n as nftImageUrlById } from "./nftImage-qKgxaRHy.js";
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
var jt = (n) => {
  switch (n) {
    case "success":
      return ee;
    case "info":
      return ae;
    case "warning":
      return oe;
    case "error":
      return se;
    default:
      return null;
  }
}, te = Array(12).fill(0), Yt = ({ visible: n, className: e }) => o.createElement("div", { className: ["sonner-loading-wrapper", e].filter(Boolean).join(" "), "data-visible": n }, o.createElement("div", { className: "sonner-spinner" }, te.map((t, a) => o.createElement("div", { className: "sonner-loading-bar", key: `spinner-bar-${a}` })))), ee = o.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, o.createElement("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z", clipRule: "evenodd" })), oe = o.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", height: "20", width: "20" }, o.createElement("path", { fillRule: "evenodd", d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z", clipRule: "evenodd" })), ae = o.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, o.createElement("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z", clipRule: "evenodd" })), se = o.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", height: "20", width: "20" }, o.createElement("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z", clipRule: "evenodd" })), Ot = o.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }, o.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), o.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }));
var Ft = () => {
  let [n, e] = o.useState(document.hidden);
  return o.useEffect(() => {
    let t = () => {
      e(document.hidden);
    };
    return document.addEventListener("visibilitychange", t), () => window.removeEventListener("visibilitychange", t);
  }, []), n;
};
var bt = 1, yt = class {
  constructor() {
    this.subscribe = (e) => (this.subscribers.push(e), () => {
      let t = this.subscribers.indexOf(e);
      this.subscribers.splice(t, 1);
    });
    this.publish = (e) => {
      this.subscribers.forEach((t) => t(e));
    };
    this.addToast = (e) => {
      this.publish(e), this.toasts = [...this.toasts, e];
    };
    this.create = (e) => {
      var S;
      let { message: t, ...a } = e, u = typeof (e == null ? void 0 : e.id) == "number" || ((S = e.id) == null ? void 0 : S.length) > 0 ? e.id : bt++, f = this.toasts.find((g) => g.id === u), w = e.dismissible === void 0 ? true : e.dismissible;
      return this.dismissedToasts.has(u) && this.dismissedToasts.delete(u), f ? this.toasts = this.toasts.map((g) => g.id === u ? (this.publish({ ...g, ...e, id: u, title: t }), { ...g, ...e, id: u, dismissible: w, title: t }) : g) : this.addToast({ title: t, ...a, dismissible: w, id: u }), u;
    };
    this.dismiss = (e) => (this.dismissedToasts.add(e), e || this.toasts.forEach((t) => {
      this.subscribers.forEach((a) => a({ id: t.id, dismiss: true }));
    }), this.subscribers.forEach((t) => t({ id: e, dismiss: true })), e);
    this.message = (e, t) => this.create({ ...t, message: e });
    this.error = (e, t) => this.create({ ...t, message: e, type: "error" });
    this.success = (e, t) => this.create({ ...t, type: "success", message: e });
    this.info = (e, t) => this.create({ ...t, type: "info", message: e });
    this.warning = (e, t) => this.create({ ...t, type: "warning", message: e });
    this.loading = (e, t) => this.create({ ...t, type: "loading", message: e });
    this.promise = (e, t) => {
      if (!t) return;
      let a;
      t.loading !== void 0 && (a = this.create({ ...t, promise: e, type: "loading", message: t.loading, description: typeof t.description != "function" ? t.description : void 0 }));
      let u = e instanceof Promise ? e : e(), f = a !== void 0, w, S = u.then(async (i) => {
        if (w = ["resolve", i], o.isValidElement(i)) f = false, this.create({ id: a, type: "default", message: i });
        else if (ie(i) && !i.ok) {
          f = false;
          let T = typeof t.error == "function" ? await t.error(`HTTP error! status: ${i.status}`) : t.error, F = typeof t.description == "function" ? await t.description(`HTTP error! status: ${i.status}`) : t.description;
          this.create({ id: a, type: "error", message: T, description: F });
        } else if (t.success !== void 0) {
          f = false;
          let T = typeof t.success == "function" ? await t.success(i) : t.success, F = typeof t.description == "function" ? await t.description(i) : t.description;
          this.create({ id: a, type: "success", message: T, description: F });
        }
      }).catch(async (i) => {
        if (w = ["reject", i], t.error !== void 0) {
          f = false;
          let D = typeof t.error == "function" ? await t.error(i) : t.error, T = typeof t.description == "function" ? await t.description(i) : t.description;
          this.create({ id: a, type: "error", message: D, description: T });
        }
      }).finally(() => {
        var i;
        f && (this.dismiss(a), a = void 0), (i = t.finally) == null || i.call(t);
      }), g = () => new Promise((i, D) => S.then(() => w[0] === "reject" ? D(w[1]) : i(w[1])).catch(D));
      return typeof a != "string" && typeof a != "number" ? { unwrap: g } : Object.assign(a, { unwrap: g });
    };
    this.custom = (e, t) => {
      let a = (t == null ? void 0 : t.id) || bt++;
      return this.create({ jsx: e(a), id: a, ...t }), a;
    };
    this.getActiveToasts = () => this.toasts.filter((e) => !this.dismissedToasts.has(e.id));
    this.subscribers = [], this.toasts = [], this.dismissedToasts = /* @__PURE__ */ new Set();
  }
}, v = new yt(), ne = (n, e) => {
  let t = (e == null ? void 0 : e.id) || bt++;
  return v.addToast({ title: n, ...e, id: t }), t;
}, ie = (n) => n && typeof n == "object" && "ok" in n && typeof n.ok == "boolean" && "status" in n && typeof n.status == "number", le = ne, ce = () => v.toasts, de = () => v.getActiveToasts(), ue = Object.assign(le, { success: v.success, info: v.info, warning: v.warning, error: v.error, custom: v.custom, message: v.message, promise: v.promise, dismiss: v.dismiss, loading: v.loading }, { getHistory: ce, getToasts: de });
function wt(n, { insertAt: e } = {}) {
  if (typeof document == "undefined") return;
  let t = document.head || document.getElementsByTagName("head")[0], a = document.createElement("style");
  a.type = "text/css", e === "top" && t.firstChild ? t.insertBefore(a, t.firstChild) : t.appendChild(a), a.styleSheet ? a.styleSheet.cssText = n : a.appendChild(document.createTextNode(n));
}
wt(`:where(html[dir="ltr"]),:where([data-sonner-toaster][dir="ltr"]){--toast-icon-margin-start: -3px;--toast-icon-margin-end: 4px;--toast-svg-margin-start: -1px;--toast-svg-margin-end: 0px;--toast-button-margin-start: auto;--toast-button-margin-end: 0;--toast-close-button-start: 0;--toast-close-button-end: unset;--toast-close-button-transform: translate(-35%, -35%)}:where(html[dir="rtl"]),:where([data-sonner-toaster][dir="rtl"]){--toast-icon-margin-start: 4px;--toast-icon-margin-end: -3px;--toast-svg-margin-start: 0px;--toast-svg-margin-end: -1px;--toast-button-margin-start: 0;--toast-button-margin-end: auto;--toast-close-button-start: unset;--toast-close-button-end: 0;--toast-close-button-transform: translate(35%, -35%)}:where([data-sonner-toaster]){position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1: hsl(0, 0%, 99%);--gray2: hsl(0, 0%, 97.3%);--gray3: hsl(0, 0%, 95.1%);--gray4: hsl(0, 0%, 93%);--gray5: hsl(0, 0%, 90.9%);--gray6: hsl(0, 0%, 88.7%);--gray7: hsl(0, 0%, 85.8%);--gray8: hsl(0, 0%, 78%);--gray9: hsl(0, 0%, 56.1%);--gray10: hsl(0, 0%, 52.3%);--gray11: hsl(0, 0%, 43.5%);--gray12: hsl(0, 0%, 9%);--border-radius: 8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:none;z-index:999999999;transition:transform .4s ease}:where([data-sonner-toaster][data-lifted="true"]){transform:translateY(-10px)}@media (hover: none) and (pointer: coarse){:where([data-sonner-toaster][data-lifted="true"]){transform:none}}:where([data-sonner-toaster][data-x-position="right"]){right:var(--offset-right)}:where([data-sonner-toaster][data-x-position="left"]){left:var(--offset-left)}:where([data-sonner-toaster][data-x-position="center"]){left:50%;transform:translate(-50%)}:where([data-sonner-toaster][data-y-position="top"]){top:var(--offset-top)}:where([data-sonner-toaster][data-y-position="bottom"]){bottom:var(--offset-bottom)}:where([data-sonner-toast]){--y: translateY(100%);--lift-amount: calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);filter:blur(0);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:none;overflow-wrap:anywhere}:where([data-sonner-toast][data-styled="true"]){padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px #0000001a;width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}:where([data-sonner-toast]:focus-visible){box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}:where([data-sonner-toast][data-y-position="top"]){top:0;--y: translateY(-100%);--lift: 1;--lift-amount: calc(1 * var(--gap))}:where([data-sonner-toast][data-y-position="bottom"]){bottom:0;--y: translateY(100%);--lift: -1;--lift-amount: calc(var(--lift) * var(--gap))}:where([data-sonner-toast]) :where([data-description]){font-weight:400;line-height:1.4;color:inherit}:where([data-sonner-toast]) :where([data-title]){font-weight:500;line-height:1.5;color:inherit}:where([data-sonner-toast]) :where([data-icon]){display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}:where([data-sonner-toast][data-promise="true"]) :where([data-icon])>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}:where([data-sonner-toast]) :where([data-icon])>*{flex-shrink:0}:where([data-sonner-toast]) :where([data-icon]) svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}:where([data-sonner-toast]) :where([data-content]){display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;cursor:pointer;outline:none;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}:where([data-sonner-toast]) :where([data-button]):focus-visible{box-shadow:0 0 0 2px #0006}:where([data-sonner-toast]) :where([data-button]):first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}:where([data-sonner-toast]) :where([data-cancel]){color:var(--normal-text);background:rgba(0,0,0,.08)}:where([data-sonner-toast][data-theme="dark"]) :where([data-cancel]){background:rgba(255,255,255,.3)}:where([data-sonner-toast]) :where([data-close-button]){position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast] [data-close-button]{background:var(--gray1)}:where([data-sonner-toast]) :where([data-close-button]):focus-visible{box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}:where([data-sonner-toast]) :where([data-disabled="true"]){cursor:not-allowed}:where([data-sonner-toast]):hover :where([data-close-button]):hover{background:var(--gray2);border-color:var(--gray5)}:where([data-sonner-toast][data-swiping="true"]):before{content:"";position:absolute;left:-50%;right:-50%;height:100%;z-index:-1}:where([data-sonner-toast][data-y-position="top"][data-swiping="true"]):before{bottom:50%;transform:scaleY(3) translateY(50%)}:where([data-sonner-toast][data-y-position="bottom"][data-swiping="true"]):before{top:50%;transform:scaleY(3) translateY(-50%)}:where([data-sonner-toast][data-swiping="false"][data-removed="true"]):before{content:"";position:absolute;inset:0;transform:scaleY(2)}:where([data-sonner-toast]):after{content:"";position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}:where([data-sonner-toast][data-mounted="true"]){--y: translateY(0);opacity:1}:where([data-sonner-toast][data-expanded="false"][data-front="false"]){--scale: var(--toasts-before) * .05 + 1;--y: translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}:where([data-sonner-toast])>*{transition:opacity .4s}:where([data-sonner-toast][data-expanded="false"][data-front="false"][data-styled="true"])>*{opacity:0}:where([data-sonner-toast][data-visible="false"]){opacity:0;pointer-events:none}:where([data-sonner-toast][data-mounted="true"][data-expanded="true"]){--y: translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}:where([data-sonner-toast][data-removed="true"][data-front="true"][data-swipe-out="false"]){--y: translateY(calc(var(--lift) * -100%));opacity:0}:where([data-sonner-toast][data-removed="true"][data-front="false"][data-swipe-out="false"][data-expanded="true"]){--y: translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}:where([data-sonner-toast][data-removed="true"][data-front="false"][data-swipe-out="false"][data-expanded="false"]){--y: translateY(40%);opacity:0;transition:transform .5s,opacity .2s}:where([data-sonner-toast][data-removed="true"][data-front="false"]):before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y, 0px)) translate(var(--swipe-amount-x, 0px));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{0%{transform:var(--y) translate(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translate(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{0%{transform:var(--y) translate(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translate(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{0%{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{0%{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width: 600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-theme=light]{--normal-bg: #fff;--normal-border: var(--gray4);--normal-text: var(--gray12);--success-bg: hsl(143, 85%, 96%);--success-border: hsl(145, 92%, 91%);--success-text: hsl(140, 100%, 27%);--info-bg: hsl(208, 100%, 97%);--info-border: hsl(221, 91%, 91%);--info-text: hsl(210, 92%, 45%);--warning-bg: hsl(49, 100%, 97%);--warning-border: hsl(49, 91%, 91%);--warning-text: hsl(31, 92%, 45%);--error-bg: hsl(359, 100%, 97%);--error-border: hsl(359, 100%, 94%);--error-text: hsl(360, 100%, 45%)}[data-sonner-toaster][data-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg: #000;--normal-border: hsl(0, 0%, 20%);--normal-text: var(--gray1)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg: #fff;--normal-border: var(--gray3);--normal-text: var(--gray12)}[data-sonner-toaster][data-theme=dark]{--normal-bg: #000;--normal-bg-hover: hsl(0, 0%, 12%);--normal-border: hsl(0, 0%, 20%);--normal-border-hover: hsl(0, 0%, 25%);--normal-text: var(--gray1);--success-bg: hsl(150, 100%, 6%);--success-border: hsl(147, 100%, 12%);--success-text: hsl(150, 86%, 65%);--info-bg: hsl(215, 100%, 6%);--info-border: hsl(223, 100%, 12%);--info-text: hsl(216, 87%, 65%);--warning-bg: hsl(64, 100%, 6%);--warning-border: hsl(60, 100%, 12%);--warning-text: hsl(46, 87%, 65%);--error-bg: hsl(358, 76%, 10%);--error-border: hsl(357, 89%, 16%);--error-text: hsl(358, 100%, 81%)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success],[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info],[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning],[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error],[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size: 16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:nth-child(1){animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}to{opacity:.15}}@media (prefers-reduced-motion){[data-sonner-toast],[data-sonner-toast]>*,.sonner-loading-bar{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}
`);
function tt(n) {
  return n.label !== void 0;
}
var pe = 3, me = "32px", ge = "16px", Wt = 4e3, he = 356, be = 14, ye = 20, we = 200;
function M(...n) {
  return n.filter(Boolean).join(" ");
}
function xe(n) {
  let [e, t] = n.split("-"), a = [];
  return e && a.push(e), t && a.push(t), a;
}
var ve = (n) => {
  var Dt, Pt, Nt, Bt, Ct, kt, It, Mt, Ht, At, Lt;
  let { invert: e, toast: t, unstyled: a, interacting: u, setHeights: f, visibleToasts: w, heights: S, index: g, toasts: i, expanded: D, removeToast: T, defaultRichColors: F, closeButton: et, style: ut, cancelButtonStyle: ft, actionButtonStyle: l, className: ot = "", descriptionClassName: at = "", duration: X, position: st, gap: pt, loadingIcon: rt, expandByDefault: B, classNames: s, icons: P, closeButtonAriaLabel: nt = "Close toast", pauseWhenPageIsHidden: it } = n, [Y, C] = o.useState(null), [lt, J] = o.useState(null), [W, H] = o.useState(false), [A, mt] = o.useState(false), [L, z] = o.useState(false), [ct, d] = o.useState(false), [h, y] = o.useState(false), [R, j] = o.useState(0), [p, _] = o.useState(0), O = o.useRef(t.duration || X || Wt), G = o.useRef(null), k = o.useRef(null), Vt = g === 0, Ut = g + 1 <= w, N = t.type, V = t.dismissible !== false, Kt = t.className || "", Xt = t.descriptionClassName || "", dt = o.useMemo(() => S.findIndex((r) => r.toastId === t.id) || 0, [S, t.id]), Jt = o.useMemo(() => {
    var r;
    return (r = t.closeButton) != null ? r : et;
  }, [t.closeButton, et]), Tt = o.useMemo(() => t.duration || X || Wt, [t.duration, X]), gt = o.useRef(0), U = o.useRef(0), St = o.useRef(0), K = o.useRef(null), [Gt, Qt] = st.split("-"), Rt = o.useMemo(() => S.reduce((r, m, c) => c >= dt ? r : r + m.height, 0), [S, dt]), Et = Ft(), qt = t.invert || e, ht = N === "loading";
  U.current = o.useMemo(() => dt * pt + Rt, [dt, Rt]), o.useEffect(() => {
    O.current = Tt;
  }, [Tt]), o.useEffect(() => {
    H(true);
  }, []), o.useEffect(() => {
    let r = k.current;
    if (r) {
      let m = r.getBoundingClientRect().height;
      return _(m), f((c) => [{ toastId: t.id, height: m, position: t.position }, ...c]), () => f((c) => c.filter((b) => b.toastId !== t.id));
    }
  }, [f, t.id]), o.useLayoutEffect(() => {
    if (!W) return;
    let r = k.current, m = r.style.height;
    r.style.height = "auto";
    let c = r.getBoundingClientRect().height;
    r.style.height = m, _(c), f((b) => b.find((x) => x.toastId === t.id) ? b.map((x) => x.toastId === t.id ? { ...x, height: c } : x) : [{ toastId: t.id, height: c, position: t.position }, ...b]);
  }, [W, t.title, t.description, f, t.id]);
  let $ = o.useCallback(() => {
    mt(true), j(U.current), f((r) => r.filter((m) => m.toastId !== t.id)), setTimeout(() => {
      T(t);
    }, we);
  }, [t, T, f, U]);
  o.useEffect(() => {
    if (t.promise && N === "loading" || t.duration === 1 / 0 || t.type === "loading") return;
    let r;
    return D || u || it && Et ? (() => {
      if (St.current < gt.current) {
        let b = (/* @__PURE__ */ new Date()).getTime() - gt.current;
        O.current = O.current - b;
      }
      St.current = (/* @__PURE__ */ new Date()).getTime();
    })() : (() => {
      O.current !== 1 / 0 && (gt.current = (/* @__PURE__ */ new Date()).getTime(), r = setTimeout(() => {
        var b;
        (b = t.onAutoClose) == null || b.call(t, t), $();
      }, O.current));
    })(), () => clearTimeout(r);
  }, [D, u, t, N, it, Et, $]), o.useEffect(() => {
    t.delete && $();
  }, [$, t.delete]);
  function Zt() {
    var r, m, c;
    return P != null && P.loading ? o.createElement("div", { className: M(s == null ? void 0 : s.loader, (r = t == null ? void 0 : t.classNames) == null ? void 0 : r.loader, "sonner-loader"), "data-visible": N === "loading" }, P.loading) : rt ? o.createElement("div", { className: M(s == null ? void 0 : s.loader, (m = t == null ? void 0 : t.classNames) == null ? void 0 : m.loader, "sonner-loader"), "data-visible": N === "loading" }, rt) : o.createElement(Yt, { className: M(s == null ? void 0 : s.loader, (c = t == null ? void 0 : t.classNames) == null ? void 0 : c.loader), visible: N === "loading" });
  }
  return o.createElement("li", { tabIndex: 0, ref: k, className: M(ot, Kt, s == null ? void 0 : s.toast, (Dt = t == null ? void 0 : t.classNames) == null ? void 0 : Dt.toast, s == null ? void 0 : s.default, s == null ? void 0 : s[N], (Pt = t == null ? void 0 : t.classNames) == null ? void 0 : Pt[N]), "data-sonner-toast": "", "data-rich-colors": (Nt = t.richColors) != null ? Nt : F, "data-styled": !(t.jsx || t.unstyled || a), "data-mounted": W, "data-promise": !!t.promise, "data-swiped": h, "data-removed": A, "data-visible": Ut, "data-y-position": Gt, "data-x-position": Qt, "data-index": g, "data-front": Vt, "data-swiping": L, "data-dismissible": V, "data-type": N, "data-invert": qt, "data-swipe-out": ct, "data-swipe-direction": lt, "data-expanded": !!(D || B && W), style: { "--index": g, "--toasts-before": g, "--z-index": i.length - g, "--offset": `${A ? R : U.current}px`, "--initial-height": B ? "auto" : `${p}px`, ...ut, ...t.style }, onDragEnd: () => {
    z(false), C(null), K.current = null;
  }, onPointerDown: (r) => {
    ht || !V || (G.current = /* @__PURE__ */ new Date(), j(U.current), r.target.setPointerCapture(r.pointerId), r.target.tagName !== "BUTTON" && (z(true), K.current = { x: r.clientX, y: r.clientY }));
  }, onPointerUp: () => {
    var x, Q, q, Z;
    if (ct || !V) return;
    K.current = null;
    let r = Number(((x = k.current) == null ? void 0 : x.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0), m = Number(((Q = k.current) == null ? void 0 : Q.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0), c = (/* @__PURE__ */ new Date()).getTime() - ((q = G.current) == null ? void 0 : q.getTime()), b = Y === "x" ? r : m, I = Math.abs(b) / c;
    if (Math.abs(b) >= ye || I > 0.11) {
      j(U.current), (Z = t.onDismiss) == null || Z.call(t, t), J(Y === "x" ? r > 0 ? "right" : "left" : m > 0 ? "down" : "up"), $(), d(true), y(false);
      return;
    }
    z(false), C(null);
  }, onPointerMove: (r) => {
    var Q, q, Z, zt;
    if (!K.current || !V || ((Q = window.getSelection()) == null ? void 0 : Q.toString().length) > 0) return;
    let c = r.clientY - K.current.y, b = r.clientX - K.current.x, I = (q = n.swipeDirections) != null ? q : xe(st);
    !Y && (Math.abs(b) > 1 || Math.abs(c) > 1) && C(Math.abs(b) > Math.abs(c) ? "x" : "y");
    let x = { x: 0, y: 0 };
    Y === "y" ? (I.includes("top") || I.includes("bottom")) && (I.includes("top") && c < 0 || I.includes("bottom") && c > 0) && (x.y = c) : Y === "x" && (I.includes("left") || I.includes("right")) && (I.includes("left") && b < 0 || I.includes("right") && b > 0) && (x.x = b), (Math.abs(x.x) > 0 || Math.abs(x.y) > 0) && y(true), (Z = k.current) == null || Z.style.setProperty("--swipe-amount-x", `${x.x}px`), (zt = k.current) == null || zt.style.setProperty("--swipe-amount-y", `${x.y}px`);
  } }, Jt && !t.jsx ? o.createElement("button", { "aria-label": nt, "data-disabled": ht, "data-close-button": true, onClick: ht || !V ? () => {
  } : () => {
    var r;
    $(), (r = t.onDismiss) == null || r.call(t, t);
  }, className: M(s == null ? void 0 : s.closeButton, (Bt = t == null ? void 0 : t.classNames) == null ? void 0 : Bt.closeButton) }, (Ct = P == null ? void 0 : P.close) != null ? Ct : Ot) : null, t.jsx || reactExports.isValidElement(t.title) ? t.jsx ? t.jsx : typeof t.title == "function" ? t.title() : t.title : o.createElement(o.Fragment, null, N || t.icon || t.promise ? o.createElement("div", { "data-icon": "", className: M(s == null ? void 0 : s.icon, (kt = t == null ? void 0 : t.classNames) == null ? void 0 : kt.icon) }, t.promise || t.type === "loading" && !t.icon ? t.icon || Zt() : null, t.type !== "loading" ? t.icon || (P == null ? void 0 : P[N]) || jt(N) : null) : null, o.createElement("div", { "data-content": "", className: M(s == null ? void 0 : s.content, (It = t == null ? void 0 : t.classNames) == null ? void 0 : It.content) }, o.createElement("div", { "data-title": "", className: M(s == null ? void 0 : s.title, (Mt = t == null ? void 0 : t.classNames) == null ? void 0 : Mt.title) }, typeof t.title == "function" ? t.title() : t.title), t.description ? o.createElement("div", { "data-description": "", className: M(at, Xt, s == null ? void 0 : s.description, (Ht = t == null ? void 0 : t.classNames) == null ? void 0 : Ht.description) }, typeof t.description == "function" ? t.description() : t.description) : null), reactExports.isValidElement(t.cancel) ? t.cancel : t.cancel && tt(t.cancel) ? o.createElement("button", { "data-button": true, "data-cancel": true, style: t.cancelButtonStyle || ft, onClick: (r) => {
    var m, c;
    tt(t.cancel) && V && ((c = (m = t.cancel).onClick) == null || c.call(m, r), $());
  }, className: M(s == null ? void 0 : s.cancelButton, (At = t == null ? void 0 : t.classNames) == null ? void 0 : At.cancelButton) }, t.cancel.label) : null, reactExports.isValidElement(t.action) ? t.action : t.action && tt(t.action) ? o.createElement("button", { "data-button": true, "data-action": true, style: t.actionButtonStyle || l, onClick: (r) => {
    var m, c;
    tt(t.action) && ((c = (m = t.action).onClick) == null || c.call(m, r), !r.defaultPrevented && $());
  }, className: M(s == null ? void 0 : s.actionButton, (Lt = t == null ? void 0 : t.classNames) == null ? void 0 : Lt.actionButton) }, t.action.label) : null));
};
function _t() {
  if (typeof window == "undefined" || typeof document == "undefined") return "ltr";
  let n = document.documentElement.getAttribute("dir");
  return n === "auto" || !n ? window.getComputedStyle(document.documentElement).direction : n;
}
function Te(n, e) {
  let t = {};
  return [n, e].forEach((a, u) => {
    let f = u === 1, w = f ? "--mobile-offset" : "--offset", S = f ? ge : me;
    function g(i) {
      ["top", "right", "bottom", "left"].forEach((D) => {
        t[`${w}-${D}`] = typeof i == "number" ? `${i}px` : i;
      });
    }
    typeof a == "number" || typeof a == "string" ? g(a) : typeof a == "object" ? ["top", "right", "bottom", "left"].forEach((i) => {
      a[i] === void 0 ? t[`${w}-${i}`] = S : t[`${w}-${i}`] = typeof a[i] == "number" ? `${a[i]}px` : a[i];
    }) : g(S);
  }), t;
}
reactExports.forwardRef(function(e, t) {
  let { invert: a, position: u = "bottom-right", hotkey: f = ["altKey", "KeyT"], expand: w, closeButton: S, className: g, offset: i, mobileOffset: D, theme: T = "light", richColors: F, duration: et, style: ut, visibleToasts: ft = pe, toastOptions: l, dir: ot = _t(), gap: at = be, loadingIcon: X, icons: st, containerAriaLabel: pt = "Notifications", pauseWhenPageIsHidden: rt } = e, [B, s] = o.useState([]), P = o.useMemo(() => Array.from(new Set([u].concat(B.filter((d) => d.position).map((d) => d.position)))), [B, u]), [nt, it] = o.useState([]), [Y, C] = o.useState(false), [lt, J] = o.useState(false), [W, H] = o.useState(T !== "system" ? T : typeof window != "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), A = o.useRef(null), mt = f.join("+").replace(/Key/g, "").replace(/Digit/g, ""), L = o.useRef(null), z = o.useRef(false), ct = o.useCallback((d) => {
    s((h) => {
      var y;
      return (y = h.find((R) => R.id === d.id)) != null && y.delete || v.dismiss(d.id), h.filter(({ id: R }) => R !== d.id);
    });
  }, []);
  return o.useEffect(() => v.subscribe((d) => {
    if (d.dismiss) {
      s((h) => h.map((y) => y.id === d.id ? { ...y, delete: true } : y));
      return;
    }
    setTimeout(() => {
      vt.flushSync(() => {
        s((h) => {
          let y = h.findIndex((R) => R.id === d.id);
          return y !== -1 ? [...h.slice(0, y), { ...h[y], ...d }, ...h.slice(y + 1)] : [d, ...h];
        });
      });
    });
  }), []), o.useEffect(() => {
    if (T !== "system") {
      H(T);
      return;
    }
    if (T === "system" && (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? H("dark") : H("light")), typeof window == "undefined") return;
    let d = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      d.addEventListener("change", ({ matches: h }) => {
        H(h ? "dark" : "light");
      });
    } catch (h) {
      d.addListener(({ matches: y }) => {
        try {
          H(y ? "dark" : "light");
        } catch (R) {
          console.error(R);
        }
      });
    }
  }, [T]), o.useEffect(() => {
    B.length <= 1 && C(false);
  }, [B]), o.useEffect(() => {
    let d = (h) => {
      var R, j;
      f.every((p) => h[p] || h.code === p) && (C(true), (R = A.current) == null || R.focus()), h.code === "Escape" && (document.activeElement === A.current || (j = A.current) != null && j.contains(document.activeElement)) && C(false);
    };
    return document.addEventListener("keydown", d), () => document.removeEventListener("keydown", d);
  }, [f]), o.useEffect(() => {
    if (A.current) return () => {
      L.current && (L.current.focus({ preventScroll: true }), L.current = null, z.current = false);
    };
  }, [A.current]), o.createElement("section", { ref: t, "aria-label": `${pt} ${mt}`, tabIndex: -1, "aria-live": "polite", "aria-relevant": "additions text", "aria-atomic": "false", suppressHydrationWarning: true }, P.map((d, h) => {
    var j;
    let [y, R] = d.split("-");
    return B.length ? o.createElement("ol", { key: d, dir: ot === "auto" ? _t() : ot, tabIndex: -1, ref: A, className: g, "data-sonner-toaster": true, "data-theme": W, "data-y-position": y, "data-lifted": Y && B.length > 1 && !w, "data-x-position": R, style: { "--front-toast-height": `${((j = nt[0]) == null ? void 0 : j.height) || 0}px`, "--width": `${he}px`, "--gap": `${at}px`, ...ut, ...Te(i, D) }, onBlur: (p) => {
      z.current && !p.currentTarget.contains(p.relatedTarget) && (z.current = false, L.current && (L.current.focus({ preventScroll: true }), L.current = null));
    }, onFocus: (p) => {
      p.target instanceof HTMLElement && p.target.dataset.dismissible === "false" || z.current || (z.current = true, L.current = p.relatedTarget);
    }, onMouseEnter: () => C(true), onMouseMove: () => C(true), onMouseLeave: () => {
      lt || C(false);
    }, onDragEnd: () => C(false), onPointerDown: (p) => {
      p.target instanceof HTMLElement && p.target.dataset.dismissible === "false" || J(true);
    }, onPointerUp: () => J(false) }, B.filter((p) => !p.position && h === 0 || p.position === d).map((p, _) => {
      var O, G;
      return o.createElement(ve, { key: p.id, icons: st, index: _, toast: p, defaultRichColors: F, duration: (O = l == null ? void 0 : l.duration) != null ? O : et, className: l == null ? void 0 : l.className, descriptionClassName: l == null ? void 0 : l.descriptionClassName, invert: a, visibleToasts: ft, closeButton: (G = l == null ? void 0 : l.closeButton) != null ? G : S, interacting: lt, position: d, style: l == null ? void 0 : l.style, unstyled: l == null ? void 0 : l.unstyled, classNames: l == null ? void 0 : l.classNames, cancelButtonStyle: l == null ? void 0 : l.cancelButtonStyle, actionButtonStyle: l == null ? void 0 : l.actionButtonStyle, removeToast: ct, toasts: B.filter((k) => k.position == p.position), heights: nt.filter((k) => k.position == p.position), setHeights: it, expandByDefault: w, gap: at, loadingIcon: X, expanded: Y, pauseWhenPageIsHidden: rt, swipeDirections: e.swipeDirections });
    })) : null;
  }));
});
function useShuffledNFTs(nfts) {
  const [shuffled, setShuffled] = reactExports.useState(
    void 0
  );
  const prevRef = reactExports.useRef(void 0);
  reactExports.useEffect(() => {
    if (!nfts) {
      setShuffled(void 0);
      return;
    }
    if (prevRef.current === nfts) return;
    prevRef.current = nfts;
    const copy = [...nfts];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffled(copy);
  }, [nfts]);
  return shuffled;
}
const EMOTIONS = [
  {
    id: -3,
    labelKey: "emotions.disgusting",
    label: "Odporné",
    size: 56,
    colorBg: "rgba(220,38,38,0.18)",
    colorBorder: "rgba(220,38,38,0.60)",
    colorFill: "rgba(220,38,38,0.92)",
    glow: "0 0 20px 6px rgba(220,38,38,0.50)"
  },
  {
    id: -2,
    labelKey: "emotions.boring",
    label: "Nudné",
    size: 46,
    colorBg: "rgba(234,88,12,0.18)",
    colorBorder: "rgba(234,88,12,0.55)",
    colorFill: "rgba(234,88,12,0.90)",
    glow: "0 0 15px 4px rgba(234,88,12,0.42)"
  },
  {
    id: -1,
    labelKey: "emotions.weak",
    label: "Slabé",
    size: 34,
    colorBg: "rgba(202,138,4,0.18)",
    colorBorder: "rgba(202,138,4,0.50)",
    colorFill: "rgba(202,138,4,0.88)",
    glow: "0 0 10px 3px rgba(202,138,4,0.35)"
  },
  {
    id: 0,
    labelKey: "emotions.neutral",
    label: "Jedno mi to",
    size: 64,
    colorBg: "rgba(156,163,175,0.18)",
    colorBorder: "rgba(156,163,175,0.55)",
    colorFill: "rgba(107,114,128,0.85)",
    glow: "0 0 24px 8px rgba(156,163,175,0.35)"
  },
  {
    id: 1,
    labelKey: "emotions.interesting",
    label: "Zaujímavé",
    size: 34,
    colorBg: "rgba(34,197,94,0.18)",
    colorBorder: "rgba(34,197,94,0.50)",
    colorFill: "rgba(34,197,94,0.88)",
    glow: "0 0 10px 3px rgba(34,197,94,0.35)"
  },
  {
    id: 2,
    labelKey: "emotions.likeIt",
    label: "Páči sa mi",
    size: 46,
    colorBg: "rgba(6,182,212,0.18)",
    colorBorder: "rgba(6,182,212,0.55)",
    colorFill: "rgba(6,182,212,0.90)",
    glow: "0 0 15px 4px rgba(6,182,212,0.42)"
  },
  {
    id: 3,
    labelKey: "emotions.beautiful",
    label: "Nádherné",
    size: 56,
    colorBg: "rgba(59,130,246,0.18)",
    colorBorder: "rgba(59,130,246,0.55)",
    colorFill: "rgba(59,130,246,0.92)",
    glow: "0 0 20px 6px rgba(59,130,246,0.52)"
  }
];
function ActiveCard({
  nft,
  rating,
  settings
}) {
  const ratedEmotion = EMOTIONS.find((e) => e.id === rating);
  const { data: imageBytes } = useGetNFTImage(nft.tokenId);
  const imageUrl = imageBytes ? nftImageUrlById(nft.tokenId, imageBytes) : "";
  const aspectStyle = settings.cardAspectRatio === "auto" ? {} : settings.cardAspectRatio === "portrait" ? { aspectRatio: "3/4" } : settings.cardAspectRatio === "landscape" ? { aspectRatio: "4/3" } : { aspectRatio: "1/1" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full h-full rounded-2xl overflow-hidden",
      style: {
        boxShadow: `0 16px 60px rgba(0,0,0,${0.35 + settings.shadowIntensity * 0.5})`,
        background: "rgba(10,4,16,1)",
        border: settings.showCardBorder ? `1.5px solid ${settings.borderColor}` : "none",
        ...aspectStyle
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: imageUrl,
            alt: nft.name,
            loading: "eager",
            draggable: false,
            className: "w-full h-full object-cover select-none",
            style: { display: "block" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8",
            style: {
              background: "linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.52) 55%, transparent 100%)"
            },
            children: [
              settings.showLabels && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-display font-bold text-white truncate leading-snug",
                  style: { fontSize: settings.labelFontSize },
                  children: nft.name
                }
              ),
              nft.description && settings.showLabels && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/60 line-clamp-2 leading-relaxed mt-0.5", children: nft.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "inline-block text-[10px] font-mono px-1.5 py-0.5 rounded-full",
                    style: {
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      color: "rgba(255,255,255,0.45)"
                    },
                    children: [
                      "#",
                      nft.tokenId.toString()
                    ]
                  }
                ),
                ratedEmotion && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full",
                    style: {
                      background: ratedEmotion.colorBg,
                      border: `1px solid ${ratedEmotion.colorBorder}`,
                      color: ratedEmotion.colorFill
                    },
                    children: ratedEmotion.label
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
function PeekCard({
  nft,
  pos,
  settings
}) {
  const opacities = [1, 0.85, 0.65, 0.45, 0.28];
  const opacity = (opacities[pos] ?? 0.2) * settings.opacity;
  const [hovered, setHovered] = reactExports.useState(false);
  const { data: imageBytes } = useGetNFTImage(nft.tokenId);
  const imageUrl = imageBytes ? nftImageUrlById(nft.tokenId, imageBytes) : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-full h-full rounded-2xl overflow-hidden",
      onMouseEnter: () => settings.interactiveHover && setHovered(true),
      onMouseLeave: () => setHovered(false),
      style: {
        border: settings.showCardBorder ? "1.5px solid rgba(255,255,255,0.10)" : "none",
        boxShadow: `0 4px ${20 + settings.shadowIntensity * 40}px rgba(0,0,0,${0.3 + settings.shadowIntensity * 0.4})`,
        background: "rgba(8,4,18,0.95)",
        maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 18%, rgba(0,0,0,0.9) 45%, black 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 18%, rgba(0,0,0,0.9) 45%, black 100%)",
        filter: settings.blurInactive > 0 ? `blur(${settings.blurInactive}px)` : void 0,
        transform: hovered ? "translateY(-4px) scale(1.02)" : void 0,
        transition: "transform 0.2s ease"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: imageUrl,
            alt: nft.name,
            loading: "lazy",
            draggable: false,
            className: "w-full h-full object-cover select-none",
            style: { display: "block", opacity }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: 8,
              right: 10,
              fontSize: 10,
              color: "rgba(255,255,255,0.28)",
              fontWeight: 700,
              letterSpacing: "0.05em",
              lineHeight: 1,
              pointerEvents: "none",
              userSelect: "none"
            },
            children: pos + 1
          }
        )
      ]
    }
  );
}
function EmotionCircle({
  emotion,
  selected,
  onSelect
}) {
  const { t } = useTranslation();
  const [hovered, setHovered] = reactExports.useState(false);
  const d = emotion.size;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative flex flex-col items-center",
      style: { minWidth: d + 8 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "aria-label": t(emotion.labelKey),
            "aria-pressed": selected,
            onClick: onSelect,
            onMouseEnter: () => setHovered(true),
            onMouseLeave: () => setHovered(false),
            style: {
              width: d,
              height: d,
              borderRadius: "50%",
              border: `2px solid ${emotion.colorBorder}`,
              background: selected ? emotion.colorFill : emotion.colorBg,
              boxShadow: selected ? emotion.glow : hovered ? emotion.glow.replace(/ [0-9.]+\)$/, "0.22)") : "none",
              transform: selected ? "scale(1.15)" : hovered ? "scale(1.10)" : "scale(1)",
              transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
              cursor: "pointer",
              flexShrink: 0,
              outline: "none"
            },
            className: "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            style: {
              opacity: hovered || selected ? 1 : 0,
              transition: "opacity 0.15s ease",
              pointerEvents: "none",
              fontSize: 10,
              marginTop: 4,
              whiteSpace: "nowrap",
              color: "rgba(255,255,255,0.72)",
              fontWeight: 600,
              letterSpacing: "0.03em"
            },
            children: t(emotion.labelKey)
          }
        )
      ]
    }
  );
}
const SHAPE_ICONS = {
  "arc-left": /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 28 44",
      fill: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [0, 1, 2, 3, 4].map((i) => {
        const t = i / 4;
        const y = 2 + i * 8;
        const arc = -Math.sin(t * Math.PI) * 10;
        const x = 10 + arc;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x,
            y,
            width: 10,
            height: 7,
            rx: "1.5",
            fill: "currentColor",
            opacity: 1 - i * 0.15
          },
          i
        );
      })
    }
  ),
  "arc-right": /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 28 44",
      fill: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [0, 1, 2, 3, 4].map((i) => {
        const t = i / 4;
        const y = 2 + i * 8;
        const arc = Math.sin(t * Math.PI) * 10;
        const x = 10 + arc;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x,
            y,
            width: 10,
            height: 7,
            rx: "1.5",
            fill: "currentColor",
            opacity: 1 - i * 0.15
          },
          i
        );
      })
    }
  ),
  line: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 44 28",
      fill: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "rect",
        {
          x: 2 + i * 8,
          y: 4 + i * 4,
          width: 7,
          height: 10,
          rx: "1.5",
          fill: "currentColor",
          opacity: 1 - i * 0.15
        },
        i
      ))
    }
  ),
  "arc-up": /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 44 28",
      fill: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [0, 1, 2, 3, 4].map((i) => {
        const t = i / 4;
        const x = 2 + i * 8;
        const arc = Math.sin(t * Math.PI) * 10;
        const y = 16 - arc;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x,
            y,
            width: 7,
            height: 10,
            rx: "1.5",
            fill: "currentColor",
            opacity: 1 - i * 0.15
          },
          i
        );
      })
    }
  ),
  "arc-down": /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 44 28",
      fill: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [0, 1, 2, 3, 4].map((i) => {
        const t = i / 4;
        const x = 2 + i * 8;
        const arc = Math.sin(t * Math.PI) * 10;
        const y = 4 + arc;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x,
            y,
            width: 7,
            height: 10,
            rx: "1.5",
            fill: "currentColor",
            opacity: 1 - i * 0.15
          },
          i
        );
      })
    }
  ),
  spiral: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 44 28",
      fill: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [0, 1, 2, 3, 4].map((i) => {
        const angle = i * 0.55;
        const r = 8 - i * 1.2;
        const cx = 22 + Math.cos(angle) * r * 2;
        const cy = 14 + Math.sin(angle) * r;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: cx - 3.5,
            y: cy - 5,
            width: 7,
            height: 10,
            rx: "1.5",
            fill: "currentColor",
            opacity: 1 - i * 0.15,
            transform: `rotate(${angle * 30},${cx},${cy})`
          },
          i
        );
      })
    }
  ),
  fan: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 44 28",
      fill: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [0, 1, 2, 3, 4].map((i) => {
        const angle = (i - 2) * 18;
        const rad = angle * Math.PI / 180;
        const cx = 22 + Math.sin(rad) * 14;
        const cy = 22 - Math.cos(rad) * 10;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: cx - 3.5,
            y: cy - 8,
            width: 7,
            height: 11,
            rx: "1.5",
            fill: "currentColor",
            opacity: 1 - Math.abs(i - 2) * 0.15,
            transform: `rotate(${angle},${cx},${cy + 2})`
          },
          i
        );
      })
    }
  ),
  wave: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 44 28",
      fill: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [0, 1, 2, 3, 4].map((i) => {
        const x = 2 + i * 8;
        const y = 14 + Math.sin(i * 1.2) * 8;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x,
            y: y - 5,
            width: 7,
            height: 10,
            rx: "1.5",
            fill: "currentColor",
            opacity: 1 - i * 0.12
          },
          i
        );
      })
    }
  ),
  grid: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 44 28",
      fill: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: 4 + col * 13,
            y: 2 + row * 13,
            width: 9,
            height: 9,
            rx: "1.5",
            fill: "currentColor",
            opacity: 0.9 - i * 0.08
          },
          i
        );
      })
    }
  ),
  steps: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 44 28",
      fill: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "rect",
        {
          x: 2 + i * 9,
          y: 22 - i * 5,
          width: 7,
          height: 10,
          rx: "1.5",
          fill: "currentColor",
          opacity: 1 - i * 0.15
        },
        i
      ))
    }
  ),
  circle: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 44 28",
      fill: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [0, 1, 2, 3, 4, 5].map((i) => {
        const angle = i / 6 * Math.PI * 2;
        const cx = 22 + Math.cos(angle) * 11;
        const cy = 14 + Math.sin(angle) * 7;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: cx - 3,
            y: cy - 4,
            width: 6,
            height: 8,
            rx: "1.5",
            fill: "currentColor",
            opacity: 0.9
          },
          i
        );
      })
    }
  ),
  teardrop: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 44 28",
      fill: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [0, 1, 2, 3, 4].map((i) => {
        const spread = i * i * 1.5;
        const x = 22 - spread / 2;
        const y = 2 + i * 5;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x,
            y,
            width: Math.max(6, spread),
            height: 6,
            rx: "1.5",
            fill: "currentColor",
            opacity: 1 - i * 0.15
          },
          i
        );
      })
    }
  ),
  concentric: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 44 28",
      fill: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [0, 1, 2, 3, 4].map((i) => {
        const x = 2 + i * 8;
        const y = 14 + (i % 2 === 0 ? -6 : 6);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x,
            y: y - 4,
            width: 7,
            height: 9,
            rx: "1.5",
            fill: "currentColor",
            opacity: 1 - i * 0.14
          },
          i
        );
      })
    }
  ),
  diamond: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 44 28",
      fill: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [0, 1, 2, 3, 4].map((i) => {
        const x = 2 + i * 8;
        const amp = i % 2 === 0 ? 0 : 10;
        const y = 10 + amp;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x,
            y,
            width: 7,
            height: 9,
            rx: "1.5",
            fill: "currentColor",
            opacity: 1 - i * 0.14
          },
          i
        );
      })
    }
  ),
  cascade: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      viewBox: "0 0 44 28",
      fill: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "rect",
        {
          x: 4 + i * 8,
          y: 2 + i * 4,
          width: 10,
          height: 12,
          rx: "1.5",
          fill: "currentColor",
          opacity: 1 - i * 0.15
        },
        i
      ))
    }
  )
};
const SHAPE_LABELS = {
  line: "rating.shapes.line",
  "arc-up": "rating.shapes.arc-up",
  "arc-down": "rating.shapes.arc-down",
  "arc-left": "rating.shapes.arc-left",
  "arc-right": "rating.shapes.arc-right",
  spiral: "rating.shapes.spiral",
  fan: "rating.shapes.fan",
  wave: "rating.shapes.wave",
  grid: "rating.shapes.grid",
  steps: "rating.shapes.steps",
  circle: "rating.shapes.circle",
  teardrop: "rating.shapes.teardrop",
  concentric: "rating.shapes.concentric",
  diamond: "rating.shapes.diamond",
  cascade: "rating.shapes.cascade"
};
const ALL_SHAPES = [
  "line",
  "arc-up",
  "arc-down",
  "arc-left",
  "arc-right",
  "spiral",
  "fan",
  "wave",
  "grid",
  "steps",
  "circle",
  "teardrop",
  "concentric",
  "diamond",
  "cascade"
];
const DIRECTION_OPTIONS = [
  { value: "right", label: "→" },
  { value: "left", label: "←" },
  { value: "right-up", label: "↗" },
  { value: "right-down", label: "↘" }
];
function computeDepths(settings) {
  const {
    visibleCards,
    cardScale,
    depthStep,
    arrangementShape,
    curveIntensity,
    spacingX,
    spacingY,
    direction,
    opacity,
    waveAmplitude,
    activeCardScale
  } = settings;
  const dirSign = direction === "left" ? -1 : 1;
  const vertSign = direction === "right-up" ? -1 : direction === "right-down" ? 1 : 0;
  const curve = curveIntensity / 100;
  return Array.from({ length: visibleCards }, (_, pos) => {
    if (pos === 0)
      return {
        scale: activeCardScale,
        tz: 0,
        tx: 0,
        ty: 0,
        rot: 0,
        opacity: 1
      };
    const t = pos / (visibleCards - 1 || 1);
    const baseScale = activeCardScale * (1 - pos * (1 - cardScale) / activeCardScale);
    const baseTz = -pos * depthStep;
    const baseOpacity = [0.85, 0.65, 0.45, 0.28, 0.18][pos - 1] ?? 0.15;
    const cardOpacity = baseOpacity * opacity;
    const cardRot = settings.cardRotation;
    let tx = dirSign * pos * spacingX;
    let ty = (spacingY !== 0 ? pos * spacingY : 0) + vertSign * pos * 30;
    let rot = cardRot;
    switch (arrangementShape) {
      case "line":
        break;
      case "arc-up": {
        const arcY = -Math.sin(t * Math.PI) * curveIntensity * 2;
        tx = dirSign * pos * spacingX;
        ty = arcY;
        break;
      }
      case "arc-down": {
        const arcY = Math.sin(t * Math.PI) * curveIntensity * 2;
        tx = dirSign * pos * spacingX;
        ty = arcY;
        break;
      }
      case "arc-left": {
        const arcX = -Math.sin(t * Math.PI) * curveIntensity * 2;
        tx = arcX;
        ty = pos * spacingX * 0.55;
        break;
      }
      case "arc-right": {
        const arcX = Math.sin(t * Math.PI) * curveIntensity * 2;
        tx = arcX;
        ty = pos * spacingX * 0.55;
        break;
      }
      case "spiral": {
        const angle = pos * curve * 0.9;
        const radius = pos * spacingX;
        tx = dirSign * Math.cos(angle) * radius;
        ty = Math.sin(angle) * radius * 0.45;
        rot = angle * (180 / Math.PI) * dirSign * 0.4 + cardRot;
        break;
      }
      case "fan": {
        const fanAngle = pos * curve * 12;
        rot = dirSign * fanAngle + cardRot;
        const rad = fanAngle * Math.PI / 180;
        tx = dirSign * Math.sin(rad) * spacingX * pos * 0.6;
        ty = (1 - Math.cos(rad)) * spacingX * pos * 0.15;
        break;
      }
      case "wave": {
        const amp = waveAmplitude;
        tx = dirSign * pos * spacingX;
        ty = Math.sin(pos * 1.1) * amp;
        break;
      }
      case "grid": {
        const cols = Math.ceil(Math.sqrt(visibleCards));
        const col = pos % cols;
        const row = Math.floor(pos / cols);
        tx = dirSign * col * spacingX;
        ty = row * (spacingY || spacingX * 0.8);
        break;
      }
      case "steps": {
        tx = dirSign * pos * spacingX;
        ty = pos * (spacingY !== 0 ? spacingY : spacingX * 0.4);
        rot = cardRot;
        break;
      }
      case "circle": {
        const totalAngle = 2 * Math.PI * pos / visibleCards;
        const radius = spacingX * 1.2;
        tx = dirSign * Math.sin(totalAngle) * radius;
        ty = -Math.cos(totalAngle) * radius * 0.5 + radius * 0.5;
        rot = totalAngle * 180 / Math.PI + cardRot;
        break;
      }
      case "teardrop": {
        const spread = pos * pos * (spacingX / 20);
        tx = dirSign * (pos % 2 === 0 ? 1 : -1) * spread * 0.5;
        ty = pos * (spacingY || spacingX * 0.3);
        break;
      }
      case "concentric": {
        tx = dirSign * pos * spacingX;
        ty = pos % 2 === 0 ? -curveIntensity * 0.8 : curveIntensity * 0.8;
        break;
      }
      case "diamond": {
        tx = dirSign * pos * spacingX;
        ty = pos % 2 === 0 ? 0 : curveIntensity * 1.5;
        rot = pos % 2 === 0 ? cardRot : -cardRot;
        break;
      }
      case "cascade": {
        tx = dirSign * pos * Math.max(spacingX, 0) * 0.6;
        ty = pos * (spacingY !== 0 ? spacingY : 28);
        rot = dirSign * pos * curve * 3 + cardRot;
        break;
      }
    }
    return { scale: baseScale, tz: baseTz, tx, ty, rot, opacity: cardOpacity };
  });
}
function PanelSection({
  title,
  defaultOpen = false,
  children
}) {
  const [open, setOpen] = reactExports.useState(defaultOpen);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 4 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((v2) => !v2),
        style: {
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "7px 0 6px",
          background: "none",
          border: "none",
          cursor: "pointer",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          color: "rgba(255,255,255,0.38)",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                fontSize: 10,
                transition: "transform 0.2s ease",
                display: "inline-block",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                color: "rgba(255,255,255,0.25)"
              },
              children: "▼"
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { paddingTop: 10 }, children })
  ] });
}
function SliderRow({
  label,
  value,
  min,
  max,
  step,
  ocid,
  onChange,
  format
}) {
  const display = format ? format(value) : String(value);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 11 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                fontSize: 11,
                color: "rgba(255,255,255,0.60)",
                fontWeight: 600
              },
              children: label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
                fontFamily: "monospace"
              },
              children: display
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "range",
        "data-ocid": ocid,
        min,
        max,
        step,
        value,
        onChange: (e) => onChange(Number(e.target.value)),
        style: {
          width: "100%",
          height: 4,
          borderRadius: 2,
          accentColor: "rgba(255,255,255,0.7)",
          cursor: "pointer"
        }
      }
    )
  ] });
}
function ToggleRow({
  label,
  value,
  ocid,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            style: {
              fontSize: 11,
              color: "rgba(255,255,255,0.60)",
              fontWeight: 600
            },
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": ocid,
            onClick: () => onChange(!value),
            style: {
              width: 34,
              height: 18,
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              background: value ? "rgba(100,220,150,0.85)" : "rgba(255,255,255,0.12)",
              position: "relative",
              transition: "background 0.2s ease",
              flexShrink: 0
            },
            "aria-pressed": value,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  position: "absolute",
                  top: 2,
                  left: value ? 16 : 2,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "white",
                  transition: "left 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.4)"
                }
              }
            )
          }
        )
      ]
    }
  );
}
const RANDOM_SHAPES = [
  "line",
  "arc-up",
  "arc-down",
  "arc-left",
  "arc-right",
  "spiral",
  "fan",
  "wave",
  "grid",
  "steps",
  "circle",
  "teardrop",
  "concentric",
  "diamond",
  "cascade"
];
const RANDOM_DIRECTIONS = [
  "right",
  "left",
  "right-up",
  "right-down"
];
const RANDOM_EASINGS = [
  "ease",
  "ease-in-out",
  "spring",
  "bounce"
];
const RANDOM_ASPECTS = [
  "square",
  "portrait",
  "landscape",
  "auto"
];
const RANDOM_BORDER_COLORS = [
  "oklch(0.6 0.28 320)",
  "oklch(0.65 0.25 240)",
  "oklch(0.7 0.22 160)",
  "oklch(0.65 0.25 60)",
  "rgba(255,255,255,0.4)",
  "rgba(255,255,255,0.1)"
];
function rnd(min, max, step = 1) {
  const steps = Math.floor((max - min) / step);
  return min + Math.floor(Math.random() * (steps + 1)) * step;
}
function rndFloat(min, max, decimals = 2) {
  return Number.parseFloat(
    (min + Math.random() * (max - min)).toFixed(decimals)
  );
}
function rndBool() {
  return Math.random() >= 0.5;
}
function rndItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function buildRandomSettings() {
  return {
    arrangementShape: rndItem(RANDOM_SHAPES),
    direction: rndItem(RANDOM_DIRECTIONS),
    curveIntensity: rnd(5, 100, 5),
    waveAmplitude: rnd(20, 120, 5),
    spacingX: rnd(-50, 250, 5),
    spacingY: rnd(-30, 150, 5),
    verticalOffset: rnd(-100, 100, 5),
    horizontalOffset: rnd(-100, 100, 5),
    visibleCards: rnd(3, 20),
    activeCardScale: rndFloat(1, 2.2),
    cardRotation: rnd(-30, 30),
    perspectiveDepth: rnd(300, 1500, 50),
    depthStep: rnd(0, 200, 5),
    cardTilt: rnd(-20, 20),
    blurInactive: rndFloat(0, 6, 1),
    interactiveHover: rndBool(),
    shadowIntensity: rndFloat(0, 1),
    opacity: rndFloat(0.3, 1),
    animationDuration: rndFloat(0.15, 1),
    scrollCooldown: rnd(100, 1400, 100),
    showLabels: rndBool(),
    cardAspectRatio: rndItem(RANDOM_ASPECTS),
    animationEasing: rndItem(RANDOM_EASINGS),
    showCardBorder: rndBool(),
    borderColor: rndItem(RANDOM_BORDER_COLORS),
    cardScale: rndFloat(0.5, 1)
  };
}
function RatingArrangementPanel({
  settings,
  updateSettings,
  resetToDefault,
  savedProfiles,
  activeProfileName,
  saveProfile,
  loadProfile,
  deleteProfile
}) {
  const { t } = useTranslation();
  const [open, setOpen] = reactExports.useState(false);
  const [profileNameInput, setProfileNameInput] = reactExports.useState("");
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const [pos, setPos] = reactExports.useState(() => ({
    x: Math.max(0, window.innerWidth - 292),
    y: 80
  }));
  const draggingRef = reactExports.useRef(false);
  const dragOffsetRef = reactExports.useRef({ x: 0, y: 0 });
  const panelRef = reactExports.useRef(null);
  const PANEL_WIDTH = 292;
  reactExports.useEffect(() => {
    const onMouseMove = (e) => {
      if (!draggingRef.current) return;
      const nx = e.clientX - dragOffsetRef.current.x;
      const ny = e.clientY - dragOffsetRef.current.y;
      setPos({
        x: Math.max(0, Math.min(nx, window.innerWidth - PANEL_WIDTH)),
        y: Math.max(0, Math.min(ny, window.innerHeight - 48))
      });
    };
    const onMouseUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);
  const onDragHandleMouseDown = (e) => {
    var _a;
    e.preventDefault();
    e.stopPropagation();
    const rect = (_a = panelRef.current) == null ? void 0 : _a.getBoundingClientRect();
    if (!rect) return;
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    draggingRef.current = true;
    setIsDragging(true);
  };
  const u = updateSettings;
  const s = settings;
  const easingOptions = [
    { value: "ease", label: "Ease" },
    { value: "ease-in-out", label: "EaseInOut" },
    { value: "spring", label: "Spring" },
    { value: "bounce", label: "Bounce" }
  ];
  const aspectOptions = [
    { value: "square", label: "1:1" },
    { value: "portrait", label: "3:4" },
    { value: "landscape", label: "4:3" },
    { value: "auto", label: "Auto" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: panelRef,
      style: {
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
        width: PANEL_WIDTH,
        userSelect: "none"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onMouseDown: onDragHandleMouseDown,
            title: t("rating.labels.dragToMove"),
            style: {
              width: "100%",
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isDragging ? "grabbing" : "grab",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px 12px 0 0",
              border: "1px solid rgba(255,255,255,0.10)",
              borderBottom: "none",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  background: isDragging ? "rgba(255,255,255,0.50)" : "rgba(255,255,255,0.25)",
                  transition: "background 0.15s ease"
                }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              gap: 5,
              padding: "4px 8px 4px",
              background: "rgba(8,4,18,0.75)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderTop: "none",
              borderBottom: "none"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "rating.reset_settings_button",
                  onClick: resetToDefault,
                  "aria-label": t("rating.labels.resetSettings"),
                  style: {
                    flex: 1,
                    height: 30,
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.70)",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    transition: "background 0.15s ease"
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.10)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, lineHeight: 1 }, children: "↺" }),
                    t("buttons.reset")
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "rating.randomize_settings_button",
                  onClick: () => updateSettings(buildRandomSettings()),
                  "aria-label": t("rating.labels.randomSettings"),
                  style: {
                    flex: 1,
                    height: 30,
                    borderRadius: 8,
                    border: "1px solid rgba(147,51,234,0.50)",
                    background: "rgba(147,51,234,0.25)",
                    color: "rgba(255,255,255,0.90)",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    transition: "background 0.15s ease"
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = "rgba(147,51,234,0.45)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = "rgba(147,51,234,0.25)";
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, lineHeight: 1 }, children: "🎲" }),
                    t("buttons.random")
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              background: "rgba(8,4,18,0.75)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderTop: "none",
              borderBottom: open ? "none" : "1px solid rgba(255,255,255,0.12)",
              borderRadius: open ? 0 : "0 0 12px 12px",
              padding: "4px 8px",
              gap: 8
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "rating.arrangement_settings_button",
                  onClick: () => setOpen((v2) => !v2),
                  "aria-label": t("rating.labels.settings"),
                  style: {
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: open ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.18s ease, transform 0.18s ease",
                    transform: open ? "rotate(45deg)" : "rotate(0deg)",
                    color: "rgba(255,255,255,0.75)",
                    flexShrink: 0
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "svg",
                    {
                      width: "16",
                      height: "16",
                      viewBox: "0 0 16 16",
                      fill: "none",
                      "aria-hidden": "true",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          d: "M8 1v2.27a5 5 0 0 1 1.59.66l1.6-1.6 1.42 1.42-1.6 1.6A5 5 0 0 1 11.73 7H14v2h-2.27a5 5 0 0 1-.66 1.59l1.6 1.6-1.42 1.42-1.6-1.6A5 5 0 0 1 9 13.73V16H7v-2.27a5 5 0 0 1-1.59-.66l-1.6 1.6-1.42-1.42 1.6-1.6A5 5 0 0 1 4.27 9H2V7h2.27a5 5 0 0 1 .66-1.59L3.33 3.81l1.42-1.42 1.6 1.6A5 5 0 0 1 7 3.27V1h1ZM8 6a2 2 0 1 0 0 4A2 2 0 0 0 8 6Z",
                          fill: "currentColor"
                        }
                      )
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontSize: 10,
                    color: "rgba(255,255,255,0.35)",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    pointerEvents: "none"
                  },
                  children: t("rating.labels.settings")
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "rating.arrangement_panel",
            style: {
              width: "100%",
              background: "rgba(8,4,18,0.92)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderTop: "none",
              borderRadius: "0 0 16px 16px",
              overflow: "hidden",
              maxHeight: open ? 2400 : 0,
              opacity: open ? 1 : 0,
              transition: "max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease",
              pointerEvents: open ? "auto" : "none",
              boxShadow: "0 24px 64px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.05)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  padding: "12px 14px 14px",
                  maxHeight: "80vh",
                  overflowY: "auto"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    PanelSection,
                    {
                      title: t("rating.sections.shapeArrangement"),
                      defaultOpen: true,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              display: "grid",
                              gridTemplateColumns: "repeat(5,1fr)",
                              gap: 4,
                              marginBottom: 12
                            },
                            children: ALL_SHAPES.map((shape) => {
                              const active = s.arrangementShape === shape;
                              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "button",
                                {
                                  type: "button",
                                  "data-ocid": `rating.shape_${shape.replace(/-/g, "_")}_button`,
                                  onClick: () => u({ arrangementShape: shape }),
                                  "aria-label": t(SHAPE_LABELS[shape]),
                                  style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 3,
                                    padding: "7px 2px 5px",
                                    borderRadius: 8,
                                    border: active ? "1.5px solid rgba(255,255,255,0.45)" : "1.5px solid rgba(255,255,255,0.10)",
                                    background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                                    cursor: "pointer",
                                    color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.40)",
                                    transition: "all 0.15s ease"
                                  },
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 26, height: 18 }, children: SHAPE_ICONS[shape] }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "span",
                                      {
                                        style: {
                                          fontSize: 7,
                                          fontWeight: 600,
                                          letterSpacing: "0.03em",
                                          whiteSpace: "nowrap"
                                        },
                                        children: t(SHAPE_LABELS[shape])
                                      }
                                    )
                                  ]
                                },
                                shape
                              );
                            })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 10 }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              style: {
                                fontSize: 11,
                                color: "rgba(255,255,255,0.60)",
                                fontWeight: 600,
                                marginBottom: 6
                              },
                              children: t("rating.labels.direction")
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 5 }, children: DIRECTION_OPTIONS.map(({ value, label }) => {
                            const active = s.direction === value;
                            return /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                "data-ocid": `rating.direction_${value.replace("-", "_")}_button`,
                                onClick: () => u({ direction: value }),
                                style: {
                                  flex: 1,
                                  padding: "5px 0",
                                  borderRadius: 7,
                                  border: active ? "1.5px solid rgba(255,255,255,0.45)" : "1.5px solid rgba(255,255,255,0.10)",
                                  background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                                  color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.40)",
                                  fontSize: 15,
                                  cursor: "pointer",
                                  transition: "all 0.15s ease"
                                },
                                children: label
                              },
                              value
                            );
                          }) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SliderRow,
                          {
                            label: t("rating.labels.curveIntensity"),
                            value: s.curveIntensity,
                            min: 0,
                            max: 100,
                            step: 5,
                            ocid: "rating.curveIntensity_slider",
                            onChange: (v2) => u({ curveIntensity: v2 })
                          }
                        ),
                        s.arrangementShape === "wave" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SliderRow,
                          {
                            label: t("rating.labels.waveAmplitude"),
                            value: s.waveAmplitude,
                            min: 0,
                            max: 120,
                            step: 5,
                            ocid: "rating.waveAmplitude_slider",
                            onChange: (v2) => u({ waveAmplitude: v2 })
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelSection, { title: t("rating.sections.spacing"), defaultOpen: true, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 11 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 4
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  fontSize: 11,
                                  color: "rgba(255,255,255,0.60)",
                                  fontWeight: 600
                                },
                                children: t("rating.labels.spacingX")
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  fontSize: 10,
                                  color: s.spacingX < 0 ? "rgba(255,160,80,0.85)" : "rgba(255,255,255,0.35)",
                                  fontFamily: "monospace",
                                  fontWeight: s.spacingX < 0 ? 700 : 400
                                },
                                children: s.spacingX < 0 ? `${t("rating.labels.overlapLabel")} ${s.spacingX}` : `${s.spacingX}px`
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "range",
                          "data-ocid": "rating.spacingX_slider",
                          min: -80,
                          max: 300,
                          step: 5,
                          value: s.spacingX,
                          onChange: (e) => u({ spacingX: Number(e.target.value) }),
                          style: {
                            width: "100%",
                            height: 4,
                            borderRadius: 2,
                            accentColor: "rgba(255,255,255,0.7)",
                            cursor: "pointer"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: {
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 2
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 8, color: "rgba(255,160,80,0.5)" }, children: [
                              "←",
                              t("rating.labels.overlapLabel")
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 8, color: "rgba(255,255,255,0.22)" }, children: [
                              t("rating.labels.spreadLabel"),
                              "→"
                            ] })
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 11 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 4
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  fontSize: 11,
                                  color: "rgba(255,255,255,0.60)",
                                  fontWeight: 600
                                },
                                children: t("rating.labels.spacingY")
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  fontSize: 10,
                                  color: s.spacingY < 0 ? "rgba(255,160,80,0.85)" : "rgba(255,255,255,0.35)",
                                  fontFamily: "monospace",
                                  fontWeight: s.spacingY < 0 ? 700 : 400
                                },
                                children: s.spacingY < 0 ? `${t("rating.labels.overlapLabel")} ${s.spacingY}` : `${s.spacingY}px`
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "range",
                          "data-ocid": "rating.spacingY_slider",
                          min: -80,
                          max: 300,
                          step: 5,
                          value: s.spacingY,
                          onChange: (e) => u({ spacingY: Number(e.target.value) }),
                          style: {
                            width: "100%",
                            height: 4,
                            borderRadius: 2,
                            accentColor: "rgba(255,255,255,0.7)",
                            cursor: "pointer"
                          }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SliderRow,
                      {
                        label: t("rating.labels.verticalOffset"),
                        value: s.verticalOffset,
                        min: -200,
                        max: 200,
                        step: 5,
                        ocid: "rating.verticalOffset_slider",
                        onChange: (v2) => u({ verticalOffset: v2 }),
                        format: (v2) => `${v2 > 0 ? "+" : ""}${v2}px`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SliderRow,
                      {
                        label: t("rating.labels.horizontalOffset"),
                        value: s.horizontalOffset,
                        min: -300,
                        max: 300,
                        step: 5,
                        ocid: "rating.horizontalOffset_slider",
                        onChange: (v2) => u({ horizontalOffset: v2 }),
                        format: (v2) => `${v2 > 0 ? "+" : ""}${v2}px`
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelSection, { title: t("rating.sections.cards"), defaultOpen: true, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SliderRow,
                      {
                        label: t("rating.labels.visibleCards"),
                        value: s.visibleCards,
                        min: 1,
                        max: 50,
                        step: 1,
                        ocid: "rating.visibleCards_slider",
                        onChange: (v2) => u({ visibleCards: v2 })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SliderRow,
                      {
                        label: t("rating.labels.activeCardScale"),
                        value: s.activeCardScale,
                        min: 1,
                        max: 2.5,
                        step: 0.05,
                        ocid: "rating.activeCardScale_slider",
                        onChange: (v2) => u({ activeCardScale: v2 }),
                        format: (v2) => `${v2.toFixed(2)}x`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SliderRow,
                      {
                        label: t("rating.labels.cardRotation"),
                        value: s.cardRotation,
                        min: -45,
                        max: 45,
                        step: 1,
                        ocid: "rating.cardRotation_slider",
                        onChange: (v2) => u({ cardRotation: v2 }),
                        format: (v2) => `${v2}°`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 11 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          style: {
                            fontSize: 11,
                            color: "rgba(255,255,255,0.60)",
                            fontWeight: 600,
                            marginBottom: 6
                          },
                          children: t("rating.labels.aspectRatio")
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 5 }, children: aspectOptions.map(({ value, label }) => {
                        const active = s.cardAspectRatio === value;
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            "data-ocid": `rating.aspect_${value}_button`,
                            onClick: () => u({ cardAspectRatio: value }),
                            style: {
                              flex: 1,
                              padding: "5px 2px",
                              borderRadius: 7,
                              fontSize: 10,
                              border: active ? "1.5px solid rgba(255,255,255,0.45)" : "1.5px solid rgba(255,255,255,0.10)",
                              background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                              color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.40)",
                              cursor: "pointer",
                              transition: "all 0.15s ease"
                            },
                            children: label
                          },
                          value
                        );
                      }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ToggleRow,
                      {
                        label: t("rating.labels.cardBorder"),
                        value: s.showCardBorder,
                        ocid: "rating.showCardBorder_toggle",
                        onChange: (v2) => u({ showCardBorder: v2 })
                      }
                    ),
                    s.showCardBorder && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 11 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          style: {
                            fontSize: 11,
                            color: "rgba(255,255,255,0.60)",
                            fontWeight: 600,
                            marginBottom: 6
                          },
                          children: t("rating.labels.borderColor")
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          style: { display: "flex", gap: 5, flexWrap: "wrap" },
                          children: [
                            [
                              "oklch(0.6 0.28 320)",
                              "oklch(0.65 0.25 240)",
                              "oklch(0.7 0.22 160)",
                              "oklch(0.65 0.25 60)",
                              "rgba(255,255,255,0.4)",
                              "rgba(255,255,255,0.1)"
                            ].map((color) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => u({ borderColor: color }),
                                style: {
                                  width: 22,
                                  height: 22,
                                  borderRadius: "50%",
                                  background: color,
                                  border: s.borderColor === color ? "2px solid white" : "2px solid transparent",
                                  cursor: "pointer",
                                  flexShrink: 0
                                }
                              },
                              color
                            )),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "input",
                              {
                                type: "color",
                                value: s.borderColor.startsWith("#") ? s.borderColor : "#ffffff",
                                onChange: (e) => u({ borderColor: e.target.value }),
                                style: {
                                  width: 22,
                                  height: 22,
                                  borderRadius: "50%",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: 0,
                                  background: "none"
                                },
                                title: t("rating.labels.borderColor")
                              }
                            )
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    PanelSection,
                    {
                      title: t("rating.sections.depth3d"),
                      defaultOpen: false,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SliderRow,
                          {
                            label: t("rating.labels.perspective"),
                            value: s.perspectiveDepth,
                            min: 200,
                            max: 2e3,
                            step: 50,
                            ocid: "rating.perspectiveDepth_slider",
                            onChange: (v2) => u({ perspectiveDepth: v2 }),
                            format: (v2) => `${v2}px`
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SliderRow,
                          {
                            label: t("rating.labels.depthStep"),
                            value: s.depthStep,
                            min: 0,
                            max: 300,
                            step: 5,
                            ocid: "rating.depthStep_slider",
                            onChange: (v2) => u({ depthStep: v2 }),
                            format: (v2) => `${v2}px`
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SliderRow,
                          {
                            label: t("rating.labels.tilt"),
                            value: s.cardTilt,
                            min: -30,
                            max: 30,
                            step: 1,
                            ocid: "rating.cardTilt_slider",
                            onChange: (v2) => u({ cardTilt: v2 }),
                            format: (v2) => `${v2}°`
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SliderRow,
                          {
                            label: t("rating.labels.blur"),
                            value: s.blurInactive,
                            min: 0,
                            max: 10,
                            step: 0.5,
                            ocid: "rating.blurInactive_slider",
                            onChange: (v2) => u({ blurInactive: v2 }),
                            format: (v2) => `${v2}px`
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SliderRow,
                          {
                            label: t("rating.labels.shadow"),
                            value: s.shadowIntensity,
                            min: 0,
                            max: 1,
                            step: 0.05,
                            ocid: "rating.shadowIntensity_slider",
                            onChange: (v2) => u({ shadowIntensity: v2 }),
                            format: (v2) => v2.toFixed(2)
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SliderRow,
                          {
                            label: t("rating.labels.shrink"),
                            value: s.cardScale,
                            min: 0.3,
                            max: 1,
                            step: 0.02,
                            ocid: "rating.cardScale_slider",
                            onChange: (v2) => u({ cardScale: v2 }),
                            format: (v2) => v2.toFixed(2)
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    PanelSection,
                    {
                      title: t("rating.sections.animation"),
                      defaultOpen: false,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SliderRow,
                          {
                            label: t("rating.labels.duration"),
                            value: s.animationDuration,
                            min: 0.1,
                            max: 1.2,
                            step: 0.05,
                            ocid: "rating.animationDuration_slider",
                            onChange: (v2) => u({ animationDuration: v2 }),
                            format: (v2) => `${v2.toFixed(2)}s`
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SliderRow,
                          {
                            label: t("rating.labels.scrollSpeed"),
                            value: 1600 - s.scrollCooldown,
                            min: 100,
                            max: 1500,
                            step: 50,
                            ocid: "rating.scroll_speed_slider",
                            onChange: (v2) => u({ scrollCooldown: 1600 - v2 }),
                            format: (_v) => s.scrollCooldown <= 200 ? "Rýchle" : s.scrollCooldown >= 1100 ? "Pomaly" : `${s.scrollCooldown}ms`
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 11 }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              style: {
                                fontSize: 11,
                                color: "rgba(255,255,255,0.60)",
                                fontWeight: 600,
                                marginBottom: 6
                              },
                              children: t("rating.labels.easing")
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: { display: "flex", gap: 4, flexWrap: "wrap" },
                              children: easingOptions.map(({ value, label }) => {
                                const active = s.animationEasing === value;
                                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "button",
                                  {
                                    type: "button",
                                    "data-ocid": `rating.easing_${value.replace("-", "_")}_button`,
                                    onClick: () => u({ animationEasing: value }),
                                    style: {
                                      padding: "4px 8px",
                                      borderRadius: 6,
                                      fontSize: 10,
                                      border: active ? "1.5px solid rgba(255,255,255,0.45)" : "1.5px solid rgba(255,255,255,0.10)",
                                      background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                                      color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.40)",
                                      cursor: "pointer",
                                      transition: "all 0.15s ease"
                                    },
                                    children: label
                                  },
                                  value
                                );
                              })
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ToggleRow,
                          {
                            label: t("rating.labels.hoverEffect"),
                            value: s.interactiveHover,
                            ocid: "rating.interactiveHover_toggle",
                            onChange: (v2) => u({ interactiveHover: v2 })
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    PanelSection,
                    {
                      title: t("rating.sections.display"),
                      defaultOpen: false,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 11 }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              style: {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 4
                              },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "span",
                                  {
                                    style: {
                                      fontSize: 11,
                                      color: "rgba(255,255,255,0.60)",
                                      fontWeight: 600
                                    },
                                    children: t("rating.labels.opacity")
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "span",
                                  {
                                    style: {
                                      fontSize: 10,
                                      color: s.opacity >= 1 ? "rgba(100,220,150,0.85)" : "rgba(255,255,255,0.35)",
                                      fontFamily: "monospace",
                                      fontWeight: s.opacity >= 1 ? 700 : 400,
                                      transition: "color 0.15s ease"
                                    },
                                    children: s.opacity >= 1 ? "Orig" : s.opacity.toFixed(2)
                                  }
                                )
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              type: "range",
                              "data-ocid": "rating.opacity_slider",
                              min: 0,
                              max: 1,
                              step: 0.05,
                              value: s.opacity,
                              onChange: (e) => u({ opacity: Number(e.target.value) }),
                              style: {
                                width: "100%",
                                height: 4,
                                borderRadius: 2,
                                accentColor: "rgba(255,255,255,0.7)",
                                cursor: "pointer"
                              }
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ToggleRow,
                          {
                            label: t("rating.labels.labels"),
                            value: s.showLabels,
                            ocid: "rating.showLabels_toggle",
                            onChange: (v2) => u({ showLabels: v2 })
                          }
                        ),
                        s.showLabels && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SliderRow,
                          {
                            label: t("rating.labels.labelSize"),
                            value: s.labelFontSize,
                            min: 8,
                            max: 24,
                            step: 1,
                            ocid: "rating.labelFontSize_slider",
                            onChange: (v2) => u({ labelFontSize: v2 }),
                            format: (v2) => `${v2}px`
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    PanelSection,
                    {
                      title: t("rating.sections.profiles"),
                      defaultOpen: false,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, marginBottom: 10 }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              type: "text",
                              "data-ocid": "rating.profile_name_input",
                              placeholder: t("rating.labels.profileName"),
                              value: profileNameInput,
                              onChange: (e) => setProfileNameInput(e.target.value),
                              onKeyDown: (e) => {
                                if (e.key === "Enter" && profileNameInput.trim()) {
                                  saveProfile(profileNameInput.trim());
                                  setProfileNameInput("");
                                }
                              },
                              maxLength: 30,
                              style: {
                                flex: 1,
                                height: 30,
                                borderRadius: 8,
                                border: "1px solid rgba(255,255,255,0.14)",
                                background: "rgba(255,255,255,0.06)",
                                color: "rgba(255,255,255,0.85)",
                                fontSize: 11,
                                padding: "0 8px",
                                outline: "none"
                              }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              "data-ocid": "rating.save_profile_button",
                              disabled: !profileNameInput.trim(),
                              onClick: () => {
                                if (!profileNameInput.trim()) return;
                                saveProfile(profileNameInput.trim());
                                setProfileNameInput("");
                              },
                              style: {
                                height: 30,
                                padding: "0 10px",
                                borderRadius: 8,
                                border: "1px solid rgba(255,255,255,0.20)",
                                background: profileNameInput.trim() ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.04)",
                                color: profileNameInput.trim() ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.25)",
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: profileNameInput.trim() ? "pointer" : "default",
                                transition: "all 0.15s ease",
                                whiteSpace: "nowrap"
                              },
                              children: t("buttons.save")
                            }
                          )
                        ] }),
                        savedProfiles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            style: {
                              fontSize: 10,
                              color: "rgba(255,255,255,0.22)",
                              textAlign: "center",
                              padding: "6px 0",
                              fontStyle: "italic"
                            },
                            children: t("rating.labels.noProfiles")
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              display: "flex",
                              flexDirection: "column",
                              gap: 4,
                              maxHeight: 150,
                              overflowY: "auto"
                            },
                            children: savedProfiles.map((profile) => {
                              const isActive = activeProfileName === profile.name;
                              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "div",
                                {
                                  style: { display: "flex", alignItems: "center", gap: 4 },
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "button",
                                      {
                                        type: "button",
                                        "data-ocid": "rating.profile_load_button",
                                        onClick: () => loadProfile(profile.name),
                                        style: {
                                          flex: 1,
                                          height: 26,
                                          borderRadius: 7,
                                          border: isActive ? "1.5px solid rgba(100,220,150,0.55)" : "1px solid rgba(255,255,255,0.10)",
                                          background: isActive ? "rgba(100,220,150,0.12)" : "rgba(255,255,255,0.04)",
                                          color: isActive ? "rgba(100,220,150,0.90)" : "rgba(255,255,255,0.65)",
                                          fontSize: 11,
                                          fontWeight: isActive ? 700 : 500,
                                          cursor: "pointer",
                                          textAlign: "left",
                                          padding: "0 8px",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                          transition: "all 0.15s ease"
                                        },
                                        children: isActive ? `✓ ${profile.name}` : profile.name
                                      }
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "button",
                                      {
                                        type: "button",
                                        "data-ocid": "rating.profile_delete_button",
                                        onClick: () => deleteProfile(profile.name),
                                        "aria-label": `${t("buttons.remove")} ${profile.name}`,
                                        style: {
                                          width: 22,
                                          height: 22,
                                          borderRadius: 5,
                                          border: "1px solid rgba(255,255,255,0.10)",
                                          background: "rgba(255,255,255,0.04)",
                                          color: "rgba(255,255,255,0.35)",
                                          fontSize: 12,
                                          cursor: "pointer",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          flexShrink: 0,
                                          lineHeight: 1
                                        },
                                        children: "×"
                                      }
                                    )
                                  ]
                                },
                                profile.name
                              );
                            })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            style: {
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              color: "rgba(255,255,255,0.25)",
                              textTransform: "uppercase",
                              marginTop: 12,
                              marginBottom: 6
                            },
                            children: t("rating.labels.quickPresets")
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 }, children: RATING_DISPLAY_PRESETS.map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            "data-ocid": `rating.preset_${preset.name.replace(/\s+/g, "_").toLowerCase()}_button`,
                            onClick: () => {
                              updateSettings({ ...preset.settings, preset: preset.name });
                            },
                            style: {
                              padding: "3px 7px",
                              borderRadius: 5,
                              fontSize: 9,
                              fontWeight: 600,
                              border: "1px solid rgba(255,255,255,0.12)",
                              background: "rgba(255,255,255,0.05)",
                              color: "rgba(255,255,255,0.50)",
                              cursor: "pointer",
                              transition: "all 0.15s ease"
                            },
                            children: preset.name
                          },
                          preset.name
                        )) })
                      ]
                    }
                  )
                ]
              }
            )
          }
        )
      ]
    }
  );
}
function getEasingValue(easing) {
  switch (easing) {
    case "ease-in-out":
      return "cubic-bezier(0.4,0,0.2,1)";
    case "spring":
      return "cubic-bezier(0.34, 1.56, 0.64, 1)";
    case "bounce":
      return "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    default:
      return "ease";
  }
}
function RatingPage() {
  const { t } = useTranslation();
  const { data: rawNfts, isLoading, isError } = useGetAllPublicNFTs();
  const nfts = useShuffledNFTs(rawNfts);
  const {
    settings: ratingSettings,
    updateSettings,
    resetToDefault,
    savedProfiles,
    activeProfileName,
    saveProfile,
    loadProfile,
    deleteProfile
  } = useRatingDisplay();
  const [ratings, setRatings] = reactExports.useState({});
  const [activeIndex, setActiveIndex] = reactExports.useState(0);
  const [exitState, setExitState] = reactExports.useState(null);
  const exitTimerRef = reactExports.useRef(null);
  const isScrollingRef = reactExports.useRef(false);
  const scrollCooldownRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  reactExports.useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (scrollCooldownRef.current) clearTimeout(scrollCooldownRef.current);
    };
  }, []);
  reactExports.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const cooldown = ratingSettings.scrollCooldown;
    const handler = (e) => {
      e.preventDefault();
      if (!nfts || isScrollingRef.current) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      setActiveIndex((prev) => {
        const next = prev + dir;
        if (next < 0 || next >= nfts.length) return prev;
        return next;
      });
      isScrollingRef.current = true;
      if (scrollCooldownRef.current) clearTimeout(scrollCooldownRef.current);
      scrollCooldownRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, cooldown);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [nfts, ratingSettings.scrollCooldown]);
  const handleRate = (tokenId, emotionId) => {
    if (!nfts) return;
    const key = tokenId.toString();
    setRatings((prev) => ({ ...prev, [key]: emotionId }));
    const emotion = EMOTIONS.find((e) => e.id === emotionId);
    if (emotion)
      ue.success(t(emotion.labelKey), {
        duration: 2e3,
        description: t("messages.ratingDesc")
      });
    const dir = emotionId < 0 ? "left" : "right";
    const currentNft = nfts[activeIndex];
    if (!currentNft) return;
    setExitState({ nft: currentNft, dir });
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = setTimeout(() => {
      setExitState(null);
      setActiveIndex((prev) => Math.min(prev + 1, nfts.length));
    }, 460);
  };
  const visibleNFTs = nfts ? nfts.slice(activeIndex, activeIndex + ratingSettings.visibleCards) : [];
  const allRated = nfts ? activeIndex >= nfts.length : false;
  const DEPTHS = reactExports.useMemo(() => computeDepths(ratingSettings), [ratingSettings]);
  const easingValue = getEasingValue(ratingSettings.animationEasing);
  const TRANSITION = `transform ${ratingSettings.animationDuration}s ${easingValue}, opacity ${(ratingSettings.animationDuration * 0.9).toFixed(2)}s ${easingValue}`;
  function getDepthStyle(pos) {
    const d = DEPTHS[pos] ?? DEPTHS[DEPTHS.length - 1];
    if (!d) return {};
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      transform: `perspective(${ratingSettings.perspectiveDepth}px) translateZ(${d.tz}px) translateX(${d.tx}px) translateY(${d.ty}px) scale(${d.scale}) rotate(${d.rot}deg)`,
      opacity: d.opacity,
      transition: TRANSITION,
      zIndex: ratingSettings.visibleCards - pos,
      pointerEvents: pos === 0 ? "auto" : "none",
      transformOrigin: ratingSettings.arrangementShape === "fan" ? "center bottom" : "center center"
    };
  }
  function getExitStyle(dir) {
    const tx = dir === "left" ? "-130%" : "130%";
    const rot = dir === "left" ? -8 : 8;
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      transform: `perspective(${ratingSettings.perspectiveDepth}px) translateX(${tx}) rotate(${rot}deg) scale(0.92)`,
      opacity: 0,
      transition: TRANSITION,
      zIndex: 20,
      pointerEvents: "none",
      transformOrigin: "center center"
    };
  }
  const containerTiltStyle = {
    transform: `translateX(${ratingSettings.horizontalOffset}px) translateY(${ratingSettings.verticalOffset}px) rotateX(${ratingSettings.cardTilt}deg)`,
    transition: "transform 0.3s ease"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-content max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-bold tracking-tight gradient-text", children: t("messages.ratingTitle") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("messages.ratingSubtitle") })
      ] }),
      nfts && nfts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: [
        Math.min(activeIndex + 1, nfts.length),
        " / ",
        nfts.length
      ] })
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "rating.loading_state", className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          position: "relative",
          width: "min(60vw, 440px)",
          height: "min(60vw, 440px)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-full rounded-2xl" })
      }
    ) }),
    isError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "rating.error_state", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card border border-destructive/50 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive font-semibold flex-1", children: t("errors.loadError") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "rating.manual_reload_button",
          onClick: () => window.location.reload(),
          className: "shrink-0 px-4 py-2 rounded-xl border-2 border-destructive/40 bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors duration-200",
          children: t("buttons.reload")
        }
      )
    ] }) }),
    !isLoading && !isError && nfts && nfts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "rating.empty_state",
        className: "glass-card rounded-2xl p-12 flex flex-col items-center text-center gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-lg", children: t("messages.ratingEmpty") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: t("messages.ratingEmptyDesc") })
        ]
      }
    ),
    !isLoading && !isError && allRated && nfts && nfts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "rating.success_state",
        className: "glass-card rounded-2xl p-12 flex flex-col items-center text-center gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-16 h-16 rounded-full mb-2",
              style: {
                background: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(59,130,246,0.4)",
                boxShadow: "0 0 32px 8px rgba(59,130,246,0.2)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-lg", children: t("messages.ratingAllDone") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            nfts.length,
            " ",
            nfts.length === 1 ? "hodnotenie" : "hodnotení",
            " ",
            "uložených"
          ] })
        ]
      }
    ),
    !isLoading && !isError && !allRated && visibleNFTs.length > 0 && reactDomExports.createPortal(
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        RatingArrangementPanel,
        {
          settings: ratingSettings,
          updateSettings,
          resetToDefault,
          savedProfiles,
          activeProfileName,
          saveProfile,
          loadProfile,
          deleteProfile
        }
      ),
      document.body
    ),
    !isLoading && !isError && !allRated && visibleNFTs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "rating.section", className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: containerRef,
          style: {
            position: "relative",
            width: "min(calc(60vw + 320px), 780px)",
            height: "min(calc(60vw + 80px), 540px)",
            overflow: "visible",
            perspective: `${ratingSettings.perspectiveDepth}px`,
            cursor: "ns-resize",
            ...containerTiltStyle
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                width: "min(60vw, 440px)",
                height: "min(60vw, 440px)"
              },
              children: [
                [...visibleNFTs].reverse().map((nft, revIdx) => {
                  const pos = visibleNFTs.length - 1 - revIdx;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      "data-ocid": `rating.item.${activeIndex + pos + 1}`,
                      style: getDepthStyle(pos),
                      children: pos === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ActiveCard,
                        {
                          nft,
                          rating: ratings[nft.tokenId.toString()] ?? null,
                          settings: ratingSettings
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(PeekCard, { nft, pos, settings: ratingSettings })
                    },
                    nft.tokenId.toString()
                  );
                }),
                exitState && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: getExitStyle(exitState.dir),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ActiveCard,
                      {
                        nft: exitState.nft,
                        rating: ratings[exitState.nft.tokenId.toString()] ?? null,
                        settings: ratingSettings
                      }
                    )
                  },
                  `exit-${exitState.nft.tokenId.toString()}`
                )
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "aria-hidden": "true",
          style: {
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginTop: 12,
            opacity: 0.38,
            pointerEvents: "none",
            userSelect: "none"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "svg",
              {
                "aria-hidden": "true",
                width: "14",
                height: "18",
                viewBox: "0 0 14 18",
                fill: "none",
                style: { flexShrink: 0 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "rect",
                    {
                      x: "1",
                      y: "1",
                      width: "12",
                      height: "16",
                      rx: "6",
                      stroke: "white",
                      strokeWidth: "1.4"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "line",
                    {
                      x1: "7",
                      y1: "4",
                      x2: "7",
                      y2: "7",
                      stroke: "white",
                      strokeWidth: "1.4",
                      strokeLinecap: "round"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  fontSize: 10,
                  color: "white",
                  fontWeight: 600,
                  letterSpacing: "0.05em"
                },
                children: t("messages.scrollHint")
              }
            )
          ]
        }
      ),
      !exitState && visibleNFTs[0] && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-end justify-center",
          style: { gap: 10, marginTop: 28 },
          role: "radiogroup",
          "aria-label": t("messages.ratingTitle"),
          "data-ocid": "rating.circles",
          children: EMOTIONS.map((emotion) => {
            const activeNft = visibleNFTs[0];
            if (!activeNft) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              EmotionCircle,
              {
                emotion,
                selected: ratings[activeNft.tokenId.toString()] === emotion.id,
                onSelect: () => handleRate(activeNft.tokenId, emotion.id)
              },
              emotion.id
            );
          })
        }
      )
    ] })
  ] });
}
export {
  computeDepths,
  RatingPage as default
};
