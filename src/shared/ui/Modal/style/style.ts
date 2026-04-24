/* ============================================================
 *  Modal — Reusable Style Sheet
 *  All class strings live here so Modal components stay logic-only.
 * ============================================================ */

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalFooterAlign = 'left' | 'center' | 'right';

/* ── Size variants ─────────────────────────────────────────── */

export const modalSizeStyles: Record<ModalSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-[95vw] h-[95vh]',
};

/* ── Footer alignment ──────────────────────────────────────── */

export const modalFooterAlignStyles: Record<ModalFooterAlign, string> = {
  left:   'justify-start',
  center: 'justify-center',
  right:  'justify-end',
};

/* ── Shared base classes ───────────────────────────────────── */

export const modalBaseStyles = {
  /** Outer fixed positioning layer */
  positionLayer:
    'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6',
  /** Backdrop overlay */
  backdrop:
    'absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]',
  /** Modal panel */
  panel:
    'relative w-full bg-card-bg rounded-2xl shadow-2xl overflow-hidden flex flex-col focus:outline-none',
} as const;

/* ── ModalHeader ───────────────────────────────────────────── */

export const modalHeaderStyles = {
  root:        'px-6 py-4 flex items-start justify-between border-b border-gray-100',
  innerRow:    'flex gap-3',
  iconWrapper: 'flex-shrink-0 mt-0.5 text-gray-500',
  contentCol:  'flex flex-col gap-0.5',
  title:       'text-lg font-semibold text-gray-900 leading-tight',
  description: 'text-sm text-gray-500 leading-relaxed font-normal',
  closeButton:
    'p-1 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200',
  closeIcon: 'h-5 w-5',
} as const;

/* ── ModalBody ─────────────────────────────────────────────── */

export const modalBodyStyles = {
  root:     'px-6 py-4 text-gray-700',
  scrollable: 'max-h-[70vh] overflow-y-auto custom-scrollbar',
} as const;

/* ── ModalFooter ───────────────────────────────────────────── */

export const modalFooterStyles = {
  root: 'px-6 py-4 flex items-center gap-3 border-t border-gray-100',
} as const;
