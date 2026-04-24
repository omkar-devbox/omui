import React, { useMemo } from "react";
import type { DataTableProps } from "./types";
import { useDataTable } from "./hooks/useDataTable";
import { DataTableContext } from "./hooks/useDataTableContext";
import { DataTableRoot } from "./components/DataTableRoot";
import { DataTableHeader } from "./components/DataTableHeader";
import { DataTableBody } from "./components/DataTableBody";
import { DataTableFooter } from "./components/DataTableFooter";
import { DataTablePagination } from "./components/DataTablePagination";
import { DataTableCardView } from "./components/DataTableCardView";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { Download, Database, Search } from "lucide-react";

export function DataTable<T>({
  data,
  columns,
  getRowId,
  isLoading,
  selectable,
  className,
  title,
  cardLayout,
  renderCard,
  renderFooter,
  enableSearch = true,
}: DataTableProps<T>) {
  const table = useDataTable({ data, columns, getRowId });

  const contextValue = useMemo(
    () => ({
      ...table,
      columns,
      getRowId,
      selectable,
      cardLayout,
      renderCard: renderCard as (row: T) => React.ReactNode,
      renderFooter,
      enableSearch,
    }),
    [
      table,
      columns,
      getRowId,
      selectable,
      cardLayout,
      renderCard,
      renderFooter,
      enableSearch,
    ],
  );

  // Export to CSV helper
  const exportToCSV = () => {
    const headers = columns.map((c) => c.label).join(",");
    const rows = table.sortedData
      .map((row) =>
        columns
          .map((c) => {
            const val = c.key
              ? (row as Record<string, unknown>)[c.key as string]
              : "";
            return `"${String(val).replace(/"/g, '""')}"`;
          })
          .join(","),
      )
      .join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `table-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <DataTableContext.Provider value={contextValue}>
      <div
        className={cn(
          "flex flex-col w-full overflow-hidden bg-table-bg text-text-primary border border-table-border rounded-lg shadow-2xl transition-all duration-300",
          !className?.includes("h-") && "h-full",
          className,
        )}
      >
        {/* Table Header / Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-table-border bg-table-toolbar-bg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Database size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                {title || "Data Table"}
              </h2>
              <p className="text-[10px] text-text-muted uppercase tracking-widest">
                {table.filteredCount} total records
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-1 max-w-md mx-8">
            {enableSearch && (
              <div className="relative w-full group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Universal search..."
                  className="w-full bg-table-bg border border-table-border rounded-lg py-1.5 pl-9 pr-3 text-xs text-text-primary outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-text-muted/50"
                  value={table.state.globalSearch}
                  onChange={(e) => table.setGlobalSearch(e.target.value)}
                />
              </div>
            )}
          </div>
 
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-secondary/10 hover:bg-secondary/20 text-text-primary border border-table-border rounded-md transition-all active:scale-95"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </div>
 
        <div
          className={cn(
            "flex flex-col min-w-0 overflow-hidden",
            cardLayout ? "h-auto" : "flex-1",
          )}
        >
          {cardLayout ? (
            <div className="overflow-auto p-4 custom-scrollbar bg-table-bg">
              <DataTableCardView isLoading={isLoading} />
            </div>
          ) : (
            <DataTableRoot>
              <DataTableHeader />
              <DataTableBody isLoading={isLoading} />
              <DataTableFooter />
            </DataTableRoot>
          )}
          <DataTablePagination />
          {renderFooter && (
            <div className="bg-table-bg border-t border-table-border p-4">
              {renderFooter()}
            </div>
          )}
        </div>
      </div>
    </DataTableContext.Provider>
  );
}
