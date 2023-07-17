"use client";

import { TournamentForm } from "@/components/admin/forms/tournamentForm";
import { Form } from "@/components/ui/form/core/form";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import type { z } from "zod";

import type { Tier, Tournament } from "@prisma/client";

import { editTournamentSchema } from "@/actions/schema";
import { editTournament } from "@/actions/tournament";
import type { Session } from "next-auth";
import { toast } from "sonner";
import { dayjs } from "@/integrations/dayjs";

interface EditTournamentFormProps {
  id: string;
  session: Session;
  tournament: Tournament & { tiers: Tier[] };
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
          await editTournament(props.session, props.id, values);
          toast.success("Tournament updated");
          router.push("/admin");
        })}
      >
        <TournamentForm type="edit" />
      </form>
    </Form>
  );
};
