import { 
  CollectionPhase,
  CycleHealth,
  HealthStatus,
  PendingTx,
  TxStatus,
  Variant_Mint_Transfer,
 } from "../backend.d";
import type { 
  MintResult,
  NFTMetadata,
  Standard,
  TransferResult,
  VisibilityResult,
  backendInterface,
 } from "../backend.d";
import { Principal } from "@icp-sdk/core/principal";

// Minimal 1x1 transparent PNG as sample image bytes
function makeSampleImageBytes(): Uint8Array {
  return new Uint8Array([
    0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a,
    0x00,0x00,0x00,0x0d,0x49,0x48,0x44,0x52,
    0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x01,
    0x08,0x06,0x00,0x00,0x00,0x1f,0x15,0xc4,
    0x89,0x00,0x00,0x00,0x0b,0x49,0x44,0x41,
    0x54,0x78,0x9c,0x62,0x00,0x01,0x00,0x00,
    0x05,0x00,0x01,0x0d,0x0a,0x2d,0xb4,0x00,
    0x00,0x00,0x00,0x49,0x45,0x4e,0x44,0xae,
    0x42,0x60,0x82,
  ]);
}

const sampleOwner = Principal.fromText("aaaaa-aa");
const sampleImageBytes = makeSampleImageBytes();

const sampleNFTs: NFTMetadata[] = [
  {
    tokenId: BigInt(1),
    owner: sampleOwner,
    name: "Kozmick\u00fd Vlk",
    createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    description: "Tajomn\u00fd vlk v kozmickom priestore",
    image: sampleImageBytes,
    history: [{ eventType: Variant_Mint_Transfer.Mint, from: undefined, to: sampleOwner, timestamp: BigInt(Date.now()) * BigInt(1_000_000) }],
    isPublic: true,
  },
  {
    tokenId: BigInt(2),
    owner: sampleOwner,
    name: "Neonov\u00fd Drak",
    createdAt: BigInt(Date.now() - 86400000) * BigInt(1_000_000),
    description: "Drak z neonov\u00fdch svetiel",
    image: sampleImageBytes,
    history: [{ eventType: Variant_Mint_Transfer.Mint, from: undefined, to: sampleOwner, timestamp: BigInt(Date.now() - 86400000) * BigInt(1_000_000) }],
    isPublic: true,
  },
];

export const mockBackend: backendInterface = {
  getAllPublicNFTs: async () => sampleNFTs.filter((n) => n.isPublic),
  getAllPublicNFTsByOwner: async (owner: Principal) => sampleNFTs.filter((n) => n.isPublic && n.owner.toText() === owner.toText()),
  getMyNFTs: async () => sampleNFTs,
  getNFT: async (tokenId) => sampleNFTs.find((n) => n.tokenId === tokenId) ?? null,
  mintNFT: async (_name, _description, _image, _recipient, _isPublic, _collectionName): Promise<MintResult> => ({
    __kind__: "ok",
    ok: BigInt(sampleNFTs.length + 1),
  }),
  transferNFT: async (_tokenId, _to): Promise<TransferResult> => ({
    __kind__: "ok",
    ok: null,
  }),
  icrc7_name: async () => "Neferty Space",
  icrc7_symbol: async () => "NFRT",
  icrc7_description: async () => "NFT kol\u00e9kcia na ICP blockchaine",
  icrc7_total_supply: async () => BigInt(sampleNFTs.length),
  icrc7_tokens: async () => sampleNFTs.map((n) => n.tokenId),
  icrc7_tokens_of: async () => sampleNFTs.map((n) => n.tokenId),
  icrc7_owner_of: async (tokenId) => {
    const nft = sampleNFTs.find((n) => n.tokenId === tokenId);
    return nft ? { owner: nft.owner } : null;
  },
  icrc7_token_metadata: async (tokenIds) => tokenIds.map(() => null),
  getNFTHistory: async (tokenId) => {
    const nft = sampleNFTs.find((n) => n.tokenId === tokenId);
    return nft ? nft.history : null;
  },
  getAllPublicNFTsPaginated: async (offset, limit) => ({
    total: BigInt(sampleNFTs.filter((n) => n.isPublic).length),
    items: sampleNFTs.filter((n) => n.isPublic).slice(Number(offset), Number(offset) + Number(limit)),
  }),
  getMyNFTsPaginated: async (offset, limit) => ({
    total: BigInt(sampleNFTs.length),
    items: sampleNFTs.slice(Number(offset), Number(offset) + Number(limit)),
  }),
  setNFTVisibility: async (_tokenId, _isPublic): Promise<VisibilityResult> => ({
    __kind__: "ok",
    ok: null,
  }),
  icrc10_supported_standards: async (): Promise<Standard[]> => [
    { name: "ICRC-7", url: "https://github.com/dfinity/ICRC/ICRCs/ICRC-7" },
  ],
  createMyCollection: async () => ({ __kind__: "ok" as const, ok: Principal.fromText("aaaaa-aa") }),
  getCollectionPhase: async (_user: Principal): Promise<CollectionPhase> => CollectionPhase.Free,
  getMyCollection: async (_user: Principal): Promise<Principal[]> => [Principal.fromText("rdmx6-jaaaa-aaaaa-aaadq-cai")],
  getMyCollections: async (_user: Principal): Promise<Principal[]> => [Principal.fromText("rdmx6-jaaaa-aaaaa-aaadq-cai")],
  getMyMintCount: async (_user: Principal): Promise<bigint> => BigInt(0),
  getICPPrice: async (): Promise<number> => 10.0,
  estimateCycles: async (_imageCount: bigint): Promise<bigint> => BigInt(20_000_000_000) * _imageCount,
  estimateICPForImages: async (_imageCount: bigint, _icpPriceUSD: number): Promise<number> => {
    const cycles = Number(_imageCount) * 20_000_000_000;
    const usd = (cycles / 1_000_000_000_000) * 1.2 * 1.25;
    return _icpPriceUSD > 0 ? usd / _icpPriceUSD : 0;
  },
  estimateImagesForICP: async (_icpAmount: number, _icpPriceUSD: number): Promise<bigint> => {
    const usd = _icpAmount * _icpPriceUSD * 0.75;
    const cycles = (usd / 1.2) * 1_000_000_000_000;
    return BigInt(Math.floor(cycles / 20_000_000_000));
  },
  // MOCK DATA - only used in local dev, never in production
  getMyCollectionCycles: async (): Promise<bigint> => BigInt(500_000_000_000_000),
  // MOCK DATA - only used in local dev, never in production
  getMyHealthStatus: async (): Promise<HealthStatus> => ({
    status: "Zbierka má palivo na cca 450 dní",
    imagesRemaining: BigInt(250),
    healthColor: CycleHealth.green,
    daysRemaining: BigInt(450),
    daysPercentage: BigInt(123),
    estimatedStorageMB: BigInt(420),
    rawCycles: BigInt(2_450_000_000_000),
  }),
  getAdminPrincipal: async (): Promise<Principal> => Principal.fromText("aaaaa-aa"),
  getFactoryAccountId: async (): Promise<string> => "aaaaa-aa-account-id",
  getPlatformFees: async (): Promise<bigint> => BigInt(0),
  initSelf: async (): Promise<void> => {},
  topUpCollection: async (_blockIndex: bigint) => ({
    __kind__: "ok" as const,
    ok: { icpUsed: BigInt(50_000_000), cyclesMinted: BigInt(4_200_000_000_000), platformFee: BigInt(12_500_000) },
  }),
  withdrawPlatformFees: async (_toPrincipal: Principal) => ({
    __kind__: "ok" as const,
    ok: BigInt(0),
  }),
  getStatus: async () => ({
    cycles: BigInt(2_500_000_000_000),
    memory: BigInt(420 * 1024 * 1024),
    heap_memory: BigInt(180 * 1024 * 1024),
    estimate_days: BigInt(450),
  }),
  getCmcDepositAddress: async (): Promise<string> => "2d0e897f7e862d2b57d9bc9ea5c65f9a24ac6c074575f47898314b8d6cb0929d",
  processTopUp: async (_blockIndex: bigint, _collectionId: Principal): Promise<import('../backend.d').ProcessTopUpResult> => ({
    __kind__: "ok" as const,
    ok: { icpUsed: BigInt(50_000_000), cyclesMinted: BigInt(4_200_000_000_000), platformFee: BigInt(12_500_000) },
  }),
  retryTopUp: async (_blockIndex: bigint): Promise<import('../backend.d').ProcessTopUpResult> => ({
    __kind__: "ok" as const,
    ok: { icpUsed: BigInt(50_000_000), cyclesMinted: BigInt(4_200_000_000_000), platformFee: BigInt(12_500_000) },
  }),
  adminRetryTopUp: async (_blockIndex: bigint): Promise<import('../backend.d').ProcessTopUpResult> => ({
    __kind__: "ok" as const,
    ok: { icpUsed: BigInt(50_000_000), cyclesMinted: BigInt(4_200_000_000_000), platformFee: BigInt(12_500_000) },
  }),
  getMyPendingTransactions: async (): Promise<PendingTx[]> => [],
  getPendingTransactions: async (): Promise<PendingTx[]> => [],
  getNFTImage: async (_tokenId: bigint): Promise<Uint8Array | null> => sampleImageBytes,
  getCollectionStatus: async (_collectionId: Principal) => ({
    cycles: BigInt(500_000_000_000),
    imageCount: BigInt(8),
    ownerPrincipal: Principal.fromText("aaaaa-aa"),
  }),
  cleanupCorruptedRegistry: async (): Promise<bigint> => BigInt(0),
  getUserRegistryEntry: async (): Promise<Principal[]> => [],
  isUsingDefaultCollection: async () => true,
  addAdmin: async (_newAdmin: Principal) => ({ __kind__: "ok" as const, ok: null }),
  listAdmins: async (): Promise<Principal[]> => [],
  removeAdmin: async (_adminToRemove: Principal) => ({ __kind__: "ok" as const, ok: null }),
  removeMyCollection: async (_collectionId: Principal) => ({ __kind__: "ok" as const, ok: true }),
};
