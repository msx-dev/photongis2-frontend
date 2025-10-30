import { AdditionalPanelsType } from "@/hooks/useAdditionalPanels";
import L, { LatLngTuple } from "leaflet";
import { RefObject, SetStateAction, useEffect, useRef } from "react";
import { Polygon, useMap } from "react-leaflet";

interface DraggablePanelProps {
  mapRef: RefObject<L.Map | null>;
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;
  initialPolygon: LatLngTuple[];
  setInitialPolygon: React.Dispatch<React.SetStateAction<LatLngTuple[]>>;
  onInitialPanelChange: (
    oldInitial: LatLngTuple[],
    newInitial: LatLngTuple[]
  ) => void;
  onClick?: () => void;
  rangeValue: number;
  setTransformedAdditionalPanels: React.Dispatch<
    SetStateAction<Map<string, AdditionalPanelsType>>
  >;
}
const DraggablePanel = ({
  mapRef,
  setDragging,
  initialPolygon,
  setInitialPolygon,
  onInitialPanelChange,
  onClick,
  rangeValue,
  setTransformedAdditionalPanels,
}: DraggablePanelProps) => {
  const map = useMap();
  const lastCoordsRef = useRef<LatLngTuple[]>(initialPolygon);
  const originalPolygonRef = useRef<LatLngTuple[]>([]);

  const rotatePolygon = (
    map: L.Map,
    coords: LatLngTuple[],
    angleDeg: number
  ): LatLngTuple[] => {
    if (!map || coords.length === 0) return [];

    // Convert to coordinates
    const points = coords.map(([lat, lng]) => map.project([lat, lng]));

    // Find center
    const cx = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const cy = points.reduce((sum, p) => sum + p.y, 0) / points.length;

    const angleRad = (angleDeg * Math.PI) / 180;

    // Rotate in coordinates
    const rotatedPoints = points.map((p) => {
      const dx = p.x - cx;
      const dy = p.y - cy;
      const rx = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
      const ry = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);
      return L.point(cx + rx, cy + ry);
    });

    // Convert back to LatLng
    return rotatedPoints.map((p) => {
      const latlng = map.unproject(p);
      return [latlng.lat, latlng.lng] as LatLngTuple;
    });
  };

  useEffect(() => {
    if (initialPolygon.length > 0 && originalPolygonRef.current.length === 0) {
      originalPolygonRef.current = initialPolygon;
    }
  }, [initialPolygon]);

  useEffect(() => {
    if (originalPolygonRef.current.length > 0 && map) {
      const rotated = rotatePolygon(
        map,
        originalPolygonRef.current,
        rangeValue
      );
      setInitialPolygon(rotated);
    }
  }, [rangeValue, map]);

  return (
    <Polygon
      positions={initialPolygon}
      pathOptions={{ color: "blue" }}
      //@ts-expect-error While this results in an error, draggable exists
      draggable={true}
      eventHandlers={{
        click: () => onClick?.(),
        dragstart: () => {
          setDragging(true);
        },
        drag: (e) => {
          const layer = e.target as L.Polygon;
          const newCoords: LatLngTuple[] = (
            layer.getLatLngs()[0] as L.LatLng[]
          ).map((latlng) => [latlng.lat, latlng.lng] as LatLngTuple);
          if (rangeValue === 0) {
            onInitialPanelChange(lastCoordsRef.current, newCoords);
          } else {
            const oldInitial = lastCoordsRef.current;
            const newInitial = newCoords;
            const deltas: LatLngTuple[] = oldInitial.map((oldPoint, i) => [
              newInitial[i][0] - oldPoint[0],
              newInitial[i][1] - oldPoint[1],
            ]);

            setTransformedAdditionalPanels((prev) => {
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
          }
          lastCoordsRef.current = newCoords;
        },
        dragend: (e) => {
          const layer = e.target as L.Polygon;
          const newCoords: LatLngTuple[] = (
            layer.getLatLngs()[0] as L.LatLng[]
          ).map((latlng) => [latlng.lat, latlng.lng] as LatLngTuple);
          originalPolygonRef.current = newCoords;
          setInitialPolygon(newCoords);
          setDragging(false);

          if (mapRef.current) mapRef.current.dragging.enable();
        },
        mousedown: () => {
          if (mapRef.current) mapRef.current.dragging.disable();
        },
        mouseup: () => {
          if (mapRef.current) mapRef.current.dragging.enable();
        },
      }}
    />
  );
};
export default DraggablePanel;
