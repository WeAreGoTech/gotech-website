"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

const CloseContext = createContext<() => void>(() => {});

/** Closes the modal a form sits in, e.g. from its "Tamam" button. */
export const useCloseModal = () => useContext(CloseContext);

/**
 * A native <dialog>: Escape, focus trapping and the dimmed backdrop come from the browser. Children are only
 * mounted while open, so a form inside starts empty every time. On phones it opens as a sheet from the bottom.
 */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby={titleId}
      onClose={onClose}
      // the dialog has no padding of its own, so a click on it (not on its content) is a click on the backdrop
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {open && (
        <div className="modal-body">
          <header className="modal-head">
            <h2 id={titleId}>{title}</h2>
            <button type="button" className="icon-btn" aria-label="Kapat" onClick={onClose}>
              <Icon name="close" />
            </button>
          </header>
          <CloseContext.Provider value={onClose}>{children}</CloseContext.Provider>
        </div>
      )}
    </dialog>
  );
}

type ModalButtonProps = {
  label: string;
  // the modal's heading, when it should differ from the button
  title?: string;
  icon?: IconName;
  // "action": Wise's round icon button with its label underneath, for a page's main actions
  look?: "button" | "small" | "action";
  // the one action that stands out in a row of round buttons
  accent?: boolean;
  // a destructive action, e.g. closing a company
  danger?: boolean;
  children: ReactNode;
};

/** A button that opens its children in a modal. */
export function ModalButton({ label, title = label, icon, look = "button", accent = false, danger = false, children }: ModalButtonProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const trigger =
    look === "action" ? (
      <button type="button" className={`w-action${accent ? " is-accent" : ""}${danger ? " is-danger" : ""}`} onClick={() => setOpen(true)}>
        <span className="w-action-icon">{icon && <Icon name={icon} size={22} />}</span>
        {label}
      </button>
    ) : (
      <button type="button" className={look === "small" ? "btn btn-ghost btn-small" : "btn"} onClick={() => setOpen(true)}>
        {icon && <Icon name={icon} size={18} />}
        {label}
      </button>
    );

  return (
    <>
      {trigger}
      <Modal open={open} onClose={close} title={title}>
        {children}
      </Modal>
    </>
  );
}
