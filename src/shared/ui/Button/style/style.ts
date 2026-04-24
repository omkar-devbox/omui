/* ============================================================
 *  Button — Reusable Style Sheet
 *  All class strings live here so Button.tsx stays logic-only.
 * ============================================================ */

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

/* ── Variant classes ───────────────────────────────────────── */

export const buttonVariantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-button-primary text-white hover:bg-button-primary-hover hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/20 focus:ring-button-primary/50 shadow-sm border border-transparent',
  secondary:
    'bg-button-secondary text-text-primary hover:bg-button-secondary-hover hover:-translate-y-0.5 hover:shadow-md focus:ring-neutral-border shadow-sm border border-button-border',
  danger:
    'bg-button-danger text-white hover:bg-button-danger-hover hover:-translate-y-0.5 hover:shadow-md focus:ring-button-danger/50 shadow-sm border border-transparent',
  outline:
    'bg-transparent text-text-primary border-2 border-button-border hover:bg-neutral-bg hover:-translate-y-0.5 focus:ring-primary/20',
  ghost:
    'bg-transparent text-text-primary hover:bg-neutral-bg focus:ring-primary/20 border border-transparent hover:scale-105',
};

/* ── Size classes ──────────────────────────────────────────── */

export const buttonSizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-5 py-3 text-lg gap-2.5',
};

/* ── Spinner size classes ──────────────────────────────────── */

export const buttonSpinnerSizeStyles: Record<ButtonSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

/* ── Shared base classes ───────────────────────────────────── */

export const buttonBaseStyles = {
  root: 'inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:bg-button-disabled disabled:text-text-secondary/50 disabled:shadow-none',
  iconWrapper: 'flex-shrink-0 inline-flex items-center justify-center',
} as const;
