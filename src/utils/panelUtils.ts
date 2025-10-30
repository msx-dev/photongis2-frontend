import { Directions } from "@/constants/panelConstants";
import { AdditionalPanelsType } from "@/hooks/useAdditionalPanels";
import { LatLngTuple } from "leaflet";

export const getPolygonCenter = (coords: LatLngTuple[]) => {
  const latSum = coords.reduce((sum, [lat]) => sum + lat, 0);
  const lngSum = coords.reduce((sum, [, lng]) => sum + lng, 0);
  const n = coords.length;
  return [latSum / n, lngSum / n] as LatLngTuple;
};

export const combineAdditionalPanels = (
  polygonCoords: LatLngTuple[],
  additionalPanels: Map<string, AdditionalPanelsType>
) => {
  const newPanelKey = "0,0";
  const newPanelCoords = polygonCoords;

  const newPanel = {
    x: 0,
    y: 0,
    coords: newPanelCoords,
  };

  const combinedPanels = new Map(additionalPanels);
  combinedPanels.set(newPanelKey, newPanel);

  return combinedPanels;
};
export const getSideMarkers = (
  polygonCoords: LatLngTuple[],
  additionalPanels: Map<string, AdditionalPanelsType>,
  offset = 0.00002
) => {
  const combinedPanels = combineAdditionalPanels(
    polygonCoords,
    additionalPanels
  );
  console.log(combinedPanels);

  if (!polygonCoords || polygonCoords.length === 0) return [];

  const result: {
    position: keyof typeof Directions;
    coords: LatLngTuple;
    panel: AdditionalPanelsType;
  }[] = [];

  // Iterate through each panel in the combined panels
  combinedPanels.forEach((panel, key) => {
    const [x, y] = key.split(",").map(Number);

    // Determine the center for the current panel
    const center = getPolygonCenter(panel.coords);

    // Define the potential neighbors and their coordinates
    const potentialNeighbors: {
      position: keyof typeof Directions;
      coords: LatLngTuple;
    }[] = [
      { position: "Top", coords: [center[0] + offset, center[1]] },
      { position: "Right", coords: [center[0], center[1] + offset] },
      { position: "Bottom", coords: [center[0] - offset, center[1]] },
      { position: "Left", coords: [center[0], center[1] - offset] },
    ];

    // Check for neighbors and add missing ones to result
    potentialNeighbors.forEach(({ position, coords }) => {
      // Calculate neighbor coordinates based on direction
      let neighborKey: string;

      if (position === "Right") {
        neighborKey = `${x},${y + 1}`;
      } else if (position === "Left") {
        neighborKey = `${x},${y - 1}`;
      } else if (position === "Top") {
        neighborKey = `${x + 1},${y}`;
      } else if (position === "Bottom") {
        neighborKey = `${x - 1},${y}`;
      } else {
        neighborKey = `${x},${y}`;
      }

      // If there is no neighbor, add the missing side to the result array
      if (!combinedPanels.has(neighborKey)) {
        result.push({ position, coords, panel: panel });
      }
    });
  });

  console.log(result);
  return result;
};
