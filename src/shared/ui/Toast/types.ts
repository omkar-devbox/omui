export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

export interface ToastData extends Required<Omit<ToastOptions, 'duration'>> {
  id: string;
  duration?: number;
  visible: boolean;
}

export interface ToastStore {
  toasts: ToastData[];
  addToast: (options: ToastOptions) => string;
  dismissToast: (id: string) => void;
  removeToast: (id: string) => void;
}
