import { LoadingScreen } from "@/components/loadingScreen";
import { checkHasAccess } from "@/utils/checkHasAccess";
import { getRouteAuthSession } from "@/utils/getRouteAuthSession";
import { redirect } from "next/navigation";

const Redirect = async () => {
  const session = await getRouteAuthSession();
  if (!session) return redirect("/api/auth/signin");
  const hasAdminAccess = await checkHasAccess(session, true);
  if (hasAdminAccess) return redirect("/admin");
  const hasHubAccess = await checkHasAccess(session, false);
  if (hasHubAccess) return redirect("/hub");
  return <LoadingScreen />;
};

export default Redirect;
