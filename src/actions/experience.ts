import type { Session } from "next-auth";
import { prisma } from "../../prisma";
import type { TournamentStatus } from "@prisma/client";

export const findExperienceTournament = async (id: string) => {
  const tournament = await prisma.tournament.findFirst({
    where: { id },
  });
  return tournament;
};

export const listExperienceTournaments = async (
  status: TournamentStatus[],
  showPast = false
) => {
  const tournaments = await prisma.tournament.findMany({
    where: {
      status: { in: status },
      ...(showPast ? {} : { date: { gt: new Date() } }),
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
  session: Session
) => {
  const tournaments = await prisma.tournament.findMany({
    where: { participants: { some: { user: { id: session.user.id } } } },
  });
  return tournaments;
};

export const joinExperienceTournament = async (
  session: Session,
  id: string
) => {
  const tournament = await prisma.tournament.findFirst({
    where: { id, status: "ACTIVE" },
  });
  if (!tournament) return { error: "Unable to find tournament" };
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    select: { credits: true },
  });
  if (!user) return { error: "Unable to find authenticated user" };
  if (user.credits < tournament.entryFee)
    return { error: "Insufficient credits" };
  return await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: tournament.entryFee } },
    });
    const participant = await tx.participant.create({
      data: {
        id: `${id}-${session.user.id}`,
        user: { connect: { id: session.user.id } },
        tournament: { connect: { id } },
      },
    });
    return participant;
  });
};
