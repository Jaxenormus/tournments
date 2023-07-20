import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/utils";
import type { TournamentStatus } from "@prisma/client";

interface TournamentStatusBadgeProps {
  status: TournamentStatus;
  isAdmin?: boolean;
}

const normalizeStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const TournamentStatusBadge = (props: TournamentStatusBadgeProps) => {
  if (props.isAdmin) {
    return (
      <div
        className={cn("rounded-md p-4 border", {
          "bg-blue-100 border-blue-200": props.status === "ACTIVE",
          "bg-yellow-100 border-yellow-200": props.status === "DRAFT",
          "bg-red-100 border-red-200": props.status === "CANCELLED",
          "bg-green-100 border-green-200": props.status === "COMPLETED",
        })}
      >
        <div className="flex">
          <p
            className={cn("text-sm font-medium", {
              "text-blue-800": props.status === "ACTIVE",
              "text-yellow-800": props.status === "DRAFT",
              "text-red-800": props.status === "CANCELLED",
              "text-green-800": props.status === "COMPLETED",
            })}
          >
            {props.status === "ACTIVE"
              ? "This tournament is live and is available to be booked by users with access to the experiences listed below."
              : props.status === "DRAFT"
              ? "This tournament is currently a draft but will be bookable by users with access to the experiences listed below once it is published."
              : props.status === "CANCELLED"
              ? "This tournament has been canceled and is no longer bookable by users"
              : "This tournament is completed and no longer bookable by users"}
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <Badge
        variant={
          props.status === "ACTIVE"
            ? "default"
            : props.status === "DRAFT"
            ? "warning"
            : props.status === "CANCELLED"
            ? "destructive"
            : "success"
        }
      >
        {normalizeStatus(props.status)}
      </Badge>
    );
  }
};
