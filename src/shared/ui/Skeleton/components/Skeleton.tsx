import React from 'react';
import { cn } from '../../../utils/cn';
import { skeletonBaseStyles, skeletonVariantStyles } from '../style/style';
import type { SkeletonVariant } from '../style/style';

/* ── Props ─────────────────────────────────────────────────── */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:  SkeletonVariant;
  width?:    string | number;
  height?:   string | number;
  animated?: boolean;
}

/* ── Component ─────────────────────────────────────────────── */

export const Skeleton: React.FC<SkeletonProps> = ({
  variant  = 'rect',
  width,
  height,
  animated = true,
  className,
  style,
  ...props
}) => {
  const base     = skeletonBaseStyles;
  const isCircle = variant === 'circle';
  const isText   = variant === 'text';

  return (
    <div
      className={cn(
        base.root,
        skeletonVariantStyles[variant],
        animated && base.pulse,
        className,
      )}
      style={{
        width:  width  ?? (isCircle ? 40 : '100%'),
        height: height ?? (isCircle ? 40 : isText ? undefined : 20),
        ...style,
      }}
      {...props}
    >
      {animated && <div className={base.shimmer} />}
    </div>
  );
};
