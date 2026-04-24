import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "../shared/components/Sidebar";
import { ThemeToggle } from "../shared/components/ThemeToggle";
import { GlobalShortcutHandler } from "../shared/settings/GlobalShortcutHandler";
import { CommandPalette } from "../shared/components/CommandPalette/CommandPalette";
import { Menu, Bell, Search, User } from "lucide-react";

export const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const currentUser = {
    name: "Omkar",
    email: "omkar@example.com",
    role: "Student",
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex transition-colors duration-300">
      <GlobalShortcutHandler />
      <CommandPalette />
      <Sidebar
        collapsed={collapsed}
        setCollapsed={(val) => {
          setCollapsed(val);
          // Sync mobile menu state when interaction occurs
          if (isMobileMenuOpen) setIsMobileMenuOpen(false);
        }}
        isMobileOpen={isMobileMenuOpen}
        companyName="OMUI"
        user={currentUser}
        resizable
      />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        {/* Top Header */}
        <header className="h-16 bg-header-bg backdrop-blur-md border-b border-header-border sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-text-secondary hover:text-primary md:hidden transition-colors"
            >
              <Menu size={24} />
            </button>

            <div
              className="hidden sm:flex items-center bg-neutral-bg rounded-full px-4 py-1.5 gap-2 w-64 lg:w-96 cursor-pointer hover:bg-neutral-bg/80 transition-colors group"
              onClick={() => {
                // Dispatch a custom event or use a state sharing mechanism if needed,
                // but since CommandPalette listens for Ctrl+K, we can just trigger it manually if we had access to its state.
                // For now, let's keep it simple and just show the hint.
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", ctrlKey: true }),
                );
              }}
            >
              <Search
                size={16}
                className="text-text-secondary/50 group-hover:text-primary transition-colors"
              />
              <div className="text-sm text-text-secondary/50 flex-1">
                Search anything...
              </div>
              <div className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 rounded border border-neutral-border bg-neutral-surface text-[10px] font-bold text-text-muted">
                <kbd>Ctrl</kbd>
                <span>+</span>
                <kbd>K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-full transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 h-2 w-2 bg-error rounded-full border-2 border-neutral-surface" />
            </button>
            <div className="h-8 w-px bg-neutral-border hidden sm:block" />
            <div className="flex items-center gap-3 pl-2 cursor-pointer group">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {currentUser.name}
                </p>
                <p className="text-xs text-text-secondary">
                  {currentUser.role}
                </p>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15, transition: { duration: 0.15 } }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
