import { DragItemType } from "./App";
import { DragElementEnum } from "./constants";

export const data: DragItemType[] = [
  {
    type: DragElementEnum.ROW,
    id: "1",
    title: "Item1",
    children: [] as DragItemType[],
    path: "",
  },
  {
    type: DragElementEnum.ROW,
    id: "2",
    title: "Item2",
    children: [] as DragItemType[],
    path: "",
  },
  {
    type: DragElementEnum.ROW,
    id: "3",
    title: "Item3",
    path: "",
    children: [
      {
        type: DragElementEnum.COMPONENT,
        id: "4",
        title: "Item4",
        children: [] as DragItemType[],
        path: "",
      },
      {
        type: DragElementEnum.COMPONENT,
        id: "5",
        title: "Item5",
        children: [] as DragItemType[],
        path: "",
      },
      {
        type: DragElementEnum.COMPONENT,
        id: "6",
        title: "Item6",
        children: [] as DragItemType[],
        path: "",
      },
    ],
  },
];
