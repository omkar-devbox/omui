/* ============================================================
 *  FormField — Reusable Style Sheet
 *  All class strings live here so FormField.tsx stays logic-only.
 * ============================================================ */

/* ── Shared base classes ───────────────────────────────────── */

export const formFieldBaseStyles = {
  /** Outer wrapper */
  wrapper:    'flex flex-col gap-1.5 group',
  wrapperFull: 'w-full',
  wrapperAuto: 'w-auto',

  /** Top label (non-checkbox) */
  label:
    'text-sm font-semibold tracking-tight text-label-default transition-colors duration-200 group-focus-within:text-label-focus',
  labelDisabled: 'text-label-disabled opacity-50',

  /** Inline label (checkbox / radio) */
  inlineLabel:
    'text-sm font-medium text-label-default cursor-pointer transition-colors duration-200 group-focus-within:text-label-focus',
  inlineLabelDisabled: 'cursor-not-allowed text-label-disabled opacity-50',

  /** Required asterisk */
  requiredMark: 'ml-1 text-error',

  /** Helper / error text */
  helperText: 'text-xs font-medium mt-1 text-text-secondary',
  errorText:  'text-xs font-medium mt-1 text-error',

  /** Shared text / textarea / input styles */
  input:
    'block w-full rounded-xl border border-input-border-default bg-input-bg px-4 py-2 text-sm transition-all duration-200 min-h-[44px] text-input-text placeholder:text-text-secondary/50 focus:border-input-border-focus focus:outline-none focus:ring-4 focus:ring-primary/10',
  inputDisabled:
    'cursor-not-allowed bg-input-bg-disabled text-text-secondary/50 opacity-60',
  inputError:
    'border-error focus:border-error focus:ring-error/10',
  inputPII: 'pr-10',

  /** Checkbox / radio input */
  checkboxInput:
    'h-4 w-4 rounded border-input-border-default text-primary transition-all focus:ring-4 focus:ring-primary/10 bg-input-bg',
  checkboxInputError: 'border-error text-error focus:ring-error/10',

  radioInput:
    'h-4 w-4 border-input-border-default text-primary transition-all focus:ring-4 focus:ring-primary/10 cursor-pointer bg-input-bg',
  radioInputError: 'border-error focus:ring-error/10',

  /** Checkbox / radio row */
  toggleRow: 'flex items-center gap-3 group',
  radioGroup: 'flex flex-col gap-2',

  /** PII wrapper */
  piiWrapper: 'relative w-full group',
  piiToggleButton:
    'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all',
  piiToggleButtonDisabled: 'cursor-not-allowed opacity-50',
  piiIcon: 'h-4 w-4',
} as const;
