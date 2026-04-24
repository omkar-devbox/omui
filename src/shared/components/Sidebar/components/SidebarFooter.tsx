import React from "react";
import { LogOut, User as UserIcon } from "lucide-react";
import { cn } from "../../../utils/cn";
import type { SidebarFooterProps } from "../types";

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  collapsed,
  onLogout,
  user,
}) => {
  return (
    <div className="p-3 border-t border-sidebar-border space-y-1">
      {user && (
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-xl transition-colors mb-2",
            collapsed
              ? "justify-center"
              : "hover:bg-neutral-bg",
          )}
        >
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 overflow-hidden border border-primary/20">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon size={18} />
            )}
          </div>
          {!collapsed && (
            <div className="flex-grow min-w-0">
              <p className="text-[14px] font-semibold text-text-primary truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-text-secondary truncate">
                {user.email}
              </p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onLogout}
        className={cn(
          "flex items-center gap-3 w-full py-2.5 rounded-xl text-text-secondary hover:bg-error/10 hover:text-error transition-all duration-200",
          collapsed ? "justify-center px-0" : "px-3",
        )}
      >
        <LogOut size={20} className={cn(collapsed ? "" : "ml-0.5")} />
        {!collapsed && <span className="text-[14px] font-medium">Logout</span>}
      </button>
    </div>
  );
};
