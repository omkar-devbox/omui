import React from "react";
import { SidebarItem } from "./SidebarItem";
import type { SidebarSectionProps } from "../types";

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  section,
  collapsed,
  onExpand,
}) => {
  return (
    <div className="mb-4 md:mb-6">
      {!collapsed && (
        <h3 className="px-4 mb-2 text-[11px] font-bold text-text-secondary/50 tracking-wider">
          {section.label}
        </h3>
      )}
      <div className="space-y-1">
        {section.items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            onExpand={onExpand}
          />
        ))}
      </div>
      {collapsed && (
        <div className="mx-auto mt-4 mb-2 w-8 h-px bg-sidebar-border/50" />
      )}
    </div>
  );
};
