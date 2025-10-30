import { Directions } from "@/constants/panelConstants";
import { AdditionalPanelsType } from "@/hooks/useAdditionalPanels";
import { LatLngTuple } from "leaflet";

export const getAdditionalPanel = (
  initialPanel: LatLngTuple[],
  spacing: number,
  direction: keyof typeof Directions
): LatLngTuple[] => {
  const panelHeight = Math.abs(initialPanel[0][0] - initialPanel[2][0]);
  const panelWidth = Math.abs(initialPanel[0][1] - initialPanel[2][1]);
  const topSpacing = spacing * 0.7;

  switch (direction) {
    case "Right":
      // For the "top" case, latitudes stay the same, longitudes adjust by (panelHeight + spacing)*(index + 1)
      const topPanel: LatLngTuple[] = [
        [initialPanel[0][0], initialPanel[0][1] + (panelHeight + spacing)], // Top-left corner
        [initialPanel[1][0], initialPanel[1][1] + (panelHeight + spacing)], // Top-right corner
        [initialPanel[2][0], initialPanel[2][1] + (panelHeight + spacing)], // Bottom-right corner
        [initialPanel[3][0], initialPanel[3][1] + (panelHeight + spacing)], // Bottom-left corner
      ];
      return topPanel;

    case "Left":
      // For the "bottom" case, latitudes stay the same, longitudes adjust by subtracting (panelHeight + spacing)*(index + 1)
      const bottomPanel: LatLngTuple[] = [
        [initialPanel[0][0], initialPanel[0][1] - (panelHeight + spacing)], // Top-left corner
        [initialPanel[1][0], initialPanel[1][1] - (panelHeight + spacing)], // Top-right corner
        [initialPanel[2][0], initialPanel[2][1] - (panelHeight + spacing)], // Bottom-right corner
        [initialPanel[3][0], initialPanel[3][1] - (panelHeight + spacing)], // Bottom-left corner
      ];
      return bottomPanel;

    case "Top":
      // For the "left" case, longitudes stay the same, latitudes adjust by adding (panelWidth + spacing)*(index + 1)
      const leftPanel: LatLngTuple[] = [
        [initialPanel[0][0] + (panelWidth + topSpacing), initialPanel[0][1]], // Top-left corner
        [initialPanel[1][0] + (panelWidth + topSpacing), initialPanel[1][1]], // Top-right corner
        [initialPanel[2][0] + (panelWidth + topSpacing), initialPanel[2][1]], // Bottom-right corner
        [initialPanel[3][0] + (panelWidth + topSpacing), initialPanel[3][1]], // Bottom-left corner
      ];
      return leftPanel;

    case "Bottom":
      // For the "right" case, longitudes stay the same, latitudes adjust by subtracting (panelWidth + spacing)*(index + 1)
      const rightPanel: LatLngTuple[] = [
        [initialPanel[0][0] - (panelWidth + topSpacing), initialPanel[0][1]], // Top-left corner
        [initialPanel[1][0] - (panelWidth + topSpacing), initialPanel[1][1]], // Top-right corner
        [initialPanel[2][0] - (panelWidth + topSpacing), initialPanel[2][1]], // Bottom-right corner
        [initialPanel[3][0] - (panelWidth + topSpacing), initialPanel[3][1]], // Bottom-left corner
      ];
      return rightPanel;

    default:
      return [];
  }
};

const getAdditionalPanelCoords = (additionalPanels: AdditionalPanelsType) => {};
