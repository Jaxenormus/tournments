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

import type { Participant, TournamentStatus } from "@prisma/client";
import { dayjs } from "@/integrations/dayjs";
import { Trophy, XIcon } from "lucide-react";

type ParticipantWithUser = Participant & {
  user: { name: string };
  isWinner: boolean;
};

const columns: ColumnDef<ParticipantWithUser>[] = [
  {
    accessorKey: "isWinner",
    header: "Winner",
    cell: ({ row }) => {
      if (row.original.isWinner) {
        return <Trophy className="stroke-yellow-500 w-5 h-5" />;
      } else {
        return <XIcon className="w-5 h-5" />;
      }
    },
  },
  {
    accessorKey: "name",
    header: "Player Name",
    accessorFn: (row) => {
      return row.user.name;
    },
  },
  {
    accessorKey: "id",
    header: "Joined",
    accessorFn: () => {
      return dayjs().format("dddd, MMMM D, YYYY h:mm A zzz");
    },
  },
];

interface ParticipantTableProps {
  tournamentStatus: TournamentStatus;
  participants: ParticipantWithUser[];
}

export const ParticipantTable = (props: ParticipantTableProps) => {
  const table = useReactTable({
    data: props.participants,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnVisibility: {
        isWinner: props.tournamentStatus === "COMPLETED",
      },
    },
  });
  return (
    <div className="rounded-md border">
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
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No participants.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
