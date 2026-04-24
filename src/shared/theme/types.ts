export type Theme = "light" | "dark" | "system";

export interface ThemeColors {
  // Interface Elements
  labelDefault: string;
  labelFocus: string;
  labelDisabled: string;

  // Status Colors
  error: string;
  errorBg: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  info: string;
  infoLight: string;

  // Layout & Surfaces
  neutralBg: string;
  neutralSurface: string;
  neutralBorder: string;
  cardBg: string;
  cardBorder: string;

  // Typography
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Navigation & Shell
  navBg: string;
  navHover: string;
  navActiveBg: string;

  // Tables
  tableHeaderBg: string;
  tableRowHover: string;
  tableBg: string;
  tableBorder: string;
  tableToolbarBg: string;

  // Inputs & Buttons
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

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}
