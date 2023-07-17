export type ActionError = { error: string };

export const isActionError = (error: unknown): error is ActionError =>
  typeof error === "object" && error !== null && "error" in error;
