"use client";

import { BoardItemModel } from "../../types/board";

export default function TableModal({
  item,
  onClose,
  onChange,
  onDelete,
}: {
  item: BoardItemModel;
  onClose: () => void;
  onChange: (patch: Partial<BoardItemModel>) => void;
  onDelete: () => void;
}) {
  const seats = item.seats ?? 4;
  const people = Math.max(0, Math.min(item.people ?? 0, seats));

  const addPerson = () => onChange({ people: Math.min(seats, people + 1) });
  const removePerson = () => onChange({ people: Math.max(0, people - 1) });

  const addSeat = () =>
    onChange({ seats: seats + 1, people: Math.min(seats + 1, people) });
  const removeSeat = () =>
    onChange({
      seats: Math.max(1, seats - 1),
      people: Math.min(Math.max(1, seats - 1), people),
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />

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
          <Row label="Type" value={item.type} />
          <Row label="Seats" value={String(seats)} />
          <Row label="People" value={`${people} / ${seats}`} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            className="rounded-lg border px-3 py-2 text-sm"
            onClick={removePerson}
            type="button"
          >
            − Remove person
          </button>
          <button
            className="rounded-lg border px-3 py-2 text-sm"
            onClick={addPerson}
            type="button"
          >
            + Add person
          </button>

          <button
            className="rounded-lg border px-3 py-2 text-sm"
            onClick={removeSeat}
            type="button"
          >
            − Seat
          </button>
          <button
            className="rounded-lg border px-3 py-2 text-sm"
            onClick={addSeat}
            type="button"
          >
            + Seat
          </button>
        </div>

        <div className="mt-4 flex justify-between gap-2">
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            Delete table
          </button>

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
