import { listTournaments } from "@/actions/admin";
import { AdminTournamentTable } from "@/components/admin/tournamentTable";
import { Header } from "@/components/common/header";

import { hasAccess } from "@/utils/session";


const AdminPage = async () => {
  const session = await hasAccess("admin");
  const tournaments = await listTournaments(session);
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Header title="Tournaments" href="/admin/new" ctaText="New Tournament" />
      <AdminTournamentTable session={session} tournaments={tournaments} />
    </div>
  );
};

export default AdminPage;
