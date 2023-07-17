import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useFormContext } from "react-hook-form";

export const LoadingButton = (props: ButtonProps) => {
  const [isLoading, startTransition] = useTransition();
  return (
    <Button
      {...props}
      disabled={isLoading || props.disabled}
      onClick={(event) => {
        startTransition(async () => {
          // Create an artificial delay to show the loading spinner for at least 800ms (to prevent flashing)
          if (props.onClick) props.onClick(event);
        });
      }}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        props.children
      )}
    </Button>
  );
};

export const LoadingFormButton = (props: ButtonProps) => {
  const form = useFormContext();
  return (
    <Button {...props} disabled={form.formState.isSubmitting || props.disabled}>
      {form.formState.isSubmitting ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        props.children
      )}
    </Button>
  );
};
