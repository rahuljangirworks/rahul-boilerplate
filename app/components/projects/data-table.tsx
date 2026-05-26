import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  onPageChange?: (index: number) => void;
  emptyState?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  pageCount = 1,
  pageIndex = 1,
  onPageChange,
  emptyState,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground">Loading records...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  {emptyState ?? (
                    <div className="flex flex-col items-center justify-center p-4">
                      <p className="text-sm text-muted-foreground font-medium">No results found.</p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {onPageChange && pageCount > 1 && (
        <div className="flex items-center justify-center space-x-2 py-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex <= 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="text-xs text-muted-foreground font-medium">
            Page {pageIndex} of {pageCount}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex >= pageCount || isLoading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
