/* ============================================================
 *  Alert — Reusable Style Sheet
 *  All class strings live here so Alert.tsx stays logic-only.
 * ============================================================ */

export type AlertType = 'success' | 'error' | 'warning' | 'info';

/* ── Per-variant token classes ─────────────────────────────── */

export interface AlertVariantStyle {
  /** Outer container background + border */
  container: string;
  /** Icon colour */
  icon: string;
  /** Title text colour + weight */
  title: string;
  /** Body / children text colour */
  body: string;
  /** Close-button colour + focus ring */
  closeButton: string;
}

export const alertVariantStyles: Record<AlertType, AlertVariantStyle> = {
  success: {
    container:
      'bg-success-light dark:bg-success/10 border-success/20 dark:border-success/30',
    icon: 'text-success',
    title: 'text-success font-semibold',
    body: 'text-success/90 dark:text-success-light',
    closeButton:
      'text-success hover:bg-success/10 focus:ring-success',
  },
  error: {
    container:
      'bg-error-bg dark:bg-error/10 border-error/20 dark:border-error/30',
    icon: 'text-error',
    title: 'text-error font-semibold',
    body: 'text-error/90 dark:text-error-bg',
    closeButton:
      'text-error hover:bg-error/10 focus:ring-error',
  },
  warning: {
    container:
      'bg-warning-light dark:bg-warning/10 border-warning/20 dark:border-warning/30',
    icon: 'text-warning',
    title: 'text-warning font-semibold',
    body: 'text-warning/90 dark:text-warning-light',
    closeButton:
      'text-warning hover:bg-warning/10 focus:ring-warning',
  },
  info: {
    container:
      'bg-info-light dark:bg-info/10 border-info/20 dark:border-info/30',
    icon: 'text-info',
    title: 'text-info font-semibold',
    body: 'text-info/90 dark:text-info-light',
    closeButton:
      'text-info hover:bg-info/10 focus:ring-info',
  },
};

/* ── Shared base classes ───────────────────────────────────── */

export const alertBaseStyles = {
  /** Outer wrapper — always applied */
  container:
    'relative w-full rounded-lg border p-4 transition-all duration-300 flex items-start',
  /** Icon wrapper */
  iconWrapper: 'flex-shrink-0 mr-3 mt-0.5',
  /** Icon itself */
  icon: 'h-5 w-5',
  /** Text content column */
  content: 'flex-1 min-w-0',
  /** Title */
  title: 'text-sm font-medium mb-1',
  /** Body / children */
  body: 'text-sm',
  /** Close button column */
  closeWrapper: 'ml-4 flex-shrink-0 flex',
  /** Close button */
  closeButton:
    'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors dark:focus:ring-offset-gray-900',
  /** Close icon */
  closeIcon: 'h-4 w-4',
  /** Animation — entering */
  enter: 'opacity-100 scale-100',
  /** Animation — leaving */
  leave: 'opacity-0 scale-95',
} as const;
