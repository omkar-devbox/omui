import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InteractionState, InteractionSettings } from "./types";

const defaultMappings: InteractionSettings = {
  save: { keys: ["Control", "s"], label: "Save Action" },
  submit: { keys: ["Control", "Enter"], label: "Submit Form" },
  cancel: { keys: ["Escape"], label: "Cancel Action" },
  reset: { keys: ["Alt", "r"], label: "Reset Form" },
  openForm: { keys: ["n"], label: "Open New Form" },
  closeForm: { keys: ["Escape"], label: "Close Form" },
  toggleForm: { keys: ["t"], label: "Toggle Form" },
  navDashboard: { keys: ["Control", "d"], label: "Go to Dashboard" },
  navSettings: { keys: ["Control", ","], label: "Go to Settings" },
  navCreate: { keys: ["Control", "n"], label: "Go to Create Page" },
  navBack: { keys: ["Alt", "ArrowLeft"], label: "Go Back" },
  navForward: { keys: ["Alt", "ArrowRight"], label: "Go Forward" },
  quickNav: { keys: ["Control", "k"], label: "Quick Navigation" },
};

export const useInteractionStore = create<InteractionState>()(
  persist(
    (set) => ({
      mappings: defaultMappings,
      customNavs: [],
      updateMapping: (action, keys) =>
        set((state) => ({
          mappings: {
            ...state.mappings,
            [action]: { ...state.mappings[action], keys },
          },
        })),
      addCustomNav: (nav) => set((state) => ({
        customNavs: [...state.customNavs, { ...nav, id: crypto.randomUUID() }]
      })),
      updateCustomNav: (id, updates) => set((state) => ({
        customNavs: state.customNavs.map(nav => nav.id === id ? { ...nav, ...updates } : nav)
      })),
      removeCustomNav: (id) => set((state) => ({
        customNavs: state.customNavs.filter(nav => nav.id !== id)
      })),
      resetToDefault: () => set({ mappings: defaultMappings, customNavs: [] }),
    }),
    {
      name: "omui-interaction-v2",
    },
  ),
);
