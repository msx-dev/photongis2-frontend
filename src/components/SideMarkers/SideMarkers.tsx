import { Directions } from "@/constants/panelConstants";
import { AdditionalPanelsType } from "@/hooks/useAdditionalPanels";
import { getSideMarkers } from "@/utils/panelUtils";
import { Icon, LatLngTuple } from "leaflet";
import { Marker } from "react-leaflet";

interface SideMarkersProps {
  initialPolygon: LatLngTuple[];
  addPanel: (
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
  addPanel,
  additionalPanels,
}: SideMarkersProps) => {
  return (
    <>
      {getSideMarkers(initialPolygon, additionalPanels).map((marker, index) => (
        <Marker
          key={index}
          position={marker.coords}
          icon={healthIcon}
          eventHandlers={{
            click: () =>
              addPanel(
                marker.panel.x,
                marker.panel.y,
                marker.position,
                marker.panel.coords
              ),
          }}
        />
      ))}
    </>
  );
};

export default SideMarkers;
