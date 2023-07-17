"use client";

import { Form } from "@/components/ui/form/core/form";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import type { z } from "zod";
import FormSelect from "@/components/ui/form/formSelect";
import type { manageTournamentSchema } from "@/actions/schema";
import { manageTournament } from "@/actions/tournament";
import type { Session } from "next-auth";
import type { Participant, Tournament } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ManageTournamentFormProps {
  id: string;
  session: Session;
  tournament: Tournament;
  participants: (Participant & { user: { name: string } })[];
}

export const ManageTournamentForm = (props: ManageTournamentFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof manageTournamentSchema>>({
    defaultValues: props.tournament.winnerId
      ? { winner: { id: props.tournament.winnerId } }
      : {},
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          const tournament = await manageTournament(
            props.session,
            props.id,
            values
          );
          toast.success("Tournament winner updated");
          router.push(`/admin/${tournament.id}/manage`);
        })}
      >
        <div className="space-y-5">
          <FormSelect
            control={form.control}
            name="winner"
            label="Winner"
            placeholder="Select a winner"
            options={props.participants.map((participant) => ({
              label: participant.id,
              value: participant.id,
            }))}
          />
          <Button type="submit" className="w-full">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
