import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { handleTournamentCompletion } from "@/inngest/functions";

export const { GET, POST, PUT } = serve(inngest, [handleTournamentCompletion]);
