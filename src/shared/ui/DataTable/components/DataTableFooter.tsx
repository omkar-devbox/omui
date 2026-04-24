import React from "react";
import { useDataTableContext } from "../hooks/useDataTableContext";
import type { ColumnDef, PinDirection } from "../types";

export function DataTableFooter() {
  const { state, columns, selectable, filteredData } = useDataTableContext();

  // Check if any column has a footerRender
  const hasFooter = columns.some((c) => c.footerRender);
  if (!hasFooter) return null;

  // Reorder and Filter columns based on order and visibility
  const orderedColumns = state.columnOrder
    .map((id) => columns.find((c) => (c.id || c.key?.toString()) === id))
    .filter(Boolean)
    .filter(
      (col) =>
        state.columnVisibility[col?.id || col?.key?.toString() || ""] !== false,
    ) as ColumnDef<unknown>[];

  // Organize columns by pinning
  const leftPinned = orderedColumns.filter(
    (c) =>
      state.columnPinning[c.id || c.key?.toString() || ""] === "left",
  );
  const unpinned = orderedColumns.filter(
    (c) => !state.columnPinning[c.id || c.key?.toString() || ""],
  );
  const rightPinned = orderedColumns.filter(
    (c) =>
      state.columnPinning[c.id || c.key?.toString() || ""] === "right",
  );

  return (
    <tfoot className="sticky bottom-0 z-20 bg-white dark:bg-gray-950 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-gray-200 dark:border-gray-800">
      <tr className="h-10">
        {selectable && (
          <td className="sticky left-0 z-40 bg-white dark:bg-gray-950 w-12 px-3 border-r border-gray-200 dark:border-gray-800" />
        )}
        {leftPinned.map((col, i) => (
          <DataTableColumnFooter
            key={col.id || col.key?.toString()}
            column={col}
            data={filteredData}
            isPinned="left"
            style={{
              left: leftPinned
                .slice(0, i)
                .reduce(
                  (acc, c) =>
                    acc +
                    (state.columnSizing[c.id || c.key?.toString() || ""] ||
                      150),
                  0,
                ),
            }}
          />
        ))}
        {unpinned.map((col) => (
          <DataTableColumnFooter
            key={col.id || col.key?.toString()}
            column={col}
            data={filteredData}
          />
        ))}
        {rightPinned.map((col, i) => (
          <DataTableColumnFooter
            key={col.id || col.key?.toString()}
            column={col}
            data={filteredData}
            isPinned="right"
            style={{
              right: rightPinned
                .slice(i + 1)
                .reduce(
                  (acc, c) =>
                    acc +
                    (state.columnSizing[c.id || c.key?.toString() || ""] ||
                      150),
                  0,
                ),
            }}
          />
        ))}
      </tr>
    </tfoot>
  );
}

function DataTableColumnFooter({
  column,
  data,
  isPinned,
  style,
}: {
  column: ColumnDef<unknown>;
  data: unknown[];
  isPinned?: PinDirection;
  style?: React.CSSProperties;
}) {
  const { state } = useDataTableContext();
  const colId = column.id || column.key?.toString() || "";
  const width = state.columnSizing[colId] || 150;

  return (
    <td
      className={`
        px-3 py-2 text-left text-xs font-semibold
        border-r border-gray-200 dark:border-gray-800 transition-colors
        ${isPinned ? "sticky z-30 bg-white dark:bg-gray-950" : ""}
        ${isPinned === "left" ? "border-r-2 border-r-blue-500/30" : ""}
        ${isPinned === "right" ? "border-l-2 border-l-blue-500/30" : ""}
        bg-gray-50/50 dark:bg-gray-900/30
      `}
      style={{ width, minWidth: width, maxWidth: width, ...style }}
    >
      {column.footerRender ? column.footerRender(data) : null}
    </td>
  );
}
