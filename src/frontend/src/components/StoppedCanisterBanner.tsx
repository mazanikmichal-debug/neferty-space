/**
 * StoppedCanisterBanner / BackendErrorBanner — no-op stubs.
 * Kept only so any page that still imports these names does not break the build.
 * All banner logic has been removed per the simplification requirements.
 */

/** @deprecated No-op — banner logic removed. */
export function BackendErrorBanner() {
  return null;
}

/** @deprecated No-op — banner logic removed. */
export const StoppedCanisterBanner = BackendErrorBanner;
