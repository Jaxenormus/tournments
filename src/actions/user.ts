import type { TourneySession } from "@/actions/session";
import { prisma } from "@/prisma";
import type { TournamentStatus } from "@prisma/client";
import { tournamentRevalidation } from "@/actions";
import { captureException } from "@sentry/nextjs";

export const findExperienceTournament = async (
  session: TourneySession,
  id: string
) => {
  const tournament = await prisma.tournament.findFirst({
    where: { id, experienceIds: { has: session.experienceId } },
  });
  return tournament;
};

export const listExperienceTournaments = async (
  session: TourneySession,
  status: TournamentStatus[],
  showPast = false
) => {
  const tournaments = await prisma.tournament.findMany({
    where: {
      status: { in: status },
      ...(showPast ? {} : { date: { gt: new Date() } }),
      experienceIds: { has: session.experienceId },
    },
    include: {
      participants: { select: { id: true, user: { select: { id: true } } } },
    },
  });
  return tournaments;
};

export const listExperienceTournamentParticipants = async (id: string) => {
  const participants = await prisma.participant.findMany({
    where: { tournament: { id } },
    include: {
      user: { select: { id: true, name: true } },
    },
  });
  const winner = await prisma.tournament.findFirst({
    where: { id },
    select: { winner: { select: { id: true } } },
  });
  return participants.map((participant) => ({
    ...participant,
    isWinner: winner?.winner?.id === participant.user.id,
  }));
};

export const listParticipatingExperienceTournaments = async (
  session: TourneySession
) => {
  const tournaments = await prisma.tournament.findMany({
    where: {
      participants: { some: { user: { id: session.user.id } } },
      experienceIds: { has: session.experienceId },
    },
  });
  return tournaments;
};

export const joinExperienceTournament = async (
  session: TourneySession,
  id: string
) => {
  const tournament = await prisma.tournament.findFirst({
    where: {
      id,
      status: "ACTIVE",
      experienceIds: { has: session.experienceId },
    },
  });
  if (!tournament) return { error: "Unable to find tournament" };
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
  });
  if (!user) return { error: "Unable to find authenticated user" };
  const credit = await prisma.credit.findFirst({
    where: {
      experienceIds: { has: session.experienceId },
      user: { id: session.user.id },
    },
  });
  if (!credit) return { error: "Insufficient credits" };
  const data = await prisma.$transaction(async (tx) => {
    await tx.credit.delete({ where: { id: credit.id } });
    const participant = await tx.participant.create({
      data: {
        id: `${id}-${session.user.id}`,
        user: { connect: { id: session.user.id } },
        tournament: { connect: { id } },
      },
    });
    return participant;
  });
  tournamentRevalidation();
  return data;
};

export const fetchWhopExperienceName = async (
  session: TourneySession
): Promise<string> => {
  const res = await fetch(
    `${process.env.WHOP_API_URL}/api/v2/experiences/${session.experienceId}`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } }
  );

  const experienceData = (await res.json()) as
    | {
        id: string;
        experience_type: string;
        name: string;
        description: string;
        properties: unknown;
        products: string;
        access_passes: string;
      }
    | { error: { status: number; message: string } };

  if ("error" in experienceData) {
    captureException(experienceData.error);
    return "Tournaments";
  }

  return experienceData.name;
};

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
