const STORAGE_KEY = "nft-address-history";
const MAX_ENTRIES = 10;

export function saveAddress(address: string): void {
  const trimmed = address.trim();
  if (!trimmed) return;
  const current = getAddresses();
  const deduped = [trimmed, ...current.filter((a) => a !== trimmed)];
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(deduped.slice(0, MAX_ENTRIES)),
  );
}

export function getAddresses(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function clearAddresses(): void {
  localStorage.removeItem(STORAGE_KEY);
}
