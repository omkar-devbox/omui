import React, { useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  useInteractions,
  useHover,
  useFocus,
  useRole,
  useDismiss,
  FloatingPortal,
  FloatingArrow,
  type Placement,
  type Middleware,
} from "@floating-ui/react";
import { cn } from "../../../utils/cn";
import {
  tooltipBaseStyles,
  tooltipVariantStyles,
  tooltipArrowStyles,
} from "../style/style";
import type { TooltipVariant } from "../style/style";

/* ── Props ─────────────────────────────────────────────────── */

interface TooltipProps {
  children:   React.ReactNode;
  content:    React.ReactNode;
  placement?: Placement | "auto";
  offset?:    number;
  className?: string;
  variant?:   TooltipVariant;
  color?:     string;
  textColor?: string;
  showArrow?: boolean;
  delay?:     number | { open?: number; close?: number };
}

/**
 * Reusable Tooltip component inspired by Flowbite.
 * Features:
 * - Auto positioning (flip/shift)
 * - Arrow support
 * - Multiple themes (light/dark)
 * - Mobile friendly (dismiss on touch outside)
 * - Accessible (WAI-ARIA tooltip role)
 */
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement: placementProp = "top",
  offset:    offsetValue   = 8,
  className,
  variant,
  color,
  textColor,
  showArrow = true,
  delay:     delayProp = { open: 200, close: 0 },
}) => {
  const [isOpen, setIsOpen]               = useState(false);
  const [arrowElement, setArrowElement]   = useState<SVGSVGElement | null>(null);
  const base                              = tooltipBaseStyles;

  // Normalize placement
  const placement = (placementProp === "auto" ? "top" : placementProp) as Placement;
  const isAuto    = placementProp === "auto";

  // Normalize delay
  const delay = typeof delayProp === "number" ? { open: delayProp, close: 0 } : delayProp;

  const {
    refs: { setReference, setFloating },
    floatingStyles,
    context,
  } = useFloating({
    open:                 isOpen,
    onOpenChange:         setIsOpen,
    placement:            isAuto ? undefined : placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetValue),
      flip({ fallbackAxisSideDirection: "start", padding: 5 }),
      shift({ padding: 5 }),
      showArrow && arrow({ element: arrowElement }),
    ].filter(Boolean) as Middleware[],
  });

  const hover   = useHover(context, { move: false, delay });
  const focus   = useFocus(context);
  const dismiss = useDismiss(context);
  const role    = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  if (!content) return <>{children}</>;

  const currentVariant = (variant ?? "dark") as TooltipVariant;

  return (
    <>
      <div ref={setReference} {...getReferenceProps()} className={base.triggerWrapper}>
        {children}
      </div>
      <FloatingPortal>
        {isOpen && (
          <div
            ref={setFloating}
            style={{
              ...floatingStyles,
              opacity:            isOpen ? 1 : 0,
              transitionProperty: "opacity",
              transitionDuration: "150ms",
              ...(color     && { backgroundColor: color }),
              ...(textColor && { color: textColor }),
            }}
            {...getFloatingProps()}
            className={cn(
              base.panel,
              tooltipVariantStyles[currentVariant],
              className,
            )}
          >
            {content}
            {showArrow && (
              <FloatingArrow
                ref={setArrowElement}
                context={context}
                className={tooltipArrowStyles[currentVariant]}
                fill={color}
                width={10}
                height={5}
                strokeWidth={currentVariant === "light" ? 1 : 0}
              />
            )}
          </div>
        )}
      </FloatingPortal>
    </>
  );
};
