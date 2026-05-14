import type { backendInterface, NFTMetadata, MintResult, TransferResult, VisibilityResult, Standard } from "../backend.d";
import { Variant_Mint_Transfer, CollectionPhase } from "../backend.d";
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
  getMyNFTs: async () => sampleNFTs,
  getNFT: async (tokenId) => sampleNFTs.find((n) => n.tokenId === tokenId) ?? null,
  mintNFT: async (_name, _description, _image): Promise<MintResult> => ({
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
  createMyCollection: async () => "mock-collection-id",
  getCollectionPhase: async (_user: Principal): Promise<CollectionPhase> => CollectionPhase.free,
  getMyCollection: async (_user: Principal): Promise<Principal | null> => null,
  getMyMintCount: async (_user: Principal): Promise<bigint> => BigInt(0),
};
