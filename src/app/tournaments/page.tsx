import {
  fetchWhopExperienceName,
  listExperienceTournaments,
} from "@/actions/user";
import { ExperienceTournamentCard } from "@/components/user/experienceTournamentCard";
import { Button } from "@/components/ui/button/button";
import { hasAccess } from "@/utils/session";
import Link from "next/link";
import { HubStatistics } from "@/components/user/hubStatistics";

const ExperienceTournamentsPage = async () => {
  const session = await hasAccess("adminOrConsumer");
  const name = await fetchWhopExperienceName(session);
  const upcomingTournaments = await listExperienceTournaments(session, [
    "ACTIVE",
  ]);
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{name}</h2>
        <div className="flex items-center space-x-2">
          <Link href="/hub">
            <Button>View My Tournaments</Button>
          </Link>
        </div>
      </div>
      <HubStatistics session={session} />
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Upcoming Tournaments
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {upcomingTournaments.map((tournament) => (
            <ExperienceTournamentCard
              key={tournament.id}
              tournament={tournament}
              fromTournamentsPage
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceTournamentsPage;
