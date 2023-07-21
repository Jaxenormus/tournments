import { TournamentStatus } from "@prisma/client";
import { z } from "zod";

export const baseTournamentSchema = z.object({
  description: z.string().min(1).max(255),
  location: z.string().min(1).max(255),
  date: z.string(),
  prize: z.string().min(1).max(255),
  experienceIds: z.array(z.string()).min(1),
});

export const createTournamentSchema = baseTournamentSchema;

export const editTournamentSchema = baseTournamentSchema.extend({
  status: z.nativeEnum(TournamentStatus),
});

export const manageTournamentSchema = z.object({
  winner: z.object({ id: z.string() }).nullish(),
});
