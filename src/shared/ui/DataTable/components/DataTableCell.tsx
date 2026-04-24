import React from "react";
import { useDataTableContext } from "../hooks/useDataTableContext";
import type { ColumnDef } from "../types";

export function DataTableCell({ 
  row, 
  column, 
  isPinned,
  style 
}: { 
  row: unknown; 
  column: ColumnDef<unknown>;
  isPinned?: "left" | "right" | null;
  style?: React.CSSProperties;
}) {
  const { state } = useDataTableContext();
  const colId = column.id || column.key?.toString() || "";
  const width = state.columnSizing[colId] || 150;
  
  const value = column.key ? (row as Record<string, unknown>)[column.key as string] : null;

  return (
    <td 
      className={`
        px-3 py-3 text-sm truncate border-r border-table-border last:border-r-0
        ${isPinned ? "sticky z-10 bg-table-bg group-hover:bg-table-row-hover transition-colors" : ""}
        ${isPinned === 'left' ? "border-r-2 border-r-primary/30 shadow-sm" : ""}
        ${isPinned === 'right' ? "border-l-2 border-l-primary/30 shadow-sm" : ""}
      `}
      style={{ width, minWidth: width, maxWidth: width, ...style }}
    >
      {column.render ? column.render(row, 0) : String(value ?? "")}
    </td>
  );
}
