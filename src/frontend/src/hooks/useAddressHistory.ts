import {
  clearAddresses as clearStoredAddresses,
  getAddresses,
  saveAddress as persistAddress,
} from "@/utils/addressHistory";
import { useCallback, useState } from "react";

export function useAddressHistory() {
  const [addresses, setAddresses] = useState<string[]>(() => getAddresses());

  const saveAddress = useCallback((address: string) => {
    persistAddress(address);
    setAddresses(getAddresses());
  }, []);

  const clearAddresses = useCallback(() => {
    clearStoredAddresses();
    setAddresses([]);
  }, []);

  return { addresses, saveAddress, clearAddresses };
}
