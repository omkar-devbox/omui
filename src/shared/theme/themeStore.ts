import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ================= TYPES ================= */

export type Theme = "light" | "dark" | "system";

export interface ThemeColors {
  labelDefault: string;
  labelFocus: string;
  labelDisabled: string;

  error: string;
  errorBg: string;

  success: string;
  successLight: string;

  warning: string;
  warningLight: string;

  info: string;
  infoLight: string;

  neutralBg: string;
  neutralSurface: string;
  neutralBorder: string;

  cardBg: string;
  cardBorder: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  navBg: string;
  navHover: string;
  navActiveBg: string;

  tableHeaderBg: string;
  tableRowHover: string;
  tableBg: string;
  tableBorder: string;
  tableToolbarBg: string;

  inputBg: string;
  inputText: string;
  inputBorderDefault: string;
  inputBorderFocus: string;
  inputBgDisabled: string;

  buttonPrimary: string;
  buttonPrimaryHover: string;
  buttonSecondary: string;
  buttonSecondaryHover: string;
  buttonDanger: string;
  buttonDangerHover: string;
  buttonDisabled: string;
  buttonBorder: string;
}

/* ================= LIGHT THEME ================= */

const defaultLightColors: ThemeColors = {
  labelDefault: "#374151",
  labelFocus: "#2563EB",
  labelDisabled: "#9CA3AF",

  error: "#DC2626",
  errorBg: "#FEF2F2",

  success: "#16A34A",
  successLight: "#ECFDF5",

  warning: "#D97706",
  warningLight: "#FFFBEB",

  info: "#0284C7",
  infoLight: "#F0F9FF",

  neutralBg: "#F8FAFC",
  neutralSurface: "#F1F5F9",
  neutralBorder: "#E2E8F0",

  cardBg: "#FFFFFF",
  cardBorder: "#E2E8F0",

  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",

  navBg: "#FFFFFF",
  navHover: "#F1F5F9",
  navActiveBg: "#E0F2FE",

  tableHeaderBg: "#F8FAFC",
  tableRowHover: "#F1F5F9",
  tableBg: "#FFFFFF",
  tableBorder: "#E2E8F0",
  tableToolbarBg: "#F8FAFC",

  inputBg: "#FFFFFF",
  inputText: "#0F172A",
  inputBorderDefault: "#CBD5E1",
  inputBorderFocus: "#2563EB",
  inputBgDisabled: "#F1F5F9",

  buttonPrimary: "#2563EB",
  buttonPrimaryHover: "#1E40AF",

  buttonSecondary: "#F1F5F9",
  buttonSecondaryHover: "#E2E8F0",

  buttonDanger: "#DC2626",
  buttonDangerHover: "#B91C1C",

  buttonDisabled: "#94A3B8",
  buttonBorder: "#CBD5E1",
};

/* ================= DARK THEME ================= */

const defaultDarkColors: ThemeColors = {
  labelDefault: "#E5E7EB",
  labelFocus: "#60A5FA",
  labelDisabled: "#6B7280",

  error: "#F87171",
  errorBg: "#7F1D1D",

  success: "#4ADE80",
  successLight: "#052E16",

  warning: "#FBBF24",
  warningLight: "#78350F",

  info: "#38BDF8",
  infoLight: "#082F49",

  neutralBg: "#020617",
  neutralSurface: "#0F172A",
  neutralBorder: "#1E293B",

  cardBg: "#020617",
  cardBorder: "#1E293B",

  textPrimary: "#F8FAFC",
  textSecondary: "#CBD5F5",
  textMuted: "#64748B",

  navBg: "#020617",
  navHover: "#0F172A",
  navActiveBg: "#1D4ED8",

  tableHeaderBg: "#020617",
  tableRowHover: "#0F172A",
  tableBg: "#020617",
  tableBorder: "#1E293B",
  tableToolbarBg: "#020617",

  inputBg: "#020617",
  inputText: "#F8FAFC",
  inputBorderDefault: "#334155",
  inputBorderFocus: "#60A5FA",
  inputBgDisabled: "#0F172A",

  buttonPrimary: "#3B82F6",
  buttonPrimaryHover: "#60A5FA",

  buttonSecondary: "#1E293B",
  buttonSecondaryHover: "#334155",

  buttonDanger: "#F87171",
  buttonDangerHover: "#EF4444",

  buttonDisabled: "#475569",
  buttonBorder: "#334155",
};

/* ================= STORE ================= */

interface ThemeState {
  theme: Theme;
  lightColors: ThemeColors;
  darkColors: ThemeColors;

  setTheme: (theme: Theme) => void;
  setColors: (newColors: Partial<ThemeColors>, mode: "light" | "dark") => void;
  resetColors: () => void;
}

/* ================= STORE IMPLEMENTATION ================= */

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      lightColors: defaultLightColors,
      darkColors: defaultDarkColors,

      setTheme: (theme) => set({ theme }),

      setColors: (newColors, mode) =>
        set((state) => ({
          [mode === "light" ? "lightColors" : "darkColors"]: {
            ...state[mode === "light" ? "lightColors" : "darkColors"],
            ...newColors,
          },
        })),

      resetColors: () =>
        set({
          lightColors: defaultLightColors,
          darkColors: defaultDarkColors,
        }),
    }),
    {
      name: "omui-theme-v3",
    },
  ),
);

/* ================= HELPER ================= */

export const getActiveColors = (
  theme: Theme,
  light: ThemeColors,
  dark: ThemeColors,
): ThemeColors => {
  if (theme === "dark") return dark;
  if (theme === "light") return light;

  // system
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? dark
      : light;
  }

  return light;
};
