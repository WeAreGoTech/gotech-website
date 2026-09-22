import type { ZodError } from "zod";

export type ActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
  // tek seferlik gosterilecek deger (personelin musteriye verecegi gecici sifre)
  secret?: string;
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

export const success = (message?: string, secret?: string): ActionState => ({ status: "success", message, ...(secret ? { secret } : {}), submittedAt: Date.now() });

export const failure = (message: string): ActionState => ({ status: "error", message });

export const text = (formData: FormData, name: string) => String(formData.get(name) ?? "");
