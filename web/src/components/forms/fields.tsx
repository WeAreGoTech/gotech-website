import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import type { ActionState } from "@/lib/forms";
import { DatePicker } from "./DatePicker";
import { Select, type SelectOption } from "./Select";

type FieldShellProps = { id: string; label: ReactNode; error?: string; hint?: ReactNode; optional?: boolean; wide?: boolean; children: ReactNode };

function FieldShell({ id, label, error, hint, optional, wide, children }: FieldShellProps) {
  return (
    <div className={`field${wide ? " is-wide" : ""}${error ? " is-invalid" : ""}`}>
      <label htmlFor={id}>
        {label}
        {optional && <span className="opt"> (isteğe bağlı)</span>}
      </label>
      {children}
      {hint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

const errorProps = (id: string, error?: string, hint?: ReactNode) => ({
  "aria-invalid": error ? true : undefined,
  "aria-describedby": [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined,
});

type Common = { label: ReactNode; name: string; error?: string; hint?: ReactNode; optional?: boolean; wide?: boolean };

export function TextField({ label, name, error, hint, optional, wide, ...input }: Common & InputHTMLAttributes<HTMLInputElement>) {
  const id = `f-${name}`;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} wide={wide}>
      <input className="input" id={id} name={name} {...errorProps(id, error, hint)} {...input} />
    </FieldShell>
  );
}

export function TextAreaField({ label, name, error, hint, optional, wide, ...textarea }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = `f-${name}`;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} wide={wide}>
      <textarea className="input" id={id} name={name} {...errorProps(id, error, hint)} {...textarea} />
    </FieldShell>
  );
}

type Option = SelectOption;

type SelectFieldProps = Common & { options: Option[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void; disabled?: boolean };

export function SelectField({ label, name, error, optional, wide, options, ...select }: SelectFieldProps) {
  const id = `f-${name}`;
  return (
    <FieldShell id={id} label={label} error={error} optional={optional} wide={wide}>
      <Select id={id} name={name} options={options} {...errorProps(id, error)} {...select} />
    </FieldShell>
  );
}

export function DateField({ label, name, error, optional, wide, defaultValue }: Common & { defaultValue?: string }) {
  const id = `f-${name}`;
  return (
    <FieldShell id={id} label={label} error={error} optional={optional} wide={wide}>
      <DatePicker id={id} name={name} defaultValue={defaultValue} {...errorProps(id, error)} />
    </FieldShell>
  );
}

export function FormMessage({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <p className={`form-message ${state.status === "success" ? "is-success" : "is-error"}`} role={state.status === "error" ? "alert" : "status"}>
      {state.message}
    </p>
  );
}

export const toOptions = (labels: Record<string, string>): Option[] => Object.entries(labels).map(([value, label]) => ({ value, label }));
