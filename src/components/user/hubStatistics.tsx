import { getHubStatistics } from "@/actions/user";
import { StatisticCard } from "@/components/user/statisticCard";
import type { TourneySession } from "@/actions/session";

interface HubStatisticsProps {
  session: TourneySession;
}

export const HubStatistics = async (props: HubStatisticsProps) => {
  const statistics = await getHubStatistics(props.session);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
  );
};
