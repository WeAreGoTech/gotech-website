"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { IDLE, type ActionState } from "@/lib/forms";

type FormServerAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * Wraps a server action for a form. Submitting through onSubmit (instead of the form's action prop)
 * keeps what the user typed when validation fails; remount the form with key={state.submittedAt} to clear it after success.
 */
export function useFormAction(action: FormServerAction) {
  const [state, dispatch, pending] = useActionState(action, IDLE);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => dispatch(data));
  };

  return { state, pending, onSubmit, errorFor: (name: string) => state.fieldErrors?.[name] };
}
