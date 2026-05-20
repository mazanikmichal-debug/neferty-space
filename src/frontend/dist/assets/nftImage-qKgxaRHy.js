const byTokenId = /* @__PURE__ */ new Map();
function nftImageUrlById(tokenId, bytes) {
  const key = tokenId.toString();
  const cached = byTokenId.get(key);
  if (cached) return cached;
  const mime = detectMime(bytes);
  const blob = new Blob([bytes], { type: mime });
  const url = URL.createObjectURL(blob);
  byTokenId.set(key, url);
  return url;
}
function detectMime(bytes) {
  if (bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71)
    return "image/png";
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)
    return "image/jpeg";
  if (bytes[0] === 71 && bytes[1] === 73 && bytes[2] === 70)
    return "image/gif";
  if (bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70 && bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80)
    return "image/webp";
  return "application/octet-stream";
}
export {
  nftImageUrlById as n
};
