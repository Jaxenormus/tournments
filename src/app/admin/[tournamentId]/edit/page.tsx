import { findTournament, listWhopExperiences } from "@/actions/admin";
import { EditTournamentForm } from "@/components/admin/forms/editTournamentForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { getTournamentTitle } from "@/utils/getTournamentTitle";
import { hasAccess } from "@/utils/session";
import Link from "next/link";

import { notFound } from "next/navigation";

interface AdminEditPageProps {
  params: { tournamentId: string };
}

const AdminEditPage = async (props: AdminEditPageProps) => {
  const session = await hasAccess("admin");
  const tournament = await findTournament(session, props.params.tournamentId);
  if (!tournament) notFound();
  const experiences = await listWhopExperiences(session);
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
            href={`/admin/${tournament.id}/edit`}
            isCurrentPage
          >
            Edit
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Tournament</h2>
      </div>
      <EditTournamentForm
        id={props.params.tournamentId}
        tournament={tournament}
        session={session}
        experiences={experiences}
      />
    </div>
  );
};

export default AdminEditPage;
