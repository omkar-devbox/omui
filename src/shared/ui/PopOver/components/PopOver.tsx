import React, { useState, useCallback } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
  type Placement,
} from "@floating-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../utils/cn";
import { popOverBaseStyles } from "../style/style";

/* ── Props ─────────────────────────────────────────────────── */

interface PopOverProps {
  children:        React.ReactNode;
  content:         React.ReactNode;
  isOpen?:         boolean;
  onOpenChange?:   (open: boolean) => void;
  placement?:      Placement;
  offset?:         number;
  className?:      string;
  showArrow?:      boolean;
  modal?:          boolean;
}

/**
 * A highly customizable PopOver component for interactive content.
 * Balanced for premium experience with smooth animations and accessibility.
 */
export const PopOver: React.FC<PopOverProps> = ({
  children,
  content,
  isOpen:        controlledIsOpen,
  onOpenChange:  controlledOnOpenChange,
  placement    = "bottom-start",
  offset:        offsetValue = 8,
  className,
  modal        = false,
}) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const base = popOverBaseStyles;

  const isOpen   = controlledIsOpen ?? uncontrolledIsOpen;
  const setIsOpen = controlledOnOpenChange ?? setUncontrolledIsOpen;

  const {
    refs: { setReference, setFloating },
    floatingStyles,
    context,
  } = useFloating({
    open:                  isOpen,
    onOpenChange:          setIsOpen,
    placement,
    whileElementsMounted:  autoUpdate,
    middleware: [
      offset(offsetValue),
      flip({ fallbackAxisSideDirection: "start", padding: 5 }),
      shift({ padding: 5 }),
    ],
    strategy: "fixed",
  });

  const click   = useClick(context);
  const dismiss = useDismiss(context);
  const role    = useRole(context, { role: "dialog" });

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const renderTrigger = useCallback(() => {
    if (!children) return null;

    if (React.isValidElement(children)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return React.cloneElement(children as React.ReactElement<any>, {
        ref: setReference,
        ...getReferenceProps(),
      });
    }

    return (
      <div ref={setReference} {...getReferenceProps()} className={base.triggerWrapper}>
        {children}
      </div>
    );
  }, [children, setReference, getReferenceProps, base.triggerWrapper]);

  return (
    <>
      {renderTrigger()}
      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <div ref={setFloating} style={floatingStyles} className={base.floatingWrapper}>
              <FloatingFocusManager context={context} modal={modal}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={cn(base.panel, className)}
                  {...getFloatingProps()}
                >
                  {content}
                </motion.div>
              </FloatingFocusManager>
            </div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
};
