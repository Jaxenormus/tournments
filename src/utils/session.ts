import { cookies } from "next/dist/client/components/headers";
import { prisma } from "../../prisma";
import { redirect } from "next/navigation";

export const isExperienceOwner = async (accessToken: string) => {
  try {
    const res = await fetch(`${process.env.WHOP_API_URL}/api/v2/oauth/info`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = (await res.json()) as
      | {
          user: {
            authorized_user: {
              role: "owner" | "admin" | "moderator";
            };
          };
        }
      | { error: { status: number; message: string } };

    if ("error" in data) {
      console.error(data.error);
      return false;
    }

    return data.user.authorized_user.role === "owner";
  } catch (e) {
    return false;
  }
};

export interface TourneySession {
  user: { id: string; name: string };
  experienceId: string;
  accessToken: string;
}

export const hasAccess = async (
  access: "admin" | "consumer" | "adminOrConsumer"
): Promise<TourneySession | never> => {
  const userId = cookies().get("tourney_uid");
  const experienceId = cookies().get("tourney_eid");
  const accessToken = cookies().get("tourney_at");
  if (!userId || !experienceId || !accessToken) {
    return redirect("/no-access");
  }
  const user = await prisma.user.findFirst({
    where: { id: userId.value },
    include: { memberships: true },
  });
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
    isAdmin = await isExperienceOwner(accessToken.value);
  }
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
    accessToken: accessToken.value,
  };
};
