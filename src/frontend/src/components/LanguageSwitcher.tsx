import i18n from "@/i18n";
import { useEffect, useRef, useState } from "react";

const LANGUAGES = [
  { code: "sk", name: "Slovenčina", abbr: "SK" },
  { code: "en", name: "English", abbr: "EN" },
  { code: "de", name: "Deutsch", abbr: "DE" },
  { code: "fr", name: "Français", abbr: "FR" },
  { code: "es", name: "Español", abbr: "ES" },
  { code: "zh", name: "中文", abbr: "ZH" },
  { code: "ja", name: "日本語", abbr: "JA" },
  { code: "ar", name: "العربية", abbr: "AR" },
  { code: "pt", name: "Português", abbr: "PT" },
  { code: "ru", name: "Русский", abbr: "RU" },
] as const;

const STORAGE_KEY = "neferty_lang";

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? "sk",
  );
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  const handleSelect = (code: string) => {
    setCurrent(code);
    i18n.changeLanguage(code);
    localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    setOpen(false);
  };

  useEffect(() => {
    document.documentElement.dir = current === "ar" ? "rtl" : "ltr";
  }, [current]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative" data-ocid="nav.language_switcher">
      <button
        type="button"
        data-ocid="nav.language_button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Zmeniť jazyk / Change language"
        aria-expanded={open}
        className="flex items-center gap-1.5 text-xs font-mono font-bold text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-2xl px-3 py-2"
        style={{
          background: open
            ? "rgba(255,255,255,0.12)"
            : "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.14)",
        }}
      >
        <span className="text-[11px] uppercase tracking-wider">
          {currentLang.abbr}
        </span>
        <svg
          className="w-3 h-3 opacity-60"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <polyline points="2,4 6,8 10,4" />
        </svg>
      </button>

      {open && (
        <div
          data-ocid="nav.language_dropdown"
          role="menu"
          aria-label="Select language"
          className="absolute right-0 top-full mt-1.5 z-50 rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: "rgba(10,6,28,0.96)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.55)",
            minWidth: 160,
            animation: "mint-fade 0.15s both",
          }}
        >
          {LANGUAGES.map((lang) => {
            const isActive = lang.code === current;
            return (
              <button
                key={lang.code}
                type="button"
                role="menuitem"
                data-ocid={`nav.lang_${lang.code}_option`}
                onClick={() => handleSelect(lang.code)}
                className="flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/[0.08]"
                style={{
                  color: isActive
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.60)",
                }}
              >
                <span className="text-sm flex-1">{lang.name}</span>
                <span
                  className="text-[10px] font-bold tracking-wider"
                  style={{
                    color: isActive
                      ? "rgba(255,255,255,0.55)"
                      : "rgba(255,255,255,0.25)",
                  }}
                >
                  {lang.abbr}
                </span>
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgb(var(--theme-color-1-rgb,180,80,220)), rgb(var(--theme-color-2-rgb,230,100,180)))",
                    }}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
