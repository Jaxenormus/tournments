import { Badge } from "@/components/ui/badge";
import type { TournamentStatus } from "@prisma/client";

interface TournamentStatusBadgeProps {
  status: TournamentStatus;
}

const normalizeStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const TournamentStatusBadge = (props: TournamentStatusBadgeProps) => {
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
};
