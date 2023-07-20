"use client";

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";

import {
  flexRender,
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { Tournament, TournamentStatus } from "@prisma/client";
import { dayjs } from "@/integrations/dayjs";
import { TournamentStatusBadge } from "@/components/common/tournamentStatusBadge";
import { TournamentTableActions } from "@/components/admin/tournamentTableActions";
import type { TourneySession } from "@/utils/session";

const getColumns: (session: TourneySession) => ColumnDef<Tournament>[] = (
  session
) => [
  {
    accessorKey: "status",
    header: "Status",
    cell: (props) => {
      const status = props.getValue() as TournamentStatus;
      return <TournamentStatusBadge status={status} />;
    },
  },
  { accessorKey: "location", header: "Location" },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: (props) => {
      return dayjs(props.getValue() as Date).format("LLLL zzz");
    },
  },
  {
    id: "actions",
    cell: (props) => {
      return (
        <TournamentTableActions
          tournamentId={props.row.original.id}
          session={session}
        />
      );
    },
  },
];

interface AdminTournamentTableProps {
  session: TourneySession;
  tournaments: Tournament[];
}

export const AdminTournamentTable = (props: AdminTournamentTableProps) => {
  const table = useReactTable({
    data: props.tournaments,
    columns: getColumns(props.session),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <div className="rounded-md border">
      {props.tournaments && (
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <>
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
                </>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
