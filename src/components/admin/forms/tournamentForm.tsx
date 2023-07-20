"use client";

import FormInput from "@/components/ui/form/formInput";
import {
  FormControl,
  FormDescription,
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
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import type { editTournamentSchema } from "@/actions/schema";
import { LoadingFormButton } from "@/components/ui/button/loading";
import ReactSelect from "react-select";

interface TournamentFormProps {
  type: "create" | "edit";
  experiences: { id: string; name: string }[];
}

export const TournamentForm = (props: TournamentFormProps) => {
  const form = useFormContext<z.infer<typeof editTournamentSchema>>();
  return (
    <div className="space-y-5">
      <FormInput
        control={form.control}
        type="input"
        name="description"
        label="Description"
        placeholder="4 teams of two"
      />
      <FormField
        control={form.control}
        name="experienceIds"
        render={() => (
          <FormItem className="space-y-2">
            <div>
              <FormLabel>Allowed Experiences</FormLabel>
              <FormDescription>
                Select experiences that are allowed to participate in this
                tournament by purchasing access. Please note that 1 purchase is
                1 tournament booking
              </FormDescription>
            </div>
            <ReactSelect
              value={form.watch("experienceIds").map((eid) => ({
                label:
                  props.experiences.find((experience) => experience.id === eid)
                    ?.name ?? "Unknown",
                value: eid,
              }))}
              options={props.experiences.map((experience) => ({
                label: experience.name,
                value: experience.id,
              }))}
              isMulti
              onChange={(values) => {
                form.setValue(
                  "experienceIds",
                  values?.map((value) => value.value)
                );
              }}
            />
            <FormMessage className="pb-2 pl-1" />
          </FormItem>
        )}
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
      <LoadingFormButton type="submit" className="w-full">
        {props.type === "create" ? "Create" : "Save"}
      </LoadingFormButton>
    </div>
  );
};
