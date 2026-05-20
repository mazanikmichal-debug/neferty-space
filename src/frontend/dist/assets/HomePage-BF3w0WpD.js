import { u as useTranslation, j as jsxRuntimeExports, S as Sparkles, a as Store, I as Images, b as Star, L as Link } from "./index-CuZWHZ-E.js";
const HUB_SECTIONS = [
  { to: "/mint", Icon: Sparkles, key: "mint", ocid: "home.mint_card" },
  {
    to: "/marketplace",
    Icon: Store,
    key: "marketplace",
    ocid: "home.marketplace_card"
  },
  { to: "/gallery", Icon: Images, key: "gallery", ocid: "home.gallery_card" },
  { to: "/rating", Icon: Star, key: "rating", ocid: "home.rating_card" }
];
function HomePage() {
  const { t } = useTranslation();
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-display font-bold uppercase tracking-widest text-white", children: t(`nav.${section.key}`) })
      ]
    },
    section.to
  )) }) });
}
export {
  HomePage as default
};
