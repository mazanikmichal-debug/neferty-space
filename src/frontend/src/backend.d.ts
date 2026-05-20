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
export interface NFTMetadataLite {
    tokenId: TokenId;
    owner: Principal;
    name: string;
    createdAt: Time;
    description: string;
    history: Array<TransactionEvent>;
    collectionCanisterId?: string;
    isPublic: boolean;
    collectionName?: string;
}
export interface NFTPageLite {
    total: bigint;
    items: Array<NFTMetadataLite>;
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
export type ProcessTopUpResult = {
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
export interface PendingTx {
    status: TxStatus;
    lastAttemptAt: bigint;
    collectionId: Principal;
    createdAt: bigint;
    retryCount: bigint;
    blockIndex: bigint;
    caller: Principal;
    amount: bigint;
}
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
export enum TxStatus {
    pending = "pending",
    completed = "completed",
    failed = "failed"
}
export enum Variant_Mint_Transfer {
    Mint = "Mint",
    Transfer = "Transfer"
}
export interface backendInterface {
    addAdmin(newAdmin: Principal): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminRetryTopUp(blockIndex: bigint): Promise<ProcessTopUpResult>;
    cleanupCorruptedRegistry(): Promise<bigint>;
    createMyCollection(): Promise<{
        __kind__: "ok";
        ok: Principal;
    } | {
        __kind__: "err";
        err: string;
    }>;
    estimateCycles(imageCount: bigint): Promise<bigint>;
    estimateICPForImages(imageCount: bigint, icpPriceUSD: number): Promise<number>;
    estimateImagesForICP(icpAmount: number, icpPriceUSD: number): Promise<bigint>;
    getAdminPrincipal(): Promise<Principal>;
    getAllPublicNFTs(): Promise<Array<NFTMetadataLite>>;
    getAllPublicNFTsByOwner(owner: Principal): Promise<Array<NFTMetadataLite>>;
    getAllPublicNFTsPaginated(offset: bigint, limit: bigint): Promise<NFTPageLite>;
    getCmcDepositAddress(): Promise<string>;
    getCollectionPhase(user: Principal): Promise<CollectionPhase>;
    getCollectionStatus(collectionId: Principal): Promise<{
        ownerPrincipal: Principal;
        imageCount: bigint;
        cycles: bigint;
    }>;
    getFactoryAccountId(): Promise<string>;
    getICPPrice(): Promise<number>;
    getMyCollection(user: Principal): Promise<Array<Principal>>;
    getMyCollectionCycles(): Promise<bigint>;
    getMyCollections(user: Principal): Promise<Array<Principal>>;
    getMyHealthStatus(): Promise<HealthStatus>;
    getMyMintCount(user: Principal): Promise<bigint>;
    getMyNFTs(): Promise<Array<NFTMetadataLite>>;
    getMyNFTsPaginated(offset: bigint, limit: bigint): Promise<NFTPageLite>;
    getMyPendingTransactions(): Promise<Array<PendingTx>>;
    getNFT(tokenId: TokenId): Promise<NFTMetadata | null>;
    getNFTHistory(tokenId: TokenId): Promise<Array<TransactionEvent> | null>;
    getNFTImage(tokenId: TokenId): Promise<Uint8Array | null>;
    getPendingTransactions(): Promise<Array<PendingTx>>;
    getPlatformFees(): Promise<bigint>;
    getStatus(): Promise<{
        memory: bigint;
        cycles: bigint;
        heap_memory: bigint;
        estimate_days: bigint;
    }>;
    getUserRegistryEntry(): Promise<Array<Principal>>;
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
     * / Manual trigger — available for emergency use via Candid UI / frontend.
     * / Also purges any corrupted aaaaa-aa registry entries left from failed createMyCollection calls.
     */
    initSelf(): Promise<void>;
    isUsingDefaultCollection(user: Principal): Promise<boolean>;
    listAdmins(): Promise<Array<Principal>>;
    mintNFT(name: string, description: string, image: Uint8Array, recipientOpt: Principal | null, isPublic: boolean, collectionName: string | null): Promise<MintResult>;
    processTopUp(blockIndex: bigint, collectionId: Principal): Promise<ProcessTopUpResult>;
    removeAdmin(adminToRemove: Principal): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeMyCollection(collectionId: Principal): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    retryTopUp(blockIndex: bigint): Promise<ProcessTopUpResult>;
    setNFTVisibility(tokenId: TokenId, isPublic: boolean): Promise<VisibilityResult>;
    topUpCollection(blockIndex: bigint): Promise<TopUpResult>;
    transferNFT(tokenId: TokenId, to: Principal): Promise<TransferResult>;
    withdrawPlatformFees(toPrincipal: Principal): Promise<WithdrawResult>;
}
