import { listExperienceTournaments } from "@/actions/user";
import { ExperienceTournamentCard } from "@/components/user/experienceTournamentCard";
import { Button } from "@/components/ui/button/button";
import { hasAccess } from "@/utils/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HubStatistics } from "@/components/user/hubStatistics";

const MePage = async () => {
  const session = await hasAccess("adminOrConsumer");
  const tournaments = await listExperienceTournaments(
    session,
    ["COMPLETED", "ACTIVE", "CANCELLED"],
    true
  );
  if (tournaments.length <= 0) return redirect("/tournaments");
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start md:items-center justify-between gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Tournament Hub</h2>
          <Link href="/tournaments" className="w-full sm:w-auto">
            <Button className="w-full">View All Tournaments</Button>
          </Link>
        </div>
        <HubStatistics session={session} />
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          My Tournaments
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
                fromTournamentsPage={false}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MePage;
