import { createContext, useContext } from "react";
import { useDataTable } from "./useDataTable";
import type { ColumnDef } from "../types";

interface DataTableContextValue<T = unknown> extends ReturnType<typeof useDataTable<T>> {
  columns: ColumnDef<T>[];
  selectable?: boolean;
  cardLayout?: boolean;
  renderCard?: (row: T) => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  enableSearch?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DataTableContext = createContext<DataTableContextValue<any> | null>(null);

export function useDataTableContext<T>() {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error("useDataTableContext must be used within a DataTable");
  }
  return context as DataTableContextValue<T>;
}
