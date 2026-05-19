import { Principal } from "@dfinity/principal";
/**
 * plug-wallet.ts — Plug Wallet integration utilities
 *
 * All Plug Wallet calls go through this module.
 * window.ic?.plug is the standard Plug browser extension API.
 */

// ─── Type declarations for Plug Wallet window extension ────────────────────

declare global {
  interface Window {
    ic?: {
      plug?: {
        isConnected: () => Promise<boolean>;
        requestConnect: (opts: {
          whitelist: string[];
          host?: string;
        }) => Promise<boolean>;
        agent?: {
          getPrincipal: () => Promise<{ toText: () => string }>;
        };
        getPrincipal: () => Promise<{ toText: () => string }>;
        requestTransfer: (args: {
          to: string;
          amount: number;
          opts?: { fee?: number; memo?: number };
        }) => Promise<{
          height?: number;
          blockIndex?: number;
          block_index?: number;
          blockHeight?: number;
        }>;
      };
    };
  }
}

// ─── Availability ──────────────────────────────────────────────────────────

/** Returns true if Plug Wallet extension is installed. */
export function isPlugAvailable(): boolean {
  return typeof window !== "undefined" && !!window.ic?.plug;
}

// ─── Connection ────────────────────────────────────────────────────────────

/**
 * Request Plug Wallet connection with a canister whitelist.
 * Returns true if user approved, false if rejected or not available.
 */
export async function requestPlugConnect(
  whitelist: string[],
): Promise<boolean> {
  if (!isPlugAvailable()) return false;
  try {
    const result = await window.ic!.plug!.requestConnect({
      whitelist,
      host: "https://icp-api.io",
    });
    return !!result;
  } catch {
    return false;
  }
}

/**
 * Returns the connected Plug principal as text, or null if not connected.
 */
export async function getPlugPrincipal(): Promise<string | null> {
  if (!isPlugAvailable()) return null;
  try {
    const isConnected = await window.ic!.plug!.isConnected();
    if (!isConnected) return null;
    const principal = await window.ic!.plug!.getPrincipal();
    return principal.toText();
  } catch {
    return null;
  }
}

// ─── ICP Transfer ──────────────────────────────────────────────────────────

/**
 * Send ICP via Plug Wallet.
 * @param to  — destination Account Identifier (hex string)
 * @param amount — amount in e8s (1 ICP = 100_000_000 e8s)
 * @returns { blockIndex: bigint } on success, null if rejected/failed
 */
export async function sendICPViaPlug(
  to: string,
  amount: number,
): Promise<{ blockIndex: bigint } | null> {
  if (!isPlugAvailable()) return null;
  try {
    const result = await window.ic!.plug!.requestTransfer({
      to,
      amount,
      // CMC top-up MUST use memo 1347768404 (0x50555054 = "PUPT").
      // Any other value — computed ratio, 0, or wrong constant — causes CMC to
      // immediately refund with "Memo does not correspond to any CMC operation".
      opts: { fee: 10_000, memo: 1347768404 },
    });
    const raw =
      (
        result as {
          blockIndex?: number;
          block_index?: number;
          height?: number;
          blockHeight?: number;
        }
      )?.blockIndex ??
      (result as { block_index?: number })?.block_index ??
      (result as { height?: number })?.height ??
      (result as { blockHeight?: number })?.blockHeight;
    if (raw == null) {
      console.warn(
        "[Plug] No blockIndex found in requestTransfer response:",
        result,
      );
      throw new Error(
        "Plug Wallet nevrátil block index. Skús znova alebo použi núdzové pole.",
      );
    }
    return { blockIndex: BigInt(raw) };
  } catch (err) {
    if (err instanceof Error && err.message.includes("Plug Wallet nevrátil"))
      throw err;
    return null;
  }
}

// ─── CMC Deposit Address ────────────────────────────────────────────────────

export const CMC_CANISTER_ID = "rkp4c-7iaaa-aaaaa-aaaca-cai";

// ── Pure TypeScript SHA-224 implementation ──────────────────────────────────
// SHA-224 = SHA-256 variant with different initial constants and 28-byte output.

const SHA224_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
  0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
  0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
] as const;

function sha224(data: Uint8Array): Uint8Array {
  // SHA-224 initial hash values (different from SHA-256)
  let h0 = 0xc1059ed8;
  let h1 = 0x367cd507;
  let h2 = 0x3070dd17;
  let h3 = 0xf70e5939;
  let h4 = 0xffc00b31;
  let h5 = 0x68581511;
  let h6 = 0x64f98fa7;
  let h7 = 0xbefa4fa4;

  // Pre-processing: pad the message
  const len = data.length;
  const bitLen = len * 8;
  // Pad to 512-bit (64-byte) blocks: msg + 0x80 + zeros + 64-bit big-endian length
  const padLen = (len + 9 + 63) & ~63;
  const padded = new Uint8Array(padLen);
  padded.set(data);
  padded[len] = 0x80;
  // Write 64-bit big-endian bit length (we only handle lengths < 2^32 bits)
  const dv = new DataView(padded.buffer);
  dv.setUint32(padLen - 4, bitLen >>> 0, false);
  dv.setUint32(padLen - 8, Math.floor(bitLen / 0x100000000), false);

  const rotr32 = (x: number, n: number) => (x >>> n) | (x << (32 - n));

  // Process each 64-byte block
  for (let i = 0; i < padLen; i += 64) {
    const w = new Uint32Array(64);
    for (let j = 0; j < 16; j++) {
      w[j] = dv.getUint32(i + j * 4, false);
    }
    for (let j = 16; j < 64; j++) {
      const s0 =
        rotr32(w[j - 15], 7) ^ rotr32(w[j - 15], 18) ^ (w[j - 15] >>> 3);
      const s1 =
        rotr32(w[j - 2], 17) ^ rotr32(w[j - 2], 19) ^ (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;
    for (let j = 0; j < 64; j++) {
      const S1 = rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + SHA224_K[j] + w[j]) >>> 0;
      const S0 = rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;
      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    // h7 is computed but dropped — SHA-224 outputs only 7 words (28 bytes)
  }

  const result = new Uint8Array(28);
  const rv = new DataView(result.buffer);
  rv.setUint32(0, h0, false);
  rv.setUint32(4, h1, false);
  rv.setUint32(8, h2, false);
  rv.setUint32(12, h3, false);
  rv.setUint32(16, h4, false);
  rv.setUint32(20, h5, false);
  rv.setUint32(24, h6, false);
  return result;
}

// ── CRC32 (IEEE 802.3 reversed polynomial 0xEDB88320) ───────────────────────

function crc32(data: Uint8Array): Uint8Array {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  crc = (crc ^ 0xffffffff) >>> 0;
  const out = new Uint8Array(4);
  out[0] = (crc >>> 24) & 0xff;
  out[1] = (crc >>> 16) & 0xff;
  out[2] = (crc >>> 8) & 0xff;
  out[3] = crc & 0xff;
  return out;
}

/**
 * Compute the ICP Account ID (64-char hex) that the CMC expects for a given
 * target canister top-up. This mirrors the Motoko `principalToSubaccount` +
 * SHA-224 + CRC32 logic exactly — matching what CMC uses internally when it
 * validates a notify_top_up call.
 *
 * Formula:
 *   subaccount[0]   = targetBytes.length
 *   subaccount[1…n] = targetBytes
 *   subaccount[…31] = 0 (padding)
 *   message = [0x0a, ..."account-id", ...cmcBytes, ...subaccount32]
 *   hash28  = SHA224(message)
 *   accountId = [crc32(hash28)…4, hash28…28]  →  64-hex
 */
export function computeCmcDepositAddress(
  targetCanisterPrincipalText: string,
): string {
  // 1. CMC principal bytes
  const cmcBytes = Principal.fromText(CMC_CANISTER_ID).toUint8Array();

  // 2. Target canister bytes
  const targetBytes = Principal.fromText(
    targetCanisterPrincipalText,
  ).toUint8Array();

  // 3. Build 32-byte subaccount
  const subaccount = new Uint8Array(32);
  subaccount[0] = targetBytes.length;
  subaccount.set(targetBytes, 1);

  // 4. Build message: domain_separator || cmc_principal_bytes || subaccount32
  //    domain_separator = 0x0a || "account-id"  (length-prefixed)
  const domainBytes = new Uint8Array([
    0x0a, 97, 99, 99, 111, 117, 110, 116, 45, 105, 100,
  ]);
  const msg = new Uint8Array(domainBytes.length + cmcBytes.length + 32);
  let offset = 0;
  msg.set(domainBytes, offset);
  offset += domainBytes.length;
  msg.set(cmcBytes, offset);
  offset += cmcBytes.length;
  msg.set(subaccount, offset);

  // 5. SHA-224 → 28 bytes
  const hash28 = sha224(msg);

  // 6. CRC32 of the 28-byte hash → 4 bytes big-endian
  const crc = crc32(hash28);

  // 7. Concatenate: [crc32(4), hash28(28)] = 32 bytes
  const accountId = new Uint8Array(32);
  accountId.set(crc, 0);
  accountId.set(hash28, 4);

  // 8. Return lowercase hex string
  return Array.from(accountId)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
