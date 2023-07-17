import type { Session } from "next-auth";
import { prisma } from "../../prisma";
import type { TournamentStatus } from "@prisma/client";

export const findExperienceTournament = async (id: string) => {
  const tournament = await prisma.tournament.findFirst({
    where: { id },
    include: { tiers: true },
  });
  return tournament;
};

export const listExperienceTournaments = async (status: TournamentStatus[]) => {
  const tournaments = await prisma.tournament.findMany({
    where: { status: { in: status }, date: { gt: new Date() } },
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
      user: { select: { name: true } },
      tier: { select: { name: true } },
    },
  });
  return participants;
};

export const listParticipatingExperienceTournaments = async (
  session: Session
) => {
  const tournaments = await prisma.tournament.findMany({
    where: { participants: { some: { user: { id: session.user.id } } } },
  });
  return tournaments;
};

export const joinExperienceTournament = async (
  session: Session,
  id: string,
  tierId: string
) => {
  const tournament = await prisma.tournament.findFirst({
    where: { id, status: "ACTIVE" },
  });
  if (!tournament) return null;
  const participant = await prisma.participant.upsert({
    where: { id: `${id}-${session.user.id}` },
    update: { tier: { connect: { id: tierId } } },
    create: {
      id: `${id}-${session.user.id}`,
      user: { connect: { id: session.user.id } },
      tournament: { connect: { id } },
      tier: { connect: { id: tierId } },
    },
  });
  return participant;
};
