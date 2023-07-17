import { listExperienceTournaments } from "@/actions/experience";
import { ExperienceTournamentCard } from "@/components/experienceTournamentCard";
import { Button } from "@/components/ui/button";
import { getRouteAuthSession } from "@/utils/getRouteAuthSession";
import Link from "next/link";

import { redirect } from "next/navigation";

const ExperienceTournamentsPage = async () => {
  const session = await getRouteAuthSession();
  if (!session) return redirect("/api/auth/signin");
  const upcomingTournaments = await listExperienceTournaments(["ACTIVE"]);
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Random Experience Tournaments
        </h2>
        <div className="flex items-center space-x-2">
          <Link href="/hub">
            <Button>View My Tournaments</Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {upcomingTournaments.map((tournament) => (
          <ExperienceTournamentCard
            key={tournament.id}
            tournament={tournament}
          />
        ))}
      </div>
    </div>
  );
};

export default ExperienceTournamentsPage;
