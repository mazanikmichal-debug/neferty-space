import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface RatingDisplaySettings {
  visibleCards: number;
  cardScale: number;
  depthStep: number;
  sideStep: number;
  verticalStep: number;
  activeFrameColor: string;
  animationDuration: number;
  preset: string;
  // Shape & arrangement
  arrangementShape:
    | "line"
    | "arc-up"
    | "arc-down"
    | "arc-left"
    | "arc-right"
    | "spiral"
    | "fan"
    | "wave"
    | "grid"
    | "steps"
    | "circle"
    | "teardrop"
    | "concentric"
    | "diamond"
    | "cascade";
  curveIntensity: number; // 0–100
  spacingX: number; // -80–300 px horizontal spacing (negative = overlap)
  spacingY: number; // -80–300 px vertical offset per card
  direction: "right" | "left" | "right-up" | "right-down";
  opacity: number; // 0.0–1.0 background card opacity multiplier
  scrollCooldown: number; // ms between wheel scroll steps
  // Advanced card controls
  cardRotation: number; // -45 to 45 deg — global rotation on non-active cards
  shadowIntensity: number; // 0–1 shadow/glow intensity
  activeCardScale: number; // 1.0–2.5 scale of the active (front) card
  perspectiveDepth: number; // 200–2000 CSS perspective value
  cardTilt: number; // -30 to 30 rotateX on container
  showCardBorder: boolean;
  borderColor: string;
  animationEasing: "ease" | "ease-in-out" | "spring" | "bounce";
  blurInactive: number; // 0–10 px blur on non-active cards
  verticalOffset: number; // -200 to 200 shift entire arrangement up/down
  horizontalOffset: number; // -300 to 300 shift entire arrangement left/right
  cardAspectRatio: "square" | "portrait" | "landscape" | "auto";
  showLabels: boolean;
  labelFontSize: number; // 8–24 px
  interactiveHover: boolean;
  waveAmplitude: number; // 0–120 amplitude for wave shape
}

const STORAGE_KEY = "nft-rating-display";
const PROFILES_KEY = "nft-rating-profiles";

export const DEFAULT_RATING_SETTINGS: RatingDisplaySettings = {
  visibleCards: 4,
  cardScale: 0.82,
  depthStep: 80,
  sideStep: 140,
  verticalStep: 40,
  activeFrameColor: "oklch(0.6 0.28 320)",
  animationDuration: 0.44,
  preset: "Rad zboku",
  arrangementShape: "line",
  curveIntensity: 40,
  spacingX: 140,
  spacingY: 0,
  direction: "right",
  opacity: 1.0,
  scrollCooldown: 500,
  cardRotation: 0,
  shadowIntensity: 0.5,
  activeCardScale: 1.4,
  perspectiveDepth: 800,
  cardTilt: 0,
  showCardBorder: true,
  borderColor: "oklch(0.6 0.28 320)",
  animationEasing: "ease",
  blurInactive: 0,
  verticalOffset: 0,
  horizontalOffset: 0,
  cardAspectRatio: "square",
  showLabels: true,
  labelFontSize: 12,
  interactiveHover: true,
  waveAmplitude: 40,
};

export const RATING_DISPLAY_PRESETS: {
  name: string;
  settings: Omit<RatingDisplaySettings, "preset">;
}[] = [
  {
    name: "Rad zboku",
    settings: {
      ...DEFAULT_RATING_SETTINGS,
      visibleCards: 4,
      arrangementShape: "line",
      spacingX: 140,
      spacingY: 0,
      curveIntensity: 40,
      direction: "right",
      scrollCooldown: 500,
    },
  },
  {
    name: "Dlhý rad",
    settings: {
      ...DEFAULT_RATING_SETTINGS,
      visibleCards: 5,
      cardScale: 0.85,
      depthStep: 60,
      arrangementShape: "line",
      curveIntensity: 20,
      spacingX: 180,
      spacingY: 0,
      direction: "right",
      scrollCooldown: 500,
    },
  },
  {
    name: "Oblúk hore",
    settings: {
      ...DEFAULT_RATING_SETTINGS,
      visibleCards: 5,
      cardScale: 0.8,
      depthStep: 60,
      arrangementShape: "arc-up",
      curveIntensity: 60,
      spacingX: 120,
      spacingY: 0,
      direction: "right",
      scrollCooldown: 500,
    },
  },
  {
    name: "Vejár",
    settings: {
      ...DEFAULT_RATING_SETTINGS,
      visibleCards: 5,
      cardScale: 0.78,
      depthStep: 50,
      arrangementShape: "fan",
      curveIntensity: 55,
      spacingX: 100,
      spacingY: 0,
      direction: "right",
      scrollCooldown: 500,
    },
  },
  {
    name: "Špirála",
    settings: {
      ...DEFAULT_RATING_SETTINGS,
      visibleCards: 5,
      cardScale: 0.75,
      depthStep: 90,
      arrangementShape: "spiral",
      curveIntensity: 70,
      spacingX: 110,
      spacingY: 30,
      direction: "right",
      scrollCooldown: 500,
    },
  },
  {
    name: "Dramatický",
    settings: {
      ...DEFAULT_RATING_SETTINGS,
      visibleCards: 3,
      cardScale: 0.7,
      depthStep: 120,
      arrangementShape: "line",
      curveIntensity: 30,
      spacingX: 160,
      spacingY: 60,
      direction: "right",
      scrollCooldown: 500,
    },
  },
  {
    name: "Vlna",
    settings: {
      ...DEFAULT_RATING_SETTINGS,
      visibleCards: 7,
      cardScale: 0.82,
      depthStep: 30,
      arrangementShape: "wave",
      curveIntensity: 60,
      spacingX: 100,
      spacingY: 0,
      waveAmplitude: 60,
      blurInactive: 1,
      direction: "right",
      scrollCooldown: 400,
    },
  },
  {
    name: "Kruh",
    settings: {
      ...DEFAULT_RATING_SETTINGS,
      visibleCards: 12,
      cardScale: 0.72,
      depthStep: 0,
      arrangementShape: "circle",
      curveIntensity: 50,
      spacingX: 130,
      spacingY: 0,
      direction: "right",
      scrollCooldown: 300,
    },
  },
  {
    name: "Dramatický 3D",
    settings: {
      ...DEFAULT_RATING_SETTINGS,
      visibleCards: 5,
      cardScale: 0.68,
      depthStep: 160,
      perspectiveDepth: 400,
      shadowIntensity: 0.9,
      arrangementShape: "line",
      curveIntensity: 20,
      spacingX: 150,
      spacingY: 30,
      cardTilt: -8,
      direction: "right",
      scrollCooldown: 500,
    },
  },
  {
    name: "Mriežka",
    settings: {
      ...DEFAULT_RATING_SETTINGS,
      visibleCards: 9,
      cardScale: 0.8,
      depthStep: 10,
      arrangementShape: "grid",
      curveIntensity: 0,
      spacingX: 110,
      spacingY: 110,
      cardRotation: 0,
      direction: "right",
      scrollCooldown: 400,
    },
  },
  {
    name: "Kaskáda",
    settings: {
      ...DEFAULT_RATING_SETTINGS,
      visibleCards: 6,
      cardScale: 0.88,
      depthStep: 20,
      arrangementShape: "cascade",
      curveIntensity: 40,
      spacingX: -20,
      spacingY: 30,
      opacity: 0.9,
      direction: "right",
      scrollCooldown: 400,
    },
  },
];

function loadFromStorage(): RatingDisplaySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RATING_SETTINGS;
    return { ...DEFAULT_RATING_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_RATING_SETTINGS;
  }
}

export interface SavedProfile {
  name: string;
  settings: RatingDisplaySettings;
}

export interface RatingDisplayContextValue {
  settings: RatingDisplaySettings;
  updateSettings: (patch: Partial<RatingDisplaySettings>) => void;
  applyPreset: (presetName: string) => void;
  resetToDefault: () => void;
  savedProfiles: SavedProfile[];
  activeProfileName: string | null;
  saveProfile: (name: string) => void;
  loadProfile: (name: string) => void;
  deleteProfile: (name: string) => void;
}

export const RatingDisplayContext =
  createContext<RatingDisplayContextValue | null>(null);

export function useRatingDisplayState(): RatingDisplayContextValue {
  const [settings, setSettings] =
    useState<RatingDisplaySettings>(loadFromStorage);

  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>(() => {
    try {
      const raw = localStorage.getItem(PROFILES_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as SavedProfile[];
    } catch {
      return [];
    }
  });

  const [activeProfileName, setActiveProfileName] = useState<string | null>(
    null,
  );

  const updateSettings = useCallback(
    (patch: Partial<RatingDisplaySettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
      setActiveProfileName(null);
    },
    [],
  );

  const applyPreset = useCallback((presetName: string) => {
    const found = RATING_DISPLAY_PRESETS.find((p) => p.name === presetName);
    if (!found) return;
    const next: RatingDisplaySettings = {
      ...found.settings,
      preset: presetName,
    };
    setSettings(next);
    setActiveProfileName(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const resetToDefault = useCallback(() => {
    setSettings(DEFAULT_RATING_SETTINGS);
    setActiveProfileName(null);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(DEFAULT_RATING_SETTINGS),
      );
    } catch {
      /* ignore */
    }
  }, []);

  const saveProfile = useCallback(
    (name: string) => {
      if (!name.trim()) return;
      setSavedProfiles((prev) => {
        const trimmed = name.trim();
        const filtered = prev.filter((p) => p.name !== trimmed);
        const next = [...filtered, { name: trimmed, settings }].slice(-10);
        try {
          localStorage.setItem(PROFILES_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
      setActiveProfileName(name.trim());
    },
    [settings],
  );

  const loadProfile = useCallback((name: string) => {
    setSavedProfiles((prev) => {
      const found = prev.find((p) => p.name === name);
      if (!found) return prev;
      const next = { ...found.settings };
      setSettings(next);
      setActiveProfileName(name);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return prev;
    });
  }, []);

  const deleteProfile = useCallback((name: string) => {
    setSavedProfiles((prev) => {
      const next = prev.filter((p) => p.name !== name);
      try {
        localStorage.setItem(PROFILES_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    setActiveProfileName((prev) => (prev === name ? null : prev));
  }, []);

  return useMemo(
    () => ({
      settings,
      updateSettings,
      applyPreset,
      resetToDefault,
      savedProfiles,
      activeProfileName,
      saveProfile,
      loadProfile,
      deleteProfile,
    }),
    [
      settings,
      updateSettings,
      applyPreset,
      resetToDefault,
      savedProfiles,
      activeProfileName,
      saveProfile,
      loadProfile,
      deleteProfile,
    ],
  );
}

export function useRatingDisplay(): RatingDisplayContextValue {
  const ctx = useContext(RatingDisplayContext);
  if (!ctx)
    throw new Error(
      "useRatingDisplay must be used inside <RatingDisplayProvider>",
    );
  return ctx;
}
