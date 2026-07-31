"use client";

import { useEffect } from "react";
import Button from "./Button";

/**
 * A blocking confirm for destructive actions.
 *
 * The count belongs in `message` at the call site, not here — "Delete all 50
 * recipients?" puts the number in front of the person at the moment they
 * click, which is the only moment it can still change their mind.
 */
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  // Escape closes, and the page behind is locked so a scroll gesture over the
  // scrim does not move the list the dialog is asking about.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={busy ? undefined : onCancel}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-sm bg-white border border-line rounded-xl p-6">
        <h2 id="confirm-title" className="text-base font-semibold text-ink">
          {title}
        </h2>
        <p className="text-sm text-muted mt-2">{message}</p>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            onClick={onConfirm}
            loading={busy}
          >
            {busy ? "Working…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
