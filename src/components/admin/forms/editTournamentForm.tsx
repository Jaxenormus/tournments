"use client";

import { TournamentForm } from "@/components/admin/forms/tournamentForm";
import { Form } from "@/components/ui/form/core/form";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import type { z } from "zod";

import type { Tournament } from "@prisma/client";

import { editTournamentSchema } from "@/actions/schema";
import { editTournament } from "@/actions/admin";

import { toast } from "sonner";
import { dayjs } from "@/integrations/dayjs";
import { minDelay } from "@/utils/minDelay";
import type { TourneySession } from "@/actions/session";

interface EditTournamentFormProps {
  id: string;
  session: TourneySession;
  tournament: Tournament;
  experiences: { id: string; name: string }[];
}

export const EditTournamentForm = (props: EditTournamentFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof editTournamentSchema>>({
    defaultValues: {
      ...props.tournament,
      date: dayjs(props.tournament.date).format("YYYY-MM-DD[T]HH:mm"),
    },
    resolver: zodResolver(editTournamentSchema),
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          const tournament = await minDelay(async () => {
            return await editTournament(props.session, props.id, {
              ...values,
              date: dayjs.tz(values.date, dayjs.tz.guess()).toISOString(),
            });
          }, 800);
          toast.success("Tournament has been updated");
          router.push(`/admin/${tournament.id}`);
        })}
      >
        <TournamentForm type="edit" experiences={props.experiences} />
      </form>
    </Form>
  );
};
