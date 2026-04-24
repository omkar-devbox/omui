import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ToastProvider } from '../shared/ui/Toast';
import { ThemeProvider } from '../shared/theme';

export const Providers = ({ children }: { children?: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="omui-theme">
      <RouterProvider router={router} />
      <ToastProvider />
      {children}
    </ThemeProvider>
  );
};
