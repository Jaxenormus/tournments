"use server";

import type { TourneySession } from "@/utils/session";
import { prisma } from "../../prisma";

export const getHubStatistics = async (session: TourneySession) => {
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    select: {
      credits: { where: { experienceIds: { has: session.experienceId } } },
    },
  });
  const upcomingTournaments = await prisma.tournament.count({
    where: {
      participants: { some: { user: { id: session.user.id } } },
      status: "ACTIVE",
      date: { gt: new Date() },
      experienceIds: { has: session.experienceId },
    },
  });
  const wonTournaments = await prisma.tournament.count({
    where: {
      winner: { id: session.user.id },
      status: "COMPLETED",
      experienceIds: { has: session.experienceId },
    },
  });
  return {
    credits: user?.credits.length ?? 0,
    upcomingTournaments,
    wonTournaments,
  };
};
