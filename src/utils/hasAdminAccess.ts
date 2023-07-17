import { checkHasAccess } from "@/utils/checkHasAccess";
import { getRouteAuthSession } from "@/utils/getRouteAuthSession";
import { redirect } from "next/navigation";

export const hasAdminAccess = async () => {
  const session = await getRouteAuthSession();
  if (!session) redirect("/api/auth/signin");
  const hasAccess = checkHasAccess(session, true);
  if (!hasAccess) redirect("/");
  return session;
};
