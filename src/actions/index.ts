import { revalidatePath } from "next/cache";

export type ActionError = { error: string };

export const isActionError = (error: unknown): error is ActionError =>
  typeof error === "object" && error !== null && "error" in error;

export const tournamentRevalidation = () => {
  revalidatePath("/hub");
  revalidatePath("/[experienceId]");
  revalidatePath("/admin");
  revalidatePath("/admin/[experienceId]");
};
