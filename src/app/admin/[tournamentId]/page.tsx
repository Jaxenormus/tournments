import {
  findTournament,
  listParticipants,
  listWhopExperiences,
} from "@/actions/admin";
import { TournamentDetailListItem } from "@/components/admin/tournamentDetailListItem";
import { Header } from "@/components/common/header";
import { ParticipantTable } from "@/components/common/participantsTable";
import { TournamentStatusBadge } from "@/components/common/tournamentStatusBadge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { dayjs } from "@/integrations/dayjs";

import { getTournamentTitle } from "@/utils/getTournamentTitle";
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
  const experiences = await listWhopExperiences(session);
  const participants = await listParticipants(
    session,
    props.params.tournamentId
  );
  return (
    <div className="flex-1 space-y-5 p-8 pt-6">
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
      </Breadcrumb>
      <Header
        title={getTournamentTitle(tournament)}
        href={`/admin/${tournament.id}/edit`}
        ctaText="Edit"
      />
      <TournamentStatusBadge status={tournament.status} isAdmin />
      <dl className="bg-gray-100 border border-gray-200 rounded-md p-4 space-y-2">
        <TournamentDetailListItem
          name="Experiences with Access"
          value={tournament.experienceIds
            .map((id) => experiences.find((e) => e.id === id)?.name)
            .join(", ")}
        />
      </dl>
      <dl className="bg-gray-100 border border-gray-200 rounded-md p-4 space-y-2">
        <TournamentDetailListItem
          name="Description"
          value={tournament.description}
        />
        <TournamentDetailListItem
          name="Date"
          value={dayjs(tournament.date).format("LLLL zzz")}
        />
        <TournamentDetailListItem name="Prize" value={tournament.prize} />
        <TournamentDetailListItem name="Location" value={tournament.location} />
      </dl>
      <ParticipantTable
        tournamentStatus={tournament.status}
        participants={participants}
      />
    </div>
  );
};

export default TournamentPage;
