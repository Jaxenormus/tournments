import { listWhopExperiences } from "@/actions/admin";
import { CreateTournamentForm } from "@/components/admin/forms/createTournamentForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { hasAccess } from "@/utils/session";
import Link from "next/link";

const AdminNewPage = async () => {
  const session = await hasAccess("admin");
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
          <BreadcrumbLink as={Link} href="/admin/new" isCurrentPage>
            New
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create Tournament</h2>
      </div>
      <CreateTournamentForm session={session} experiences={experiences} />
    </div>
  );
};

export default AdminNewPage;
