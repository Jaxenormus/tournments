"use server";

import type { z } from "zod";

import type {
  createTournamentSchema,
  editTournamentSchema,
  manageTournamentSchema,
} from "@/actions/schema";

import { prisma } from "../../prisma";
import dayjs from "dayjs";
import { notFound } from "next/navigation";
import type { TourneySession } from "@/utils/session";

export const createTournament = async (
  session: TourneySession,
  input: z.infer<typeof createTournamentSchema>
) => {
  const tournament = await prisma.tournament.create({
    data: {
      ...input,
      date: dayjs(input.date).toDate(),
      status: "ACTIVE",
      user: {
        connectOrCreate: {
          where: { id: session.user.id },
          create: {
            id: session.user.id,
            name: session.user.name ?? session.user.id,
          },
        },
      },
    },
  });
  return tournament;
};

export const findTournament = async (session: TourneySession, id: string) => {
  const tournament = await prisma.tournament.findFirst({
    where: { id, user: { id: session.user.id } },
  });
  return tournament;
};

export const listTournaments = async (session: TourneySession) => {
  const tournaments = await prisma.tournament.findMany({
    where: { user: { id: session.user.id } },
  });
  return tournaments;
};

export const editTournament = async (
  session: TourneySession,
  id: string,
  input: z.infer<typeof editTournamentSchema>
) => {
  const oldTournament = await prisma.tournament.findFirst({
    where: { id, user: { id: session.user.id } },
  });
  if (!oldTournament) notFound();
  const tournament = await prisma.tournament.update({
    where: { id: id, user: { id: session.user.id } },
    data: {
      ...input,
      date: dayjs(input.date).toDate(),
    },
  });
  return tournament;
};

export const manageTournament = async (
  session: TourneySession,
  id: string,
  input: z.infer<typeof manageTournamentSchema>
) => {
  const tournament = await prisma.tournament.update({
    where: { id: id, user: { id: session.user.id } },
    data: {
      ...(input.winner ? { status: "COMPLETED" } : {}),
      winner: {
        ...(input.winner
          ? { connect: { id: input.winner.id } }
          : { disconnect: true }),
      },
    },
  });
  return tournament;
};

export const deleteTournament = async (session: TourneySession, id: string) => {
  const tournament = await prisma.tournament.delete({
    where: { id: id, user: { id: session.user.id } },
  });
  return tournament;
};

export const listParticipants = async (session: TourneySession, id: string) => {
  const tournament = await prisma.participant.findMany({
    where: {
      tournament: {
        OR: [
          { user: { id: session.user.id } },
          { participants: { some: { user: { id: session.user.id } } } },
        ],
        id: id,
      },
    },
    include: { user: true },
  });
  const winner = await prisma.tournament.findFirst({
    where: { id },
    select: { winner: { select: { id: true } } },
  });
  return tournament.map((participant) => ({
    ...participant,
    isWinner: winner?.winner?.id === participant.user.id,
  }));
};
