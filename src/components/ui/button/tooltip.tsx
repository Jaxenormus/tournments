"use client";

import type { ButtonProps } from "@/components/ui/button/button";
import { Button } from "@/components/ui/button/button";
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
      <TooltipTrigger asChild>
        <Button {...props}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent>{tip}</TooltipContent>
    </Tooltip>
  );
};
