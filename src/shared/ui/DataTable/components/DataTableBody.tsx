import { useDataTableContext } from "../hooks/useDataTableContext";
import type { ColumnDef } from "../types";
import { Check } from "lucide-react";
import { DataTableCell } from "./DataTableCell";

export function DataTableBody({ isLoading }: { isLoading?: boolean }) {
  const {
    paginatedData,
    columns,
    state,
    getRowId,
    selectable,
    toggleSelection,
  } = useDataTableContext();

  const orderedColumns = state.columnOrder
    .map((id) => columns.find((c) => (c.id || c.key?.toString()) === id))
    .filter(Boolean)
    .filter(
      (col) =>
        state.columnVisibility[col?.id || col?.key?.toString() || ""] !== false,
    ) as ColumnDef<unknown>[];

  const leftPinned = orderedColumns.filter(
    (c) => state.columnPinning[c.id || c.key?.toString() || ""] === "left",
  );
  const unpinned = orderedColumns.filter(
    (c) => !state.columnPinning[c.id || c.key?.toString() || ""],
  );
  const rightPinned = orderedColumns.filter(
    (c) => state.columnPinning[c.id || c.key?.toString() || ""] === "right",
  );

  const totalCols = orderedColumns.length + (selectable ? 1 : 0);

  if (isLoading) {
    return (
      <tbody>
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <tr
            key={rowIndex}
            className="border-b border-table-border animate-pulse"
          >
            {selectable && (
              <td className="w-12 px-3 border-r border-table-border">
                <div className="w-4 h-4 rounded bg-table-bg" />
              </td>
            )}
            {orderedColumns.map((_, colIndex) => (
              <td key={colIndex} className="px-3 py-4">
                <div className="h-4 bg-table-bg rounded w-full" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }

  if (paginatedData.length === 0) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={totalCols}
            className="px-3 py-20 text-center text-gray-500 dark:text-gray-500"
          >
            No data found
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {paginatedData.map((row, rowIndex) => {
        const id = getRowId
          ? getRowId(row)
          : ((row as Record<string, unknown>).id as string) || rowIndex;
        const isSelected = state.selection.has(id);
        return (
          <tr
            key={id}
            className={`border-b border-table-border transition-colors group ${isSelected ? "bg-primary/5" : "hover:bg-table-row-hover"}`}
          >
            {selectable && (
              <td
                className={`sticky left-0 z-10 w-12 px-3 border-r border-table-border bg-table-bg ${isSelected ? "bg-table-row-hover" : "group-hover:bg-table-row-hover"} transition-colors`}
              >
                <div
                  className={`
                        w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all
                        ${isSelected ? "bg-primary border-primary" : "bg-table-bg border-table-border hover:border-primary"}
                    `}
                  onClick={() => toggleSelection(id)}
                >
                  {isSelected && (
                    <Check size={12} className="text-white" strokeWidth={4} />
                  )}
                </div>
              </td>
            )}
            {leftPinned.map((col, i) => (
              <DataTableCell
                key={col.id || col.key?.toString()}
                row={row}
                column={col}
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
              <DataTableCell
                key={col.id || col.key?.toString()}
                row={row}
                column={col}
              />
            ))}
            {rightPinned.map((col, i) => (
              <DataTableCell
                key={col.id || col.key?.toString()}
                row={row}
                column={col}
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
        );
      })}
    </tbody>
  );
}
