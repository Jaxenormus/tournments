"use client";

import { Form } from "@/components/ui/form/core/form";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import type { z } from "zod";
import FormSelect from "@/components/ui/form/formSelect";
import type { manageTournamentSchema } from "@/actions/schema";
import { manageTournament } from "@/actions/admin";
import type { Participant, Tournament } from "@prisma/client";
import { toast } from "sonner";
import { minDelay } from "@/utils/minDelay";
import { LoadingFormButton } from "@/components/ui/button/loading";
import type { TourneySession } from "@/utils/session";

interface ManageTournamentFormProps {
  id: string;
  session: TourneySession;
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
          const tournament = await minDelay(async () => {
            return await manageTournament(props.session, props.id, values);
          }, 800);
          toast.success("Tournament winner has been updated");
          router.push(`/admin/${tournament.id}`);
        })}
      >
        <div className="space-y-5">
          <FormSelect
            control={form.control}
            name="winner"
            label="Winner"
            placeholder="Select a winner"
            options={props.participants.map((participant) => ({
              label:
                participant.user.name ?? participant.userId ?? participant.id,
              value: participant.userId,
            }))}
            value={form.watch("winner")?.id}
            onValueChange={(e) => {
              form.setValue("winner", { id: e as unknown as string });
            }}
          />
          <LoadingFormButton type="submit" className="w-full">
            Save
          </LoadingFormButton>
        </div>
      </form>
    </Form>
  );
};
