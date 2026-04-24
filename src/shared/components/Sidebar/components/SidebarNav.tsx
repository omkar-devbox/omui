import React from "react";
import { SidebarSection } from "./SidebarSection";
import type { MenuSection } from "../types";

interface SidebarNavProps {
  menu: MenuSection[];
  collapsed: boolean;
  onExpand: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  menu,
  collapsed,
  onExpand,
}) => {
  return (
    <div className="flex-grow overflow-y-auto px-3 scrollbar-hide">
      {menu.map((section) => (
        <SidebarSection
          key={section.id}
          section={section}
          collapsed={collapsed}
          onExpand={onExpand}
        />
      ))}
    </div>
  );
};
