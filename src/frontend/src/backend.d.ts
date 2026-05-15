import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Account {
    owner: Principal;
    subaccount?: Uint8Array;
}
export type Time = bigint;
export type TokenId = bigint;
export type WithdrawResult = {
    __kind__: "ok";
    ok: bigint;
} | {
    __kind__: "err";
    err: string;
};
export type MintResult = {
    __kind__: "ok";
    ok: TokenId;
} | {
    __kind__: "err";
    err: string;
} | {
    __kind__: "paymentRequired";
    paymentRequired: null;
};
export interface HealthStatus {
    status: string;
    daysPercentage: bigint;
    imagesRemaining: bigint;
    estimatedStorageMB: bigint;
    healthColor: CycleHealth;
    rawCycles: bigint;
    daysRemaining: bigint;
}
export type TopUpResult = {
    __kind__: "ok";
    ok: {
        platformFee: bigint;
        icpUsed: bigint;
        cyclesMinted: bigint;
    };
} | {
    __kind__: "err";
    err: string;
};
export interface NFTPage {
    total: bigint;
    items: Array<NFTMetadata>;
}
export type TransferResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
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
    history: Array<TransactionEvent>;
    image: Uint8Array;
    isPublic: boolean;
    collectionName?: string;
}
export type VisibilityResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export type Value = {
    __kind__: "Int";
    Int: bigint;
} | {
    __kind__: "Map";
    Map: Array<[string, Value]>;
} | {
    __kind__: "Nat";
    Nat: bigint;
} | {
    __kind__: "Blob";
    Blob: Uint8Array;
} | {
    __kind__: "Bool";
    Bool: boolean;
} | {
    __kind__: "Text";
    Text: string;
} | {
    __kind__: "Array";
    Array: Array<[string, Value]>;
};
export interface Standard {
    url: string;
    name: string;
}
export enum CollectionPhase {
    Premium = "Premium",
    Free = "Free",
    Bonus = "Bonus"
}
export enum CycleHealth {
    red = "red",
    orange = "orange",
    green = "green"
}
export enum Variant_Mint_Transfer {
    Mint = "Mint",
    Transfer = "Transfer"
}
export interface backendInterface {
    createMyCollection(): Promise<Principal>;
    estimateCycles(imageCount: bigint): Promise<bigint>;
    estimateICPForImages(imageCount: bigint, icpPriceUSD: number): Promise<number>;
    estimateImagesForICP(icpAmount: number, icpPriceUSD: number): Promise<bigint>;
    getAdminPrincipal(): Promise<Principal>;
    getAllPublicNFTs(): Promise<Array<NFTMetadata>>;
    getAllPublicNFTsByOwner(owner: Principal): Promise<Array<NFTMetadata>>;
    getAllPublicNFTsPaginated(offset: bigint, limit: bigint): Promise<NFTPage>;
    getCollectionPhase(user: Principal): Promise<CollectionPhase>;
    getFactoryAccountId(): Promise<string>;
    getICPPrice(): Promise<number>;
    getMyCollection(user: Principal): Promise<Principal | null>;
    getMyCollectionCycles(): Promise<bigint>;
    getMyHealthStatus(): Promise<HealthStatus>;
    getMyMintCount(user: Principal): Promise<bigint>;
    /**
     * / One-time init — call once after deploy to wire self-principal.
     */
    getMyNFTs(): Promise<Array<NFTMetadata>>;
    getMyNFTsPaginated(offset: bigint, limit: bigint): Promise<NFTPage>;
    getNFT(tokenId: TokenId): Promise<NFTMetadata | null>;
    getNFTHistory(tokenId: TokenId): Promise<Array<TransactionEvent> | null>;
    getPlatformFees(): Promise<bigint>;
    icrc10_supported_standards(): Promise<Array<Standard>>;
    icrc7_description(): Promise<string | null>;
    icrc7_name(): Promise<string>;
    icrc7_owner_of(tokenId: bigint): Promise<Account | null>;
    icrc7_symbol(): Promise<string>;
    icrc7_token_metadata(tokenIds: Array<bigint>): Promise<Array<Array<[string, Value]> | null>>;
    icrc7_tokens(prev: bigint | null, take: bigint | null): Promise<Array<bigint>>;
    icrc7_tokens_of(account: Account, prev: bigint | null, take: bigint | null): Promise<Array<bigint>>;
    icrc7_total_supply(): Promise<bigint>;
    /**
     * / One-time init — call once after deploy to wire self-principal.
     */
    initSelf(): Promise<void>;
    mintNFT(name: string, description: string, image: Uint8Array, recipientOpt: Principal | null, isPublic: boolean, collectionName: string | null): Promise<MintResult>;
    setNFTVisibility(tokenId: TokenId, isPublic: boolean): Promise<VisibilityResult>;
    topUpCollection(blockIndex: bigint): Promise<TopUpResult>;
    transferNFT(tokenId: TokenId, to: Principal): Promise<TransferResult>;
    withdrawPlatformFees(toPrincipal: Principal): Promise<WithdrawResult>;
}
