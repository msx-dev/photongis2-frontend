import { LatLngTuple } from "leaflet";
import { useMapEvents } from "react-leaflet";

interface LatLongFinderProps {
  addReferenceMode: boolean;
  setAddReferenceMode: React.Dispatch<React.SetStateAction<boolean>>;
  movingPolygon: LatLngTuple[];
  setMovingPolygon: React.Dispatch<React.SetStateAction<LatLngTuple[]>>;
  initialPolygon: LatLngTuple[];
  setInitialPolygon: React.Dispatch<React.SetStateAction<LatLngTuple[]>>;
}

const LatLongFinder = ({
  setInitialPolygon,
  movingPolygon,
  setMovingPolygon,
  addReferenceMode,
  setAddReferenceMode,
}: LatLongFinderProps) => {
  const map = useMapEvents({
    mousemove(e) {
      if (addReferenceMode) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        const size = 0.00001;
        setMovingPolygon([
          [lat - size, lng - size],
          [lat - size, lng + size],
          [lat + size, lng + size],
          [lat + size, lng - size],
        ]);
      }
    },
    click(e) {
      if (addReferenceMode && movingPolygon) {
        setInitialPolygon(movingPolygon);
        setMovingPolygon([]);
        setAddReferenceMode(false);
      }
    },
  });
  return null;
};

export default LatLongFinder;
