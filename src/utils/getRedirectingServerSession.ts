import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const getRedirectingServerSession = async () => {
  const session = await getServerSession();
  if (!session) redirect("/api/auth/signin");
  return session;
};
