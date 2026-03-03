"use client";

import { useState, useEffect } from "react";
import Toolbar from "../app/components/toolbar/Toolbar";
import Whiteboard from "../app/components/board/Whireboard";
import { BoardItemModel, Tool } from "../app/types/board";
import TableModal from "../app/components/modals/TableModal";
import { ICON_REGISTRY } from "./assets/board/iconRegistry";

const GRID = 20;
const snap = (v: number) => Math.round(v / GRID) * GRID;

// іконки 90x90 => bounds
const HALF_W = 45;
const HALF_H = 45;

type Bounds = { left: number; right: number; top: number; bottom: number };

function getBounds(item: Pick<BoardItemModel, "type" | "x" | "y">) {
  const cfg = ICON_REGISTRY[item.type as keyof typeof ICON_REGISTRY];
  if (!cfg) {
    // fallback, щоб не падало (і щоб ти побачив проблему в консолі)
    console.warn("Unknown item.type:", item.type);
    const halfW = 45;
    const halfH = 45;
    return {
      left: item.x - halfW,
      right: item.x + halfW,
      top: item.y - halfH,
      bottom: item.y + halfH,
    };
  }

  const { halfW, halfH } = cfg.bounds;
  return {
    left: item.x - halfW,
    right: item.x + halfW,
    top: item.y - halfH,
    bottom: item.y + halfH,
  };
}

function overlaps(a: Bounds, b: Bounds, padding = 2) {
  return !(
    a.right + padding <= b.left ||
    a.left - padding >= b.right ||
    a.bottom + padding <= b.top ||
    a.top - padding >= b.bottom
  );
}

function wouldCollide(
  items: BoardItemModel[],
  movingId: string,
  nx: number,
  ny: number,
) {
  const me = items.find((i) => i.id === movingId);
  if (!me) return false;

  const nextB = getBounds({ type: me.type, x: nx, y: ny });

  return items.some((o) => o.id !== movingId && overlaps(nextB, getBounds(o)));
}

export default function Home() {
  const [tool, setTool] = useState<Tool>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [items, setItems] = useState<BoardItemModel[]>([]);

  const opened = items.find((i) => i.id === openId) ?? null;

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
    setOpenId((prev) => (prev === id ? null : prev));
  };

  const updateItem = (id: string, patch: Partial<BoardItemModel>) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    );
  };

  const addItem = (item: Omit<BoardItemModel, "id">) => {
    const id = String(Date.now()) + Math.random().toString(16).slice(2);

    setItems((prev) => {
      const x = snap(item.x);
      const y = snap(item.y);

      // label для столиків: T-01, T-02...
      const tableCount = prev.length + 1;
      const label = `T-${String(tableCount).padStart(2, "0")}`;

      const newItem: BoardItemModel = {
        id,
        ...item,
        x,
        y,
        label: item.label ?? label,
        seats: item.seats ?? 4,
        people: item.people ?? 0,
      };

      // якщо у тебе є collision:
      const b = getBounds(newItem);
      const hit = prev.some((o) => overlaps(b, getBounds(o)));
      if (hit) return prev;

      return [...prev, newItem];
    });

    setSelectedId(id);
    setTool("select");
  };

  const moveItem = (id: string, x: number, y: number): boolean => {
    const nx = snap(x);
    const ny = snap(y);

    let accepted = false;

    setItems((prev) => {
      if (wouldCollide(prev, id, nx, ny)) {
        accepted = false;
        return prev;
      }
      accepted = true;
      return prev.map((p) => (p.id === id ? { ...p, x: nx, y: ny } : p));
    });

    return accepted;
  };
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      if (!selectedId) return;

      // щоб не видаляти коли фокус в input/textarea
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      e.preventDefault();
      deleteItem(selectedId);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId]);

  return (
    <div className="h-screen w-screen bg-zinc-100 p-4">
      <div className="mx-auto flex h-full max-w-6xl flex-col gap-3">
        <Toolbar activeTool={tool} onChange={setTool} />

        <div className="flex-1 min-h-0">
          <Whiteboard
            tool={tool}
            items={items}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onOpen={(id) => setOpenId(id)}
            onAdd={addItem}
            onMove={moveItem}
          />
        </div>
      </div>

      {opened && (
        <TableModal
          item={opened}
          onClose={() => setOpenId(null)}
          onChange={(patch) => updateItem(opened.id, patch)}
          onDelete={() => deleteItem(opened.id)} // ✅
        />
      )}
    </div>
  );
}
