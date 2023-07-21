import {
  fetchWhopExperienceName,
  listExperienceTournaments,
} from "@/actions/user";
import { ExperienceTournamentCard } from "@/components/user/experienceTournamentCard";
import { hasAccess } from "@/actions/session";
import { HubStatistics } from "@/components/user/hubStatistics";
import { Header } from "@/components/common/header";

const ExperienceTournamentsPage = async () => {
  const session = await hasAccess("adminOrConsumer");
  const name = await fetchWhopExperienceName(session);
  const upcomingTournaments = await listExperienceTournaments(session, [
    "ACTIVE",
  ]);
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="space-y-4">
        <Header title={name} href="/hub" ctaText="View My Tournaments" />
        <HubStatistics session={session} />
      </div>
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
