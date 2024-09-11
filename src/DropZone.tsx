import React from "react";
import classNames from "classnames";
import { useDrop } from "react-dnd";
import { DragItemType, DropZoneType } from "./App";
import { DragElementEnum } from "./constants";

const ACCEPTS = [DragElementEnum.ROW, DragElementEnum.COMPONENT];

type Props = {
  data: DropZoneType;
  onDrop: (dropZone: DropZoneType, item: DragItemType) => void;
  isLast?: boolean;
  className?: string;
};

export const DropZone: React.FC<Props> = ({
  data,
  onDrop,
  isLast = false,
  className,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item: DragItemType) => {
      console.log(item, "item v dropu ");
      onDrop(data, item);
    },
    canDrop: (item) => {
      const dropZonePath = data.path;
      const splitDropZonePath = dropZonePath.split("-");
      const itemPath = item.path!;

      const splitItemPath = itemPath.split("-");

      // Zakázání dropu, pokud je přetahovaný řádek a má děti (children)
      if (
        item.type === DragElementEnum.ROW &&
        item.children &&
        item.children.length > 0
      ) {
        // Pokud se pokoušíme přetáhnout řádek s dětmi do jiného řádku, drop není povolen
        if (splitDropZonePath.length > 1) {
          return false;
        }
      }

      // Current item can't possible move to it's own location
      if (itemPath === dropZonePath) return false;

      // Current area
      if (splitItemPath.length === splitDropZonePath.length) {
        const pathToItem = splitItemPath.slice(0, -1).join("-");
        const currentItemIndex = Number(splitItemPath.slice(-1)[0]);

        const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");
        const currentDropZoneIndex = Number(splitDropZonePath.slice(-1)[0]);

        if (pathToItem === pathToDropZone) {
          const nextDropZoneIndex = currentItemIndex + 1;
          if (nextDropZoneIndex === currentDropZoneIndex) return false;
        }
      }

      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  return (
    <div
      className={classNames(
        "dropZone",
        { active: isActive, isLast },
        className
      )}
      ref={drop}
    />
  );
};
