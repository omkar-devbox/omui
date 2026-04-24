import { create } from 'zustand';
import type { ToastOptions, ToastStore, ToastData } from '../types';

const MAX_TOASTS = 3;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastData = {
      id,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration !== undefined ? options.duration : 4000,
      visible: true,
    };

    set((state) => {
      const activeToasts = state.toasts.filter((t) => t.visible);
      let updatedToasts = [...state.toasts, newToast];

      // If we exceed MAX_TOASTS, dismiss the oldest active toast
      if (activeToasts.length >= MAX_TOASTS) {
        // We might need to dismiss more than one if we somehow have too many
        const toDismissCount = activeToasts.length - MAX_TOASTS + 1;
        const toDismissIds = new Set(
          activeToasts.slice(0, toDismissCount).map((t) => t.id)
        );

        updatedToasts = updatedToasts.map((t) =>
          toDismissIds.has(t.id) ? { ...t, visible: false } : t
        );
      }

      return { toasts: updatedToasts };
    });

    return id;
  },

  dismissToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.map((toast) =>
        toast.id === id ? { ...toast, visible: false } : toast
      ),
    }));
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
