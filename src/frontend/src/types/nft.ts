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
}

export { Variant_Mint_Transfer };
export type { TokenId, Time };
export type { _TransactionEvent };
