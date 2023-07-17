import { checkHasAccess } from "@/utils/checkHasAccess";
import { getRouteAuthSession } from "@/utils/getRouteAuthSession";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

const Redirect = async () => {
  const session = await getRouteAuthSession();
  if (!session) return redirect("/api/auth/signin");
  const hasAdminAccess = await checkHasAccess(session, true);
  if (hasAdminAccess) return redirect("/admin");
  const hasHubAccess = await checkHasAccess(session, false);
  if (hasHubAccess) return redirect("/hub");
  return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  );
};

export default Redirect;
