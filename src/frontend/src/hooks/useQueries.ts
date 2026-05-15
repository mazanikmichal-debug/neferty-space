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
  TokenId,
  TransactionEvent,
} from "@/types/nft";
import { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetMyNFTs() {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<NFTMetadata[], Error, NFTMetadata[], string[]>({
    queryKey: ["myNFTs"],
    queryFn: async () => {
      if (!actor) throw new Error("Konfigurácia chýba");
      return actor.getMyNFTs();
    },
    enabled: actorReady,
    placeholderData: (prev) => prev,
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

  return useQuery<NFTMetadata[], Error, NFTMetadata[], string[]>({
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

  return useQuery<number, Error, number, string[]>({
    queryKey: ["icpPrice"],
    queryFn: async () => {
      if (!actor) return 10.0;
      try {
        const price = await actor.getICPPrice();
        return price > 0 ? price : 10.0;
      } catch {
        return 10.0;
      }
    },
    enabled: actorReady,
    staleTime: 60_000,
    placeholderData: 10.0,
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
  });
}

/**
 * useGetMyHealthStatus — fetches visual health status of caller's collection canister.
 */
export function useGetMyHealthStatus() {
  const { actor, isLoading: actorLoading } = useBackend();
  const actorReady = !!actor && !actorLoading;

  return useQuery<HealthStatus, Error, HealthStatus, string[]>({
    queryKey: ["myHealthStatus"],
    queryFn: async () => {
      if (!actor) throw new Error("Konfigurácia chýba");
      return actor.getMyHealthStatus() as Promise<HealthStatus>;
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
      const principal = await actor.createMyCollection();
      return principal.toText();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myCollectionCycles"] });
      queryClient.invalidateQueries({ queryKey: ["myHealthStatus"] });
    },
  });
}
