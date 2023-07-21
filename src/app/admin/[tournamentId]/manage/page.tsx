import { findTournament, listParticipants } from "@/actions/admin";
import { ManageTournamentForm } from "@/components/admin/forms/manageTournamentForm";
import { Header } from "@/components/common/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { getTournamentTitle } from "@/utils/getTournamentTitle";
import { hasAccess } from "@/actions/session";
import Link from "next/link";

import { notFound } from "next/navigation";

interface AdminManagePageProps {
  params: { tournamentId: string };
}

const AdminManagePage = async (props: AdminManagePageProps) => {
  const session = await hasAccess("admin");
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
          <BreadcrumbLink as={Link} href="/admin">
            Tournaments
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href={`/admin/${tournament.id}`}>
            {getTournamentTitle(tournament)}
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
      <Header title="Manage Tournament" />
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
