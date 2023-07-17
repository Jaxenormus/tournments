import { cn } from "@/utils/utils";
import React from "react";
import { type Control, type FieldValues, type Path } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form/core/form";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/form/core/input";

type InputOrTextArea =
  | "textarea"
  | React.InputHTMLAttributes<HTMLInputElement>["type"];

type FormInputProps<
  T extends FieldValues,
  U extends InputOrTextArea
> = (U extends "textarea"
  ? React.TextareaHTMLAttributes<HTMLTextAreaElement>
  : React.InputHTMLAttributes<HTMLInputElement>) & {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  type?: U;
};

const FormInput = <
  T extends Record<string, unknown>,
  U extends InputOrTextArea
>({
  control,
  name,
  label,
  description,
  type = "text" as U,
  className,
  ...props
}: FormInputProps<T, U>) => {
  const isSubmitting = control._formState.isSubmitting;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn("flex flex-col items-start space-y-2", className)}
        >
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {type === "textarea" ? (
              <Textarea
                {...(field as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                disabled={isSubmitting || props.disabled}
              />
            ) : (
              <Input
                type={type}
                {...(field as React.InputHTMLAttributes<HTMLInputElement>)}
                {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                disabled={isSubmitting || props.disabled}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className="pb-2 pl-1" />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
