import { AdditionalPanelsType } from "@/hooks/useAdditionalPolygons";
import { LatLngTuple } from "leaflet";

export const getAdditionalPanel = (
  initialPanel: LatLngTuple[],
  index: number,
  spacing: number,
  direction: "top" | "bottom" | "right" | "left"
): LatLngTuple[] => {
  console.log(initialPanel);
  const panelHeight = Math.abs(initialPanel[0][0] - initialPanel[2][0]);
  const panelWidth = Math.abs(initialPanel[0][1] - initialPanel[2][1]);

  switch (direction) {
    case "right":
      // For the "top" case, latitudes stay the same, longitudes adjust by (panelHeight + spacing)*(index + 1)
      const topPanel: LatLngTuple[] = [
        [
          initialPanel[0][0],
          initialPanel[0][1] + (panelHeight + spacing) * (index + 1),
        ], // Top-left corner
        [
          initialPanel[1][0],
          initialPanel[1][1] + (panelHeight + spacing) * (index + 1),
        ], // Top-right corner
        [
          initialPanel[2][0],
          initialPanel[2][1] + (panelHeight + spacing) * (index + 1),
        ], // Bottom-right corner
        [
          initialPanel[3][0],
          initialPanel[3][1] + (panelHeight + spacing) * (index + 1),
        ], // Bottom-left corner
      ];
      return topPanel;

    case "left":
      // For the "bottom" case, latitudes stay the same, longitudes adjust by subtracting (panelHeight + spacing)*(index + 1)
      const bottomPanel: LatLngTuple[] = [
        [
          initialPanel[0][0],
          initialPanel[0][1] - (panelHeight + spacing) * (index + 1),
        ], // Top-left corner
        [
          initialPanel[1][0],
          initialPanel[1][1] - (panelHeight + spacing) * (index + 1),
        ], // Top-right corner
        [
          initialPanel[2][0],
          initialPanel[2][1] - (panelHeight + spacing) * (index + 1),
        ], // Bottom-right corner
        [
          initialPanel[3][0],
          initialPanel[3][1] - (panelHeight + spacing) * (index + 1),
        ], // Bottom-left corner
      ];
      return bottomPanel;

    case "top":
      // For the "left" case, longitudes stay the same, latitudes adjust by adding (panelWidth + spacing)*(index + 1)
      const leftPanel: LatLngTuple[] = [
        [
          initialPanel[0][0] + (panelWidth + spacing) * (index + 1),
          initialPanel[0][1],
        ], // Top-left corner
        [
          initialPanel[1][0] + (panelWidth + spacing) * (index + 1),
          initialPanel[1][1],
        ], // Top-right corner
        [
          initialPanel[2][0] + (panelWidth + spacing) * (index + 1),
          initialPanel[2][1],
        ], // Bottom-right corner
        [
          initialPanel[3][0] + (panelWidth + spacing) * (index + 1),
          initialPanel[3][1],
        ], // Bottom-left corner
      ];
      return leftPanel;

    case "bottom":
      // For the "right" case, longitudes stay the same, latitudes adjust by subtracting (panelWidth + spacing)*(index + 1)
      const rightPanel: LatLngTuple[] = [
        [
          initialPanel[0][0] - (panelWidth + spacing) * (index + 1),
          initialPanel[0][1],
        ], // Top-left corner
        [
          initialPanel[1][0] - (panelWidth + spacing) * (index + 1),
          initialPanel[1][1],
        ], // Top-right corner
        [
          initialPanel[2][0] - (panelWidth + spacing) * (index + 1),
          initialPanel[2][1],
        ], // Bottom-right corner
        [
          initialPanel[3][0] - (panelWidth + spacing) * (index + 1),
          initialPanel[3][1],
        ], // Bottom-left corner
      ];
      return rightPanel;

    default:
      return [];
  }
};

const getAdditionalPanelCoords = (additionalPanels: AdditionalPanelsType) => {};
