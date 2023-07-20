import type { Tournament } from "@prisma/client";
import { dayjs } from "@/integrations/dayjs";

export const getTournamentTitle = (tournament: Tournament) => {
  const date = dayjs(tournament.date).format("MMMM D, YYYY");
  // truncate location to 8 characters and add ellipsis if longer
  const location =
    tournament.location.length > 15
      ? tournament.location.slice(0, 15) + "..."
      : tournament.location;
  return `${date} - ${location}`;
};
