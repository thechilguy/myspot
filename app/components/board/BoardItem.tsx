import { useEffect, useMemo, useRef } from "react";
import { Group, Image as KonvaImage, Text, Circle } from "react-konva";
import { useImage } from "react-konva-utils";
import { BoardItemModel } from "../../types/board";
import { ICON_REGISTRY } from "../../assets/board/iconRegistry";

type Props = {
  item: BoardItemModel;
  selected: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
  onMove: (id: string, x: number, y: number) => boolean;
  draggable: boolean;
};

export default function BoardItem({
  item,
  selected,
  onSelect,
  onOpen,
  onMove,
  draggable,
}: Props) {
  const lastGood = useRef({ x: item.x, y: item.y });

  useEffect(() => {
    lastGood.current = { x: item.x, y: item.y };
  }, [item.x, item.y]);

  const cfg = ICON_REGISTRY[item.type];
  const [img] = useImage(cfg.src, "anonymous");

  const seats = item.seats ?? 4;
  const people = Math.max(0, Math.min(item.people ?? 0, seats));

  const handleSelect = (e: any) => {
    e.cancelBubble = true;
    onSelect(item.id);
  };

  const handleOpen = (e: any) => {
    e.cancelBubble = true;
    onOpen(item.id);
  };

  const handleDragMove = (e: any) => {
    const nx = e.target.x();
    const ny = e.target.y();
    const ok = onMove(item.id, nx, ny);

    if (!ok) {
      e.target.position(lastGood.current);
    } else {
      lastGood.current = { x: nx, y: ny };
    }
  };

  // радіус для стільців (динамічний від розміру іконки)
  const ringR = Math.max(cfg.w, cfg.h) * 0.7;
  const chairR = 7;

  return (
    <Group
      x={item.x}
      y={item.y}
      draggable={draggable}
      onMouseDown={handleSelect}
      onTouchStart={handleSelect}
      onDblClick={handleOpen}
      onDblTap={handleOpen}
      onDragMove={handleDragMove}
    >
      {/* Chairs */}
      {Array.from({ length: seats }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / seats - Math.PI / 2;
        const cx = Math.cos(angle) * ringR;
        const cy = Math.sin(angle) * ringR;
        const occupied = i < people;

        return (
          <Circle
            key={i}
            x={cx}
            y={cy}
            radius={chairR}
            fill={occupied ? "#111" : "#fff"}
            stroke="#444"
            strokeWidth={1}
            listening={false}
          />
        );
      })}

      {/* Table icon */}
      <KonvaImage
        image={img ?? undefined}
        x={-cfg.w / 2}
        y={-cfg.h / 2}
        width={cfg.w}
        height={cfg.h}
      />

      {/* Label */}
      {!!item.label && (
        <Text
          text={item.label}
          x={-cfg.w / 2}
          y={-10}
          width={cfg.w}
          align="center"
          fontSize={14}
          fontStyle="bold"
          fill={selected ? "#111" : "#2b2b2b"}
          listening={false}
        />
      )}
    </Group>
  );
}
