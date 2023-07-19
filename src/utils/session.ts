import { cookies } from "next/dist/client/components/headers";
import { prisma } from "../../prisma";
import { redirect } from "next/navigation";

interface HasAccessResponse {
  valid: true;
  authorized_user?: {
    role: "owner" | "admin" | "moderator";
    permission_level: 0 | 1 | 2;
  };
}

export const isExperienceOwner = async (
  accessToken: string,
  experienceId: string
) => {
  // try {
  //   const res = await fetch(
  //     `https://api.whop.com/api/v2/me/has_access/${experienceId}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );
  //   const data = (await res.json()) as HasAccessResponse;
  //   return data.authorized_user?.permission_level === 0;
  // } catch (e) {
  //   return false;
  // }
  return true;
};

export interface TourneySession {
  user: { id: string; name: string };
  experienceId: string;
}

export const hasAccess = async (
  access: "admin" | "consumer" | "adminOrConsumer"
): Promise<TourneySession | never> => {
  const userId = cookies().get("tourney_uid");
  const experienceId = cookies().get("tourney_eid");
  const accessToken = cookies().get("tourney_at");
  if (!userId || !experienceId || !accessToken) return redirect("/no-access");
  const user = await prisma.user.findFirst({
    where: { id: userId.value },
    include: { memberships: true },
  });
  if (!user) return redirect("/no-access");
  if (access === "consumer") {
    const hasMembership = user.memberships.some(
      (membership) => membership.experienceId === experienceId.value
    );
    if (!hasMembership) return redirect("/no-access");
  }
  if (access === "admin" || access === "adminOrConsumer") {
    const isAdmin = await isExperienceOwner(
      accessToken.value,
      experienceId.value
    );
    if (!isAdmin) return redirect("/no-access");
  }
  return {
    user: { id: userId.value, name: user.name },
    experienceId: experienceId.value,
  };
};
