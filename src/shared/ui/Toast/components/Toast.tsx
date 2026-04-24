import React, { useEffect, useState, useRef } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../../utils/cn';
import type { ToastData } from '../types';
import { useToastStore } from '../store/useToastStore';
import { toastBaseStyles, toastVariantStyles } from '../style/style';
import type { ToastType } from '../style/style';

/* ── Icon map ──────────────────────────────────────────────── */

const toastIcons: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error:   AlertCircle,
  warning: AlertTriangle,
  info:    Info,
};

/* ── Props ─────────────────────────────────────────────────── */

interface ToastProps {
  toast: ToastData;
}

/* ── Component ─────────────────────────────────────────────── */

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  const dismissToast = useToastStore((state) => state.dismissToast);
  const removeToast  = useToastStore((state) => state.removeToast);
  const { id, message, type, duration = 4000, visible } = toast;

  const [isPaused, setIsPaused]               = useState(false);
  const timerRef                              = useRef<number | null>(null);
  const remainingTimeRef                      = useRef(duration);
  const lastStartTimeRef                      = useRef<number>(0);

  const base    = toastBaseStyles;
  const variant = toastVariantStyles[type] ?? toastVariantStyles.info;
  const Icon    = toastIcons[type as ToastType] ?? Info;

  const startTimer = React.useCallback(() => {
    if (remainingTimeRef.current <= 0) return;
    lastStartTimeRef.current = Date.now();
    timerRef.current = window.setTimeout(() => {
      dismissToast(id);
    }, remainingTimeRef.current);
  }, [dismissToast, id]);

  const pauseTimer = React.useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
      remainingTimeRef.current -= Date.now() - lastStartTimeRef.current;
    }
  }, []);

  useEffect(() => {
    if (visible && !isPaused && duration !== Infinity) startTimer();
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, [visible, isPaused, duration, startTimer]);

  useEffect(() => {
    if (isPaused) pauseTimer();
  }, [isPaused, pauseTimer]);

  const handleAnimationEnd = () => { if (!visible) removeToast(id); };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onAnimationEnd={handleAnimationEnd}
      role="status"
      aria-live="polite"
      className={cn(
        base.card,
        variant.borderColor,
        visible ? base.enter : base.leave,
      )}
    >
      <div className={base.inner}>
        <div className={base.iconWrapper}>
          <Icon className={cn(base.icon, variant.iconColor)} aria-hidden="true" />
        </div>
        <div className={base.textWrapper}>
          <p className={base.message}>{message}</p>
        </div>
        <div className={base.closeWrapper}>
          <button
            type="button"
            className={base.closeButton}
            onClick={() => dismissToast(id)}
          >
            <span className="sr-only">Close</span>
            <X className={base.closeIcon} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
