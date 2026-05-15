import { ThemeSettingsPanel } from "@/components/ThemeSettings";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { copyToClipboard } from "@/utils/clipboard";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Check,
  Copy,
  Home,
  Images,
  Settings,
  Sliders,
  Sparkles,
  Star,
  Store,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { to: "/", key: "home", Icon: Home },
  { to: "/mint", key: "mint", Icon: Sparkles },
  { to: "/gallery", key: "gallery", Icon: Images },
  { to: "/marketplace", key: "marketplace", Icon: Store },
  { to: "/rating", key: "rating", Icon: Star },
  { to: "/settings", key: "settings", Icon: Sliders },
];

export function Layout({ children }: LayoutProps) {
  const {
    isAuthenticated,
    shortPrincipal,
    principalText,
    handleLogout,
    isInitializing,
  } = useAuth();
  const { isOpen: themeOpen, setIsOpen: setThemeOpen } = useTheme();
  const [copiedPrincipal, setCopiedPrincipal] = React.useState(false);
  const { t } = useTranslation();

  const handleCopyPrincipal = async () => {
    if (!principalText) return;
    const success = await copyToClipboard(principalText);
    if (success) {
      setCopiedPrincipal(true);
      setTimeout(() => setCopiedPrincipal(false), 2000);
    }
  };
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Static theme-reactive gradient background */}
      <div className="gradient-bg-static" aria-hidden="true" />
      <div className="gradient-bg-overlay" aria-hidden="true" />
      <ThemeSettingsPanel isOpen={themeOpen} setIsOpen={setThemeOpen} />

      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "var(--theme-header-bg, rgba(8, 5, 24, 0.70))",
          borderBottom:
            "1px solid rgba(var(--theme-color-1-rgb, 255,255,255), 0.12)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
          {/* Top row: logo + user */}
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-base uppercase tracking-widest gradient-text">
              Neferty Space
            </span>
            {isAuthenticated && (
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                {shortPrincipal && principalText && (
                  <button
                    type="button"
                    data-ocid="nav.copy_principal_button"
                    onClick={handleCopyPrincipal}
                    aria-label={t("aria.copyPrincipal")}
                    title={principalText}
                    className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-2xl px-3 py-2 glass-nav-inactive hover:border-primary/40"
                  >
                    <span>{shortPrincipal}</span>
                    {copiedPrincipal ? (
                      <Check className="w-3 h-3 text-primary shrink-0" />
                    ) : (
                      <Copy className="w-3 h-3 shrink-0 opacity-60" />
                    )}
                  </button>
                )}
                <button
                  type="button"
                  data-ocid="nav.settings_button"
                  onClick={() => setThemeOpen(true)}
                  aria-label={t("aria.designSettings")}
                  className="flex items-center justify-center w-9 h-9 rounded-2xl transition-all duration-200 text-white hover:scale-110"
                  style={{
                    background: "rgba(255,255,255,0.09)",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  <Settings className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  data-ocid="nav.logout_button"
                  onClick={handleLogout}
                  disabled={isInitializing}
                  className="relative overflow-hidden rounded-2xl px-5 py-2 text-xs font-display font-bold uppercase tracking-wider transition-all duration-200 disabled:opacity-40 text-white"
                  style={{
                    boxShadow: "0 4px 16px rgba(0,0,0,0.20)",
                  }}
                >
                  <span className="gradient-btn-inner" aria-hidden="true" />
                  <span className="relative z-[1]">{t("buttons.logout")}</span>
                </button>
              </div>
            )}
          </div>

          {/* Nav row */}
          {isAuthenticated && (
            <nav
              className="flex items-stretch gap-3"
              aria-label={t("aria.mainNav")}
            >
              {NAV_LINKS.map((link) => {
                const active =
                  link.to === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    data-ocid={`nav.${link.to.replace(/\//g, "") || "home"}_link`}
                    className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-4 px-3 rounded-2xl font-bold transition-all duration-200 select-none min-h-[80px] text-white no-underline relative overflow-hidden ${
                      active ? "scale-[1.03]" : "hover:scale-[1.02]"
                    }`}
                    style={
                      active
                        ? {
                            boxShadow:
                              "0 4px 20px 4px rgba(var(--theme-color-1-rgb, 120, 40, 180), 0.38)",
                          }
                        : {
                            background: "rgba(255, 255, 255, 0.07)",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                          }
                    }
                  >
                    {active && (
                      <span className="gradient-btn-inner" aria-hidden="true" />
                    )}
                    <link.Icon
                      className="w-7 h-7 shrink-0 relative z-[1]"
                      strokeWidth={1.2}
                      aria-hidden="true"
                    />
                    <span className="text-[11px] uppercase tracking-widest font-bold relative z-[1]">
                      {t(`nav.${link.key}`)}
                    </span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        style={{
          background: "var(--theme-footer-bg, rgba(8, 5, 24, 0.60))",
          borderTop:
            "1px solid rgba(var(--theme-color-1-rgb, 255,255,255), 0.12)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <p className="text-xs gradient-text">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
