import { findTournament, listParticipants } from "@/actions/tournament";
import { ParticipantTable } from "@/components/participantsTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { hasAdminAccess } from "@/utils/hasAdminAccess";
import Link from "next/link";
import { notFound } from "next/navigation";

interface TournamentPage {
  params: { tournamentId: string };
}

const TournamentPage = async (props: TournamentPage) => {
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
      </Breadcrumb>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{tournament.name}</h2>
        <div className="flex items-center space-x-2">
          <Link href={`/admin/${tournament.id}/edit`}>
            <Button>Edit</Button>
          </Link>
        </div>
      </div>
      <p className="text-gray-500">{tournament.description}</p>
      <ParticipantTable participants={participants} />
    </div>
  );
};

export default TournamentPage;
