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
  try {
    const res = await fetch(
      `https://staging.whop.com/api/v2/me/has_access/${experienceId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = (await res.json()) as HasAccessResponse;
    console.log(data);
    return data.authorized_user?.permission_level === 0;
  } catch (e) {
    return false;
  }
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
  console.log(userId, experienceId, accessToken);
  if (!userId || !experienceId || !accessToken) {
    return redirect("/no-access");
  }
  const user = await prisma.user.findFirst({
    where: { id: userId.value },
    include: { memberships: true },
  });
  console.log(user);
  if (!user) {
    return redirect("/no-access");
  }
  let hasMembership = false;
  let isAdmin = false;
  if (access === "consumer" || access === "adminOrConsumer") {
    hasMembership = user.memberships.some(
      (membership) => membership.experienceId === experienceId.value
    );
  }
  if (access === "admin" || access === "adminOrConsumer") {
    isAdmin = await isExperienceOwner(accessToken.value, experienceId.value);
  }
  console.log(isAdmin, hasMembership);
  if (
    (access === "adminOrConsumer" && !isAdmin && !hasMembership) ||
    (access === "admin" && !isAdmin) ||
    (access === "consumer" && !hasMembership)
  ) {
    return redirect("/no-access");
  }
  return {
    user: { id: userId.value, name: user.name },
    experienceId: experienceId.value,
  };
};
