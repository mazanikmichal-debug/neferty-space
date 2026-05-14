import { j as jsxRuntimeExports, S as Sparkles, a as Store, I as Images, b as Star, L as Link } from "./index-CQ236Vkp.js";
const HUB_SECTIONS = [
  { to: "/mint", Icon: Sparkles, label: "Raziť", ocid: "home.mint_card" },
  {
    to: "/marketplace",
    Icon: Store,
    label: "Trhovisko",
    ocid: "home.marketplace_card"
  },
  { to: "/gallery", Icon: Images, label: "Galéria", ocid: "home.gallery_card" },
  { to: "/rating", Icon: Star, label: "Hodnotenie", ocid: "home.rating_card" }
];
function HomePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-content flex flex-col items-center justify-center min-h-[70vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hub-card-grid", "data-ocid": "home.hub_grid", children: HUB_SECTIONS.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: section.to,
      "data-ocid": section.ocid,
      className: "hub-card no-underline",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          section.Icon,
          {
            className: "w-20 h-20 text-white",
            strokeWidth: 1.2,
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-display font-bold uppercase tracking-widest text-white", children: section.label })
      ]
    },
    section.to
  )) }) });
}
export {
  HomePage as default
};
