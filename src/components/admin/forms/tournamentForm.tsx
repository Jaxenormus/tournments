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
      <div className="space-y-2">
        <FormLabel>Tiers</FormLabel>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 bg-gray-100 rounded-md border border-gray-200 p-4 gap-4">
            {form.watch("tiers").map((_, i) => (
              <div
                className="bg-white space-y-5 p-4 rounded-md w-full border border-gray-200"
                key={i}
              >
                <FormInput
                  control={form.control}
                  name={`tiers.${i}.name`}
                  label="Name"
                  placeholder="Competitive"
                />
                <FormInput
                  control={form.control}
                  name={`tiers.${i}.description`}
                  label="Description"
                  placeholder="Compete against the best teams in the world"
                />
                <FormInput
                  control={form.control}
                  name={`tiers.${i}.price`}
                  label="Price"
                  placeholder="100"
                  type="number"
                  onChange={(e) => {
                    const tiers = form.watch("tiers");
                    tiers[i].price = parseInt(e.target.value);
                    form.setValue("tiers", tiers);
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    const tiers = form.watch("tiers");
                    tiers.splice(i, 1);
                    form.setValue("tiers", tiers);
                  }}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
          <Button
            className="w-full"
            variant="outline"
            type="button"
            onClick={() => {
              form.setValue("tiers", [
                ...form.watch("tiers"),
                { name: "", description: "", price: 0 },
              ]);
            }}
          >
            Add Tier
          </Button>
        </div>
      </div>
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
