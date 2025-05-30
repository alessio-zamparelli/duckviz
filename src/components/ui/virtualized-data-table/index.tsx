"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortDirection,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { forwardRef, HTMLAttributes, useState } from "react"
import { TableVirtuoso } from "react-virtuoso"

import { TableCell, TableHead, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

// Original Table is wrapped with a <div> (see https://ui.shadcn.com/docs/components/table#radix-:r24:-content-manual),
// but here we don't want it, so let's use a new component with only <table> tag
const TableComponent = forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  ),
)
TableComponent.displayName = "TableComponent"

const TableRowComponent = <TData,>(rows: Row<TData>[]) =>
  function getTableRow(props: HTMLAttributes<HTMLTableRowElement>) {
    // @ts-expect-error data-index is a valid attribute
    const index = props["data-index"]
    const row = rows[index]

    if (!row) return null

    return (
      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} {...props}>
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
      </TableRow>
    )
  }

function SortingIndicator({ isSorted }: { isSorted: SortDirection | false }) {
  if (!isSorted) return null
  return (
    <div>
      {
        {
          asc: "↑",
          desc: "↓",
        }[isSorted]
      }
    </div>
  )
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  height?: string
  className?: HTMLElement["className"]
}

export function DataTable<TData, TValue>({ columns, data, height, className }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const { rows } = table.getRowModel()

  return (
    <TableVirtuoso
      className={className}
      style={{ height }}
      totalCount={rows.length}
      components={{
        Table: TableComponent,
        TableRow: TableRowComponent(rows),
      }}
      fixedHeaderContent={() =>
        table.getHeaderGroups().map(headerGroup => (
          // Change header background color to non-transparent
          <TableRow className="bg-card hover:bg-muted" key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              return (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{
                    width: header.getSize(),
                  }}>
                  {header.isPlaceholder ? null : (
                    <div
                      className="flex items-center"
                      {...{
                        style: header.column.getCanSort()
                          ? {
                              cursor: "pointer",
                              userSelect: "none",
                            }
                          : {},
                        onClick: header.column.getToggleSortingHandler(),
                      }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <SortingIndicator isSorted={header.column.getIsSorted()} />
                    </div>
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        ))
      }
    />
  )
}
