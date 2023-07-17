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
import { hasAccess } from "@/actions/session";
import Link from "next/link";

import { notFound } from "next/navigation";
import { getTournamentTitle } from "@/utils/getTournamentTitle";
import { Header } from "@/components/common/header";

interface HubTournamentPageProps {
  params: { tournamentId: string };
  searchParams: { fromTournamentsPage?: string };
}

const HubTournamentPage = async (props: HubTournamentPageProps) => {
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
            <BreadcrumbLink as={Link} href="/hub/tournaments">
              Tournaments
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link}
            href={`/hub/${tournament.id}`}
            isCurrentPage
          >
            {getTournamentTitle(tournament)}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Header title={getTournamentTitle(tournament)}>
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
      </Header>
      <TournamentStatusBadge status={tournament.status} />
      <p className="text-gray-500">{tournament.description}</p>
      <ParticipantTable
        tournamentStatus={tournament.status}
        participants={participants}
      />
    </div>
  );
};

export default HubTournamentPage;
