import { prisma } from "../../prisma";
import { inngest } from "./client";

export const handleScheduleTournamentCompletion = inngest.createFunction(
  {
    name: "Schedule tournament completion",
    cancelOn: [
      { event: "tournament/update", match: "data.id" },
      { event: "tournament/delete", match: "data.id" },
    ],
  },
  { event: "tournament/date.set" },
  async ({ event, step }) => {
    await step.sleepUntil(event.data.isoDate);
    return await step.run("Update tournament status", async () => {
      return await prisma.tournament.update({
        where: { id: event.data.id },
        data: { status: "COMPLETED" },
      });
    });
  }
);
