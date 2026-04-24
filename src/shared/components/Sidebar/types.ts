import type { LucideIcon } from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  path?: string;
  children?: MenuItem[];
}

export interface MenuSection {
  id: string;
  label: string;
  items: MenuItem[];
}

/**
 * Class to handle navigation logic for the Sidebar.
 * Encapsulates tree traversal and active state detection.
 */
export class SidebarNavigationModel {
  /**
   * Checks if any child of a menu item is currently active.
   */
  static isChildActive(children: MenuItem[], currentPath: string): boolean {
    return children.some((child) => {
      if (child.path === currentPath) return true;
      if (child.children)
        return this.isChildActive(child.children, currentPath);
      return false;
    });
  }

  /**
   * Determines if a menu item is active based on the current path.
   */
  static isActive(item: MenuItem, currentPath: string): boolean {
    if (item.path === currentPath) return true;
    if (item.children && item.children.length > 0) {
      return this.isChildActive(item.children, currentPath);
    }
    return false;
  }
}

export interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export interface SidebarHeaderProps {
  collapsed: boolean;
  isHeaderHovered: boolean;
  setIsHeaderHovered: (hovered: boolean) => void;
  onToggle: () => void;
  logo?: React.ReactNode;
  companyName?: string;
}

export interface SidebarFooterProps {
  collapsed: boolean;
  onLogout: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface SidebarMainProps extends SidebarProps {
  logo?: React.ReactNode;
  companyName?: string;
  user?: SidebarFooterProps["user"];
  isMobileOpen?: boolean;
  resizable?: boolean;
}

export interface SidebarSectionProps {
  section: MenuSection;
  collapsed: boolean;
  onExpand: () => void;
}

export interface SidebarItemProps {
  item: MenuItem;
  collapsed?: boolean;
  depth?: number;
  onExpand?: () => void;
}
