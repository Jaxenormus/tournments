"use client";

import { TournamentForm } from "@/components/admin/forms/tournamentForm";
import { Form } from "@/components/ui/form/core/form";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import type { z } from "zod";
import { createTournamentSchema } from "@/actions/schema";
import { createTournament } from "@/actions/tournament";

import type { Session } from "next-auth";
import { toast } from "sonner";
import dayjs from "dayjs";

interface CreateTournamentFormProps {
  session: Session;
}

export const CreateTournamentForm = (props: CreateTournamentFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof createTournamentSchema>>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: { date: dayjs().format("YYYY-MM-DDTHH:mm") },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          const tournament = await createTournament(props.session, values);
          toast.success("Tournament created");
          router.push(`/admin/${tournament.id}/edit`);
        })}
      >
        <TournamentForm type="create" />
      </form>
    </Form>
  );
};
