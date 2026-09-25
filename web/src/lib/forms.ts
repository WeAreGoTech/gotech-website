import type { ZodError } from "zod";

export type NewAccount = { name: string; email: string; password: string; companyName: string; loginUrl: string };

export type ActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
  // a customer account staff just created: the password is shown once, then gone
  account?: NewAccount;
  // changes on every successful submit so forms can reset themselves
  submittedAt?: number;
};

export const IDLE: ActionState = { status: "idle" };

export function fieldErrors(error: ZodError): ActionState {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    errors[field] ??= issue.message;
  }
  return { status: "error", fieldErrors: errors };
}

export const success = (message?: string): ActionState => ({ status: "success", message, submittedAt: Date.now() });

export const failure = (message: string): ActionState => ({ status: "error", message });

export const text = (formData: FormData, name: string) => String(formData.get(name) ?? "");
