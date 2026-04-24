/* ============================================================
 *  Skeleton — Reusable Style Sheet
 *  All class strings live here so Skeleton components stay logic-only.
 * ============================================================ */

export type SkeletonVariant = 'rect' | 'circle' | 'text';

/* ── Variant shape classes ─────────────────────────────────── */

export const skeletonVariantStyles: Record<SkeletonVariant, string> = {
  circle: 'rounded-full',
  text:   'rounded-md h-4',
  rect:   'rounded-lg',
};

/* ── Shared base classes ───────────────────────────────────── */

export const skeletonBaseStyles = {
  /** Always applied root classes */
  root:    'relative overflow-hidden bg-gray-200 dark:bg-gray-800',
  /** Shimmer overlay */
  shimmer: 'absolute inset-0 skeleton-shimmer pointer-events-none',
  /** Animated pulse */
  pulse:   'animate-pulse',
} as const;

/* ── Skeletons compound component styles ───────────────────── */

export const skeletonsStyles = {
  statCard:
    'bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4',
  statCardInner: 'flex justify-between items-start',
  statCardContent: 'space-y-2',
  listItem:
    'flex items-center gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0',
  listItemContent: 'flex-grow space-y-2',
  statsGrid: 'grid grid-cols-1 md:grid-cols-3 gap-6',
  contentWrapper: 'space-y-6',
  contentCard:
    'bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4',
  contentList: 'space-y-4',
  pageHeader: 'space-y-4 mb-8',
} as const;
