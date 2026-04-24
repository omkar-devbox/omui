import type { ReactNode } from "react";

export function DataTableRoot({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 overflow-auto relative custom-scrollbar">
      <table className="w-full border-collapse table-fixed select-none">
        {children}
      </table>
    </div>
  );
}
