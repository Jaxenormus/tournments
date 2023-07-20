import { prisma } from "../../prisma";
import { inngest } from "./client";
import dayjs from "dayjs";

export const handleTournamentCompletion = inngest.createFunction(
  {
    name: "Handle Tournament Completion",
    cancelOn: [
      { event: "tournament/update", match: "data.id" },
      { event: "tournament/delete", match: "data.id" },
    ],
  },
  { event: "tournament/date.set" },
  async ({ event, step }) => {
    await step.sleepUntil(dayjs(event.data.date).toDate());
    const newTournament = await prisma.tournament.update({
      where: { id: event.data.id },
      data: { status: "COMPLETED" },
    });
    return newTournament;
  }
);
