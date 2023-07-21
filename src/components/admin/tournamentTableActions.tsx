"use client";

import { deleteTournament } from "@/actions/admin";
import { DestructiveButton } from "@/components/ui/button/destructive";
import { TooltipButton } from "@/components/ui/button/tooltip";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getBaseUrl } from "@/utils/getBaseUrl";
import type { TourneySession } from "@/actions/session";

import { Eye, Share2, Settings, Medal, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

interface TournamentTableActionsProps {
  session: TourneySession;
  tournamentId: string;
}

export const TournamentTableActions = (props: TournamentTableActionsProps) => {
  const [_, copy] = useCopyToClipboard();
  return (
    <div className="flex justify-end">
      <TooltipProvider>
        <Link href={`/admin/${props.tournamentId}`}>
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
            copy(`${getBaseUrl()}/${props.tournamentId}`);
            toast.success("Copied to clipboard");
          }}
        >
          <Share2 className="w-4 h-4" />
        </TooltipButton>
        <Link href={`/admin/${props.tournamentId}/edit`}>
          <TooltipButton
            tip="Settings"
            variant="outline"
            className="rounded-l-none rounded-r-none border-l-0"
          >
            <Settings className="w-4 h-4" />
          </TooltipButton>
        </Link>
        <Link href={`/admin/${props.tournamentId}/manage`}>
          <TooltipButton
            tip="Manage"
            variant="outline"
            className="rounded-l-none rounded-r-none border-l-0"
          >
            <Medal className="w-4 h-4" />
          </TooltipButton>
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* Wrap in div since asChild doesn't work on DestructiveButton */}
            <div>
              <DestructiveButton
                className="rounded-l-none border-l-0"
                handleDelete={async () => {
                  await deleteTournament(props.session, props.tournamentId);
                  toast.success("Tournament deleted");
                  window.location.reload();
                }}
              >
                <Trash2 className="w-4 h-4" />
              </DestructiveButton>
            </div>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
