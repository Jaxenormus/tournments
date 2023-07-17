"use server";

import type { z } from "zod";

import type {
  createTournamentSchema,
  editTournamentSchema,
  manageTournamentSchema,
} from "@/actions/schema";
import type { Session } from "next-auth";
import { prisma } from "../../prisma";
import dayjs from "dayjs";
import { notFound } from "next/navigation";

export const createTournament = async (
  session: Session,
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
            name: session.user.name ?? session.user.email ?? session.user.id,
            role: "ADMIN",
            credits: 0,
          },
        },
      },
    },
  });
  return tournament;
};

export const findTournament = async (session: Session, id: string) => {
  const tournament = await prisma.tournament.findFirst({
    where: { id, user: { id: session.user.id, role: "ADMIN" } },
  });
  return tournament;
};

export const listTournaments = async (session: Session) => {
  const tournaments = await prisma.tournament.findMany({
    where: { user: { id: session.user.id, role: "ADMIN" } },
  });
  return tournaments;
};

export const editTournament = async (
  session: Session,
  id: string,
  input: z.infer<typeof editTournamentSchema>
) => {
  const oldTournament = await prisma.tournament.findFirst({
    where: { id, user: { id: session.user.id, role: "ADMIN" } },
  });
  if (!oldTournament) notFound();
  const tournament = await prisma.tournament.update({
    where: { id: id, user: { id: session.user.id, role: "ADMIN" } },
    data: {
      ...input,
      date: dayjs(input.date).toDate(),
    },
  });
  return tournament;
};

export const manageTournament = async (
  session: Session,
  id: string,
  input: z.infer<typeof manageTournamentSchema>
) => {
  const tournament = await prisma.tournament.update({
    where: { id: id, user: { id: session.user.id, role: "ADMIN" } },
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

export const deleteTournament = async (session: Session, id: string) => {
  const tournament = await prisma.tournament.delete({
    where: { id: id, user: { id: session.user.id, role: "ADMIN" } },
  });
  return tournament;
};

export const listParticipants = async (session: Session, id: string) => {
  const tournament = await prisma.participant.findMany({
    where: {
      tournament: {
        OR: [
          { user: { id: session.user.id, role: "ADMIN" } },
          { participants: { some: { user: { id: session.user.id } } } },
        ],
        id: id,
      },
    },
    include: { user: true },
  });
  return tournament;
};
