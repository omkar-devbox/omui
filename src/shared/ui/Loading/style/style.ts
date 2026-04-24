/* ============================================================
 *  Loading — Reusable Style Sheet
 *  All class strings live here so Loading.tsx stays logic-only.
 * ============================================================ */

/* ── Shared base classes ───────────────────────────────────── */

export const loadingBaseStyles = {
  /** Outer wrapper — applied to both fullscreen and inline */
  wrapper:
    'flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-950/50 backdrop-blur-sm',
  /** Fullscreen overlay */
  fullScreen: 'fixed inset-0 z-[100]',
  /** Inline variant */
  inline: 'w-full h-full min-h-[400px]',
  /** Spinner ring container */
  spinnerContainer: 'relative flex items-center justify-center',
  /** Outer pulsating ring */
  pingRing:
    'absolute h-16 w-16 rounded-full border-4 border-primary/20 animate-ping',
  /** Middle spinning gradient ring */
  spinRing:
    'h-12 w-12 rounded-full border-t-4 border-l-4 border-primary animate-spin',
  /** Inner dot */
  innerDot: 'absolute h-2 w-2 bg-primary rounded-full animate-pulse',
  /** Loading text label */
  label:
    'mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse tracking-widest uppercase',
  /** Skeleton wrapper */
  skeletonWrapper: 'p-8 w-full max-w-7xl mx-auto',
} as const;
