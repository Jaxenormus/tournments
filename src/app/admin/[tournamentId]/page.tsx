import { findTournament, listParticipants } from "@/actions/admin";
import { ParticipantTable } from "@/components/common/participantsTable";
import { TournamentStatusBadge } from "@/components/common/tournamentStatusBadge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button/button";
import { hasAccess } from "@/utils/session";
import Link from "next/link";
import { notFound } from "next/navigation";

interface TournamentPage {
  params: { tournamentId: string };
}

const TournamentPage = async (props: TournamentPage) => {
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
            {tournament.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{tournament.name}</h2>
        <div className="flex items-center space-x-2">
          <Link href={`/admin/${tournament.id}/edit`}>
            <Button>Edit</Button>
          </Link>
        </div>
      </div>
      <TournamentStatusBadge status={tournament.status} />
      <p className="text-gray-500">{tournament.description}</p>
      <ParticipantTable
        tournamentStatus={tournament.status}
        participants={participants}
      />
    </div>
  );
};

export default TournamentPage;
