import { listExperienceTournaments } from "@/actions/user";
import { getHubStatistics } from "@/actions/user";
import { ExperienceTournamentCard } from "@/components/user/experienceTournamentCard";
import { StatisticCard } from "@/components/user/statisticCard";
import { Button } from "@/components/ui/button/button";
import { hasAccess } from "@/utils/session";
import Link from "next/link";

const MePage = async () => {
  const session = await hasAccess("adminOrConsumer");
  const tournaments = await listExperienceTournaments(
    session,
    ["COMPLETED", "ACTIVE", "CANCELLED"],
    true
  );
  const statistics = await getHubStatistics(session);
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tournament Hub</h2>
        <div className="flex items-center space-x-2">
          <Link href="/tournaments">
            <Button>View All Tournaments</Button>
          </Link>
        </div>
      </div>
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          <StatisticCard title="Available Credits" value={statistics.credits} />
          <StatisticCard
            title="Upcoming Tournaments"
            value={statistics.upcomingTournaments}
          />
          <StatisticCard
            title="Won Tournaments"
            value={statistics.wonTournaments}
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Upcoming Tournaments
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {tournaments
              .filter((tournament) =>
                tournament.participants.find(
                  (participant) => participant.user.id === session.user.id
                )
              )
              .map((tournament) => (
                <ExperienceTournamentCard
                  key={tournament.id}
                  tournament={tournament}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MePage;
