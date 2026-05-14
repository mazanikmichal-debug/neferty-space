/**
 * useQueries.ts — All backend React Query hooks.
 *
 * Simple direct calls to actor methods via BackendContext.
 * No auto-recover, no Service Worker logic, no retry-on-stopped.
 * If actor is null (env.json failed), pages show "Konfigurácia chýba".
 */
import { useBackend } from "@/context/BackendContext";
import type { NFTMetadata, TokenId, TransactionEvent } from "@/types/nft";
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
    }: {
      name: string;
      description: string;
      imageFile: File;
      recipientId?: string;
      isPublic?: boolean;
    }) => {
      if (!actor || actorLoading) {
        throw new Error("Konfigurácia chýba");
      }

      // Convert File → raw Uint8Array and send directly to the canister.
      const imageBytes = new Uint8Array(await imageFile.arrayBuffer());

      const recipientOpt: Principal | null = recipientId?.trim()
        ? Principal.fromText(recipientId.trim())
        : null;

      const result = await actor.mintNFT(
        name,
        description,
        imageBytes,
        recipientOpt,
        isPublic ?? true,
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
