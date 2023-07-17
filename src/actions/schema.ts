import { TournamentStatus } from "@prisma/client";
import { z } from "zod";

export const baseTierSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
  price: z.number().min(0),
});

export const baseTournamentSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
  location: z.string().min(1).max(255),
  date: z.string(),
  prize: z.string().min(1).max(255),
  tiers: z.array(baseTierSchema),
});

export const createTournamentSchema = baseTournamentSchema;

export const editTournamentSchema = baseTournamentSchema.extend({
  status: z.nativeEnum(TournamentStatus),
  tiers: z.array(baseTierSchema.extend({ id: z.string().nullish() })),
});

export const manageTournamentSchema = z.object({
  winner: z.object({ id: z.string() }).nullish(),
});
