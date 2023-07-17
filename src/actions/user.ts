"use server";

import type { Session } from "next-auth";
import { prisma } from "../../prisma";

export const getHubStatistics = async (session: Session) => {
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    select: { credits: true },
  });
  const upcomingTournaments = await prisma.tournament.count({
    where: {
      participants: { some: { user: { id: session.user.id } } },
      status: "ACTIVE",
      date: { gt: new Date() },
    },
  });
  const wonTournaments = await prisma.tournament.count({
    where: {
      winner: { id: session.user.id },
      status: "COMPLETED",
    },
  });
  return {
    credits: user?.credits ?? 0,
    upcomingTournaments,
    wonTournaments,
  };
};
