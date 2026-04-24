/* ============================================================
 *  PopOver — Reusable Style Sheet
 *  All class strings live here so PopOver.tsx stays logic-only.
 * ============================================================ */

export const popOverBaseStyles = {
  /** Floating container z-index wrapper */
  floatingWrapper: 'z-[100] outline-none',
  /** Inline trigger wrapper (when children is not a valid element) */
  triggerWrapper: 'inline-block',
  /** Animated panel */
  panel:
    'bg-card-bg border border-card-border rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5',
} as const;
