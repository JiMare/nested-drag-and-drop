import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { DragItemType } from "./App";
import { DragElementEnum } from "./constants";

const style = {
  border: "1px dashed black",
  padding: "0.5rem 1rem",
  backgroundColor: "white",
  cursor: "move",
};

type Props = {
  data: DragItemType;
  path: string;
};

export const Component: React.FC<Props> = ({ data, path }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: DragElementEnum.COMPONENT,
    item: { type: DragElementEnum.COMPONENT, id: data.id, path, title: data.title },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  return (
    <div
      ref={ref}
      style={{ ...style, opacity }}
      className="component draggable"
    >
      <div>{data.id}</div>
      <div>{data.title}</div>
    </div>
  );
};
