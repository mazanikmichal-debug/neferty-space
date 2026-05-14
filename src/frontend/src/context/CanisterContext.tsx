/**
 * CanisterContext — no-op passthrough.
 * Kept only so existing imports do not break the build.
 * @deprecated Use useBackend() from context/BackendContext instead.
 */

const _noop = () => {};

export function CanisterProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useCanisterError() {
  return { stoppedCanister: false, markStopped: _noop, clearStopped: _noop };
}
