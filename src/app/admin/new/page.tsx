import { listWhopExperiences } from "@/actions/admin";
import { CreateTournamentForm } from "@/components/admin/forms/createTournamentForm";
import { Header } from "@/components/common/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { hasAccess } from "@/actions/session";
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
      <Header title="Create Tournament" />
      <CreateTournamentForm session={session} experiences={experiences} />
    </div>
  );
};

export default AdminNewPage;
