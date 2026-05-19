/**
 * nftImage.ts — Convert Uint8Array NFT image bytes to a displayable blob URL.
 *
 * Two caches:
 * - byBytes: keyed on Uint8Array identity (for full NFTMetadata with inline image)
 * - byTokenId: keyed on tokenId string (for lazy-loaded images from getNFTImage)
 *
 * Returned URLs are never explicitly revoked — they live for the app session.
 */

const byBytes = new Map<Uint8Array, string>();
const byTokenId = new Map<string, string>();

/**
 * Returns a stable blob URL for the given Uint8Array image bytes (identity-cached).
 * Used when the image bytes come directly from an NFTMetadata object.
 */
export function nftImageUrl(bytes: Uint8Array): string {
  const cached = byBytes.get(bytes);
  if (cached) return cached;

  const mime = detectMime(bytes);
  const blob = new Blob([bytes as BlobPart], { type: mime });
  const url = URL.createObjectURL(blob);
  byBytes.set(bytes, url);
  return url;
}

/**
 * Returns a stable blob URL for separately-fetched image bytes, keyed by tokenId.
 * Used when the image was loaded via getNFTImage(tokenId).
 */
export function nftImageUrlById(tokenId: bigint, bytes: Uint8Array): string {
  const key = tokenId.toString();
  const cached = byTokenId.get(key);
  if (cached) return cached;

  const mime = detectMime(bytes);
  const blob = new Blob([bytes as BlobPart], { type: mime });
  const url = URL.createObjectURL(blob);
  byTokenId.set(key, url);
  return url;
}

function detectMime(bytes: Uint8Array): string {
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  )
    return "image/png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return "image/jpeg";
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46)
    return "image/gif";
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  )
    return "image/webp";
  return "application/octet-stream";
}
