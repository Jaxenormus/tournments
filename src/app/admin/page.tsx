import { listTournaments } from "@/actions/tournament";
import { AdminTournamentTable } from "@/components/admin/tournamentTable";

import { Button } from "@/components/ui/button";
import { hasAccess } from "@/utils/session";

import Link from "next/link";

const AdminPage = async () => {
  const session = await hasAccess("admin");
  const tournaments = await listTournaments(session);
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tournaments</h2>
        <div className="flex items-center space-x-2">
          <Link href="/admin/new">
            <Button>New Tournament</Button>
          </Link>
        </div>
      </div>
      <AdminTournamentTable session={session} tournaments={tournaments} />
    </div>
  );
};

export default AdminPage;
