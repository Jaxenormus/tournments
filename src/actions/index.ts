export type ActionError = { error: string };

export const isActionError = (error: any): error is ActionError =>
  typeof error === "object" && error !== null && "error" in error;
