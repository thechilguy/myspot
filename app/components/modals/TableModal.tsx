"use client";

import { BoardItemModel } from "../../types/board";

export default function TableModal({
  item,
  onClose,
}: {
  item: BoardItemModel;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative z-10 w-[380px] max-w-[92vw] rounded-2xl bg-white p-4 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">Table details</div>
            <div className="text-xs text-zinc-500">ID: {item.id}</div>
          </div>

          <button
            type="button"
            className="rounded-lg border px-2 py-1 text-sm"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Label</span>
            <span className="font-medium">{item.label ?? "—"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">Seats</span>
            <span className="font-medium">{item.seats ?? 4}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">Position</span>
            <span className="font-medium">
              {Math.round(item.x)}, {Math.round(item.y)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
