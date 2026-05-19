import type { PendingTx } from "@/backend";
/**
 * SettingsPage — Full-page settings at /settings
 *
 * Sections:
 *  1. Cycles Management Card (health bar, stats, expert mode, top-up flow)
 *  2. Cycles Calculator (inline)
 *  3. Admin Treasury (admin-only)
 *  4. Theme Settings (inline accordion)
 */
import { CyclesCalculator } from "@/components/CyclesCalculator";
import { useBackend } from "@/context/BackendContext";
import {
  useAddAdmin,
  useAdminRetryTopUp,
  useCleanupCorruptedRegistry,
  useCreateMyCollection,
  useGetAllPendingTransactions,
  useGetMyHealthStatus,
  useGetMyPendingTransactions,
  useGetPlatformFees,
  useGetStatus,
  useGetUserRegistryEntry,
  useListAdmins,
  useProcessTopUp,
  useRemoveAdmin,
  useRetryTopUp,
  useWithdrawPlatformFees,
} from "@/hooks/useQueries";
import type { CycleHealth } from "@/types/nft";
import { copyToClipboard } from "@/utils/clipboard";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";

import { Principal } from "@dfinity/principal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  Check,
  ChevronDown,
  Copy,
  HardDrive,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// ─── Color maps ────────────────────────────────────────────────────────────

const HEALTH_HEX: Record<CycleHealth, string> = {
  green: "#22c55e",
  orange: "#f97316",
  red: "#ef4444",
};

const HEALTH_GLOW: Record<CycleHealth, string> = {
  green: "rgba(34,197,94,0.35)",
  orange: "rgba(249,115,22,0.35)",
  red: "rgba(239,68,68,0.35)",
};

// ─── HealthBar ───────────────────────────────────────────────────────────────

function HealthBar({
  color,
  fillPct,
}: { color: CycleHealth; fillPct: number }) {
  const hex = HEALTH_HEX[color];
  const glow = HEALTH_GLOW[color];
  return (
    <div
      data-ocid="settings.health_bar"
      className="relative w-full h-4 rounded-full overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
      role="progressbar"
      tabIndex={0}
      aria-valuenow={fillPct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
        style={{
          width: `${fillPct}%`,
          background: `linear-gradient(90deg, ${hex}cc, ${hex})`,
          boxShadow: `0 0 14px ${glow}`,
        }}
      />
    </div>
  );
}

// ─── SectionCard ─────────────────────────────────────────────────────────────

function SectionCard({
  children,
  title,
  icon,
}: {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-3xl p-6 flex flex-col gap-5"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
      }}
    >
      {title && (
        <div className="flex items-center gap-2">
          {icon && (
            <span style={{ color: "rgba(255,255,255,0.45)" }}>{icon}</span>
          )}
          <span
            className="font-display text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ color: "rgba(255,255,255,0.50)" }}
          >
            {title}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

// ─── CorruptedRegistryBanner ────────────────────────────────────────────────

function CorruptedRegistryBanner() {
  return null;
}

// ─── PendingTransactionsSection ─────────────────────────────────────────────

function PendingTransactionsSection() {
  const { data: pending } = useGetMyPendingTransactions();
  const retryTopUp = useRetryTopUp();
  const queryClient = useQueryClient();

  if (!pending || pending.length === 0) return null;

  const handleRetry = (tx: PendingTx) => {
    retryTopUp.mutate(tx.blockIndex, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["myPendingTransactions"] });
        queryClient.invalidateQueries({ queryKey: ["myHealthStatus"] });
      },
    });
  };

  return (
    <SectionCard
      title="Problematické platby"
      icon={<AlertTriangle size={14} style={{ color: "#f97316" }} />}
    >
      <div className="space-y-2">
        {pending.map((tx, i) => {
          const amountIcp = (Number(tx.amount) / 100_000_000).toFixed(4);
          const retryCount = Number(tx.retryCount);
          const date = new Date(
            Number(tx.createdAt / 1_000_000n),
          ).toLocaleString("sk-SK");
          const maxed = retryCount >= 3;

          return (
            <div
              key={tx.blockIndex.toString()}
              data-ocid={`settings.pending_tx.item.${i + 1}`}
              className="rounded-xl px-4 py-3 flex flex-col gap-2"
              style={{
                background: "rgba(251,191,36,0.07)",
                border: "1px solid rgba(251,191,36,0.22)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <p
                    className="text-sm font-mono font-semibold"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    {amountIcp} ICP
                  </p>
                  <p
                    className="text-[10px]"
                    style={{ color: "rgba(255,255,255,0.38)" }}
                  >
                    {date}
                  </p>
                </div>
                <span
                  className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(251,191,36,0.15)",
                    color: "rgba(251,191,36,0.90)",
                    border: "1px solid rgba(251,191,36,0.28)",
                  }}
                >
                  Čaká na spracovanie
                </span>
              </div>

              {maxed ? (
                <p
                  className="text-[10px]"
                  style={{ color: "rgba(239,68,68,0.80)" }}
                >
                  Maximálny počet pokusov. Kontaktujte podporu.
                </p>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[10px]"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    Pokus {retryCount}/3
                  </span>
                  <button
                    type="button"
                    data-ocid={`settings.pending_tx_retry_button.${i + 1}`}
                    onClick={() => handleRetry(tx)}
                    disabled={retryTopUp.isPending}
                    className="text-[10px] font-semibold px-3 py-1 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-40"
                    style={{
                      background: "rgba(251,191,36,0.15)",
                      color: "rgba(251,191,36,0.90)",
                      border: "1px solid rgba(251,191,36,0.28)",
                    }}
                  >
                    {retryTopUp.isPending ? (
                      <span className="flex items-center gap-1">
                        <Loader2 size={10} className="animate-spin" />
                        Spracovávam...
                      </span>
                    ) : (
                      "Skúsiť znova"
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

// ─── AdminPaymentMonitor ─────────────────────────────────────────────────────

function AdminPaymentMonitor() {
  const { identity } = useInternetIdentity();
  const { data: allPending } = useGetAllPendingTransactions();
  const adminRetryTopUp = useAdminRetryTopUp();

  const { data: adminList } = useListAdmins();
  const userPrincipal = identity?.getPrincipal().toText();
  const isAdmin =
    !!userPrincipal &&
    (adminList ?? []).some((p) => p.toText() === userPrincipal);

  if (!isAdmin) return null;

  const txList = allPending ?? [];

  return (
    <SectionCard title="Platobný monitoring" icon={<ShieldCheck size={14} />}>
      {txList.length === 0 ? (
        <div
          data-ocid="settings.admin_payments_empty_state"
          className="flex items-center gap-2 py-2"
          style={{ color: "rgba(34,197,94,0.75)" }}
        >
          <Check size={14} />
          <span className="text-sm">Všetky platby spracované</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {["Principal", "Suma ICP", "Dátum", "Stav", "Pokusy", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="pb-2 text-left font-semibold uppercase tracking-wider"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {txList.map((tx, i) => {
                const amountIcp = (Number(tx.amount) / 100_000_000).toFixed(2);
                const callerText = tx.caller.toText();
                const shortCaller =
                  callerText.length > 12
                    ? `${callerText.slice(0, 12)}...`
                    : callerText;
                const date = new Date(
                  Number(tx.createdAt / 1_000_000n),
                ).toLocaleDateString("sk-SK");
                const retryCount = Number(tx.retryCount);

                return (
                  <tr
                    key={tx.blockIndex.toString()}
                    data-ocid={`settings.admin_payment_row.${i + 1}`}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <td
                      className="py-2 pr-3 font-mono"
                      style={{ color: "rgba(255,255,255,0.70)" }}
                    >
                      {shortCaller}
                    </td>
                    <td
                      className="py-2 pr-3 font-mono"
                      style={{ color: "rgba(255,255,255,0.80)" }}
                    >
                      {amountIcp}
                    </td>
                    <td
                      className="py-2 pr-3"
                      style={{ color: "rgba(255,255,255,0.50)" }}
                    >
                      {date}
                    </td>
                    <td className="py-2 pr-3">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(251,191,36,0.15)",
                          color: "rgba(251,191,36,0.90)",
                        }}
                      >
                        Čaká
                      </span>
                    </td>
                    <td
                      className="py-2 pr-3 text-center"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {retryCount}
                    </td>
                    <td className="py-2">
                      <button
                        type="button"
                        data-ocid={`settings.admin_retry_button.${i + 1}`}
                        onClick={() => adminRetryTopUp.mutate(tx.blockIndex)}
                        disabled={adminRetryTopUp.isPending}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-40"
                        style={{
                          background: "rgba(139,92,246,0.18)",
                          color: "rgba(167,139,250,0.90)",
                          border: "1px solid rgba(139,92,246,0.30)",
                        }}
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

// ─── Helper: compute % and color from cycles bigint ─────────────────────────

const MAX_CYCLES = 10_000_000_000_000n; // 10T = 100%
// Zero principal = aaaaa-aa — returned when collection does not exist yet
const ZERO_PRINCIPAL_TEXT = "aaaaa-aa";
function isZeroPrincipal(p: Principal | null | undefined): boolean {
  if (!p) return false;
  try {
    return p.toText() === ZERO_PRINCIPAL_TEXT;
  } catch {
    return false;
  }
}

function cyclesPercent(cycles: bigint): number {
  return Math.min(100, Math.round(Number((cycles * 100n) / MAX_CYCLES)));
}

function cyclesColor(pct: number): CycleHealth {
  if (pct > 50) return "green";
  if (pct >= 20) return "orange";
  return "red";
}

// ─── CanisterStatusCard (admin — getStatus()) ─────────────────────────────────

function CanisterStatusCard() {
  const { t } = useTranslation();
  const [expertMode, setExpertMode] = useState(false);
  const { data: status, isLoading, isError } = useGetStatus();

  if (isLoading) {
    return (
      <SectionCard
        title={t("settings.cyclesManagement")}
        icon={<Activity size={14} />}
      >
        <div className="space-y-3 animate-pulse">
          <div
            className="h-4 rounded-full w-full"
            style={{ background: "rgba(255,255,255,0.09)" }}
          />
          <div className="flex gap-3">
            <div
              className="flex-1 h-24 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <div
              className="flex-1 h-24 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
          </div>
        </div>
      </SectionCard>
    );
  }

  if (isError || status === null || status === undefined) {
    return (
      <SectionCard
        title={t("settings.cyclesManagement")}
        icon={<Activity size={14} />}
      >
        <p
          data-ocid="settings.cycles_error_state"
          className="text-sm text-center py-4"
          style={{ color: "rgba(255,255,255,0.38)" }}
        >
          Štatistiky nedostupné
        </p>
      </SectionCard>
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
  const prepaidMB = Math.round((Number(cycles) / 4_000_000_000_000) * 1024);
  const usedMB = Math.round(Number(memory) / 1_048_576);

  return (
    <SectionCard
      title={t("settings.cyclesManagement")}
      icon={
        isCritical ? (
          <AlertTriangle size={14} style={{ color: "#ef4444" }} />
        ) : (
          <Activity size={14} />
        )
      }
    >
      <HealthBar color={color} fillPct={pct} />
      {isCritical && (
        <div
          data-ocid="settings.cycles_critical_alert"
          className="flex items-center gap-2.5 rounded-xl px-4 py-3"
          style={{
            background: "rgba(239,68,68,0.13)",
            border: "1px solid rgba(239,68,68,0.35)",
          }}
        >
          <AlertTriangle
            size={15}
            style={{ color: "#ef4444", flexShrink: 0 }}
          />
          <p
            className="text-xs font-semibold"
            style={{ color: "rgba(239,68,68,0.92)" }}
          >
            Pozor: Zásoby cycles sú kriticky nízke! Doplňte čo najskôr.
          </p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{
              background: hex,
              boxShadow: `0 0 8px ${HEALTH_GLOW[color]}`,
            }}
          />
          <span
            data-ocid="settings.health_status_text"
            className="text-sm font-semibold"
            style={{ color: hex }}
          >
            {color === "green"
              ? t("settings.cyclesCard.healthGreen")
              : color === "orange"
                ? t("settings.cyclesCard.healthYellow")
                : t("settings.cyclesCard.healthRed")}
          </span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>
            {pct}%
          </span>
        </div>
        <button
          type="button"
          data-ocid="settings.expert_mode_toggle"
          onClick={() => setExpertMode((v) => !v)}
          className="text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors duration-200"
          style={{
            background: expertMode
              ? "rgba(139,92,246,0.25)"
              : "rgba(255,255,255,0.07)",
            color: expertMode
              ? "rgba(167,139,250,0.90)"
              : "rgba(255,255,255,0.38)",
            border: expertMode
              ? "1px solid rgba(139,92,246,0.35)"
              : "1px solid rgba(255,255,255,0.10)",
          }}
        >
          Expert
        </button>
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <table className="w-full text-xs">
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <td
                className="px-3 py-2"
                style={{ color: "rgba(255,255,255,0.38)", width: "35%" }}
              >
                Cycles
              </td>
              <td
                className="px-3 py-2 font-mono font-semibold"
                style={{ color: hex }}
              >
                {trillionCycles} T
              </td>
              <td
                className="px-3 py-2"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                {expertMode ? "Heap" : "Pamäť"}
              </td>
              <td
                className="px-3 py-2 font-mono font-semibold"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {expertMode ? heapMB : memoryMB} MB
              </td>
            </tr>
            <tr>
              <td
                className="px-3 py-2"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                Využité MB
              </td>
              <td
                className="px-3 py-2 font-mono font-semibold"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {usedMB} MB
              </td>
              <td
                className="px-3 py-2"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                Predplatené MB
              </td>
              <td
                className="px-3 py-2 font-mono font-semibold"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {prepaidMB} MB
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingTop: "1rem",
        }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-widest mb-3"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Dobiť cycles
        </p>
        <CyclesCalculator onTopUp={() => {}} onClose={() => {}} />
      </div>
    </SectionCard>
  );
}

// ─── CyclesCard (per-user collection — getMyHealthStatus()) ───────────────────

function CyclesCard() {
  const { t } = useTranslation();
  const { actor } = useBackend();
  const { identity } = useInternetIdentity();

  const { data: collectionPrincipal, isLoading: collectionLoading } = useQuery<
    Principal | null,
    Error,
    Principal | null,
    string[]
  >({
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
    staleTime: 300_000,
  });

  const collectionIsZero = isZeroPrincipal(collectionPrincipal);

  const {
    data: health,
    isLoading: healthLoading,
    isError: healthError,
    error: healthErrorObj,
    refetch: healthRefetch,
  } = useGetMyHealthStatus();

  const { data: status, isError: statusAdminError } = useGetStatus();

  const [emergencyBlockIndex, setEmergencyBlockIndex] = useState("");
  const [emergencyBlockIndexError, setEmergencyBlockIndexError] = useState("");
  const [syncOpen, setSyncOpen] = useState(false);
  const [emergencyResult, setEmergencyResult] = useState<{
    ok?: string;
    err?: string;
  } | null>(null);
  const processTopUpEmergency = useProcessTopUp();

  const isAdmin = !statusAdminError && status !== null && status !== undefined;
  if (isAdmin) {
    return <CanisterStatusCard />;
  }

  const isLoading = collectionLoading || healthLoading;

  if (isLoading) {
    return (
      <SectionCard
        title={t("settings.cyclesManagement")}
        icon={<Activity size={14} />}
      >
        <div
          data-ocid="settings.cycles_loading_state"
          className="flex flex-col items-center gap-3 py-6"
        >
          <Loader2
            size={28}
            className="animate-spin"
            style={{ color: "rgba(167,139,250,0.80)" }}
          />
          <p
            className="text-sm text-center"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Načítavam živé dáta z blockchainu...
          </p>
        </div>
      </SectionCard>
    );
  }

  const isNoCollection =
    (!collectionLoading && (!collectionPrincipal || collectionIsZero)) ||
    (healthError && healthErrorObj?.message === "NO_COLLECTION");

  if (isNoCollection && !health) {
    return (
      <SectionCard
        title={t("settings.cyclesManagement")}
        icon={<Activity size={14} />}
      >
        <div
          data-ocid="settings.cycles_empty_state"
          className="rounded-2xl p-6 text-center space-y-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
            style={{ background: "rgba(34,197,94,0.12)" }}
          >
            <Zap size={20} style={{ color: "rgba(34,197,94,0.70)" }} />
          </div>
          <div className="space-y-1">
            <p
              className="text-sm font-semibold"
              style={{ color: "rgba(34,197,94,0.85)" }}
            >
              Predvolená zbierka Neferty Space
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              Tvoje NFT sú uložené v hlavnom canistri. Načítavam stav cycles...
            </p>
          </div>
        </div>
      </SectionCard>
    );
  }

  if (healthError && healthErrorObj?.message !== "NO_COLLECTION" && !health) {
    return (
      <SectionCard
        title={t("settings.cyclesManagement")}
        icon={<Activity size={14} />}
      >
        <div
          data-ocid="settings.cycles_error_state"
          className="rounded-2xl p-6 text-center space-y-3"
          style={{
            background: "rgba(239,68,68,0.07)",
            border: "1px solid rgba(239,68,68,0.20)",
          }}
        >
          <p className="text-sm" style={{ color: "rgba(239,68,68,0.85)" }}>
            Nepodarilo sa načítať stav cycles
          </p>
          <button
            type="button"
            data-ocid="settings.cycles_retry_button"
            onClick={() => healthRefetch()}
            className="text-xs px-4 py-1.5 rounded-full transition-colors"
            style={{
              background: "rgba(239,68,68,0.15)",
              color: "rgba(239,68,68,0.9)",
              border: "1px solid rgba(239,68,68,0.30)",
            }}
          >
            Skúsiť znova
          </button>
        </div>
      </SectionCard>
    );
  }

  const displayHealth = health
    ? {
        rawCycles: health.rawCycles,
        estimatedStorageMB: health.estimatedStorageMB,
        healthColor: health.healthColor as CycleHealth,
      }
    : null;

  if (!displayHealth) {
    return (
      <SectionCard
        title={t("settings.cyclesManagement")}
        icon={<Activity size={14} />}
      >
        <div
          data-ocid="settings.cycles_empty_state"
          className="rounded-2xl p-6 text-center space-y-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
            style={{ background: "rgba(34,197,94,0.12)" }}
          >
            <Zap size={20} style={{ color: "rgba(34,197,94,0.70)" }} />
          </div>
          <div className="space-y-1">
            <p
              className="text-sm font-semibold"
              style={{ color: "rgba(34,197,94,0.85)" }}
            >
              Predvolená zbierka Neferty Space
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              Tvoje NFT sú uložené v hlavnom canistri.
            </p>
          </div>
        </div>
      </SectionCard>
    );
  }

  // ── Derived display values ────────────────────────────────────────────
  const rawCyclesNum = Number(displayHealth.rawCycles);
  const usedMB = Math.round(Number(displayHealth.estimatedStorageMB));
  // Cycles remaining as storage: 1 GB/year = 4T cycles
  const prepaidMB = Math.round((rawCyclesNum / 4_000_000_000_000) * 1024);
  const color = displayHealth.healthColor;
  const hex = HEALTH_HEX[color] ?? HEALTH_HEX.green;

  // Format cycles with T/B/M suffix
  function formatCycles(n: number): string {
    if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(2)}T`;
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    return n.toLocaleString("sk-SK");
  }

  const cyclesDisplay = formatCycles(rawCyclesNum);

  // ── Glass card style matching nav menu ────────────────────────────────
  const glassCard = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
  } as const;

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
        "Číslo bloku musí byť celé číslo (napr. 36503278)",
      );
      return;
    }
    try {
      const result = await processTopUpEmergency.mutateAsync({
        blockIndex: BigInt(trimmed),
        collectionId: Principal.fromText("3shfw-daaaa-aaaag-aywla-cai"),
      });
      setEmergencyResult({
        ok: `Platba synchronizovaná! +${result.cyclesMinted.toLocaleString()} cycles`,
      });
      setEmergencyBlockIndex("");
    } catch (e: unknown) {
      setEmergencyResult({
        err: e instanceof Error ? e.message : "Neznáma chyba",
      });
    }
  };

  return (
    <SectionCard
      title={t("settings.cyclesManagement")}
      icon={<Activity size={14} />}
    >
      {/* ── Two large status cards ── */}
      <div
        data-ocid="settings.cycles_stats_grid"
        className="grid grid-cols-2 gap-3 mb-2"
      >
        {/* Cycles card */}
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-6 min-h-[120px]"
          style={glassCard}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: `rgba(${color === "green" ? "34,197,94" : color === "orange" ? "249,115,22" : "239,68,68"},0.15)`,
            }}
          >
            <Zap size={22} strokeWidth={1.5} style={{ color: hex }} />
          </div>
          <span
            data-ocid="settings.cycles_value"
            className="text-2xl font-bold font-mono leading-none tracking-tight"
            style={{ color: hex }}
          >
            {cyclesDisplay}
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            CYCLES
          </span>
        </div>

        {/* Storage card */}
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-6 min-h-[120px]"
          style={glassCard}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(56,189,248,0.15)" }}
          >
            <HardDrive
              size={22}
              strokeWidth={1.5}
              style={{ color: "#38bdf8" }}
            />
          </div>
          <span
            data-ocid="settings.storage_value"
            className="text-2xl font-bold font-mono leading-none tracking-tight"
            style={{ color: "rgba(255,255,255,0.90)" }}
          >
            {prepaidMB}{" "}
            <span
              className="text-base font-semibold"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              MB
            </span>
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            STORAGE
          </span>
        </div>
      </div>

      {/* Used MB sub-line */}
      {usedMB > 0 && (
        <p
          className="text-center text-[10px] mb-4"
          style={{ color: "rgba(255,255,255,0.28)" }}
        >
          Využité:{" "}
          <span style={{ color: "rgba(255,255,255,0.55)" }}>{usedMB} MB</span>
        </p>
      )}

      {/* ── Top-up form ── */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingTop: "1rem",
        }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-3"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Doplniť cycles
        </p>
        <CyclesCalculator onTopUp={() => {}} onClose={() => {}} />
      </div>

      {/* ── Synchronizácia platby — hidden by default ── */}
      {actor && (
        <div data-ocid="settings.emergency_sync_section" className="mt-2">
          <button
            type="button"
            data-ocid="settings.emergency_sync_toggle"
            onClick={() => setSyncOpen((v) => !v)}
            className="text-[11px] transition-opacity hover:opacity-80"
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            Zasekla sa platba? →
          </button>

          {syncOpen && (
            <div
              className="mt-3 rounded-2xl p-4 space-y-3"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Zadaj číslo bloku z tvojej peňaženky a klikni Synchronizovať.
              </p>
              <div className="flex gap-2">
                <input
                  data-ocid="settings.emergency_block_index_input"
                  type="text"
                  value={emergencyBlockIndex}
                  onChange={(e) => {
                    setEmergencyBlockIndex(e.target.value);
                    setEmergencyBlockIndexError("");
                    setEmergencyResult(null);
                  }}
                  placeholder="napr. 36503278"
                  className="flex-1 px-3 py-2 text-sm rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: emergencyBlockIndexError
                      ? "1px solid rgba(239,68,68,0.70)"
                      : "1px solid rgba(255,255,255,0.12)",
                  }}
                />
                <button
                  type="button"
                  data-ocid="settings.emergency_sync_button"
                  onClick={handleEmergencySync}
                  disabled={processTopUpEmergency.isPending}
                  className="px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{
                    background: "rgba(251,191,36,0.15)",
                    border: "1px solid rgba(251,191,36,0.35)",
                    color: "rgba(251,191,36,0.90)",
                  }}
                >
                  {processTopUpEmergency.isPending
                    ? "Spracovávam..."
                    : "Synchronizovať"}
                </button>
              </div>
              {emergencyBlockIndexError && (
                <p
                  data-ocid="settings.emergency_block_index_error"
                  className="text-xs"
                  style={{ color: "rgba(239,68,68,0.85)" }}
                >
                  {emergencyBlockIndexError}
                </p>
              )}
              {emergencyResult?.ok && (
                <p
                  data-ocid="settings.emergency_sync_success_state"
                  className="text-xs font-medium"
                  style={{ color: "rgba(34,197,94,0.85)" }}
                >
                  ✓ {emergencyResult.ok}
                </p>
              )}
              {emergencyResult?.err && (
                <p
                  data-ocid="settings.emergency_sync_error_state"
                  className="text-xs"
                  style={{ color: "rgba(239,68,68,0.85)" }}
                >
                  Chyba: {emergencyResult.err}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}

// ─── CalculatorCard ──────────────────────────────────────────────────────────

// CalculatorCard removed — calculator is now inline in CyclesCard

// ─── AdminManagementCard ────────────────────────────────────────────────────

function AdminManagementCard() {
  const { identity } = useInternetIdentity();
  const { data: adminList, isLoading: adminsLoading } = useListAdmins();
  const addAdmin = useAddAdmin();
  const removeAdmin = useRemoveAdmin();

  const userPrincipal = identity?.getPrincipal().toText();
  const isAdmin =
    !!userPrincipal &&
    (adminList ?? []).some((p) => p.toText() === userPrincipal);

  const [newPrincipal, setNewPrincipal] = useState("");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [removeErrors, setRemoveErrors] = useState<Record<string, string>>({});

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
        setTimeout(() => setAddSuccess(false), 3000);
      }
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Neznáma chyba");
    }
  };

  const handleRemoveConfirm = async (principalText: string) => {
    setRemoveErrors((prev) => ({ ...prev, [principalText]: "" }));
    try {
      const result = await removeAdmin.mutateAsync(principalText);
      if ("err" in result) {
        setRemoveErrors((prev) => ({ ...prev, [principalText]: result.err }));
      }
    } catch (err) {
      setRemoveErrors((prev) => ({
        ...prev,
        [principalText]: err instanceof Error ? err.message : "Neznáma chyba",
      }));
    } finally {
      setConfirmRemove(null);
    }
  };

  return (
    <SectionCard title="Správa adminov" icon={<ShieldCheck size={14} />}>
      {/* Current admins list */}
      <div className="space-y-2">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest mb-3"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Aktuálni admini
        </p>
        {adminsLoading ? (
          <div
            data-ocid="settings.admin_list_loading_state"
            className="flex items-center gap-2 py-2"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            <Loader2 size={12} className="animate-spin" />
            <span className="text-xs">Načítavam...</span>
          </div>
        ) : (adminList ?? []).length === 0 ? (
          <p
            data-ocid="settings.admin_list_empty_state"
            className="text-xs py-2"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Žiadni admini nenájdení
          </p>
        ) : (
          <div className="space-y-2">
            {(adminList ?? []).map((admin, i) => {
              const txt = admin.toText();
              const short = txt.length > 16 ? `${txt.slice(0, 16)}...` : txt;
              const isRemoving = removeAdmin.isPending && confirmRemove === txt;
              return (
                <div
                  key={txt}
                  data-ocid={`settings.admin_item.${i + 1}`}
                  className="flex items-center justify-between gap-2 rounded-xl px-3 py-2"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="text-xs font-mono truncate"
                      style={{ color: "rgba(255,255,255,0.70)" }}
                      title={txt}
                    >
                      {short}
                    </span>
                    <button
                      type="button"
                      data-ocid={`settings.admin_copy_button.${i + 1}`}
                      onClick={() => copyToClipboard(txt)}
                      className="flex-shrink-0 p-1 rounded-lg transition-colors hover:bg-white/10"
                      aria-label="Kopírovať Principal ID"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      <Copy size={11} />
                    </button>
                  </div>

                  {removeErrors[txt] && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-lg"
                      style={{
                        color: "rgba(239,68,68,0.90)",
                        background: "rgba(239,68,68,0.10)",
                        border: "1px solid rgba(239,68,68,0.20)",
                      }}
                    >
                      {removeErrors[txt]}
                    </span>
                  )}

                  {confirmRemove === txt ? (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span
                        className="text-[10px]"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        Ste si istý?
                      </span>
                      <button
                        type="button"
                        data-ocid={`settings.admin_remove_confirm_button.${i + 1}`}
                        onClick={() => handleRemoveConfirm(txt)}
                        disabled={isRemoving}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-40"
                        style={{
                          background: "rgba(239,68,68,0.18)",
                          color: "rgba(239,68,68,0.90)",
                          border: "1px solid rgba(239,68,68,0.30)",
                        }}
                      >
                        {isRemoving ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : (
                          "Áno"
                        )}
                      </button>
                      <button
                        type="button"
                        data-ocid={`settings.admin_remove_cancel_button.${i + 1}`}
                        onClick={() => setConfirmRemove(null)}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-[1.02]"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          color: "rgba(255,255,255,0.55)",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        Nie
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      data-ocid={`settings.admin_remove_button.${i + 1}`}
                      onClick={() => {
                        setConfirmRemove(txt);
                        setRemoveErrors((prev) => ({ ...prev, [txt]: "" }));
                      }}
                      disabled={removeAdmin.isPending}
                      className="flex-shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-40"
                      style={{
                        background: "rgba(239,68,68,0.10)",
                        color: "rgba(239,68,68,0.75)",
                        border: "1px solid rgba(239,68,68,0.20)",
                      }}
                    >
                      Odstrániť
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Divider */}
      <div
        className="my-1"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      />

      {/* Add new admin */}
      <div className="space-y-2">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Pridať admina
        </p>
        <div className="flex gap-2">
          <input
            data-ocid="settings.add_admin_input"
            type="text"
            value={newPrincipal}
            onChange={(e) => {
              setNewPrincipal(e.target.value);
              setAddError("");
              setAddSuccess(false);
            }}
            placeholder="Principal ID nového admina"
            className="flex-1 rounded-xl px-3 py-2 text-xs font-mono outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: addError
                ? "1px solid rgba(239,68,68,0.50)"
                : "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.80)",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button
            type="button"
            data-ocid="settings.add_admin_button"
            onClick={handleAdd}
            disabled={addAdmin.isPending || !newPrincipal.trim()}
            className="flex-shrink-0 rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "rgba(139,92,246,0.20)",
              color: "rgba(167,139,250,0.90)",
              border: "1px solid rgba(139,92,246,0.35)",
            }}
          >
            {addAdmin.isPending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : null}
            Pridať admina
          </button>
        </div>

        {addError && (
          <p
            data-ocid="settings.add_admin_error_state"
            className="text-xs rounded-lg px-3 py-2"
            style={{
              background: "rgba(239,68,68,0.12)",
              color: "rgba(239,68,68,0.90)",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            {addError}
          </p>
        )}
        {addSuccess && (
          <p
            data-ocid="settings.add_admin_success_state"
            className="text-xs rounded-lg px-3 py-2 flex items-center gap-1.5"
            style={{
              background: "rgba(34,197,94,0.12)",
              color: "rgba(34,197,94,0.90)",
              border: "1px solid rgba(34,197,94,0.25)",
            }}
          >
            <Check size={12} />
            Admin úspešne pridaný
          </p>
        )}
      </div>
    </SectionCard>
  );
}

// ─── AdminTreasuryCard ───────────────────────────────────────────────────────

function AdminTreasuryCard() {
  const { identity } = useInternetIdentity();
  const { data: platformFees, refetch: refetchFees } = useGetPlatformFees();
  const withdraw = useWithdrawPlatformFees();
  const [withdrawSuccess, setWithdrawSuccess] = useState<bigint | null>(null);

  const { data: adminList } = useListAdmins();
  const userPrincipal = identity?.getPrincipal().toText();
  const isAdmin =
    !!userPrincipal &&
    (adminList ?? []).some((p) => p.toText() === userPrincipal);

  if (!isAdmin) return null;

  const feesIcp = platformFees
    ? (Number(platformFees) / 100_000_000).toFixed(3)
    : "0.000";

  const handleWithdraw = async () => {
    if (!userPrincipal) return;
    try {
      const result = await withdraw.mutateAsync(userPrincipal);
      setWithdrawSuccess(result);
      refetchFees();
    } catch {
      // error displayed via withdraw.error
    }
  };

  return (
    <SectionCard title="Pokladňa platformy" icon={<ShieldCheck size={14} />}>
      <div
        className="rounded-2xl p-4 flex items-center justify-between gap-3"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            Nazbierané poplatky
          </p>
          <p
            className="text-2xl font-bold font-mono mt-0.5"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {feesIcp}{" "}
            <span
              className="text-sm font-normal"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              ICP
            </span>
          </p>
          <p
            className="text-[10px] mt-1"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            25% platforma podiel
          </p>
        </div>
      </div>

      {withdraw.error && (
        <p
          data-ocid="settings.treasury_error_state"
          className="text-xs rounded-lg px-3 py-2"
          style={{
            background: "rgba(239,68,68,0.12)",
            color: "rgba(239,68,68,0.90)",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          {withdraw.error.message}
        </p>
      )}

      {withdrawSuccess !== null && (
        <p
          data-ocid="settings.treasury_success_state"
          className="text-xs rounded-lg px-3 py-2"
          style={{
            background: "rgba(34,197,94,0.12)",
            color: "rgba(34,197,94,0.90)",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          Úspešne prevedené {(Number(withdrawSuccess) / 100_000_000).toFixed(3)}{" "}
          ICP na vašu peňaženku
        </p>
      )}

      <button
        type="button"
        data-ocid="settings.withdraw_fees_button"
        onClick={handleWithdraw}
        disabled={withdraw.isPending || !platformFees || platformFees === 0n}
        className="w-full rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background:
            "linear-gradient(135deg, rgba(251,191,36,0.25), rgba(245,158,11,0.25))",
          color: "#fbbf24",
          border: "1px solid rgba(251,191,36,0.30)",
        }}
      >
        {withdraw.isPending ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Spracovávam...
          </>
        ) : (
          "Vybrať na moju peňaženku"
        )}
      </button>
    </SectionCard>
  );
}

// ─── SettingsPage ─────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div
      data-ocid="settings.page"
      className="min-h-screen bg-background px-4 py-8"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="mb-2">
          <h1
            className="font-display text-2xl font-bold tracking-tight"
            style={{ color: "rgba(255,255,255,0.90)" }}
          >
            {t("settings.title")}
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            {t("misc.appName")}
          </p>
        </div>

        <section data-ocid="settings.corrupted_registry_section">
          <CorruptedRegistryBanner />
        </section>

        <section data-ocid="settings.cycles_section">
          <CyclesCard />
        </section>

        <section data-ocid="settings.pending_transactions_section">
          <PendingTransactionsSection />
        </section>

        <section data-ocid="settings.admin_management_section">
          <AdminManagementCard />
        </section>

        <section data-ocid="settings.treasury_section">
          <AdminTreasuryCard />
        </section>

        <section data-ocid="settings.admin_payments_section">
          <AdminPaymentMonitor />
        </section>
      </div>
    </div>
  );
}
