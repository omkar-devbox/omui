import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Tooltip } from "../../../ui";
import { cn } from "../../../utils/cn";
import { SidebarNavigationModel } from "../types";
import type { SidebarItemProps } from "../types";

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  collapsed = false,
  depth = 0,
  onExpand,
}) => {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;

  const isActive = SidebarNavigationModel.isActive(item, location.pathname);
  const [isOpen, setIsOpen] = useState(isActive);
  const [prevIsActive, setPrevIsActive] = useState(isActive);

  // Sync state with isActive when it changes (e.g. on navigation)
  if (isActive !== prevIsActive) {
    setPrevIsActive(isActive);
    if (isActive && hasChildren) {
      setIsOpen(true);
    }
  }

  if (collapsed) {
    return (
      <div className="w-full flex justify-center">
        <Tooltip content={item.label} placement="right" offset={20}>
          <NavLink
            to={item.path || "#"}
            className={cn(
              "flex items-center justify-center h-11 w-11 rounded-lg transition-all duration-200 mb-1 relative overflow-hidden",
              isActive
                ? "bg-sidebar-item-active-bg text-sidebar-item-active-text shadow-[0_4px_12px_rgba(var(--color-brand-primary),0.15)] border border-primary/20 scale-105"
                : "text-sidebar-text hover:bg-neutral-bg hover:text-text-primary hover:scale-105 hover:shadow-sm",
            )}
            onClick={(e) => {
              if (hasChildren && onExpand) {
                e.preventDefault();
                onExpand();
              } else if (hasChildren) {
                e.preventDefault();
              }
            }}
          >
            {item.icon && (
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            )}
            {!item.icon && (
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  isActive ? "bg-primary" : "bg-neutral-border",
                )}
              />
            )}
          </NavLink>
        </Tooltip>
      </div>
    );
  }

  // Using hardcoded classes because Tailwind doesn't support dynamic JIT strings well
  const getPaddingClass = (d: number) => {
    switch (d) {
      case 0:
        return "px-4";
      case 1:
        return "pl-11 pr-4";
      case 2:
        return "pl-14 pr-4";
      case 3:
        return "pl-[68px] pr-4";
      default:
        return "pl-20 pr-4";
    }
  };

  const content = (
    <div
      onClick={() => hasChildren && setIsOpen(!isOpen)}
      className={cn(
        "flex items-center gap-3 py-2.5 my-0.5 rounded-xl transition-all duration-200 group cursor-pointer relative",
        isActive && (!hasChildren || depth > 0)
          ? "bg-sidebar-item-active-bg text-sidebar-item-active-text font-semibold shadow-[0_4px_12px_rgba(var(--color-brand-primary),0.05)] border border-primary/10 pl-3.5"
          : isActive && hasChildren
            ? "text-text-primary font-semibold"
            : "text-sidebar-text hover:bg-sidebar-hover hover:text-text-primary hover:translate-x-1",
        getPaddingClass(depth),
      )}
    >
      {item.icon && (
        <item.icon
          size={20}
          className={cn(
            "flex-shrink-0 transition-colors",
            isActive
              ? "text-sidebar-item-active-text"
              : "text-sidebar-text/60 group-hover:text-text-primary",
          )}
          strokeWidth={isActive ? 2.5 : 2}
        />
      )}

      {!item.icon && (
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full transition-colors flex-shrink-0",
            isActive ? "bg-sidebar-item-active-text" : "bg-sidebar-border group-hover:bg-text-secondary/50",
          )}
        />
      )}

      <span
        className={cn(
          "flex-grow whitespace-nowrap overflow-hidden text-ellipsis transition-all",
          depth === 0 ? "text-[14.5px]" : "text-[13.5px]",
        )}
      >
        {item.label}
      </span>

      {hasChildren && (
        <div
          className={cn(
            "transition-transform duration-200 text-text-secondary/50",
            isOpen && "rotate-180",
          )}
        >
          <ChevronDown size={14} />
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {item.path ? (
        <NavLink to={item.path} className="block">
          {content}
        </NavLink>
      ) : (
        content
      )}

      {hasChildren && isOpen && (
        <div className="flex flex-col relative">
          {/* Vertical line for submenus - slightly adjusted left based on depth */}
          <div
            className={cn(
              "absolute top-0 bottom-2 w-[1px] bg-sidebar-border",
              depth === 0
                ? "left-[26px]"
                : depth === 1
                  ? "left-[50px]"
                  : "left-[62px]",
            )}
          />
          {item.children!.map((child) => (
            <SidebarItem key={child.id} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
