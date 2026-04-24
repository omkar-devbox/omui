/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import { Loading } from "../shared/ui";

// Lazy load layouts
const MainLayout = lazy(() => import("../layouts/MainLayout").then(m => ({ default: m.MainLayout })));
const AuthLayout = lazy(() => import("../layouts/AuthLayout").then(m => ({ default: m.AuthLayout })));

// Lazy load feature components
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage").then(m => ({ default: m.LoginPage })));
const ThemeConfigurationPage = lazy(() => import("../features/settings/pages/ThemeConfigurationPage").then(m => ({ default: m.ThemeConfigurationPage })));
const InteractionConfigurationPage = lazy(() => import("../features/settings/pages/InteractionConfigurationPage").then(m => ({ default: m.InteractionConfigurationPage })));
const BadgeDemo = lazy(() => import("../features/debug/pages/BadgeDemo"));
const SkeletonDemo = lazy(() => import("../features/debug/pages/SkeletonDemo"));
const ButtonDemo = lazy(() => import("../features/debug/pages/ButtonDemo"));
const ToastDemo = lazy(() => import("../features/debug/pages/ToastDemo").then(m => ({ default: m.ToastDemo })));
const AlertDemo = lazy(() => import("../features/debug/pages/AlertDemo").then(m => ({ default: m.AlertDemo })));
const FormFieldDemo = lazy(() => import("../features/debug/pages/FormFieldDemo").then(m => ({ default: m.FormFieldDemo })));
const ModalDemo = lazy(() => import("../features/debug/pages/ModalDemo").then(m => ({ default: m.ModalDemo })));
const DataTableDemo = lazy(() => import("../features/debug/pages/DataTableDemo"));
const Dashboard = lazy(() => import("../features/dashboard/pages/Dashboard").then(m => ({ default: m.Dashboard })));

// Helper to wrap components in Suspense
const withLoading = (Component: React.ReactNode) => (
  <Suspense fallback={<Loading />}>
    {Component}
  </Suspense>
);

const DummyPage = ({ title }: { title: string }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <header>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
        {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-1">
        This is a placeholder for the {title.toLowerCase()} view.
      </p>
    </header>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-[#0b0f1a] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md h-40 flex items-center justify-center"
        >
          <div className="text-gray-300 dark:text-gray-700 font-medium text-lg italic">
            Component {i}
          </div>
        </div>
      ))}
    </div>

    <div className="bg-white dark:bg-[#0b0f1a] p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md h-96 flex items-center justify-center">
       <div className="text-center">
         <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
           <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-800/40 rounded-full animate-pulse" />
         </div>
         <p className="text-gray-400 dark:text-gray-600 font-medium">Main data table or chart will go here...</p>
       </div>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: withLoading(<MainLayout />),
        children: [
          { path: "/", element: withLoading(<Dashboard />) },
          {
            path: "sales",
            children: [
              { path: "overview", element: <DummyPage title="Sales Overview" /> },
              { path: "analytics", element: <DummyPage title="Sales Analytics" /> },
              {
                path: "reports",
                children: [
                  { path: "daily", element: <DummyPage title="Daily Sales Report" /> },
                  { path: "monthly", element: <DummyPage title="Monthly Sales Report" /> },
                ],
              },
            ],
          },
          { path: "customers", element: <DummyPage title="Customers" /> },
          {
            path: "orders",
            children: [
              { path: "active", element: <DummyPage title="Active Orders" /> },
              { path: "completed", element: <DummyPage title="Completed Orders" /> },
            ],
          },
          { path: "reports", element: <DummyPage title="Reports" /> },
          { path: "messages", element: <DummyPage title="Messages" /> },
          { path: "team", element: <DummyPage title="Team" /> },
          { path: "access-control", element: <DummyPage title="Access Control" /> },
          {
            path: "settings",
            children: [
              { path: "", element: <DummyPage title="Settings" /> },
              { path: "theme", element: withLoading(<ThemeConfigurationPage />) },
              { path: "interaction", element: withLoading(<InteractionConfigurationPage />) },
            ],
          },
          { path: "debug/badges", element: withLoading(<BadgeDemo />) },
          { path: "debug/skeletons", element: withLoading(<SkeletonDemo />) },
          { path: "debug/buttons", element: withLoading(<ButtonDemo />) },
          { path: "debug/toasts", element: withLoading(<ToastDemo />) },
          { path: "debug/alerts", element: withLoading(<AlertDemo />) },
          { path: "debug/forms", element: withLoading(<FormFieldDemo />) },
          { path: "debug/modals", element: withLoading(<ModalDemo />) },
          { path: "debug/data-table", element: withLoading(<DataTableDemo />) },
        ],
      },
    ],
  },
  {
    element: withLoading(<AuthLayout />),
    children: [
      { path: "/login", element: withLoading(<LoginPage />) },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
