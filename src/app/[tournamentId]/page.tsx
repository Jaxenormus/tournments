import {
  findExperienceTournament,
  listExperienceTournamentParticipants,
} from "@/actions/experience";
import { ParticipantTable } from "@/components/participantsTable";
import { TournamentStatusBadge } from "@/components/tournamentStatusBadge";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface TournamentHubPageProps {
  params: { tournamentId: string };
}

const TournamentHubPage = async (props: TournamentHubPageProps) => {
  const tournament = await findExperienceTournament(props.params.tournamentId);
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
      </div>
      <TournamentStatusBadge status={tournament.status} />
      <p className="text-gray-500">{tournament.description}</p>
      <div className="grid grid-cols-3 gap-4">
        {tournament.tiers.map((tier) => (
          <div
            key={tier.id}
            className="bg-gray-100 p-4 rounded-lg border border-gray-200 space-y-4"
          >
            <div>
              <h4 className="text-xl font-semibold tracking-tight">
                {tier.name}
              </h4>
              <p className="text-gray-500">{tier.description}</p>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Button
                className="w-full"
                disabled={tournament.status !== "ACTIVE"}
              >
                Join for ${tier.price}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <ParticipantTable participants={participants} />
    </div>
  );
};

export default TournamentHubPage;
