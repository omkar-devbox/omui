import React from 'react';
import { Alert } from '../../../shared/ui/Alert';

export const AlertDemo: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 p-8 bg-white dark:bg-[#0b0f1a] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm mt-8 mx-auto max-w-4xl">
      <header className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Alert Component</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          A flexible inline alert component for various contextual messages.
        </p>
      </header>

      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Standard Alerts</h3>
        <Alert type="success" title="Order completed">
          Your order #1005 has been successfully created.
        </Alert>
        <Alert type="error" title="Payment failed">
          There was an issue processing your payment. Please try a different card.
        </Alert>
        <Alert type="warning" title="API Deprecation">
          The endpoint you are using will be deprecated in v2.0. Please migrate to the new endpoint.
        </Alert>
        <Alert type="info" title="New feature available">
          You can now filter your contacts by their location directly in the table view.
        </Alert>
      </section>

      <section className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Closable Alerts</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">These alerts can be dismissed by clicking the close button.</p>
        <Alert type="success" title="Success" closable>
          You have successfully saved your profile settings.
        </Alert>
        <Alert type="info" closable>
          This is a simple info alert without a title, but it can still be closed!
        </Alert>
      </section>
    </div>
  );
};
