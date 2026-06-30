"use client";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Ջնջել",
  cancelLabel = "Չեղարկել",
  isSubmitting = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm">
      <div className="admin-panel w-full max-w-md rounded-[28px] p-6 shadow-[0_30px_90px_rgba(17,24,39,0.16)]">
        <p className="admin-kicker text-sm font-semibold uppercase tracking-[0.24em]">
          Հաստատում
        </p>
        <h2 className="admin-title mt-3 text-2xl font-semibold">{title}</h2>
        <p className="admin-muted mt-3 text-sm leading-7">{description}</p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="admin-button-secondary rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="admin-button-primary rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60"
          >
            {isSubmitting ? "Ջնջում..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
