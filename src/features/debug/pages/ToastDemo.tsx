import React from 'react';
import { useToast } from '../../../shared/ui/Toast';

export const ToastDemo: React.FC = () => {
  const toast = useToast();

  return (
    <div className="flex flex-col gap-4 p-8 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mt-8 mx-auto max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Toast Notifications</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Click the buttons below to test the global toast notification system.</p>
      
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => toast.success("Resource saved successfully.")}
          className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors shadow-sm font-medium"
        >
          Success Toast
        </button>

        <button
          onClick={() => toast.error("Failed to save resource. Please try again.")}
          className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors shadow-sm font-medium"
        >
          Error Toast
        </button>

        <button
          onClick={() => toast.warning("Your session is about to expire.", { duration: 6000 })}
          className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors shadow-sm font-medium"
        >
          Warning Toast
        </button>

        <button
          onClick={() => toast.info("A new software update is available.")}
          className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors shadow-sm font-medium"
        >
          Info Toast
        </button>
        
        <button
          onClick={() => {
            toast.success("Toast 1");
            setTimeout(() => toast.info("Toast 2"), 300);
            setTimeout(() => toast.warning("Toast 3"), 600);
            setTimeout(() => toast.error("Toast 4 - Forces oldest to exit"), 900);
          }}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors shadow-sm font-medium"
        >
          Queue Multiple (Test Limit)
        </button>
      </div>
    </div>
  );
};
