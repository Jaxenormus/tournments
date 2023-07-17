"use client";

import type { ActionError } from "@/actions";
import { isActionError } from "@/actions";
import { Button } from "@/components/ui/button";
import type { Participant, Tournament } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface JoinTournamentButtonProps {
  hasJoined: boolean;
  tournament: Tournament;
  joinTournament: () =>
    | Promise<Participant | ActionError>
    | Participant
    | ActionError;
}

export const JoinTournamentButton = (props: JoinTournamentButtonProps) => {
  const router = useRouter();
  return (
    <Button
      className="w-full"
      disabled={props.tournament.status !== "ACTIVE" || props.hasJoined}
      onClick={async () => {
        try {
          const res = await props.joinTournament();
          console.log(res);
          if (isActionError(res)) {
            toast.error(res.error);
          } else {
            toast.success("Successfully joined tournament");
            router.push("/hub");
          }
        } catch {
          toast.error("Error occurred while joining the tournament");
        }
      }}
    >
      {props.hasJoined ? (
        "Joined"
      ) : (
        <> Join for {props.tournament.entryFee} credits</>
      )}
    </Button>
  );
};
