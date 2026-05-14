/**
 * BackendContext — Simple Actor Provider (Blob-native, no object-storage)
 *
 * On mount: fetches /env.json once with cache: 'no-store'.
 * Validates redirect and Content-Type.
 * Creates HttpAgent + Actor exactly once per identity change.
 * If env.json fails → error state, actor=null. No retries, no reloads.
 *
 * Usage:
 *   const { actor, isLoading, error } = useBackend();
 */
import { createActor } from "@/backend";
import type { Backend } from "@/backend";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { HttpAgent, type HttpAgentOptions } from "@icp-sdk/core/agent";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface BackendContextValue {
  actor: Backend | null;
  canisterId: string | null;
  isLoading: boolean;
  error: string | null;
}

const BackendContext = createContext<BackendContextValue | null>(null);

function processError(e: unknown): never {
  if (e && typeof e === "object" && "message" in e) {
    const raw = `${(e as { message: unknown }).message}`;
    const match = raw.match(/with message:\s*'([^']+)'/s);
    throw new Error(match ? match[1] : raw);
  }
  throw e;
}

export function BackendProvider({ children }: { children: React.ReactNode }) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const [actor, setActor] = useState<Backend | null>(null);
  const [canisterId, setCanisterId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track identity so we re-create actor when login/logout happens.
  const lastPrincipal = useRef<string | null>(null);

  useEffect(() => {
    const currentPrincipal = identity?.getPrincipal().toString() ?? null;
    if (currentPrincipal === lastPrincipal.current) return;
    lastPrincipal.current = currentPrincipal;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        // 1. Fetch env.json — no cache, no fallback.
        const res = await fetch("/env.json", { cache: "no-store" });

        if (res.redirected) throw new Error("Konfigurácia chýba");

        const ct = res.headers.get("content-type") ?? "";
        if (!ct.includes("application/json"))
          throw new Error("Konfigurácia chýba");

        if (!res.ok) throw new Error("Konfigurácia chýba");

        const raw = (await res.json()) as Record<string, string>;
        const freshCanisterId =
          raw.backend_canister_id && raw.backend_canister_id !== "undefined"
            ? raw.backend_canister_id
            : "";

        if (!freshCanisterId) throw new Error("Konfigurácia chýba");

        // 2. Build HttpAgent.
        const backendHost =
          raw.backend_host && raw.backend_host !== "undefined"
            ? raw.backend_host
            : undefined;

        const agentOpts: HttpAgentOptions = {
          ...(backendHost ? { host: backendHost } : {}),
          ...(isAuthenticated && identity ? { identity } : {}),
        };
        const agent = new HttpAgent(agentOpts);

        if (backendHost?.includes("localhost")) {
          await agent.fetchRootKey().catch(() => {
            console.warn("[BackendContext] Could not fetch root key");
          });
        }

        // 3. Create actor — no StorageClient, no uploadFile/downloadFile callbacks.
        //    Images are sent/received as raw Uint8Array (Motoko Blob) directly.
        const noopUpload = async (_f: unknown): Promise<Uint8Array> => {
          throw new Error("object-storage is not used");
        };
        const noopDownload = async (_b: Uint8Array): Promise<unknown> => {
          throw new Error("object-storage is not used");
        };

        const newActor = createActor(
          freshCanisterId,
          noopUpload as Parameters<typeof createActor>[1],
          noopDownload as Parameters<typeof createActor>[2],
          {
            agent,
            processError,
          },
        );

        if (!cancelled) {
          setActor(newActor);
          setCanisterId(freshCanisterId);
          setError(null);
          console.log(
            "[BackendContext] Actor initialised for canister:",
            freshCanisterId,
          );
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[BackendContext] Failed to initialise:", err);
          setError("Konfigurácia chýba");
          setActor(null);
          setCanisterId(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // Re-run when identity or auth state changes (login/logout).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity, isAuthenticated]);

  return (
    <BackendContext.Provider value={{ actor, canisterId, isLoading, error }}>
      {children}
    </BackendContext.Provider>
  );
}

export function useBackend(): BackendContextValue {
  const ctx = useContext(BackendContext);
  if (!ctx) {
    throw new Error("useBackend must be used inside <BackendProvider>");
  }
  return ctx;
}
