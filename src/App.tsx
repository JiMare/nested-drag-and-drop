import React, { useCallback, useState } from "react";
import { data } from "./initialData";
import { DropZone } from "./DropZone";
import { Row } from "./Row";
import {
  handleMoveToDifferentParent,
  handleMoveWithinParent,
  insert,
  removeChildFromChildren,
} from "./helpers";
import { DragElementEnum } from "./constants";

export type DragItemType = {
  id: string; // ID přetahované položky
  type: DragElementEnum.ROW | DragElementEnum.COMPONENT;
  path: string; // Cesta k položce v hierarchii
  children: DragItemType[]; // Pole dětí, pokud má položka děti
  title?: string; // Název položky, pokud je k dispozici
};

export type DropZoneType = { path: string; childrenCount: number };

function App() {
  const [initData, setInitData] = useState(data);

  console.log(initData, "initdata");

  const handleDrop = useCallback(
    (dropZone: DropZoneType, item: DragItemType) => {
      console.log("dropZone", dropZone);
      console.log("item", item);

      const splitDropZonePath = dropZone.path.split("-");
      const splitItemPath = item.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");
      const pathToItem = splitItemPath.slice(0, -1).join("-");

      // Zkontrolujeme, zda jsou délky cest shodné
      if (splitItemPath.length === splitDropZonePath.length) {
        // Přesun v rámci jednoho rodiče
        if (pathToItem === pathToDropZone) {
          setInitData(
            handleMoveWithinParent(initData, splitDropZonePath, splitItemPath)
          );
          return;
        }
        // Přesun mezi různými rodiči
        setInitData(
          handleMoveToDifferentParent(
            initData,
            splitDropZonePath,
            splitItemPath,
            item
          )
        );
        return;
      }

      // Přetažení řádku do jiného řádku (když má drop zóna délku cesty větší než 1)
      if (item.type === DragElementEnum.ROW && splitDropZonePath.length > 1) {
        console.log("radek do radku");
        const updatedLayout = removeChildFromChildren(initData, splitItemPath);

        const targetRowIndex = Number(splitDropZonePath[0]);
        const targetRow = initData[targetRowIndex];

        console.log(splitDropZonePath, targetRow, "targetrow");

        // Vložení řádku jako dítě jiného řádku
        targetRow.children = [...targetRow.children, item];

        setInitData(updatedLayout);
        return;
      }

      // Pokud se komponenta dropuje mimo řádky (např. na prázdné místo)
      if (dropZone.path.length === 1) {
        const updatedLayout = removeChildFromChildren(initData, splitItemPath);

        console.log("droparea prazdno");
        const newRow = {
          type: DragElementEnum.ROW,
          id: item.id,
          title: String(item.title), // Můžete přidat logiku pro generování názvu řádku
          children: [] as DragItemType[],
          path: item.path,
        };
        const dropZoneIndex = Number(splitDropZonePath[0]);
        const finalLayout = insert(updatedLayout, dropZoneIndex, newRow);
        setInitData(finalLayout);
        return;
      }

      // Vytvoření nové hierarchie a přesun položky
      setInitData(
        handleMoveToDifferentParent(
          initData,
          splitDropZonePath,
          splitItemPath,
          item
        )
      );
    },
    [initData]
  );

  const renderRow = (row: DragItemType, currentPath: string) => {
    return (
      <Row key={row.id} data={row} handleDrop={handleDrop} path={currentPath} />
    );
  };

  return (
    <div className="body">
      <div className="pageContainer">
        <div className="page">
          {initData.map((row, index) => {
            const currentPath = `${index}`;
            return (
              <React.Fragment key={row.id}>
                <DropZone
                  data={{
                    path: currentPath,
                    childrenCount: initData.length,
                  }}
                  onDrop={handleDrop}
                />
                {renderRow(row, currentPath)}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
