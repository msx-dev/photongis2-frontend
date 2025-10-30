import { Directions } from "@/constants/panelConstants";
import { getAdditionalPanel } from "@/utils/additionalPanelUtils";
import { LatLngTuple } from "leaflet";
import { useState } from "react";

export interface AdditionalPanelsType {
  x: number;
  y: number;
  coords: LatLngTuple[];
}

const useAdditionalPanels = () => {
  const [additionalPanels, setAdditionalPanels] = useState<
    Map<string, AdditionalPanelsType>
  >(new Map());

  const addPolygon = (
    x: number,
    y: number,
    direction: keyof typeof Directions,
    startingPanel: LatLngTuple[]
  ) => {
    let newX = x;
    let newY = y;

    switch (direction) {
      case "Top":
        newX = x + 1;
        break;
      case "Bottom":
        newX = x - 1;
        break;
      case "Right":
        newY = y + 1;
        break;
      case "Left":
        newY = y - 1;
        break;
    }

    const coords = getAdditionalPanel(startingPanel, 0.0001, direction);
    const key = `${newX},${newY}`;

    setAdditionalPanels((prev) => {
      console.log(prev);
      const updated = new Map(prev);
      updated.set(key, { x: newX, y: newY, coords });
      return updated;
    });
  };

  const onInitialPanelChange = (
    oldInitial: LatLngTuple[],
    newInitial: LatLngTuple[]
  ) => {
    if (oldInitial.length !== newInitial.length) return;

    const deltas: LatLngTuple[] = oldInitial.map((oldPoint, i) => [
      newInitial[i][0] - oldPoint[0],
      newInitial[i][1] - oldPoint[1],
    ]);

    setAdditionalPanels((prev) => {
      const updated = new Map(prev);

      updated.forEach((panel, key) => {
        const newCoords = panel.coords.map((point, i) => [
          point[0] + deltas[i % deltas.length][0],
          point[1] + deltas[i % deltas.length][1],
        ]) as LatLngTuple[];

        updated.set(key, { ...panel, coords: newCoords });
      });

      return updated;
    });
  };

  return {
    additionalPanels,
    setAdditionalPanels,
    addPolygon,
    onInitialPanelChange,
  };
};

export default useAdditionalPanels;
