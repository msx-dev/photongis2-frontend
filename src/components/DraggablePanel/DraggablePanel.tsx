import { LatLngTuple } from "leaflet";
import { RefObject } from "react";
import { Polygon } from "react-leaflet";

interface DraggablePanelProps {
  mapRef: RefObject<L.Map | null>;
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;
  initialPolygon: LatLngTuple[];
  setInitialPolygon: React.Dispatch<React.SetStateAction<LatLngTuple[]>>;
}
const DraggablePanel = ({
  mapRef,
  setDragging,
  initialPolygon,
  setInitialPolygon,
}: DraggablePanelProps) => {
  return (
    <Polygon
      positions={initialPolygon}
      pathOptions={{ color: "blue" }}
      //@ts-expect-error While this results in an error, draggable exists
      draggable={true}
      eventHandlers={{
        dragstart: () => {
          setDragging(true);
        },
        dragend: (e) => {
          const layer = e.target as L.Polygon;
          const newCoords: LatLngTuple[] = (
            layer.getLatLngs()[0] as L.LatLng[]
          ).map((latlng) => [latlng.lat, latlng.lng] as LatLngTuple);

          setInitialPolygon(newCoords);
          setDragging(false);

          // Re-enable map dragging
          if (mapRef.current) {
            mapRef.current.dragging.enable();
          }
        },
        mousedown: () => {
          // Disable map drag while dragging polygon
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
