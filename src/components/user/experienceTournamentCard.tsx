import { TournamentStatusBadge } from "@/components/common/tournamentStatusBadge";
import { Button } from "@/components/ui/button/button";
import { dayjs } from "@/integrations/dayjs";
import type { Tournament } from "@prisma/client";
import Link from "next/link";

interface ExperienceTournamentCardProps {
  tournament: Tournament & { participants: { id: string }[] };
  fromTournamentsPage: boolean;
}

export const ExperienceTournamentCard = (
  props: ExperienceTournamentCardProps
) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-semibold tracking-tight">
            {props.tournament.name}
          </h4>
          <TournamentStatusBadge status={props.tournament.status} />
        </div>
        <p className="text-gray-500">{props.tournament.description}</p>
        <div className="space-y-1">
          <p className="text-gray-500 text-sm">
            Prize: {props.tournament.prize}
          </p>
          <p className="text-gray-500 text-sm">
            Participants: {props.tournament.participants.length}
          </p>
          <p className="text-gray-500 text-sm">
            Date: {dayjs(props.tournament.date).format("LLLL z")}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Link
          href={
            props.fromTournamentsPage
              ? `/${props.tournament.id}?fromTournamentsPage=true`
              : `/${props.tournament.id}`
          }
          className="w-full"
        >
          <Button className="w-full">View Details</Button>
        </Link>
      </div>
    </div>
  );
};
