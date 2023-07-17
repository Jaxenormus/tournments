import type { ButtonProps } from "@/components/ui/button/button";
import { Button } from "@/components/ui/button/button";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useState, type ReactNode, useRef } from "react";
import { toast } from "sonner";

interface DestructiveButtonProps extends ButtonProps {
  children: ReactNode;
  handleDelete: () => void;
}

export const DestructiveButton = ({
  children,
  handleDelete,
  ...props
}: DestructiveButtonProps) => {
  const [attempting, setAttempting] = useState(false);
  const [toastId, setToastId] = useState<string | number>();
  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    setAttempting(false);
    toast.dismiss(toastId);
  });
  return (
    <Button
      ref={ref}
      variant={attempting ? "destructive" : "outline"}
      onClick={() => {
        if (attempting) {
          setAttempting(false);
          handleDelete();
          toast.success("Deleted");
        } else {
          setAttempting(true);
          const tid = toast.message("Are you sure?", { delete: false });
          setToastId(tid);
        }
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
