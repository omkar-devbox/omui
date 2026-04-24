import React, { useEffect } from 'react';
import { useToastStore } from '../store/useToastStore';
import { Toast } from './Toast';
import { toastProviderStyles } from '../style/style';

/* ── Component ─────────────────────────────────────────────── */

export const ToastProvider: React.FC = () => {
  const toasts       = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);
  const s            = toastProviderStyles;

  // Handle ESC globally to dismiss the most recently added active toast
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const activeToasts = useToastStore.getState().toasts.filter((t) => t.visible);
        if (activeToasts.length > 0) {
          dismissToast(activeToasts[activeToasts.length - 1].id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dismissToast]);

  return (
    <div aria-live="assertive" className={s.root}>
      <div className={s.stack}>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};
