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
      <div className="w-full max-w-md rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_30px_90px_rgba(24,24,27,0.25)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          Հաստատում
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-zinc-950">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-600">{description}</p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-950 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent)] disabled:opacity-60"
          >
            {isSubmitting ? "Ջնջում..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
