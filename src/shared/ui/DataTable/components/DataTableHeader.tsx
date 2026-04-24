import React, { useState } from "react";
import { useDataTableContext } from "../hooks/useDataTableContext";
import {
  MoreVertical,
  Filter,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Maximize2,
  RefreshCcw,
  Check,
} from "lucide-react";
import { PopOver } from "../../PopOver";
import type { ColumnDef, PinDirection, FilterOperator } from "../types";
import { FormField } from "../../FormField";

export function DataTableHeader() {
  const {
    state,
    columns,
    selectable,
    selectAll,
    clearSelection,
    paginatedData,
    getRowId,
  } = useDataTableContext();

  const allIds = paginatedData.map((row, i) =>
    getRowId
      ? getRowId(row)
      : ((row as Record<string, unknown>).id as string) || i,
  );
  const isAllSelected =
    allIds.length > 0 && allIds.every((id) => state.selection.has(id));
  const isPartialSelected =
    !isAllSelected && allIds.some((id) => state.selection.has(id));

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
    (c) => state.columnPinning[c.id || c.key?.toString() || ""] === "left",
  );
  const unpinned = orderedColumns.filter(
    (c) => !state.columnPinning[c.id || c.key?.toString() || ""],
  );
  const rightPinned = orderedColumns.filter(
    (c) => state.columnPinning[c.id || c.key?.toString() || ""] === "right",
  );

  return (
    <thead className="sticky top-0 z-20 bg-table-header-bg shadow-md border-b border-table-border">
      <tr className="h-12">
        {selectable && (
          <th className="sticky left-0 z-40 bg-table-header-bg w-12 px-3 border-r border-table-border">
            <div
              className={`
                    w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all
                    ${isAllSelected ? "bg-primary border-primary" : isPartialSelected ? "bg-primary/50 border-primary" : "bg-table-bg border-table-border hover:border-primary"}
                `}
              onClick={() =>
                isAllSelected ? clearSelection() : selectAll(allIds)
              }
            >
              {isAllSelected && (
                <Check size={12} className="text-white" strokeWidth={4} />
              )}
              {isPartialSelected && <div className="w-2 h-0.5 bg-white" />}
            </div>
          </th>
        )}
        {leftPinned.map((col, i) => (
          <DataTableColumnHeader
            key={col.id || col.key?.toString()}
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
          <DataTableColumnHeader
            key={col.id || col.key?.toString()}
            column={col}
          />
        ))}
        {rightPinned.map((col, i) => (
          <DataTableColumnHeader
            key={col.id || col.key?.toString()}
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
    </thead>
  );
}

function DataTableColumnHeader({
  column,
  isPinned,
  style,
}: {
  column: ColumnDef<unknown>;
  isPinned?: PinDirection;
  style?: React.CSSProperties;
}) {
  const {
    state,
    toggleSort,
    setColumnWidth,
    setColumnPinning,
    setColumnOrder,
    setFilter,
  } = useDataTableContext();

  const operators: { label: string; value: FilterOperator }[] = [
    { label: "Equals", value: "equals" },
    { label: "Does not equal", value: "not_equals" },
    { label: "Contains", value: "contains" },
    { label: "Greater than", value: "gt" },
    { label: "Greater than or equal to", value: "gte" },
    { label: "Less than", value: "lt" },
    { label: "Less than or equal to", value: "lte" },
    { label: "Between", value: "between" },
    { label: "Blank", value: "blank" },
    { label: "Not blank", value: "not_blank" },
  ];

  const colId = column.id || column.key?.toString() || "";
  const sort = state.sorting.find((s) => s.id === colId);
  const filter = state.filters.find((f) => f.id === colId);
  const width = state.columnSizing[colId] || 150;

  // Action Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Resizing Logic
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.pageX;
    const startWidth = width;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(
        column.minWidth || 50,
        startWidth + (moveEvent.pageX - startX),
      );
      setColumnWidth(colId, newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Reordering Logic (Native DND)
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("columnId", colId);
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    const draggedId = e.dataTransfer.getData("columnId");
    if (draggedId === colId) return;

    const newOrder = [...state.columnOrder];
    const draggedIdx = newOrder.indexOf(draggedId);
    const targetIdx = newOrder.indexOf(colId);

    newOrder.splice(draggedIdx, 1);
    newOrder.splice(targetIdx, 0, draggedId);

    setColumnOrder(newOrder);
  };

  return (
    <th
      className={`
        relative px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider
        border-r border-table-border group transition-colors
        ${isPinned ? "sticky z-30 bg-table-header-bg" : ""}
        ${isPinned === "left" ? "border-r-2 border-r-primary/30" : ""}
        ${isPinned === "right" ? "border-l-2 border-l-primary/30" : ""}
        hover:bg-table-row-hover
      `}
      style={{ width, minWidth: width, maxWidth: width, ...style }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center gap-1">
        {/* Reorder Handle */}
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
        >
          <GripVertical size={14} className="text-gray-500 dark:text-gray-500" />
        </div>

        {/* Label and Sort Icon */}
        <div
          className="flex-1 flex items-center gap-1 cursor-pointer truncate"
          onClick={() => column.sortable && toggleSort(colId)}
        >
          <span className="truncate">{column.label}</span>
          {sort && (
            <div className="text-blue-400">
              {sort.desc ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
          )}
        </div>

        {/* Action Icon (Combined) */}
        <div className="flex items-center">
          <PopOver
            isOpen={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            content={
              <div className="py-1 min-w-[220px] text-sm">
                {/* Filter Section (Advanced) */}
                {column.filterable && (
                  <div className="p-3 border-b border-table-border bg-table-header-bg rounded-t-xl mb-1 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-text-secondary/60 tracking-wider flex items-center gap-1.5">
                        <Filter size={10} className="text-primary" />
                        Filter {column.label}
                      </span>
                      {filter && (
                        <button
                          onClick={() => setFilter(colId, null, null)}
                          className="text-[10px] text-primary hover:text-primary-hover font-medium"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    {/* Operator Selector using FormField */}
                    <FormField
                      type="select"
                      isSearchable
                      isClearable
                      className="!min-h-[32px] !py-1 text-xs bg-neutral-surface border-neutral-border"
                      value={
                        filter?.operator ||
                        (column.filterType === "text" ? "contains" : "equals")
                      }
                      options={operators}
                      onChange={(e) => {
                        const newOp = (e.target as HTMLSelectElement)
                          .value as FilterOperator;
                        if (newOp === "between") {
                          setFilter(
                            colId,
                            [null, null],
                            column.filterType || "text",
                            newOp,
                          );
                        } else if (newOp === "blank" || newOp === "not_blank") {
                          setFilter(
                            colId,
                            null,
                            column.filterType || "text",
                            newOp,
                          );
                        } else {
                          setFilter(
                            colId,
                            filter?.value,
                            column.filterType || "text",
                            newOp,
                          );
                        }
                      }}
                    />

                    {/* Conditional Inputs using FormField */}
                    {!(
                      filter?.operator === "blank" ||
                      filter?.operator === "not_blank"
                    ) && (
                      <div className="flex flex-col gap-2">
                        {filter?.operator === "between" ? (
                          <>
                            <FormField
                              type={
                                column.filterType === "range" ? "number" : "text"
                              }
                              placeholder="From"
                              className="!min-h-[32px] !py-1 text-xs"
                              value={
                                (filter?.value as [unknown, unknown])?.[0] ?? ""
                              }
                              onChange={(e) => {
                                const val = (e.target as HTMLInputElement).value;
                                setFilter(
                                  colId,
                                  [
                                    val || null,
                                    (filter?.value as [unknown, unknown])?.[1] ??
                                      null,
                                  ],
                                  "range",
                                  "between",
                                );
                              }}
                            />
                            <FormField
                              type={
                                column.filterType === "range" ? "number" : "text"
                              }
                              placeholder="To"
                              className="!min-h-[32px] !py-1 text-xs"
                              value={
                                (filter?.value as [unknown, unknown])?.[1] ?? ""
                              }
                              onChange={(e) => {
                                const val = (e.target as HTMLInputElement).value;
                                setFilter(
                                  colId,
                                  [
                                    (filter?.value as [unknown, unknown])?.[0] ??
                                      null,
                                    val || null,
                                  ],
                                  "range",
                                  "between",
                                );
                              }}
                            />
                          </>
                        ) : column.filterType === "select" &&
                          (filter?.operator === "equals" ||
                            filter?.operator === "not_equals" ||
                            !filter?.operator) ? (
                          <FormField
                            type="select"
                            className="!min-h-[32px] !py-1 text-xs"
                            value={(filter?.value as string) || ""}
                            options={column.filterOptions || []}
                            onChange={(e) =>
                              setFilter(
                                colId,
                                (e.target as HTMLSelectElement).value,
                                "select",
                                filter?.operator,
                              )
                            }
                          />
                        ) : (
                          <FormField
                            autoFocus
                            type={column.filterType === "range" ? "number" : "text"}
                            placeholder={`Search ${column.label.toLowerCase()}...`}
                            className="!min-h-[32px] !py-1 text-xs"
                            value={(filter?.value as string) || ""}
                            onChange={(e) =>
                              setFilter(
                                colId,
                                (e.target as HTMLInputElement).value,
                                column.filterType || "text",
                                filter?.operator,
                              )
                            }
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="px-1">
                  <div className="px-2 py-1.5 text-[10px] uppercase text-text-secondary font-bold tracking-wider">
                    Sort & Layout
                  </div>
                  <MenuAction
                    icon={<ChevronUp size={14} />}
                    label="Sort Ascending"
                    active={sort && !sort.desc}
                    onClick={() => {
                      toggleSort(colId, false);
                      setIsMenuOpen(false);
                    }}
                  />
                  <MenuAction
                    icon={<ChevronDown size={14} />}
                    label="Sort Descending"
                    active={sort && sort.desc}
                    onClick={() => {
                      toggleSort(colId, true);
                      setIsMenuOpen(false);
                    }}
                  />

                  <div className="h-px bg-table-border my-1 mx-2" />
                  <div className="px-2 py-1.5 text-[10px] uppercase text-text-secondary font-bold tracking-wider">
                    Pin Column
                  </div>
                  <MenuAction
                    icon={
                      <Check
                        size={14}
                        className={!isPinned ? "opacity-100" : "opacity-0"}
                      />
                    }
                    label="No Pin"
                    onClick={() => {
                      setColumnPinning(colId, null);
                      setIsMenuOpen(false);
                    }}
                  />
                  <MenuAction
                    icon={
                      <Check
                        size={14}
                        className={
                          isPinned === "left" ? "opacity-100" : "opacity-0"
                        }
                      />
                    }
                    label="Pin Left"
                    onClick={() => {
                      setColumnPinning(colId, "left");
                      setIsMenuOpen(false);
                    }}
                  />
                  <MenuAction
                    icon={
                      <Check
                        size={14}
                        className={
                          isPinned === "right" ? "opacity-100" : "opacity-0"
                        }
                      />
                    }
                    label="Pin Right"
                    onClick={() => {
                      setColumnPinning(colId, "right");
                      setIsMenuOpen(false);
                    }}
                  />

                  <div className="h-px bg-slate-700/50 my-1 mx-2" />
                  <MenuAction
                    icon={<Maximize2 size={14} />}
                    label="Autosize Column"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MenuAction
                    icon={<RefreshCcw size={14} />}
                    label="Reset Column"
                    onClick={() => setIsMenuOpen(false)}
                  />
                </div>
              </div>
            }
          >
            <button
              className={`
                p-1 rounded hover:bg-neutral-bg transition-colors
                ${isMenuOpen ? "text-primary bg-neutral-bg" : filter ? "text-primary" : "text-text-secondary/60"}
              `}
            >
              {column.filterable ? (
                <Filter size={14} className={filter ? "fill-blue-400/20" : ""} />
              ) : (
                <MoreVertical size={14} />
              )}
            </button>
          </PopOver>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors z-10"
        onMouseDown={handleResizeStart}
      />

    </th>
  );
}

function MenuAction({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-2.5 py-2 hover:bg-neutral-bg text-text-primary transition-all rounded-md
        ${active ? "bg-primary/10 text-primary" : ""}
      `}
    >
      <span className={`${active ? "text-primary" : "text-text-secondary/60"}`}>
        {icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
      {active && <Check size={12} className="text-primary" />}
    </button>
  );
}
