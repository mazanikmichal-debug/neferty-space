import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const {
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    identity,
  } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    clear();
    queryClient.clear();
  };

  const principalText = identity?.getPrincipal()?.toString() ?? null;
  const shortPrincipal = principalText
    ? `${principalText.slice(0, 8)}...${principalText.slice(-4)}`
    : null;

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    identity,
    principalText,
    shortPrincipal,
    handleLogin,
    handleLogout,
  };
}
