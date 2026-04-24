import type { ReactNode } from "react";


export type FilterType = "text" | "select" | "range";

export type FilterOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "blank"
  | "not_blank";

export type ColumnFilter = {
  id: string;
  value: unknown;
  type: FilterType;
  operator?: FilterOperator;
};

export type ColumnSort = {
  id: string;
  desc: boolean;
};

export type PinDirection = "left" | "right" | null;

export type ColumnDef<T> = {
  id?: string;
  key?: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: FilterType;
  filterOptions?: { label: string; value: string | number | boolean | readonly string[] }[];
  width?: number;
  minWidth?: number;
  pinned?: PinDirection;
  visible?: boolean;
  render?: (row: T, index: number) => ReactNode;
  headerRender?: () => ReactNode;
  footerRender?: (data: T[]) => ReactNode;
};

export type DataTableState = {
  sorting: ColumnSort[];
  filters: ColumnFilter[];
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
  columnSizing: Record<string, number>;
  columnPinning: Record<string, PinDirection>;
  selection: Set<string | number>;
  globalSearch: string;
  cardLayout?: boolean;
};

export type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId?: (row: T) => string | number;
  isLoading?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selection: (string | number)[]) => void;
  className?: string;
  title?: string;
  cardLayout?: boolean;
  renderCard?: (row: T) => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  enableSearch?: boolean;
};
