import shortid from "shortid";
import { DragItemType } from "./App";
import { DragElementEnum } from "./constants";

// a little function to help us with reordering the result
//NEED
export const reorder = (
  list: DragItemType[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed); // inserting task in new index

  return result;
};

//NEED
export const remove = (arr: DragItemType[], index: number) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // part of the array after the specified index
  ...arr.slice(index + 1),
];

//NEED
export const insert = (
  arr: DragItemType[],
  index: number,
  newItem: DragItemType
) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index),
];

//NEED
export const reorderChildren = (
  children: DragItemType[],
  splitDropZonePath: string[],
  splitItemPath: string[]
): DragItemType[] => {
  // Reorderuje položky na základě pozice v rodiči
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    const itemIndex = Number(splitItemPath[0]);
    return reorder(children, itemIndex, dropZoneIndex) as DragItemType[];
  }

  const updatedChildren = [...children];
  const curIndex = Number(splitDropZonePath[0]);

  // Rekurzivní aktualizace dětí položky
  updatedChildren[curIndex] = {
    ...updatedChildren[curIndex],
    children: reorderChildren(
      updatedChildren[curIndex].children as DragItemType[],
      splitDropZonePath.slice(1),
      splitItemPath.slice(1)
    ),
  };

  return updatedChildren;
};

//NEED
export const removeChildFromChildren = (
  children: DragItemType[],
  splitItemPath: string[]
) => {
  if (splitItemPath.length === 1) {
    const itemIndex = Number(splitItemPath[0]);
    return remove(children, itemIndex);
  }

  const updatedChildren = [...children];
  const curIndex = Number(splitItemPath[0]);

  updatedChildren[curIndex] = {
    ...updatedChildren[curIndex],
    children: removeChildFromChildren(
      updatedChildren[curIndex].children,
      splitItemPath.slice(1)
    ),
  };

  return updatedChildren;
};

//NEED
export const handleMoveWithinParent = (
  layout: DragItemType[],
  splitDropZonePath: string[],
  splitItemPath: string[]
) => {
  return reorderChildren(layout, splitDropZonePath, splitItemPath);
};

//NEED
export const handleMoveToDifferentParent = (
  layout: DragItemType[],
  splitDropZonePath: string[],
  splitItemPath: string[],
  item: DragItemType
) => {
  let newLayoutStructure;

  // Definice nové struktury řádku nebo komponenty
  const ROW_STRUCTURE = {
    type: DragElementEnum.ROW,
    id: shortid.generate(),
    title: item.title, // Zachování názvu
    children: [item],
    path: item.path,
  };

  // Přepínač podle hloubky cesty v nové struktuře
  switch (splitDropZonePath.length) {
    case 1: {
      // Přesouvá komponentu mimo do nově vytvořeného řádku
      newLayoutStructure = {
        ...ROW_STRUCTURE,
      };
      break;
    }
    default: {
      newLayoutStructure = item;
    }
  }

  // Aktualizace layoutu bez columnů
  let updatedLayout = layout;
  updatedLayout = removeChildFromChildren(updatedLayout, splitItemPath);
  updatedLayout = addChildToChildren(
    updatedLayout,
    splitDropZonePath,
    newLayoutStructure
  );

  return updatedLayout;
};

//NEED
export const addChildToChildren = (
  children: DragItemType[],
  splitDropZonePath: string[],
  item: DragItemType
) => {
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    return insert(children, dropZoneIndex, item);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: addChildToChildren(
      nodeChildren.children,
      splitItemChildrenPath,
      item
    ),
  };

  return updatedChildren;
};
