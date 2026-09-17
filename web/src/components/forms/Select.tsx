"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import "./select.css";

export type SelectOption = { value: string; label: string };

type SelectProps = {
  name: string;
  options: SelectOption[];
  id?: string;
  value?: string;
  defaultValue?: string;
  /** Called after the hidden input holds the new value, so a form can be submitted right away. */
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

// room the list needs below the button before it opens upwards instead
const MIN_SPACE_BELOW_PX = 240;
// typing letters quickly jumps to the option starting with them
const TYPEAHEAD_RESET_MS = 600;

/** Themed replacement for <select>: the operating system's native menu does not follow the panel design. */
export function Select({ name, options, id, value, defaultValue, onValueChange, disabled, className, ...aria }: SelectProps) {
  const listId = useId();
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value ?? "");
  const current = value ?? inner;
  const [open, setOpen] = useState(false);
  const [upwards, setUpwards] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const typed = useRef({ text: "", at: 0 });

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === current));
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, listId]);

  function openList() {
    if (disabled) return;
    const rect = buttonRef.current?.getBoundingClientRect();
    setUpwards(rect ? window.innerHeight - rect.bottom < MIN_SPACE_BELOW_PX && rect.top > window.innerHeight - rect.bottom : false);
    setActive(selectedIndex);
    setOpen(true);
  }

  function choose(index: number) {
    const option = options[index];
    setOpen(false);
    buttonRef.current?.focus();
    if (!option || option.value === current) return;
    flushSync(() => setInner(option.value));
    onValueChange?.(option.value);
  }

  function jumpByTyping(key: string) {
    const now = Date.now();
    typed.current = { text: now - typed.current.at > TYPEAHEAD_RESET_MS ? key : typed.current.text + key, at: now };
    const needle = typed.current.text.toLocaleLowerCase("tr-TR");
    const match = options.findIndex((o) => o.label.toLocaleLowerCase("tr-TR").startsWith(needle));
    if (match < 0) return;
    if (open) setActive(match);
    else choose(match);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = options.length - 1;
    const keys: Record<string, () => void> = {
      ArrowDown: () => (open ? setActive(Math.min(last, active + 1)) : openList()),
      ArrowUp: () => (open ? setActive(Math.max(0, active - 1)) : openList()),
      Home: () => open && setActive(0),
      End: () => open && setActive(last),
      Enter: () => (open ? choose(active) : openList()),
      " ": () => (open ? choose(active) : openList()),
      Escape: () => setOpen(false),
    };
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    const handler = keys[event.key];
    if (handler) {
      event.preventDefault();
      handler();
    } else if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      jumpByTyping(event.key);
    }
  }

  return (
    <div ref={rootRef} className={`select${open ? " is-open" : ""}${upwards ? " opens-up" : ""}${className ? ` ${className}` : ""}`}>
      <input type="hidden" name={name} value={current} />
      <button
        ref={buttonRef}
        id={id}
        type="button"
        className="input select-trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        {...aria}
      >
        <span className="select-value">{selected?.label ?? ""}</span>
        <svg className="select-chevron" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul className="select-list" id={listId} role="listbox" tabIndex={-1}>
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.value === current}
              className={index === active ? "is-active" : undefined}
              onPointerEnter={() => setActive(index)}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {option.value === current && (
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m5 12 5 5 9-10" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
