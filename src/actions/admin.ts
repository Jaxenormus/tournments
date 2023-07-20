"use server";

import type { z } from "zod";

import type {
  createTournamentSchema,
  editTournamentSchema,
  manageTournamentSchema,
} from "@/actions/schema";

import { prisma } from "../../prisma";
import { dayjs } from "@/integrations/dayjs";
import { notFound } from "next/navigation";
import type { TourneySession } from "@/utils/session";
import { tournamentRevalidation } from "@/actions";
import { inngest } from "@/inngest/client";

export const createTournament = async (
  session: TourneySession,
  input: z.infer<typeof createTournamentSchema>
) => {
  const tournament = await prisma.tournament.create({
    data: {
      ...input,
      date: dayjs(input.date).utc().toISOString(),
      status: "ACTIVE",
      experienceIds: [session.experienceId],
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
  if (process.env.NODE_ENV === "production") {
    await inngest.send({
      name: "tournament/date.set",
      data: {
        id: tournament.id,
        isoDate: dayjs(tournament.date).toISOString(),
      },
    });
  }
  tournamentRevalidation();
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
    data: { ...input, date: dayjs(input.date).utc().toISOString() },
  });
  if (process.env.NODE_ENV === "production") {
    await inngest.send({
      name: "tournament/update",
      data: { id: tournament.id },
    });
    await inngest.send({
      name: "tournament/date.set",
      data: {
        id: tournament.id,
        isoDate: dayjs(tournament.date).toISOString(),
      },
    });
  }
  tournamentRevalidation();
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
  if (process.env.NODE_ENV === "production") {
    await inngest.send({
      name: "tournament/update",
      data: { id: tournament.id },
    });
  }
  tournamentRevalidation();
  return tournament;
};

export const deleteTournament = async (session: TourneySession, id: string) => {
  const tournament = await prisma.tournament.delete({
    where: { id: id, user: { id: session.user.id } },
  });
  await inngest.send({
    name: "tournament/delete",
    data: { id: tournament.id },
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

export const listWhopExperiences = async (
  session: TourneySession,
  page = 1
): Promise<{ id: string; name: string; description: string }[]> => {
  const res = await fetch(
    `${process.env.WHOP_API_URL}/api/v2/oauth/company/experiences?page=${page}`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } }
  );

  const data = (await res.json()) as {
    pagination: {
      current_page: number;
      total_page: number;
      total_count: number;
    };
    data: [
      {
        id: string;
        experience_type: string;
        name: string;
        description: string;
        properties: unknown;
        products: string;
        access_passes: string;
      }
    ];
  };

  const experiences = data.data.map((experience) => ({
    id: experience.id,
    name: experience.name,
    description: experience.description,
  }));

  if (data.pagination.current_page < data.pagination.total_page) {
    return experiences.concat(
      await listWhopExperiences(session, data.pagination.current_page + 1)
    );
  }

  return experiences;
};
