import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Command, LayoutGrid } from "lucide-react";
import { useShortcut } from "../../settings/useShortcut";
import { SIDEBAR_MENU } from "../../../shared/constants/menuItems";
import { motion } from "framer-motion";

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useShortcut({
    action: "quickNav",
    onTrigger: () => setIsOpen(true),
  });

  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        setQuery("");
        setSelectedIndex(0);
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  const allItems: { label: string; path: string; icon: React.ElementType; section: string }[] = [];
  SIDEBAR_MENU.forEach(section => {
    section.items.forEach(item => {
      if (item.path) {
        allItems.push({ label: item.label, path: item.path, icon: item.icon, section: section.label });
      }
      if (item.children) {
        item.children.forEach(child => {
            if (child.path) {
                allItems.push({ label: child.label, path: child.path, icon: item.icon, section: section.label });
            }
            if (child.children) {
                child.children.forEach(subchild => {
                    if (subchild.path) {
                         allItems.push({ label: subchild.label, path: subchild.path, icon: item.icon, section: section.label });
                    }
                });
            }
        });
      }
    });
  });

  const filteredItems = allItems.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.section.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
    if (e.key === "ArrowDown") {
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    }
    if (e.key === "ArrowUp") {
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    }
    if (e.key === "Enter") {
      if (filteredItems[selectedIndex]) {
        navigate(filteredItems[selectedIndex].path);
        setIsOpen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4 bg-gray-900/40 backdrop-blur-[2px]" onClick={() => setIsOpen(false)}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-2xl bg-neutral-surface rounded-2xl shadow-2xl border border-neutral-border overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-neutral-border flex items-center gap-3 bg-neutral-bg">
          <Search className="w-5 h-5 text-text-muted" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search pages, actions, items..."
            value={query}
            onChange={e => {
                setQuery(e.target.value);
                setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none text-text-primary focus:ring-0 placeholder:text-text-muted text-lg"
          />
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-surface border border-neutral-border text-[10px] font-bold text-text-muted">
            <kbd>ESC</kbd>
          </div>
        </div>

        <div className="p-2 max-h-[400px] overflow-y-auto">
          {filteredItems.length > 0 ? (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const Icon = item.icon || LayoutGrid;
                return (
                  <div 
                    key={item.path + index}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      index === selectedIndex 
                        ? "bg-button-primary/10 text-button-primary ring-1 ring-button-primary/20" 
                        : "hover:bg-neutral-bg text-text-secondary"
                    }`}
                    onClick={() => {
                        navigate(item.path);
                        setIsOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${index === selectedIndex ? "bg-button-primary/20" : "bg-neutral-bg"}`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <div>
                            <div className={`text-sm font-semibold ${index === selectedIndex ? "text-button-primary" : "text-text-primary"}`}>
                                {item.label}
                            </div>
                            <div className="text-[10px] uppercase tracking-widest opacity-60">
                                {item.section}
                            </div>
                        </div>
                    </div>
                    {index === selectedIndex && (
                        <div className="flex items-center gap-1 text-[10px] font-bold opacity-60">
                            <span>Open</span>
                            <kbd className="px-1.5 py-0.5 rounded border border-button-primary/30 bg-button-primary/10">↵</kbd>
                        </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-text-muted">
              <Command className="w-12 h-12 mx-auto mb-4 opacity-10" />
              <p>No results for &quot;{query}&quot;</p>
            </div>
          )}
        </div>

        <div className="p-3 bg-neutral-bg border-t border-neutral-border flex items-center justify-between text-[11px] text-text-muted font-medium">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><kbd className="px-1 rounded border border-neutral-border bg-neutral-surface">↓</kbd><kbd className="px-1 rounded border border-neutral-border bg-neutral-surface">↑</kbd> to navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1 rounded border border-neutral-border bg-neutral-surface">↵</kbd> to select</span>
            </div>
            <div className="flex items-center gap-1">
                <Command className="w-3 h-3" />
                <span>Command Palette</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
};
