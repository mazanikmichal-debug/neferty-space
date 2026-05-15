import { j as jsxRuntimeExports } from "./index-B8lwuDBy.js";
import { c as cn } from "./utils-BsXaUsmB.js";
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
export {
  Skeleton as S
};
