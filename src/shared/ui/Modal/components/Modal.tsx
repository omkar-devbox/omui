import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { ModalProps } from '../types';
import { cn } from '../../../utils/cn';
import { useShortcut } from '../../../settings/useShortcut';
import { modalBaseStyles, modalSizeStyles } from '../style/style';

/* ── Component ─────────────────────────────────────────────── */

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  size            = 'md',
  closeOnOverlay  = true,
  closeOnEsc      = true,
  children,
  className,
  overlayClassName,
}) => {
  const modalRef      = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const base          = modalBaseStyles;

  // Handle configurable close action
  useShortcut({
    action:    'closeForm',
    onTrigger: onClose,
    enabled:   open && closeOnEsc,
  });

  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      previousFocus.current?.focus();
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Focus trap logic
  useEffect(() => {
    if (!open) return;
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement  = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) { e.preventDefault(); lastElement?.focus(); }
      } else {
        if (document.activeElement === lastElement) { e.preventDefault(); firstElement?.focus(); }
      }
    };

    modalElement.addEventListener('keydown', handleTabTrap);
    if (firstElement) firstElement.focus(); else modalElement.focus();
    return () => modalElement.removeEventListener('keydown', handleTabTrap);
  }, [open]);

  const modalContent = (
    <AnimatePresence>
      {open && (
        <div
          className={base.positionLayer}
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(base.backdrop, overlayClassName)}
            onClick={closeOnOverlay ? onClose : undefined}
          />

          {/* Modal Panel */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, duration: 0.3 }}
            tabIndex={-1}
            className={cn(base.panel, modalSizeStyles[size], className)}
          >
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const childType  = child.type as any;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const childProps = child.props as any;
                if (childType.name === 'ModalHeader' && !childProps.onClose) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  return React.cloneElement(child, { onClose } as any);
                }
              }
              return child;
            })}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
