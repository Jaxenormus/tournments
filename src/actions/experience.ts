import type { TourneySession } from "@/utils/session";
import { prisma } from "../../prisma";
import type { TournamentStatus } from "@prisma/client";
import { tournamentRevalidation } from "@/actions";

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
  const experienceCredits = await prisma.credit.findMany({
    where: { experienceIds: { has: session.experienceId } },
  });
  if (experienceCredits.length < tournament.entryFee)
    return { error: "Insufficient credits" };
  const data = await prisma.$transaction(async (tx) => {
    const experienceCreditIds = experienceCredits.map((credit) => credit.id);
    for (let i = 0; i < tournament.entryFee; i++) {
      await tx.credit.delete({ where: { id: experienceCreditIds[i] } });
      experienceCreditIds.splice(i, 1);
    }
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

export const fetchWhopExperienceDetails = async (session: TourneySession) => {
  const res = await fetch(
    `${process.env.WHOP_API_URL}/api/v2/experiences/${session.experienceId}`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } }
  );

  const experienceData = (await res.json()) as {
    id: string;
    experience_type: string;
    name: string;
    description: string;
    properties: unknown;
    products: string;
    access_passes: string;
  };

  console.log(experienceData);

  return experienceData;
};
