import React from "react";
import { useDataTableContext } from "../hooks/useDataTableContext";

export function DataTableCardView({ isLoading }: { isLoading?: boolean }) {
  const {
    paginatedData,
    renderCard,
    columns,
    selectable,
    state,
    toggleSelection,
    getRowId,
  } = useDataTableContext();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:flex sm:flex-nowrap sm:overflow-x-auto gap-4 pb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-48 bg-slate-800/50 rounded-xl animate-pulse w-full sm:w-72 sm:flex-shrink-0"
          />
        ))}
      </div>
    );
  }

  if (paginatedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <p>No results found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:flex sm:flex-nowrap sm:overflow-x-auto gap-6 custom-scrollbar pb-6">
      {paginatedData.map((row, index) => {
        const id = getRowId ? getRowId(row) : (row as Record<string, unknown>).id || index;
        const isSelected = state.selection.has(id as string | number);

        return (
          <div
            key={id as string | number}
            className={`
              relative group rounded-2xl border transition-all duration-300 overflow-hidden
              w-full sm:w-80 sm:flex-shrink-0
              ${isSelected ? "bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-900/20" : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 hover:translate-y-[-4px]"}
            `}
          >
            {selectable && (
              <div
                onClick={() => toggleSelection(id as string | number)}
                className={`
                  absolute top-4 right-4 z-10 w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all
                  ${isSelected ? "bg-blue-600 border-blue-600" : "bg-slate-800/50 border-slate-700 hover:border-blue-500"}
                `}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 bg-white rounded-sm" />
                )}
              </div>
            )}

            {renderCard ? (
              renderCard(row)
            ) : (
              <div className="p-6 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Default card layout using columns */}
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest leading-none">
                      {columns[0].label}
                    </div>
                    <div className="text-lg font-bold text-white truncate">
                      {columns[0].render
                        ? columns[0].render(row, 0)
                        : ((row as Record<string, unknown>)[columns[0].key as string] as React.ReactNode)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/50">
                    {columns
                      .filter((c) => c.key !== "actions")

                      .map((col, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="text-[9px] uppercase font-bold text-slate-600 tracking-tighter">
                            {col.label}
                          </div>
                          <div className="text-xs text-slate-300 font-medium truncate">
                            {col.render
                              ? col.render(row, idx + 1)
                              : ((row as Record<string, unknown>)[col.key as string] as React.ReactNode)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Actions if present */}
                {columns.find((c) => c.key === "actions") && (
                  <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-end">
                    {columns
                      .find((c) => c.key === "actions")
                      ?.render?.(row, -1)}
                  </div>
                )}
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        );
      })}
    </div>
  );
}
