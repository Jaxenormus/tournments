import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipButtonProps extends ButtonProps {
  tip: string;
  children: React.ReactNode;
}

export const TooltipButton = ({
  tip,
  children,
  ...props
}: TooltipButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button {...props}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent>{tip}</TooltipContent>
    </Tooltip>
  );
};
