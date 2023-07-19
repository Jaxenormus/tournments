"use client";

import { TournamentForm } from "@/components/admin/forms/tournamentForm";
import { Form } from "@/components/ui/form/core/form";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import type { z } from "zod";

import type { Tournament } from "@prisma/client";

import { editTournamentSchema } from "@/actions/schema";
import { editTournament } from "@/actions/tournament";

import { toast } from "sonner";
import { dayjs } from "@/integrations/dayjs";
import { minDelay } from "@/utils/minDelay";
import type { TourneySession } from "@/utils/session";

interface EditTournamentFormProps {
  id: string;
  session: TourneySession;
  tournament: Tournament;
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
            return await editTournament(props.session, props.id, values);
          }, 800);
          toast.success("Tournament has been updated");
          router.push(`/admin/${tournament.id}`);
        })}
      >
        <TournamentForm type="edit" />
      </form>
    </Form>
  );
};
