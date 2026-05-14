/**
 * Runtime environment loader — simple, no caching, no fallbacks.
 * Fetches /env.json once with { cache: 'no-store' }.
 * Validates redirect and Content-Type.
 * Returns config or throws. No retries, no sessionStorage, no _lastKnown.
 */

export interface EnvConfig {
  backend_canister_id: string;
  backend_host?: string;
  storage_gateway_url?: string;
  project_id?: string;
  ii_derivation_origin?: string;
}

/**
 * Fetches /env.json fresh with no caching.
 * Throws if the request is redirected (SPA catch-all), if Content-Type is
 * not application/json, or if backend_canister_id is missing.
 */
export async function loadEnvConfig(): Promise<EnvConfig> {
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

  const raw = (await res.json()) as Record<string, string>;

  const canisterId =
    raw.backend_canister_id && raw.backend_canister_id !== "undefined"
      ? raw.backend_canister_id
      : "";

  if (!canisterId) {
    throw new Error("Konfigurácia chýba");
  }

  return {
    backend_canister_id: canisterId,
    backend_host:
      raw.backend_host && raw.backend_host !== "undefined"
        ? raw.backend_host
        : undefined,
    storage_gateway_url:
      raw.storage_gateway_url && raw.storage_gateway_url !== "undefined"
        ? raw.storage_gateway_url
        : undefined,
    project_id:
      raw.project_id && raw.project_id !== "undefined"
        ? raw.project_id
        : undefined,
    ii_derivation_origin:
      raw.ii_derivation_origin && raw.ii_derivation_origin !== "undefined"
        ? raw.ii_derivation_origin
        : undefined,
  };
}
