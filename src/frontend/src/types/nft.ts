import { Variant_Mint_Transfer } from "@/backend";
import type {
  Time,
  TokenId,
  TransactionEvent as _TransactionEvent,
} from "@/backend";
import type { Principal } from "@icp-sdk/core/principal";

export interface TransactionEvent {
  to: Principal;
  from?: Principal;
  timestamp: bigint;
  eventType: Variant_Mint_Transfer;
}

export interface NFTMetadata {
  tokenId: TokenId;
  owner: Principal;
  name: string;
  createdAt: Time;
  description: string;
  /** Raw image bytes returned directly from the Motoko canister. */
  image: Uint8Array;
  history: TransactionEvent[];
  isPublic: boolean;
  collectionName?: string;
}

/** Lightweight NFT metadata — no image field. Used by list endpoints. */
export interface NFTMetadataLite {
  tokenId: TokenId;
  owner: Principal;
  name: string;
  createdAt: Time;
  description: string;
  history: TransactionEvent[];
  isPublic: boolean;
  collectionName?: string;
  /** Candid ?Text — the canister that holds this NFT, or [] if unknown. */
  collectionCanisterId?: string;
}

export { Variant_Mint_Transfer };
export type { TokenId, Time };
export type { _TransactionEvent };
// Cycles health types
export type CycleHealth = "green" | "orange" | "red";

export interface HealthStatus {
  status: string;
  daysRemaining: bigint;
  imagesRemaining: bigint;
  healthColor: CycleHealth;
  daysPercentage: bigint;
  rawCycles: bigint;
  estimatedStorageMB: bigint;
}

export type CollectionPhase =
  | { Free: null }
  | { Bonus: null }
  | { Premium: null };
