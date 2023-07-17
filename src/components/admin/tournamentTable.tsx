"use client";

import { DestructiveButton } from "@/components/destructiveButton";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import {
  flexRender,
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import { toast } from "sonner";

import type { Tournament, TournamentStatus } from "@prisma/client";
import { Eye, Medal, Settings, Share2, Trash2 } from "lucide-react";
import { deleteTournament } from "@/actions/tournament";
import type { Session } from "next-auth";
import Link from "next/link";
import { dayjs } from "@/integrations/dayjs";
import { TooltipButton } from "@/components/tooltipButton";
import { TournamentStatusBadge } from "@/components/tournamentStatusBadge";

const columns: ColumnDef<Tournament>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "location", header: "Location" },
  {
    accessorKey: "status",
    header: "Status",
    cell: (props) => {
      const status = props.getValue() as TournamentStatus;
      return <TournamentStatusBadge status={status} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: (props) => {
      return dayjs(props.getValue() as Date).format("LLLL zzz");
    },
  },
];

interface AdminTournamentTableProps {
  session: Session;
  tournaments: Tournament[];
}

export const AdminTournamentTable = (props: AdminTournamentTableProps) => {
  const [_, copy] = useCopyToClipboard();
  const table = useReactTable({
    data: props.tournaments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
                <div className="flex p-4 align-middle justify-end">
                  <TooltipProvider>
                    <Link href={`/admin/${row.original.id}`}>
                      <TooltipButton
                        tip="View"
                        variant="outline"
                        className="rounded-r-none"
                      >
                        <Eye className="w-4 h-4" />
                      </TooltipButton>
                    </Link>
                    <TooltipButton
                      tip="Share"
                      variant="outline"
                      className="rounded-l-none rounded-r-none border-l-0"
                      onClick={() => {
                        copy(`${window.location.host}/hub/${row.original.id}`);
                        toast.success("Copied to clipboard");
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </TooltipButton>
                    <Link href={`/admin/${row.original.id}/edit`}>
                      <TooltipButton
                        tip="Settings"
                        variant="outline"
                        className="rounded-l-none rounded-r-none border-l-0"
                      >
                        <Settings className="w-4 h-4" />
                      </TooltipButton>
                    </Link>
                    <Link href={`/admin/${row.original.id}/manage`}>
                      <TooltipButton
                        tip="Manage"
                        variant="outline"
                        className="rounded-l-none rounded-r-none border-l-0"
                      >
                        <Medal className="w-4 h-4" />
                      </TooltipButton>
                    </Link>
                    <Tooltip>
                      <TooltipTrigger>
                        <DestructiveButton
                          className="rounded-l-none border-l-0"
                          handleDelete={async () => {
                            await deleteTournament(
                              props.session,
                              row.original.id
                            );
                            toast.success("Tournament deleted");
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </DestructiveButton>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
