import {
  findExperienceTournament,
  joinExperienceTournament,
  listExperienceTournamentParticipants,
} from "@/actions/experience";
import { JoinTournamentButton } from "@/components/joinTournamentButton";
import { ParticipantTable } from "@/components/participantsTable";
import { TournamentStatusBadge } from "@/components/tournamentStatusBadge";
import { hasAccess } from "@/utils/session";

import { notFound } from "next/navigation";

interface TournamentHubPageProps {
  params: { tournamentId: string };
}

const TournamentHubPage = async (props: TournamentHubPageProps) => {
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
