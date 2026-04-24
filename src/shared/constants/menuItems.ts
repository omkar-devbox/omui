import {
  LayoutGrid,
  CircleDollarSign,
  User,
  ShoppingCart,
  FileText,
  MessageCircle,
  Users,
  UserRoundCog,
  Settings,
  Palette,
  MousePointer2,
  TestTube,
  Table,
} from "lucide-react";

import type { MenuSection } from "../components/Sidebar/types";

export const SIDEBAR_MENU: MenuSection[] = [
  {
    id: "dashboard-section",
    label: "DASHBOARD",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutGrid,
        path: "/",
      },
      {
        id: "sales",
        label: "Sales",
        icon: CircleDollarSign,
        children: [
          {
            id: "sales-reports",
            label: "Reports",
            children: [
              {
                id: "sales-daily",
                label: "Daily Sales",
                path: "/sales/reports/daily",
              },
              {
                id: "sales-monthly",
                label: "Monthly Sales",
                path: "/sales/reports/monthly",
              },
            ],
          },
          {
            id: "sales-analytics",
            label: "Analytics",
            path: "/sales/analytics",
          },
        ],
      },
      {
        id: "customers",
        label: "Customers",
        icon: User,
        path: "/customers",
      },
      {
        id: "orders",
        label: "Orders",
        icon: ShoppingCart,
        children: [
          {
            id: "orders-active",
            label: "Active Orders",
            path: "/orders/active",
          },
          {
            id: "orders-completed",
            label: "Completed",
            path: "/orders/completed",
          },
        ],
      },
      {
        id: "reports",
        label: "Reports",
        icon: FileText,
        path: "/reports",
      },
    ],
  },
  {
    id: "communication-section",
    label: "COMMUNICATION",
    items: [
      {
        id: "messages",
        label: "Messages",
        icon: MessageCircle,
        path: "/messages",
      },
      {
        id: "team",
        label: "Team",
        icon: Users,
        path: "/team",
      },
    ],
  },
  {
    id: "settings-section",
    label: "SETTINGS",
    items: [
      {
        id: "access-control",
        label: "Access control",
        icon: UserRoundCog,
        path: "/access-control",
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        children: [
          {
            id: "settings-theme",
            label: "Theme",
            icon: Palette,
            path: "/settings/theme",
          },
          {
            id: "settings-interaction",
            label: "Interactions",
            icon: MousePointer2,
            path: "/settings/interaction",
          },
        ],
      },
    ],
  },
  {
    id: "debug-section",
    label: "DEBUG",
    items: [
      {
        id: "badge-demo",
        label: "Badge Demo",
        icon: TestTube,
        path: "/debug/badges",
      },
      {
        id: "skeleton-demo",
        label: "Skeleton Demo",
        icon: TestTube,
        path: "/debug/skeletons",
      },
      {
        id: "button-demo",
        label: "Button Demo",
        icon: TestTube,
        path: "/debug/buttons",
      },
      {
        id: "toast-demo",
        label: "Toast Demo",
        icon: TestTube,
        path: "/debug/toasts",
      },
      {
        id: "alert-demo",
        label: "Alert Demo",
        icon: TestTube,
        path: "/debug/alerts",
      },
      {
        id: "form-demo",
        label: "Form Demo",
        icon: TestTube,
        path: "/debug/forms",
      },
      {
        id: "modal-demo",
        label: "Modal Demo",
        icon: TestTube,
        path: "/debug/modals",
      },
      {
        id: "data-table-demo",
        label: "Data Table Demo",
        icon: Table,
        path: "/debug/data-table",
      },
    ],
  },
];
