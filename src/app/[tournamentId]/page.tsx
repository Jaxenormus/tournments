import {
  findExperienceTournament,
  joinExperienceTournament,
  listExperienceTournamentParticipants,
} from "@/actions/user";
import { JoinTournamentButton } from "@/components/user/joinTournamentButton";
import { ParticipantTable } from "@/components/common/participantsTable";
import { TournamentStatusBadge } from "@/components/common/tournamentStatusBadge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { hasAccess } from "@/utils/session";
import Link from "next/link";

import { notFound } from "next/navigation";

interface TournamentHubPageProps {
  params: { tournamentId: string };
  searchParams: { fromTournamentsPage?: string };
}

const TournamentHubPage = async (props: TournamentHubPageProps) => {
  const returnToTournaments = props.searchParams.fromTournamentsPage === "true";
  const session = await hasAccess("adminOrConsumer");
  const tournament = await findExperienceTournament(
    session,
    props.params.tournamentId
  );
  if (!tournament) notFound();
  const participants = await listExperienceTournamentParticipants(
    props.params.tournamentId
  );
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/hub">
            Hub
          </BreadcrumbLink>
        </BreadcrumbItem>
        {returnToTournaments && (
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/tournaments">
              Tournaments
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href={`/${tournament.id}`} isCurrentPage>
            {tournament.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Join {tournament.name}
        </h2>
        <div className="flex items-center space-x-2">
          <JoinTournamentButton
            hasJoined={
              !!participants.find(
                (participant) => participant.user.id === session.user.id
              )
            }
            tournament={tournament}
            joinTournament={async () => {
              "use server";
              return joinExperienceTournament(session, tournament.id);
            }}
          />
        </div>
      </div>
      <TournamentStatusBadge status={tournament.status} />
      <p className="text-gray-500">{tournament.description}</p>
      <ParticipantTable
        tournamentStatus={tournament.status}
        participants={participants}
      />
    </div>
  );
};

export default TournamentHubPage;
