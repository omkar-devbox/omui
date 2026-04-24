import { useEffect } from "react";
import { useInteractionStore } from "./interactionStore";
import type { ShortcutAction, BaseShortcutAction } from "./types";

interface UseShortcutOptions {
  action?: ShortcutAction;
  customKeys?: string[]; // Allow overriding with custom keys directly
  onTrigger: () => void;
  enabled?: boolean;
  preventDefault?: boolean;
}

export const useShortcut = ({
  action,
  customKeys,
  onTrigger,
  enabled = true,
  preventDefault = true,
}: UseShortcutOptions) => {
  const { mappings, customNavs } = useInteractionStore();
  
  // Find the keys to listen for
  let keysToMatch: string[] | undefined = customKeys;

  if (action) {
    // Check in base mappings
    if (action in mappings) {
      keysToMatch = mappings[action as BaseShortcutAction]?.keys;
    } else {
      // Check in custom navs
      const customNav = customNavs.find(nav => nav.id === action);
      if (customNav) {
        keysToMatch = customNav.keys;
      }
    }
  }

  useEffect(() => {
    if (!enabled || !keysToMatch || keysToMatch.length === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!keysToMatch) return;

      const isMatch = keysToMatch.every((key) => {
        if (key === "Control") return event.ctrlKey;
        if (key === "Alt") return event.altKey;
        if (key === "Shift") return event.shiftKey;
        if (key === "Meta") return event.metaKey;
        return event.key.toLowerCase() === key.toLowerCase();
      });

      const modifiers = ["Control", "Alt", "Shift", "Meta"];
      const mappingModifiers = keysToMatch.filter(k => modifiers.includes(k));
      const eventModifiers = [];
      if (event.ctrlKey) eventModifiers.push("Control");
      if (event.altKey) eventModifiers.push("Alt");
      if (event.shiftKey) eventModifiers.push("Shift");
      if (event.metaKey) eventModifiers.push("Meta");

      const sameModifiers = mappingModifiers.length === eventModifiers.length && 
                           mappingModifiers.every(m => eventModifiers.includes(m));

      if (isMatch && sameModifiers) {
        if (preventDefault) {
          event.preventDefault();
        }
        onTrigger();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keysToMatch, onTrigger, enabled, preventDefault]);
};
