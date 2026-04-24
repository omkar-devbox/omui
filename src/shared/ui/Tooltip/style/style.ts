/* ============================================================
 *  Tooltip — Reusable Style Sheet
 *  All class strings live here so Tooltip.tsx stays logic-only.
 * ============================================================ */

export type TooltipVariant =
  | 'dark'
  | 'light'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

/* ── Variant panel classes ─────────────────────────────────── */

export const tooltipVariantStyles: Record<TooltipVariant, string> = {
  dark:    'bg-gray-900 text-white dark:bg-gray-700',
  light:   'bg-white text-gray-900 border border-neutral-border shadow-lg',
  primary: 'bg-primary text-white',
  success: 'bg-success text-white',
  warning: 'bg-warning text-white',
  danger:  'bg-error text-white',
  info:    'bg-primary text-white',
};

/* ── Arrow fill classes ────────────────────────────────────── */

export const tooltipArrowStyles: Record<TooltipVariant, string> = {
  dark:    'fill-gray-900 dark:fill-gray-700',
  light:   'fill-white [&>path]:stroke-neutral-border',
  primary: 'fill-primary',
  success: 'fill-success',
  warning: 'fill-warning',
  danger:  'fill-error',
  info:    'fill-primary',
};

/* ── Shared base classes ───────────────────────────────────── */

export const tooltipBaseStyles = {
  /** Inline trigger wrapper */
  triggerWrapper: 'inline-block',
  /** Floating panel */
  panel:
    'z-50 px-3 py-2 text-xs font-medium rounded-lg shadow-sm transition-opacity',
} as const;
