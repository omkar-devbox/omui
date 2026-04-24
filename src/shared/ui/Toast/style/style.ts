/* ============================================================
 *  Toast — Reusable Style Sheet
 *  All class strings live here so Toast components stay logic-only.
 * ============================================================ */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

/* ── Per-type colors ───────────────────────────────────────── */

export interface ToastVariantStyle {
  iconColor:   string;
  borderColor: string;
}

export const toastVariantStyles: Record<ToastType, ToastVariantStyle> = {
  success: { iconColor: 'text-emerald-500', borderColor: 'border-l-emerald-500' },
  error:   { iconColor: 'text-rose-500',    borderColor: 'border-l-rose-500'    },
  warning: { iconColor: 'text-amber-500',   borderColor: 'border-l-amber-500'   },
  info:    { iconColor: 'text-sky-500',      borderColor: 'border-l-sky-500'     },
};

/* ── Shared base classes ───────────────────────────────────── */

export const toastBaseStyles = {
  /** Root toast card */
  card:
    'pointer-events-auto flex w-full max-w-sm overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition-all border-l-4',
  /** Animation — visible */
  enter: 'animate-toast-slide-in',
  /** Animation — leaving */
  leave: 'animate-toast-slide-out',
  /** Inner content row */
  inner:       'flex w-full items-start p-4',
  iconWrapper: 'flex-shrink-0',
  icon:        'h-5 w-5',
  textWrapper: 'ml-3 w-0 flex-1 pt-0.5',
  message:     'text-sm font-medium text-gray-900 dark:text-gray-100',
  closeWrapper: 'ml-4 flex flex-shrink-0',
  closeButton:
    'inline-flex rounded-md bg-white dark:bg-gray-900 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
  closeIcon: 'h-5 w-5',
} as const;

/* ── ToastProvider classes ─────────────────────────────────── */

export const toastProviderStyles = {
  /** Outermost fixed positioning layer */
  root:   'pointer-events-none fixed inset-0 z-[100] flex px-4 py-6 sm:p-6 sm:pr-8 sm:pt-8',
  /** Stack of toasts */
  stack: 'flex w-full flex-col items-center space-y-3 sm:items-end sm:justify-start',
} as const;
