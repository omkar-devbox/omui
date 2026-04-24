import React from "react";
import { useDataTableContext } from "../hooks/useDataTableContext";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { FormField } from "../../FormField";

export function DataTablePagination() {
  const { state, setPageIndex, setPageSize, pageCount, filteredCount, totalCount } = useDataTableContext();

  const { pageIndex, pageSize } = state.pagination;
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, filteredCount);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-neutral-surface border-t border-neutral-border text-xs text-text-secondary">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="shrink-0">Rows per page:</span>
          <div className="w-20">
            <FormField
              type="select"
              value={pageSize}
              onChange={(e) => setPageSize(Number((e.target as HTMLSelectElement).value))}
              options={[
                { label: "10", value: 10 },
                { label: "25", value: 25 },
                { label: "50", value: 50 },
                { label: "100", value: 100 },
              ]}
              className="!min-h-[32px] !py-1 text-xs"
            />
          </div>
        </div>
        <div>
          Showing <span className="text-text-primary font-medium">{start}</span> to <span className="text-text-primary font-medium">{end}</span> of <span className="text-text-primary font-medium">{filteredCount}</span> results
          {filteredCount !== totalCount && ` (filtered from ${totalCount})`}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 mr-4">
          <span>Page {pageIndex + 1} of {Math.max(1, pageCount)}</span>
        </div>
        <div className="flex items-center gap-1">
          <PaginationButton 
            onClick={() => setPageIndex(0)} 
            disabled={pageIndex === 0}
            icon={<ChevronsLeft size={16} />}
          />
          <PaginationButton 
            onClick={() => setPageIndex(pageIndex - 1)} 
            disabled={pageIndex === 0}
            icon={<ChevronLeft size={16} />}
          />
          <PaginationButton 
            onClick={() => setPageIndex(pageIndex + 1)} 
            disabled={pageIndex >= pageCount - 1}
            icon={<ChevronRight size={16} />}
          />
          <PaginationButton 
            onClick={() => setPageIndex(pageCount - 1)} 
            disabled={pageIndex >= pageCount - 1}
            icon={<ChevronsRight size={16} />}
          />
        </div>
      </div>
    </div>
  );
}

function PaginationButton({ 
  onClick, 
  disabled, 
  icon 
}: { 
  onClick: () => void; 
  disabled: boolean; 
  icon: React.ReactNode 
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        p-1.5 rounded-lg border border-neutral-border transition-colors
        ${disabled ? "opacity-30 cursor-not-allowed bg-neutral-bg" : "hover:bg-neutral-bg text-text-secondary hover:text-text-primary"}
      `}
    >
      {icon}
    </button>
  );
}
