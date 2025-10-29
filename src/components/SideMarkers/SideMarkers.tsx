import useAdditionalPanels from "@/hooks/useAdditionalPanels";
import { getSideMarkers } from "@/utils/initialPanelUtils";
import { Icon, LatLngTuple } from "leaflet";
import { Marker } from "react-leaflet";

interface SideMarkersProps {
  initialPolygon: LatLngTuple[];
}

const healthIcon = new Icon({
  iconUrl: "/images/plus.png",
  iconSize: [25, 25],
});

const SideMarkers = ({ initialPolygon }: SideMarkersProps) => {
  const { addPolygon, additionalPolygons } = useAdditionalPanels();
  return (
    <>
      {getSideMarkers(initialPolygon).map((pos, idx) => (
        <Marker
          key={idx}
          position={pos}
          icon={healthIcon}
          eventHandlers={{ click: () => addPolygon(idx) }}
        />
      ))}
    </>
  );
};

export default SideMarkers;
