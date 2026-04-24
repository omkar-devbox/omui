import React from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";
import { PopOver } from "../../ui/PopOver";
import { cn } from "../../utils/cn";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  const content = (
    <div className="w-36 p-1.5 space-y-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            theme === option.value
              ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50/50 dark:bg-blue-900/20"
              : "text-gray-600 dark:text-gray-400",
          )}
        >
          <div className="flex items-center gap-2.5">
            <option.icon size={16} />
            <span>{option.label}</span>
          </div>
          {theme === option.value && <Check size={14} />}
        </button>
      ))}
    </div>
  );

  const CurrentIcon =
    options.find((opt) => opt.value === theme)?.icon || Monitor;

  return (
    <PopOver
      content={content}
      className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 min-w-0"
      placement="bottom-end"
    >
      <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all group">
        <CurrentIcon
          size={20}
          className="transition-transform group-hover:scale-110"
        />
      </button>
    </PopOver>
  );
};
