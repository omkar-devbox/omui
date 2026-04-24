import React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Tooltip } from "../../../ui";
import { cn } from "../../../utils/cn";
import type { SidebarHeaderProps } from "../types";

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  collapsed,
  isHeaderHovered,
  setIsHeaderHovered,
  onToggle,
  logo,
  companyName = "Company",
}) => {
  return (
    <div
      className="h-20 flex items-center px-4 mb-2 cursor-pointer relative"
      onMouseEnter={() => setIsHeaderHovered(true)}
      onMouseLeave={() => setIsHeaderHovered(false)}
    >
      <div
        className={cn(
          "flex items-center w-full",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {/* Logo & Name Area */}
        <div
          className={cn(
            "flex items-center gap-3 transition-opacity duration-200 min-w-0 flex-1",
            collapsed && isHeaderHovered
              ? "opacity-0 invisible"
              : "opacity-100 visible",
          )}
        >
          {logo ? (
            logo
          ) : (
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-primary/20">
              <span className="text-white font-bold text-xl">
                {companyName.charAt(0)}
              </span>
            </div>
          )}
          <span
            className={cn(
              "font-bold text-[16px] text-text-primary leading-[1.1] transition-all duration-300",
              collapsed ? "w-0 opacity-0 invisible" : "opacity-100 visible",
            )}
          >
            {companyName}
          </span>
        </div>

        {/* Toggle Button Area */}
        <div
          className={cn(
            "transition-all duration-200 shrink-0",
            collapsed
              ? isHeaderHovered
                ? "opacity-100 visible absolute inset-0 flex items-center justify-center scale-100 bg-neutral-surface/80 backdrop-blur-sm"
                : "opacity-0 invisible absolute inset-0 flex items-center justify-center scale-75"
              : "opacity-100 visible static scale-100 ml-2",
          )}
        >
          <Tooltip
            content={collapsed ? "Show sidebar" : "Hide sidebar"}
            placement="right"
            offset={collapsed ? 20 : 8}
          >
            <button
              onClick={onToggle}
              className="p-2 rounded-lg bg-sidebar-bg text-sidebar-text hover:text-primary transition-colors shadow-sm border border-sidebar-border"
            >
              {collapsed ? (
                <PanelLeftOpen size={20} />
              ) : (
                <PanelLeftClose size={20} />
              )}
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
