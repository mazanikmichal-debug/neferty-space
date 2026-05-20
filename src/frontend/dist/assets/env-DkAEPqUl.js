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
export {
  loadEnvConfig
};
