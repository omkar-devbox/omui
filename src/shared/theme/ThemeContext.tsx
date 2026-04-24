import { useEffect, useState } from "react";
import { useThemeStore } from "./themeStore";
import type { ThemeProviderProps } from "./types";

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme);
  const lightColors = useThemeStore((state) => state.lightColors);
  const darkColors = useThemeStore((state) => state.darkColors);

  const [activeSystemTheme, setActiveSystemTheme] = useState<"light" | "dark">(
    () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setActiveSystemTheme(e.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      root.classList.add(activeSystemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, activeSystemTheme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === "system" ? activeSystemTheme === "dark" : theme === "dark";
    const activeColors = isDark ? darkColors : lightColors;

    Object.entries(activeColors).forEach(([key, value]) => {
      const cssVarName = `--theme-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });
  }, [theme, activeSystemTheme, lightColors, darkColors]);

  return <>{children}</>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const lightColors = useThemeStore((state) => state.lightColors);
  const darkColors = useThemeStore((state) => state.darkColors);
  const setColors = useThemeStore((state) => state.setColors);
  const resetColors = useThemeStore((state) => state.resetColors);

  return { theme, setTheme, lightColors, darkColors, setColors, resetColors };
};
