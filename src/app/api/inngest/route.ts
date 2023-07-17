import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { handleScheduleTournamentCompletion } from "@/inngest/functions";

export const { GET, POST, PUT } = serve(inngest, [
  handleScheduleTournamentCompletion,
]);
