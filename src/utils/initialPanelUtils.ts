import { LatLngTuple } from "leaflet";

export const getPolygonCenter = (coords: LatLngTuple[]) => {
  const latSum = coords.reduce((sum, [lat]) => sum + lat, 0);
  const lngSum = coords.reduce((sum, [, lng]) => sum + lng, 0);
  const n = coords.length;
  return [latSum / n, lngSum / n] as LatLngTuple;
};

export const getSideMarkers = (
  polygonCoords: LatLngTuple[],
  offset = 0.00002
) => {
  if (!polygonCoords || polygonCoords.length === 0) return [];
  const center = getPolygonCenter(polygonCoords);

  return [
    [center[0] + offset, center[1]], // top
    [center[0], center[1] + offset], // right
    [center[0] - offset, center[1]], // bottom
    [center[0], center[1] - offset], // left
  ] as LatLngTuple[];
};
