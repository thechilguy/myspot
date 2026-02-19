"use client";

import { useEffect, useState } from "react";
import { Stage, Layer, Rect, Text, Circle } from "react-konva";

export default function Home() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    update(); // initial
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!size.width || !size.height) return null;

  return (
    <Stage width={size.width} height={size.height}>
      <Layer>
        <Text text="Try to drag shapes" fontSize={15} />
        <Rect
          x={20}
          y={50}
          width={100}
          height={100}
          fill="red"
          shadowBlur={10}
          draggable
        />
        <Circle x={200} y={100} radius={50} fill="green" draggable />
      </Layer>
    </Stage>
  );
}
