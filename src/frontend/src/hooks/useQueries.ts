import type { PendingTx } from "@/backend";
/**
 * useQueries.ts — All backend React Query hooks.
 *
 * Simple direct calls to actor methods via BackendContext.
 * No auto-recover, no Service Worker logic, no retry-on-stopped.
 * If actor is null (env.json failed), pages show "Konfigurácia chýba".
 */
import { useBackend } from "@/context/BackendContext";
import type {
  CollectionPhase,
  HealthStatus,
  NFTMetadata,
  NFTMetadataLite,
  TokenId,
  TransactionEvent,
} from "@/types/nft";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetMyNFTs() {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<NFTMetadataLite[], Error, NFTMetadataLite[], string[]>({
    queryKey: ["myNFTs"],
    queryFn: async () => {
      if (!actor) throw new Error("Konfigurácia chýba");
      return actor.getMyNFTs();
    },
    enabled: actorReady,
    placeholderData: (prev) => prev,
  });
}

/**
 * useGetNFTImage — fetches image bytes for a single NFT by tokenId.
 * Cached by React Query — each tokenId is fetched only once per session.
 */
export function useGetNFTImage(tokenId: bigint | null) {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<Uint8Array | null, Error, Uint8Array | null, string[]>({
    queryKey: ["nftImage", tokenId?.toString() ?? ""],
    queryFn: async () => {
      if (!actor || tokenId === null) return null;
      const result = await actor.getNFTImage(tokenId);
      return result ?? null;
    },
    enabled: actorReady && tokenId !== null,
    staleTime: Number.POSITIVE_INFINITY, // images never change once minted
    gcTime: 10 * 60_000, // keep in cache for 10 minutes
  });
}

export function useMintNFT() {
  const { actor, isLoading: actorLoading } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      imageFile,
      recipientId,
      isPublic,
      collectionName,
    }: {
      name: string;
      description: string;
      imageFile: File;
      recipientId?: string;
      isPublic?: boolean;
      collectionName?: string;
    }) => {
      if (!actor || actorLoading) {
        throw new Error("Konfigurácia chýba");
      }

      // Convert File → raw Uint8Array and send directly to the canister.
      const imageBytes = new Uint8Array(await imageFile.arrayBuffer());

      const recipientOpt: Principal | null = recipientId?.trim()
        ? Principal.fromText(recipientId.trim())
        : null;

      const collectionNameOpt: string | null = collectionName?.trim() || null;

      const result = await actor.mintNFT(
        name,
        description,
        imageBytes,
        recipientOpt,
        isPublic ?? true,
        collectionNameOpt,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      if (result.__kind__ === "paymentRequired")
        throw new Error("Limit NFT dosiahnutý. Prosím vlož ICP.");
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myNFTs"] });
      queryClient.invalidateQueries({ queryKey: ["allPublicNFTs"] });
    },
  });
}

export function useGetAllPublicNFTs() {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<NFTMetadataLite[], Error, NFTMetadataLite[], string[]>({
    queryKey: ["allPublicNFTs"],
    queryFn: async () => {
      if (!actor) throw new Error("Konfigurácia chýba");
      return actor.getAllPublicNFTs();
    },
    enabled: actorReady,
    placeholderData: (prev) => prev,
  });
}

export function useTransferNFT() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tokenId,
      to,
    }: { tokenId: TokenId; to: Principal }) => {
      if (!actor) throw new Error("Konfigurácia chýba");
      const result = await actor.transferNFT(tokenId, to);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myNFTs"] });
    },
  });
}

export function useSetNFTVisibility() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tokenId,
      isPublic,
    }: { tokenId: TokenId; isPublic: boolean }) => {
      if (!actor) throw new Error("Konfigurácia chýba");
      const result = await actor.setNFTVisibility(tokenId, isPublic);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myNFTs"] });
      queryClient.invalidateQueries({ queryKey: ["allPublicNFTs"] });
    },
  });
}

export function useGetNFTHistory(tokenId: TokenId | null) {
  // Note: useGetNFTHistory continues below

  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<TransactionEvent[], Error, TransactionEvent[], string[]>({
    queryKey: ["nftHistory", tokenId?.toString() ?? ""],
    queryFn: async () => {
      if (!actor || tokenId === null) throw new Error("Konfigurácia chýba");
      const result = await actor.getNFTHistory(tokenId);
      return (result ?? []) as TransactionEvent[];
    },
    enabled: actorReady && tokenId !== null,
    staleTime: 30_000,
  });
}

/**
 * useGetICPPrice — fetches current ICP/USD price if backend supports it.
 * Falls back to $10.00 estimate; no error thrown.
 */
export function useGetICPPrice() {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<number | null, Error, number | null, string[]>({
    queryKey: ["icpPrice"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const price = await actor.getICPPrice();
        return price > 0 ? price : null;
      } catch {
        return null;
      }
    },
    enabled: actorReady,
    staleTime: 30_000,
    refetchInterval: 60_000,
    placeholderData: undefined,
  });
}
/**
 * useGetMyCollection — fetches the caller's Collection canister Principal.
 * Used to resolve collectionId before calling getCollectionStatus.
 */
export function useGetMyCollection() {
  const { actor, isLoading: actorLoading } = useBackend();
  const { identity } = useInternetIdentity();
  const actorReady = !!actor && !actorLoading;

  return useQuery<Principal[], Error, Principal[], string[]>({
    queryKey: ["myCollection"],
    queryFn: async () => {
      if (!actor) throw new Error("Konfigurácia chýba");
      // getMyCollection now returns an array of collection Principals
      const callerPrincipal = identity?.getPrincipal() ?? Principal.anonymous();
      try {
        const result = await actor.getMyCollection(callerPrincipal);
        if (Array.isArray(result)) return result as Principal[];
        if (result) return [result as Principal];
        return [];
      } catch {
        return [];
      }
    },
    enabled: actorReady,
    staleTime: 300_000,
  });
}

/**
 * useGetCollectionStatus — fetches live cycle balance + image count from a Collection canister.
 * The Factory is the intermediary: actor.getCollectionStatus(collectionId).
 * Returns { cycles, imageCount, ownerPrincipal }.
 * staleTime 30s, refetchInterval 60s.
 * If collectionId is null/empty the query is disabled.
 */
export function useGetCollectionStatus(collectionId: string | null) {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;
  const enabled = actorReady && !!collectionId && collectionId.length > 0;

  return useQuery<
    {
      cycles: bigint;
      imageCount: bigint;
      ownerPrincipal: import("@dfinity/principal").Principal;
    },
    Error,
    {
      cycles: bigint;
      imageCount: bigint;
      ownerPrincipal: import("@dfinity/principal").Principal;
    },
    string[]
  >({
    queryKey: ["collectionStatus", collectionId ?? ""],
    queryFn: async () => {
      if (!actor || !collectionId) throw new Error("Konfigurácia chýba");
      try {
        const principal = Principal.fromText(collectionId);
        return await actor.getCollectionStatus(principal);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes("no collection") ||
          msg.includes("not found") ||
          msg.includes("nenájdená") ||
          msg.includes("No collection")
        ) {
          throw new Error("NO_COLLECTION");
        }
        throw new Error(`Nepodarilo sa načítať stav cycles: ${msg}`);
      }
    },
    enabled,
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 2,
    retryDelay: (attempt) => attempt * 2000,
  });
}

/**
 * useGetMyCollectionCycles — fetches cycle balance of caller's collection canister.
 */
export function useGetMyCollectionCycles() {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<number, Error, number, string[]>({
    queryKey: ["myCollectionCycles"],
    queryFn: async () => {
      if (!actor) throw new Error("Konfigurácia chýba");
      const result = await actor.getMyCollectionCycles();
      // bigint → number for display
      return Number(result);
    },
    enabled: actorReady,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

/**
 * useGetMyHealthStatus — fetches visual health status of caller's collection canister.
 * Retries twice with progressive backoff before surfacing an error.
 */
export function useGetMyHealthStatus() {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<HealthStatus, Error, HealthStatus, string[]>({
    queryKey: ["myHealthStatus"],
    queryFn: async () => {
      if (!actor) throw new Error("Konfigurácia chýba");
      try {
        const result = await actor.getMyHealthStatus();
        return result as HealthStatus;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes("no collection") ||
          msg.includes("not found") ||
          msg.includes("nenájdená") ||
          msg.includes("No collection") ||
          msg.includes("aaaaa-aa") ||
          msg.includes("does not exist")
        ) {
          throw new Error("NO_COLLECTION");
        }
        throw new Error(`Nepodarilo sa načítať stav cycles: ${msg}`);
      }
    },
    enabled: actorReady,
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 2,
    retryDelay: (attempt) => attempt * 2000,
  });
}

/**
 * useGetStatus — fetches real canister status (admin-only).
 * Returns { cycles, memory, heap_memory, estimate_days } or null if unauthorized.
 * staleTime 30s — load once on Settings open, no polling.
 */
export function useGetStatus() {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<
    {
      cycles: bigint;
      memory: bigint;
      heap_memory: bigint;
      estimate_days: bigint;
    } | null,
    Error,
    {
      cycles: bigint;
      memory: bigint;
      heap_memory: bigint;
      estimate_days: bigint;
    } | null,
    string[]
  >({
    queryKey: ["canisterStatus"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getStatus();
      } catch {
        // Caller is not admin or network error — return null silently
        return null;
      }
    },
    enabled: actorReady,
    staleTime: 30_000,
  });
}

/**
 * useCreateMyCollection — mutation to create or return existing collection canister.
 */
export function useCreateMyCollection() {
  const { actor, isLoading: actorLoading } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<string> => {
      if (!actor || actorLoading) throw new Error("Konfigurácia chýba");
      const result = await actor.createMyCollection();
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok.toText();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myCollectionCycles"] });
      queryClient.invalidateQueries({ queryKey: ["myHealthStatus"] });
      queryClient.invalidateQueries({ queryKey: ["myCollectionPrincipal"] });
      queryClient.invalidateQueries({ queryKey: ["userRegistryEntry"] });
      queryClient.invalidateQueries({ queryKey: ["myCollection"] });
    },
  });
}

/**
 * useGetFactoryAccountId — fetches the Factory canister's ICP account address.
 */
export function useGetFactoryAccountId() {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<string, Error, string, string[]>({
    queryKey: ["factoryAccountId"],
    queryFn: async () => {
      if (!actor) throw new Error("Konfigurácia chýba");
      return actor.getFactoryAccountId();
    },
    enabled: actorReady,
    staleTime: 300_000, // account ID doesn't change
  });
}

/**
 * useTopUpCollection — sends blockIndex to topUpCollection on the backend.
 */
export function useTopUpCollection() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation<
    { icpUsed: bigint; cyclesMinted: bigint; platformFee: bigint },
    Error,
    bigint
  >({
    mutationFn: async (blockIndex: bigint) => {
      if (!actor) throw new Error("Konfigurácia chýba");
      const result = await actor.topUpCollection(blockIndex);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myHealthStatus"] });
      queryClient.invalidateQueries({ queryKey: ["myCollectionCycles"] });
    },
  });
}

/**
 * useGetAdminPrincipal — fetches the admin principal ID.
 */
export function useGetAdminPrincipal() {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<string, Error, string, string[]>({
    queryKey: ["adminPrincipal"],
    queryFn: async () => {
      if (!actor) throw new Error("Konfigurácia chýba");
      const p = await actor.getAdminPrincipal();
      return p.toText();
    },
    enabled: actorReady,
    staleTime: 300_000,
  });
}

/**
 * useGetPlatformFees — fetches accumulated 25% fees (admin only).
 */
export function useGetPlatformFees() {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<bigint, Error, bigint, string[]>({
    queryKey: ["platformFees"],
    queryFn: async () => {
      if (!actor) throw new Error("Konfigurácia chýba");
      return actor.getPlatformFees();
    },
    enabled: actorReady,
    staleTime: 30_000,
  });
}

/**
 * useWithdrawPlatformFees — admin mutation to withdraw accumulated fees.
 */
export function useWithdrawPlatformFees() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation<bigint, Error, string>({
    mutationFn: async (principalText: string) => {
      if (!actor) throw new Error("Konfigurácia chýba");
      const { Principal } = await import("@dfinity/principal");
      const p = Principal.fromText(principalText);
      const result = await actor.withdrawPlatformFees(p);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platformFees"] });
    },
  });
}
/**
 * useGetCmcDepositAddress — fetches the CMC deposit address from backend.
 * This is the Account Identifier that Plug Wallet sends ICP to.
 * staleTime 5m — the address is deterministic and never changes.
 */
export function useGetCmcDepositAddress() {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<string, Error, string, string[]>({
    queryKey: ["cmcDepositAddress"],
    queryFn: async () => {
      if (!actor) throw new Error("Konfigurácia chýba");
      return actor.getCmcDepositAddress();
    },
    enabled: actorReady,
    staleTime: 5 * 60_000,
  });
}

/**
 * useProcessTopUp — sends blockIndex + collectionId to backend processTopUp.
 * Returns { icpUsed, cyclesMinted, platformFee } on success.
 */
export function useProcessTopUp() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation<
    { icpUsed: bigint; cyclesMinted: bigint; platformFee: bigint },
    Error,
    { blockIndex: bigint; collectionId: Principal }
  >({
    mutationFn: async ({ blockIndex, collectionId }) => {
      if (!actor) throw new Error("Konfigurácia chýba");
      const result = await actor.processTopUp(blockIndex, collectionId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myHealthStatus"] });
      queryClient.invalidateQueries({ queryKey: ["myCollectionCycles"] });
      queryClient.invalidateQueries({ queryKey: ["myPendingTransactions"] });
    },
  });
}

/**
 * useRetryTopUp — user-initiated retry for a pending transaction.
 */
export function useRetryTopUp() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation<
    { icpUsed: bigint; cyclesMinted: bigint; platformFee: bigint },
    Error,
    bigint
  >({
    mutationFn: async (blockIndex: bigint) => {
      if (!actor) throw new Error("Konfigurácia chýba");
      const result = await actor.retryTopUp(blockIndex);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPendingTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["myHealthStatus"] });
      queryClient.invalidateQueries({ queryKey: ["myCollectionCycles"] });
    },
  });
}

/**
 * useAdminRetryTopUp — admin-initiated retry for any pending transaction.
 */
export function useAdminRetryTopUp() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation<
    { icpUsed: bigint; cyclesMinted: bigint; platformFee: bigint },
    Error,
    bigint
  >({
    mutationFn: async (blockIndex: bigint) => {
      if (!actor) throw new Error("Konfigurácia chýba");
      const result = await actor.adminRetryTopUp(blockIndex);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPendingTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["myPendingTransactions"] });
    },
  });
}

/**
 * useGetMyPendingTransactions — polls caller's pending txs every 30s.
 */
export function useGetMyPendingTransactions() {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<PendingTx[], Error, PendingTx[], string[]>({
    queryKey: ["myPendingTransactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyPendingTransactions();
    },
    enabled: actorReady,
    refetchInterval: 30_000,
    staleTime: 25_000,
  });
}

/**
 * useGetAllPendingTransactions — admin view, polls every 60s.
 */
export function useGetAllPendingTransactions() {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<PendingTx[], Error, PendingTx[], string[]>({
    queryKey: ["allPendingTransactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingTransactions();
    },
    enabled: actorReady,
    refetchInterval: 60_000,
    staleTime: 55_000,
  });
}

/**
 * useGetUserRegistryEntry — fetches the caller's Collection principal from the registry.
 * Returns the principal text string, or null if no collection exists.
 * A value of "aaaaa-aa" indicates a corrupted/placeholder registry entry.
 *
 * Uses getMyCollection under the hood — requires the caller's identity.
 */
export function useGetUserRegistryEntry(
  callerPrincipal: import("@dfinity/principal").Principal | null,
) {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading && callerPrincipal !== null;

  return useQuery<string | null, Error, string | null, string[]>({
    queryKey: ["userRegistryEntry"],
    queryFn: async () => {
      if (!actor || !callerPrincipal) return null;
      try {
        const result = await actor.getUserRegistryEntry();
        return result && result.length > 0 ? result[0].toText() : null;
      } catch {
        return null;
      }
    },
    enabled: actorReady,
    staleTime: 60_000,
  });
}

/**
 * useIsUsingDefaultCollection — returns true if the user's collection is the Factory canister itself
 * (i.e., they have no dedicated Collection canister and use the shared Factory storage).
 */
export function useIsUsingDefaultCollection(
  callerPrincipal: import("@dfinity/principal").Principal | null,
) {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading && callerPrincipal !== null;

  return useQuery<boolean, Error, boolean, string[]>({
    queryKey: ["isUsingDefaultCollection", callerPrincipal?.toText() ?? ""],
    queryFn: async () => {
      if (!actor || !callerPrincipal) return false;
      try {
        const result = await actor.getMyCollection(callerPrincipal);
        const arr: Principal[] = Array.isArray(result)
          ? (result as Principal[])
          : result
            ? [result as Principal]
            : [];
        // empty array = no separate collection = using default
        return arr.length === 0;
      } catch {
        return true; // on error treat as default
      }
    },
    enabled: actorReady,
    staleTime: 60_000,
  });
}

/**
 * useCleanupCorruptedRegistry — calls cleanupCorruptedRegistry() for the authenticated user.
 * On success invalidates registry entry and collection/health status queries.
 */
export function useCleanupCorruptedRegistry() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation<bigint, Error>({
    mutationFn: async (): Promise<bigint> => {
      if (!actor) throw new Error("Konfigurácia chýba");
      return actor.cleanupCorruptedRegistry();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRegistryEntry"] });
      queryClient.invalidateQueries({ queryKey: ["myCollection"] });
      queryClient.invalidateQueries({ queryKey: ["myCollectionPrincipal"] });
      queryClient.invalidateQueries({ queryKey: ["myHealthStatus"] });
      queryClient.invalidateQueries({ queryKey: ["myCollectionCycles"] });
    },
  });
}

/**
 * useListAdmins — fetches the current list of admin principals.
 */
export function useListAdmins() {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<Principal[], Error, Principal[], string[]>({
    queryKey: ["admins"],
    queryFn: async () => {
      if (!actor) throw new Error("Konfigurácia chýba");
      return actor.listAdmins();
    },
    enabled: actorReady,
    staleTime: 60_000,
  });
}

/**
 * useAddAdmin — mutation to add a new admin by principal text.
 * Invalidates ["admins"] on success.
 */
export function useAddAdmin() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation<{ ok: null } | { err: string }, Error, string>({
    mutationFn: async (principalStr: string) => {
      if (!actor) throw new Error("Konfigurácia chýba");
      return actor.addAdmin(Principal.fromText(principalStr));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}

/**
 * useRemoveAdmin — mutation to remove an admin by principal text.
 * Invalidates ["admins"] on success.
 */
export function useRemoveAdmin() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation<{ ok: null } | { err: string }, Error, string>({
    mutationFn: async (principalStr: string) => {
      if (!actor) throw new Error("Konfigurácia chýba");
      return actor.removeAdmin(Principal.fromText(principalStr));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}
