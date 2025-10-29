import { getAdditionalPanel } from "@/utils/additionalPanelUtils";
import { LatLngTuple } from "leaflet";
import { useState } from "react";

export interface AdditionalPanelsType {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const useAdditionalPanels = () => {
  const [additionalPolygons, setAdditionalPolygons] =
    useState<AdditionalPanelsType>({ top: 0, right: 0, bottom: 0, left: 0 });

  const addPolygon = (index: number) => {
    let side: keyof typeof additionalPolygons | null = null;

    if (index === 0) side = "top";
    else if (index === 1) side = "right";
    else if (index === 2) side = "bottom";
    else if (index === 3) side = "left";

    if (side) {
      setAdditionalPolygons((prevState) => ({
        ...prevState,
        [side]: prevState[side] + 1,
      }));
    }
  };

  const getAdditionalPanelsCoords = (
    initialPanel: LatLngTuple[],
    spacing: number
  ) => {
    const allPanelsCoords: LatLngTuple[][] = [];

    // Calculate panels for each side
    for (let i = 1; i <= additionalPolygons.top; i++) {
      allPanelsCoords.push(getAdditionalPanel(initialPanel, i, spacing, "top"));
    }
    for (let i = 1; i <= additionalPolygons.right; i++) {
      allPanelsCoords.push(
        getAdditionalPanel(initialPanel, i, spacing, "right")
      );
    }
    for (let i = 1; i <= additionalPolygons.bottom; i++) {
      allPanelsCoords.push(
        getAdditionalPanel(initialPanel, i, spacing, "bottom")
      );
    }
    for (let i = 1; i <= additionalPolygons.left; i++) {
      allPanelsCoords.push(
        getAdditionalPanel(initialPanel, i, spacing, "left")
      );
    }

    return allPanelsCoords;
  };

  return {
    additionalPolygons,
    setAdditionalPolygons,
    addPolygon,
    getAdditionalPanelsCoords,
  };
};

export default useAdditionalPanels;
