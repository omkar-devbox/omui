import { useToastStore } from '../store/useToastStore';
import type { ToastOptions } from '../types';

const toast = {
  success: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
    useToastStore.getState().addToast({ message, type: 'success', ...options }),

  error: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
    useToastStore.getState().addToast({ message, type: 'error', ...options }),

  warning: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
    useToastStore.getState().addToast({ message, type: 'warning', ...options }),

  info: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
    useToastStore.getState().addToast({ message, type: 'info', ...options }),

  dismiss: (id: string) => useToastStore.getState().dismissToast(id),
};

export function useToast() {
  return toast;
}
