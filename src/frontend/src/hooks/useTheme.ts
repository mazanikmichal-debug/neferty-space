import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface ThemeSettings {
  color1: string;
  color2: string;
  color3: string;
  shift: number;
  hueShift: number;
  useThirdColor: boolean;
}

export interface SavedDesign extends ThemeSettings {
  name: string;
}

const STORAGE_KEY = "nft-theme-settings";
const SAVED_DESIGNS_KEY = "nft-saved-designs";

const PRESETS: { name: string; emoji: string; settings: ThemeSettings }[] = [
  {
    name: "Fialová",
    emoji: "💜",
    settings: {
      color1: "#9b30ff",
      color2: "#d946ef",
      color3: "#f59e0b",
      shift: 50,
      hueShift: 0,
      useThirdColor: true,
    },
  },
  {
    name: "Západ slnka",
    emoji: "🌅",
    settings: {
      color1: "#f97316",
      color2: "#e11d48",
      color3: "#facc15",
      shift: 40,
      hueShift: 0,
      useThirdColor: true,
    },
  },
  {
    name: "Oceán",
    emoji: "🌊",
    settings: {
      color1: "#0ea5e9",
      color2: "#10b981",
      color3: "#06b6d4",
      shift: 50,
      hueShift: 0,
      useThirdColor: true,
    },
  },
  {
    name: "Nočná obloha",
    emoji: "🌌",
    settings: {
      color1: "#1e1b4b",
      color2: "#312e81",
      color3: "#4c1d95",
      shift: 50,
      hueShift: 0,
      useThirdColor: true,
    },
  },
  {
    name: "Zlatý svit",
    emoji: "✨",
    settings: {
      color1: "#d97706",
      color2: "#f59e0b",
      color3: "#fde68a",
      shift: 60,
      hueShift: 0,
      useThirdColor: true,
    },
  },
];

export { PRESETS };

const DEFAULT_SETTINGS: ThemeSettings = {
  color1: "#9b30ff",
  color2: "#f97316",
  color3: "#facc15",
  shift: 50,
  hueShift: 0,
  useThirdColor: true,
};

export function loadFromStorage(): ThemeSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function loadSavedDesigns(): SavedDesign[] {
  try {
    const raw = localStorage.getItem(SAVED_DESIGNS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedDesign[];
  } catch {
    return [];
  }
}

// ─── Color helpers ────────────────────────────────────────────────────────────

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  const hh = h / 360;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const r = Math.round(hue2rgb(hh + 1 / 3) * 255);
  const g = Math.round(hue2rgb(hh) * 255);
  const b = Math.round(hue2rgb(hh - 1 / 3) * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function shiftHex(hex: string, hueDelta: number): string {
  if (!hueDelta) return hex;
  const { h, s, l } = hexToHsl(hex);
  return hslToHex((h + hueDelta + 360) % 360, s, l);
}

// ─── Gradient + root ─────────────────────────────────────────────────────────

export function buildGradient(settings: ThemeSettings): string {
  const { color1, color2, color3, shift, hueShift, useThirdColor } = settings;
  const angle = Math.round((shift / 100) * 360);
  const c1 = shiftHex(color1, hueShift);
  const c2 = shiftHex(color2, hueShift);
  if (!useThirdColor) {
    return `linear-gradient(${angle}deg, ${c1}, ${c2})`;
  }
  const c3 = shiftHex(color3, hueShift);
  return `linear-gradient(${angle}deg, ${c1}, ${c2}, ${c3})`;
}

export function applyToRoot(settings: ThemeSettings) {
  const root = document.documentElement;
  const c1 = shiftHex(settings.color1, settings.hueShift);
  const c2 = shiftHex(settings.color2, settings.hueShift);
  const c3 = shiftHex(settings.color3, settings.hueShift);
  root.style.setProperty("--theme-color-1", c1);
  root.style.setProperty("--theme-color-2", c2);
  root.style.setProperty("--theme-color-3", settings.useThirdColor ? c3 : c2);
  root.style.setProperty("--theme-shift", `${settings.shift}`);
  root.style.setProperty("--theme-gradient", buildGradient(settings));

  // RGB components for rgba() usage in CSS
  const toRgb = (hex: string) => {
    const r = Number.parseInt(hex.slice(1, 3), 16);
    const g = Number.parseInt(hex.slice(3, 5), 16);
    const b = Number.parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };
  root.style.setProperty("--theme-color-1-rgb", toRgb(c1));
  root.style.setProperty("--theme-color-2-rgb", toRgb(c2));
  root.style.setProperty(
    "--theme-color-3-rgb",
    toRgb(settings.useThirdColor ? c3 : c2),
  );

  // Very dark, slightly tinted overlay background derived from color1
  const r1 = Number.parseInt(c1.slice(1, 3), 16);
  const g1 = Number.parseInt(c1.slice(3, 5), 16);
  const b1 = Number.parseInt(c1.slice(5, 7), 16);
  // Dark overlay: mix color1 at 8% into near-black base
  const dr = Math.round(r1 * 0.08);
  const dg = Math.round(g1 * 0.08);
  const db = Math.round(b1 * 0.08 + 3);
  root.style.setProperty(
    "--theme-overlay-bg",
    `rgba(${dr}, ${dg}, ${db}, 0.72)`,
  );
  // Header/footer tint: very dark, slightly tinted
  root.style.setProperty(
    "--theme-header-bg",
    `rgba(${dr}, ${dg}, ${db}, 0.70)`,
  );
  root.style.setProperty(
    "--theme-footer-bg",
    `rgba(${dr}, ${dg}, ${db}, 0.60)`,
  );
}

// ─── Context ──────────────────────────────────────────────────────────────────

export interface ThemeContextValue {
  settings: ThemeSettings;
  update: (patch: Partial<ThemeSettings>) => void;
  applyPreset: (preset: ThemeSettings) => void;
  presets: typeof PRESETS;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  savedDesigns: SavedDesign[];
  saveDesign: (name: string) => void;
  deleteSavedDesign: (name: string) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Internal hook used only by ThemeProvider ─────────────────────────────────

export function useThemeState(): ThemeContextValue {
  const [settings, setSettings] = useState<ThemeSettings>(loadFromStorage);
  const [savedDesigns, setSavedDesigns] =
    useState<SavedDesign[]>(loadSavedDesigns);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    applyToRoot(settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const update = useCallback((patch: Partial<ThemeSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const applyPreset = useCallback((preset: ThemeSettings) => {
    setSettings(preset);
  }, []);

  const saveDesign = useCallback((name: string) => {
    setSettings((current) => {
      setSavedDesigns((prev) => {
        const filtered = prev.filter((d) => d.name !== name);
        const next = [...filtered, { ...current, name }];
        try {
          localStorage.setItem(SAVED_DESIGNS_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
      return current;
    });
  }, []);

  const deleteSavedDesign = useCallback((name: string) => {
    setSavedDesigns((prev) => {
      const next = prev.filter((d) => d.name !== name);
      try {
        localStorage.setItem(SAVED_DESIGNS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return useMemo(
    () => ({
      settings,
      update,
      applyPreset,
      presets: PRESETS,
      isOpen,
      setIsOpen,
      savedDesigns,
      saveDesign,
      deleteSavedDesign,
    }),
    [
      settings,
      update,
      applyPreset,
      isOpen,
      savedDesigns,
      saveDesign,
      deleteSavedDesign,
    ],
  );
}

// ─── Consumer hook ────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
