import { Skeleton } from "./Skeleton";
import { skeletonsStyles } from "../style/style";

const s = skeletonsStyles;

/* ────────────────────────────────────────────────────────────
 *  PageHeaderSkeleton
 *  Skeleton for a page header with breadcrumbs and title
 * ──────────────────────────────────────────────────────────── */
export const PageHeaderSkeleton = () => (
  <div className={s.pageHeader}>
    <Skeleton variant="text" width={150} height={16} />
    <Skeleton variant="rect" width={300} height={32} />
  </div>
);

/* ────────────────────────────────────────────────────────────
 *  StatCardSkeleton
 *  Skeleton for a dashboard stat card
 * ──────────────────────────────────────────────────────────── */
const StatCardSkeleton = () => (
  <div className={s.statCard}>
    <div className={s.statCardInner}>
      <Skeleton variant="circle" width={48} height={48} />
      <Skeleton variant="rect"   width={60} height={24} />
    </div>
    <div className={s.statCardContent}>
      <Skeleton variant="text" width="60%" height={16} />
      <Skeleton variant="text" width="40%" height={28} />
    </div>
  </div>
);

/* ────────────────────────────────────────────────────────────
 *  ListItemSkeleton
 *  Skeleton for a table row or list item
 * ──────────────────────────────────────────────────────────── */
export const ListItemSkeleton = () => (
  <div className={s.listItem}>
    <Skeleton variant="circle" width={40} height={40} />
    <div className={s.listItemContent}>
      <Skeleton variant="text" width="30%" height={16} />
      <Skeleton variant="text" width="20%" height={12} />
    </div>
    <Skeleton variant="rect" width={80} height={32} />
  </div>
);

/* ────────────────────────────────────────────────────────────
 *  StatsGridSkeleton
 *  Grid of Stat Cards
 * ──────────────────────────────────────────────────────────── */
export const StatsGridSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className={s.statsGrid}>
    {Array.from({ length: count }).map((_, i) => (
      <StatCardSkeleton key={i} />
    ))}
  </div>
);

/* ────────────────────────────────────────────────────────────
 *  ContentSkeleton
 *  Full page content skeleton
 * ──────────────────────────────────────────────────────────── */
export const ContentSkeleton = () => (
  <div className={s.contentWrapper}>
    <PageHeaderSkeleton />
    <StatsGridSkeleton />
    <div className={s.contentCard}>
      <Skeleton variant="text" width={200} height={20} className="mb-6" />
      <div className={s.contentList}>
        {Array.from({ length: 5 }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);
