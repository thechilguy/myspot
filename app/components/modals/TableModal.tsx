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
      {/* overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />

      {/* panel */}
      <div className="relative z-10 w-[420px] max-w-[92vw] rounded-2xl bg-white p-4 shadow-xl">
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
          <Row label="Label" value={item.label ?? "—"} />
          <Row label="Seats" value={String(item.seats ?? 4)} />
          <Row label="Status" value={item.status ?? "free"} />
          <Row
            label="Position"
            value={`${Math.round(item.x)}, ${Math.round(item.y)}`}
          />
          <Row label="Type" value={item.type} />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
