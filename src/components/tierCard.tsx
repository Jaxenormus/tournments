"use client";

import type { ActionError } from "@/actions";
import { isActionError } from "@/actions";
import { Button } from "@/components/ui/button";
import type { Participant, Tier, Tournament } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TierCardProps {
  tier: Tier;
  tournament: Tournament;
  joinTournament: (
    tierId: string
  ) => Promise<Participant | ActionError> | Participant | ActionError;
}

export const TierCard = (props: TierCardProps) => {
  const router = useRouter();
  return (
    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 space-y-4">
      <div>
        <h4 className="text-xl font-semibold tracking-tight">
          {props.tier.name}
        </h4>
        <p className="text-gray-500">{props.tier.description}</p>
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Button
          className="w-full"
          disabled={props.tournament.status !== "ACTIVE"}
          onClick={async () => {
            try {
              const res = await props.joinTournament(props.tier.id);
              console.log(res);
              if (isActionError(res)) {
                toast.error(res.error);
              } else {
                toast.success("Successfully joined tournament");
                router.push("/me");
              }
            } catch {
              toast.error("Error occurred while joining the tournament");
            }
          }}
        >
          Join for ${props.tier.price}
        </Button>
      </div>
    </div>
  );
};
