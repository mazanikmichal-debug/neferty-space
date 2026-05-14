import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export default function LoginPage() {
  const { isAuthenticated, isInitializing, isLoggingIn, handleLogin } =
    useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/", replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <div className="gradient-bg-static" aria-hidden="true" />
      <div className="gradient-bg-overlay" aria-hidden="true" />
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        {/* Logo / brand */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-7xl leading-none">⬡</span>
          <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">
            NFT Minter
          </h1>
          <p className="text-muted-foreground text-sm text-center">
            ICP Blockchain
          </p>
        </div>

        <div className="w-full border-2 border-border bg-card rounded-3xl p-8 flex flex-col items-center gap-6">
          <span className="text-5xl" aria-hidden="true">
            🔑
          </span>
          <button
            type="button"
            data-ocid="login.submit_button"
            onClick={handleLogin}
            disabled={isInitializing || isLoggingIn}
            className="relative overflow-hidden w-full rounded-2xl font-display font-bold text-base uppercase tracking-widest py-5 min-h-[64px] transition-all duration-200 hover:scale-[1.02] disabled:opacity-40 disabled:scale-100 text-white"
            style={{
              boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
            }}
          >
            <span className="gradient-btn-inner" aria-hidden="true" />
            <span className="relative z-[1]">
              {isInitializing
                ? "Načítávam..."
                : isLoggingIn
                  ? "Prihlasovanie..."
                  : "Prihlásiť sa"}
            </span>
          </button>
          <p className="text-xs text-muted-foreground text-center">
            Internet Identity
          </p>
        </div>
      </div>
    </div>
  );
}
