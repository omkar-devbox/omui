import React from "react";
import { SidebarHeader, SidebarFooter, SidebarNav } from "./components";
import { SIDEBAR_MENU } from "../../constants/menuItems";
import { useAuthStore } from "../../../features/auth/store/authStore";
import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import type { SidebarMainProps } from "./types";

export const Sidebar: React.FC<SidebarMainProps> = ({
  collapsed,
  setCollapsed,
  logo,
  companyName,
  user,
  isMobileOpen,
  resizable = false,
}) => {
  const [isHeaderHovered, setIsHeaderHovered] = React.useState(false);
  const [sidebarWidth, setSidebarWidth] = React.useState(256);
  const [isResizing, setIsResizing] = React.useState(false);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const startResizing = React.useCallback(
    (mouseDownEvent: React.MouseEvent) => {
      mouseDownEvent.preventDefault();
      setIsResizing(true);
    },
    [],
  );

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = React.useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing && resizable) {
        let newWidth = mouseMoveEvent.clientX;
        // Limit constraints
        if (newWidth < 200) newWidth = 200;
        if (newWidth > 480) newWidth = 480;
        setSidebarWidth(newWidth);
      }
    },
    [isResizing, resizable],
  );

  React.useEffect(() => {
    if (!resizable) return;

    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing, resizable]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setCollapsed(false)}
        />
      )}

      <aside
        className={cn(
          "h-screen bg-sidebar-bg border-r border-sidebar-border flex flex-col shrink-0 overflow-visible",
          !isResizing && "transition-all duration-300 ease-in-out",
          // Desktop: Use sticky positioning to fix it to the viewport while staying in the flow
          "md:sticky md:top-0 md:z-30 md:translate-x-0",
          collapsed ? "md:w-[72px]" : resizable ? "" : "md:w-64",
          // Mobile: Fixed drawer
          "fixed left-0 top-0 z-50 w-72 md:w-auto",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
        style={{
          width:
            resizable && !collapsed && !isMobileOpen
              ? `${sidebarWidth}px`
              : undefined,
        }}
      >
        <SidebarHeader
          collapsed={collapsed}
          isHeaderHovered={isHeaderHovered}
          setIsHeaderHovered={setIsHeaderHovered}
          onToggle={() => setCollapsed(!collapsed)}
          logo={logo}
          companyName={companyName}
        />

        <SidebarNav
          menu={SIDEBAR_MENU}
          collapsed={collapsed}
          onExpand={() => setCollapsed(false)}
        />

        <SidebarFooter
          collapsed={collapsed}
          onLogout={handleLogout}
          user={user}
        />

        {/* Resize Handle */}
        {resizable && !collapsed && (
          <div
            onMouseDown={startResizing}
            className={cn(
              "absolute right-[-4px] top-0 bottom-0 w-2 cursor-col-resize z-50 group hidden md:block",
              isResizing
                ? "bg-primary/10"
                : "hover:bg-primary/10 transition-colors",
            )}
          >
            <div
              className={cn(
                "absolute right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-8 rounded-full bg-neutral-border transition-colors",
                isResizing ? "bg-primary" : "group-hover:bg-primary-hover",
              )}
            />
          </div>
        )}
      </aside>
    </>
  );
};
