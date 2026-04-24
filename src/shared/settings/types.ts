export type BaseShortcutAction =
  | "save"
  | "submit"
  | "cancel"
  | "reset"
  | "openForm"
  | "closeForm"
  | "toggleForm"
  | "navDashboard"
  | "navSettings"
  | "navCreate"
  | "navBack"
  | "navForward"
  | "quickNav";

export type ShortcutAction = BaseShortcutAction | (string & {});

export interface ShortcutMapping {
  keys: string[]; // e.g., ["Control", "s"]
  label: string;
}

export interface CustomNavigation {
  id: string;
  label: string;
  path: string;
  keys: string[];
}

export type InteractionSettings = Record<BaseShortcutAction, ShortcutMapping>;

export interface InteractionState {
  mappings: InteractionSettings;
  customNavs: CustomNavigation[];
  updateMapping: (action: BaseShortcutAction, keys: string[]) => void;
  addCustomNav: (nav: Omit<CustomNavigation, "id">) => void;
  updateCustomNav: (id: string, updates: Partial<CustomNavigation>) => void;
  removeCustomNav: (id: string) => void;
  resetToDefault: () => void;
}
