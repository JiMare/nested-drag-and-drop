import React, { useRef } from "react";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { DropZone } from "./DropZone";
import { Component } from "./Component";
import { DragItemType, DropZoneType } from "./App";
import { DragElementEnum } from "./constants";

type Props = {
  data: DragItemType;
  handleDrop: (dropZone: DropZoneType, item: DragItemType) => void;
  path: string;
};

const style = {};
export const Row: React.FC<Props> = ({ data, handleDrop, path }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<
    DragItemType,
    unknown,
    { isDragging: boolean }
  >({
    type: DragElementEnum.ROW,
    item: {
      type: DragElementEnum.ROW,
      id: data.id,
      children: data.children,
      title: data.title,
      path,
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderComponent = (component: DragItemType, currentPath: string) => {
    return <Component key={component.id} data={component} path={currentPath} />;
  };

  return (
    <div ref={ref} style={{ ...style, opacity }} className="base draggable row">
      {data.id} {data.title}
      <div className="columns">
        {data.children.map((subrow, index) => {
          const currentPath = `${path}-${index}`;

          return (
            <React.Fragment key={subrow.id}>
              <DropZone
                data={{
                  path: currentPath,
                  childrenCount: data.children.length,
                }}
                onDrop={handleDrop}
                className="horizontalDrag"
              />
              {renderComponent(subrow, currentPath)}
            </React.Fragment>
          );
        })}
        <DropZone
          data={{
            path: `${path}-${data.children.length}`,
            childrenCount: data.children.length,
          }}
          onDrop={handleDrop}
          isLast
        />
      </div>
    </div>
  );
};
