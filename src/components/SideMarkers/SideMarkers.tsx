import { Directions } from "@/constants/panelConstants";
import { AdditionalPanelsType } from "@/hooks/useAdditionalPanels";
import { getSideMarkers } from "@/utils/initialPanelUtils";
import { Icon, LatLngTuple } from "leaflet";
import { Marker } from "react-leaflet";

interface SideMarkersProps {
  initialPolygon: LatLngTuple[];
  addPolygon: (
    x: number,
    y: number,
    direction: keyof typeof Directions,
    startingPanel: LatLngTuple[]
  ) => void;
  additionalPanels: Map<string, AdditionalPanelsType>;
}

const healthIcon = new Icon({
  iconUrl: "/images/plus.png",
  iconSize: [25, 25],
});

const SideMarkers = ({
  initialPolygon,
  addPolygon,
  additionalPanels,
}: SideMarkersProps) => {
  const directionKeys = ["Top", "Right", "Bottom", "Left"] as const;

  return (
    <>
      {getSideMarkers(initialPolygon, additionalPanels).map((marker, index) => (
        <Marker
          key={index}
          position={marker.coords}
          icon={healthIcon}
          eventHandlers={{
            click: () => addPolygon(0, 0, marker.position, initialPolygon),
          }}
        />
      ))}
    </>
  );
};

export default SideMarkers;
