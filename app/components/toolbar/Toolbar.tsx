"use client";

import { Tool } from "../../types/board";

type Props = {
  activeTool: Tool;
  onChange: (tool: Tool) => void;
};

function Btn({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-lg border px-3 py-2 text-sm",
        active ? "bg-black text-white" : "bg-white",
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

export default function Toolbar({ activeTool, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border bg-white p-2">
      <Btn active={activeTool === "select"} onClick={() => onChange("select")}>
        Select
      </Btn>
      <Btn active={activeTool === "rect"} onClick={() => onChange("rect")}>
        Rect
      </Btn>
      <Btn active={activeTool === "circle"} onClick={() => onChange("circle")}>
        Circle
      </Btn>

      <div className="ml-auto pr-2 text-xs text-zinc-500">
        Tool: <span className="font-medium">{activeTool}</span>
      </div>
    </div>
  );
}
