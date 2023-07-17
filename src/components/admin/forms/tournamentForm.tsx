"use client";

import FormInput from "@/components/ui/form/formInput";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form/core/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/core/select";
import { TournamentStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import type { editTournamentSchema } from "@/actions/schema";

interface TournamentFormProps {
  type: "create" | "edit";
}

export const TournamentForm = (props: TournamentFormProps) => {
  const form = useFormContext<z.infer<typeof editTournamentSchema>>();
  return (
    <div className="space-y-5">
      <FormInput
        control={form.control}
        name="name"
        label="Name"
        placeholder="Spikeball Tournament"
      />
      <FormInput
        control={form.control}
        type="textarea"
        name="description"
        label="Description"
        placeholder="Participate in the most competitive spikeball tournament in the world!"
      />
      <FormInput
        control={form.control}
        type="number"
        name="entryFee"
        label="Entry Fee (in Whop Credits)"
        placeholder="10"
        onChange={(e) =>
          form.setValue("entryFee", parseInt(e.target.value, 10))
        }
      />
      <FormInput
        control={form.control}
        name="prize"
        label="Prize"
        placeholder="$1000 USD Cash"
      />
      <FormInput
        control={form.control}
        type="datetime-local"
        name="date"
        label="Date"
      />
      <FormInput
        control={form.control}
        name="location"
        label="Location"
        placeholder="San Francisco, CA"
      />
      {props.type === "edit" && (
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={(value: TournamentStatus) =>
                  field.onChange(value)
                }
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(TournamentStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.toLowerCase().slice(0, 1).toUpperCase() +
                        status.toLowerCase().slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <Button className="w-full">
        {form.formState.isSubmitting ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : props.type === "create" ? (
          "Create"
        ) : (
          "Save"
        )}
      </Button>
    </div>
  );
};
