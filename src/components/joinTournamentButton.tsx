"use client";

import type { ActionError } from "@/actions";
import { isActionError } from "@/actions";
import { LoadingButton } from "@/components/loadingButton";
import { minDelay } from "@/utils/minDelay";
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
    <LoadingButton
      className="w-full"
      disabled={props.tournament.status !== "ACTIVE" || props.hasJoined}
      onClick={async () => {
        try {
          const res = minDelay(async () => {
            return await props.joinTournament();
          }, 800);
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
    </LoadingButton>
  );
};
