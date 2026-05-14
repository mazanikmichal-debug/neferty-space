/**
 * nftImage.ts — Convert Uint8Array NFT image bytes to a displayable blob URL.
 *
 * Uses a simple in-memory cache (WeakMap-like approach keyed on array identity)
 * so the same URL is reused if the same Uint8Array reference is passed twice.
 * Returned URLs are never explicitly revoked — they live for the app session.
 */

const cache = new Map<Uint8Array, string>();

/**
 * Returns a stable blob URL for the given Uint8Array image bytes.
 * Detects image type from magic bytes (PNG, JPEG, GIF, WEBP); falls back to octet-stream.
 */
export function nftImageUrl(bytes: Uint8Array): string {
  const cached = cache.get(bytes);
  if (cached) return cached;

  const mime = detectMime(bytes);
  const blob = new Blob([bytes as BlobPart], { type: mime });
  const url = URL.createObjectURL(blob);
  cache.set(bytes, url);
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
