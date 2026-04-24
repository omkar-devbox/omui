import React, { useState, useEffect, useRef } from "react";
import { X, Keyboard } from "lucide-react";

interface ShortcutCaptureProps {
  value: string[];
  onChange: (keys: string[]) => void;
  label?: string;
}

export const ShortcutCapture: React.FC<ShortcutCaptureProps> = ({
  value,
  onChange,
  label,
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isCapturing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const keys: string[] = [];
      if (e.ctrlKey) keys.push("Control");
      if (e.altKey) keys.push("Alt");
      if (e.shiftKey) keys.push("Shift");
      if (e.metaKey) keys.push("Meta");

      if (!["Control", "Alt", "Shift", "Meta"].includes(e.key)) {
        keys.push(e.key);
        onChange(keys);
        setIsCapturing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCapturing, onChange]);

  const displayKeys = value.map((key) => {
    if (key === "Control") return "Ctrl";
    if (key === "Meta") return "⌘";
    if (key === "Shift") return "⇧";
    if (key === "Alt") return "Alt";
    if (key === " ") return "Space";
    return key;
  });

  return (
    <div className="flex flex-col gap-1.5 min-w-[200px]">
      {label && (
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {label}
        </span>
      )}
      <div
        ref={containerRef}
        className={`group flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
          isCapturing
            ? "border-button-primary bg-button-primary/5 ring-4 ring-button-primary/10 scale-[1.02]"
            : "border-neutral-border bg-neutral-surface hover:border-text-muted hover:shadow-sm"
        }`}
        onClick={() => setIsCapturing(true)}
      >
        <div className="flex items-center gap-1.5 overflow-hidden">
          {displayKeys.length > 0 ? (
            <div className="flex items-center gap-1">
              {displayKeys.map((key, index) => (
                <React.Fragment key={index}>
                  <kbd className="px-2 py-1 min-w-[24px] text-center text-xs font-bold leading-none text-text-primary bg-neutral-bg border border-neutral-border rounded shadow-sm">
                    {key}
                  </kbd>
                  {index < displayKeys.length - 1 && (
                    <span className="text-text-muted text-xs">+</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <span className="text-text-muted text-sm italic">No shortcut set</span>
          )}
        </div>

        <div className="flex items-center gap-2">
            {isCapturing ? (
                <span className="text-[10px] font-bold text-button-primary animate-pulse uppercase tracking-tighter">
                  Recording...
                </span>
            ) : (
                 <Keyboard className="w-4 h-4 text-text-muted group-hover:text-text-secondary transition-colors" />
            )}
            
            {value.length > 0 && !isCapturing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange([]);
                }}
                className="p-1 hover:bg-neutral-bg rounded-md text-text-muted hover:text-error transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
        </div>
      </div>
    </div>
  );
};
