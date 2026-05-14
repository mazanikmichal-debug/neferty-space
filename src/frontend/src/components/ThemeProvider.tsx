import {
  RatingDisplayContext,
  useRatingDisplayState,
} from "@/hooks/useRatingDisplay";
import { ThemeContext, useThemeState } from "@/hooks/useTheme";
import type React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = useThemeState();
  const ratingValue = useRatingDisplayState();
  return (
    <ThemeContext.Provider value={value}>
      <RatingDisplayContext.Provider value={ratingValue}>
        {children}
      </RatingDisplayContext.Provider>
    </ThemeContext.Provider>
  );
}
