import { findTournament, listParticipants } from "@/actions/tournament";
import { ManageTournamentForm } from "@/components/admin/forms/manageTournamentForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { hasAdminAccess } from "@/utils/hasAdminAccess";
import Link from "next/link";

import { notFound } from "next/navigation";

interface AdminManagePageProps {
  params: { tournamentId: string };
}

const AdminManagePage = async (props: AdminManagePageProps) => {
  const session = await hasAdminAccess();
  const tournament = await findTournament(session, props.params.tournamentId);
  if (!tournament) notFound();
  const participants = await listParticipants(
    session,
    props.params.tournamentId
  );
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/admin">
            Tournaments
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href={`/admin/${tournament.id}`}>
            {tournament.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link}
            href={`/admin/${tournament.id}/manage`}
            isCurrentPage
          >
            Manage
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Tournament</h2>
      </div>
      <ManageTournamentForm
        id={props.params.tournamentId}
        tournament={tournament}
        session={session}
        participants={participants}
      />
    </div>
  );
};

export default AdminManagePage;
