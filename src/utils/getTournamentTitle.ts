import type { Tournament } from "@prisma/client";
import { dayjs } from "@/integrations/dayjs";

export const getTournamentTitle = (
  tournament: Tournament,
  length = 15
) => {
  const date = dayjs(tournament.date).format("MMMM D, YYYY");
  // truncate location to 8 characters and add ellipsis if longer
  const location =
    tournament.location.length > length
      ? tournament.location.slice(0, length) + "..."
      : tournament.location;
  return `${date} - ${location}`;
};
