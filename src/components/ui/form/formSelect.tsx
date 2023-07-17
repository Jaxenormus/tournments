import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/core/select";

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
import type { SelectProps } from "@radix-ui/react-select";

type FormSelectOption = {
  label: string;
  value: string;
  metadata?: Record<string, unknown>;
};

type FormSelectProps<T extends FieldValues, O extends FormSelectOption> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  options: O[];
  renderOption?: (option: O) => React.ReactNode;
  placeholder?: string;
} & SelectProps;

const FormSelect = <
  T extends Record<string, unknown>,
  O extends FormSelectOption
>({
  control,
  name,
  label,
  description,
  ...props
}: FormSelectProps<T, O>) => {
  const isSubmitting = control._formState.isSubmitting;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col items-start space-y-2">
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            // @ts-expect-error - TODO: Fix this
            onValueChange={props.onValueChange ?? field.onChange}
            defaultValue={(props.value ?? field.value) as string}
            disabled={isSubmitting || props.disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={props.placeholder ?? "Select an option below"}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {props.options.map((option) => {
                if (props.renderOption) {
                  return props.renderOption(option);
                } else {
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  );
                }
              })}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className="pb-2 pl-1" />
        </FormItem>
      )}
    />
  );
};

export default FormSelect;
