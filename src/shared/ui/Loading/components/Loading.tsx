import React from "react";
import { cn } from "../../../utils/cn";
import { ContentSkeleton } from "../../Skeleton";
import { loadingBaseStyles } from "../style/style";

/* ── Props ─────────────────────────────────────────────────── */

interface LoadingProps {
  fullScreen?: boolean;
  text?:       string;
  className?:  string;
  variant?:    "spinner" | "skeleton";
}

/* ── Component ─────────────────────────────────────────────── */

export const Loading: React.FC<LoadingProps> = ({
  fullScreen = true,
  text       = "Loading...",
  className,
  variant    = "spinner",
}) => {
  const base = loadingBaseStyles;

  if (variant === "skeleton") {
    return (
      <div className={cn(base.skeletonWrapper, className)}>
        <ContentSkeleton />
      </div>
    );
  }

  return (
    <div
      className={cn(
        base.wrapper,
        fullScreen ? base.fullScreen : base.inline,
        className,
      )}
    >
      <div className={base.spinnerContainer}>
        {/* Outer pulsating ring */}
        <div className={base.pingRing} />

        {/* Middle spinning gradient ring */}
        <div className={base.spinRing} />

        {/* Inner dot */}
        <div className={base.innerDot} />
      </div>

      {text && <span className={base.label}>{text}</span>}
    </div>
  );
};
