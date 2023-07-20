"use client";

import { TournamentForm } from "@/components/admin/forms/tournamentForm";
import { Form } from "@/components/ui/form/core/form";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import type { z } from "zod";
import { createTournamentSchema } from "@/actions/schema";

import { dayjs } from "@/integrations/dayjs";
import { minDelay } from "@/utils/minDelay";
import { createTournament } from "@/actions/admin";
import { toast } from "sonner";
import type { TourneySession } from "@/utils/session";

interface CreateTournamentFormProps {
  session: TourneySession;
  experiences: { id: string; name: string }[];
}

export const CreateTournamentForm = (props: CreateTournamentFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof createTournamentSchema>>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: {
      date: dayjs().format("YYYY-MM-DDTHH:mm"),
      experienceIds: [props.session.experienceId],
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          const tournament = await minDelay(async () => {
            return await createTournament(props.session, {
              ...values,
              date: dayjs.tz(values.date, dayjs.tz.guess()).toISOString(),
            });
          }, 800);
          toast.success("Tournament has been created");
          router.push(`/admin/${tournament.id}`);
        })}
      >
        <TournamentForm type="create" experiences={props.experiences} />
      </form>
    </Form>
  );
};
