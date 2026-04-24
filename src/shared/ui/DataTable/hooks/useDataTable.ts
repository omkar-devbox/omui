import { useState, useMemo, useCallback } from "react";
import type {
  DataTableState,
  ColumnSort,
  PinDirection,
  ColumnDef,
  FilterType,
  FilterOperator,
} from "../types";

export function useDataTable<T>({
  data,
  columns,
  getRowId
}: {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId?: (row: T) => string | number;
}) {
  const [state, setState] = useState<DataTableState>({
    sorting: [],
    filters: [],
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
    columnOrder: columns.map(
      (col, i) => col.id || col.key?.toString() || `col-${i}`,
    ),
    columnVisibility: Object.fromEntries(
      columns.map((col, i) => [
        col.id || col.key?.toString() || `col-${i}`,
        col.visible !== false,
      ]),
    ),
    columnSizing: Object.fromEntries(
      columns.map((col, i) => [
        col.id || col.key?.toString() || `col-${i}`,
        col.width || 150,
      ]),
    ),
    columnPinning: Object.fromEntries(
      columns.map((col, i) => [
        col.id || col.key?.toString() || `col-${i}`,
        col.pinned || null,
      ]),
    ),
    selection: new Set(),
    globalSearch: "",
  });

  // Filtering
  const filteredData = useMemo(() => {
    let result = [...data];
    // Column Filters
    state.filters.forEach((filter) => {
      const col = columns.find(
        (c) => (c.id || c.key?.toString()) === filter.id,
      );
      if (!col) return;

      result = result.filter((row) => {
        const val = col.key ? row[col.key as keyof T] : null;
        const op = filter.operator || (filter.type === "text" ? "contains" : "equals");

        if (op === "blank") return val === null || val === undefined || val === "";
        if (op === "not_blank") return val !== null && val !== undefined && val !== "";

        if (filter.value === "" || filter.value === null || filter.value === undefined) return true;

        if (filter.type === "text" || filter.type === "select") {
          const stringVal = String(val).toLowerCase();
          const filterVal = String(filter.value).toLowerCase();

          switch (op) {
            case "equals": return val === filter.value;
            case "not_equals": return val !== filter.value;
            case "contains": return stringVal.includes(filterVal);
            case "gt": return Number(val) > Number(filter.value);
            case "gte": return Number(val) >= Number(filter.value);
            case "lt": return Number(val) < Number(filter.value);
            case "lte": return Number(val) <= Number(filter.value);
            default: return true;
          }
        }

        if (filter.type === "range" || op === "between") {
          const numVal = Number(val);
          if (Array.isArray(filter.value)) {
            const [min, max] = filter.value;
            if (min !== null && numVal < min) return false;
            if (max !== null && numVal > max) return false;
            return true;
          }
          if (op === "gt") return numVal > Number(filter.value);
          if (op === "gte") return numVal >= Number(filter.value);
          if (op === "lt") return numVal < Number(filter.value);
          if (op === "lte") return numVal <= Number(filter.value);
        }

        return true;
      });
    });

    // Global Search
    if (state.globalSearch) {
      const search = state.globalSearch.toLowerCase();
      result = result.filter((row) => {
        return columns.some((col) => {
          if (!col.key) return false;
          const val = row[col.key as keyof T];
          return String(val).toLowerCase().includes(search);
        });
      });
    }
    return result;
  }, [data, state.filters, columns, state.globalSearch]);

  // Sorting
  const sortedData = useMemo(() => {
    if (state.sorting.length === 0) return filteredData;

    return [...filteredData].sort((a, b) => {
      for (const sort of state.sorting) {
        const col = columns.find(
          (c) => (c.id || c.key?.toString()) === sort.id,
        );
        if (!col || !col.key) continue;

        const valA = (a as Record<string, unknown>)[col.key as string];
        const valB = (b as Record<string, unknown>)[col.key as string];

        if (valA === valB) continue;

        const multiplier = sort.desc ? -1 : 1;
        return valA > valB ? multiplier : -multiplier;
      }
      return 0;
    });
  }, [filteredData, state.sorting, columns]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = state.pagination.pageIndex * state.pagination.pageSize;
    const end = start + state.pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, state.pagination]);

  const pageCount = Math.ceil(sortedData.length / state.pagination.pageSize);

  // Actions
  const toggleSort = useCallback((id: string, multi?: boolean) => {
    setState((prev) => {
      const existing = prev.sorting.find((s) => s.id === id);
      let newSorting: ColumnSort[] = [];

      if (existing) {
        if (existing.desc) {
          newSorting = multi ? prev.sorting.filter((s) => s.id !== id) : [];
        } else {
          newSorting = multi
            ? prev.sorting.map((s) => (s.id === id ? { ...s, desc: true } : s))
            : [{ id, desc: true }];
        }
      } else {
        newSorting = multi
          ? [...prev.sorting, { id, desc: false }]
          : [{ id, desc: false }];
      }

      return { ...prev, sorting: newSorting };
    });
  }, []);

  const setFilter = useCallback(
    (id: string, value: unknown, type: FilterType | null, operator?: FilterOperator) => {
      setState((prev) => {
        const filters = prev.filters.filter((f) => f.id !== id);
        // Special case for blank/not_blank: they don't need a value
        const isUnary = operator === "blank" || operator === "not_blank";
        const isEmpty = value === "" || value === null || value === undefined ||
                        (Array.isArray(value) && value.every(v => v === "" || v === null || v === undefined));
        
        if (isUnary || !isEmpty) {
          filters.push({ id, value, type: type || "text", operator });
        }
        return {
          ...prev,
          filters,
          pagination: { ...prev.pagination, pageIndex: 0 },
        };
      });
    },
    [],
  );

  const setPageIndex = useCallback((pageIndex: number) => {
    setState((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, pageIndex },
    }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setState((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, pageSize, pageIndex: 0 },
    }));
  }, []);

  const setColumnWidth = useCallback((id: string, width: number) => {
    setState((prev) => ({
      ...prev,
      columnSizing: { ...prev.columnSizing, [id]: Math.max(50, width) },
    }));
  }, []);

  const setColumnPinning = useCallback(
    (id: string, direction: PinDirection) => {
      setState((prev) => ({
        ...prev,
        columnPinning: { ...prev.columnPinning, [id]: direction },
      }));
    },
    [],
  );

  const setColumnVisibility = useCallback(
    (visibility: Record<string, boolean>) => {
      setState((prev) => ({ ...prev, columnVisibility: visibility }));
    },
    [],
  );

  const setColumnOrder = useCallback((columnOrder: string[]) => {
    setState((prev) => ({ ...prev, columnOrder }));
  }, []);

  const toggleSelection = useCallback((id: string | number) => {
    setState((prev) => {
      const next = new Set(prev.selection);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { ...prev, selection: next };
    });
  }, []);

  const selectAll = useCallback((ids: (string | number)[]) => {
    setState((prev) => ({ ...prev, selection: new Set(ids) }));
  }, []);

  const setGlobalSearch = useCallback((search: string) => {
    setState((prev) => ({
      ...prev,
      globalSearch: search,
      pagination: { ...prev.pagination, pageIndex: 0 },
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selection: new Set() }));
  }, []);

  const resetTable = useCallback(() => {
    setState({
      sorting: [],
      filters: [],
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      columnOrder: columns.map(
        (col, i) => col.id || col.key?.toString() || `col-${i}`,
      ),
      columnVisibility: Object.fromEntries(
        columns.map((col, i) => [
          col.id || col.key?.toString() || `col-${i}`,
          col.visible !== false,
        ]),
      ),
      columnSizing: Object.fromEntries(
        columns.map((col, i) => [
          col.id || col.key?.toString() || `col-${i}`,
          col.width || 150,
        ]),
      ),
      columnPinning: Object.fromEntries(
        columns.map((col, i) => [
          col.id || col.key?.toString() || `col-${i}`,
          col.pinned || null,
        ]),
      ),
      selection: new Set(),
      globalSearch: "",
    });
  }, [columns]);

  return {
    state,
    paginatedData,
    pageCount,
    toggleSort,
    setFilter,
    setPageIndex,
    setPageSize,
    setColumnWidth,
    setColumnPinning,
    setColumnOrder,
    setColumnVisibility,
    resetTable,
    toggleSelection,
    selectAll,
    clearSelection,
    setGlobalSearch,
    getRowId,
    filteredData,
    sortedData,
    totalCount: data.length,
    filteredCount: sortedData.length,
    data,
  };
}
