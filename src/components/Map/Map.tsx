"use client";
import L, { Icon, LatLngExpression } from "leaflet";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  FeatureGroup,
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import styles from "./Map.module.scss";

const healthIcon = new Icon({
  iconUrl:
    "https://img.icons8.com/?size=100&id=7yVMtODDHoSU&format=png&color=000000",
  iconSize: [35, 35], // size of the icon
});

export default function Map() {
  const [polygon, setPolygon] = useState<L.LatLngTuple[]>([]);
  const [addReferenceMode, setAddReferenceMode] = useState(false);
  const [lowReferenceLocation, setLowReferenceLocation] =
    useState<LatLngExpression>();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const onCreate = (e: any) => {
    const { layer } = e;
    if (e.layerType === "polygon") {
      const latlngs = e.layer.editing.latlngs;
      if (!latlngs || latlngs.length === 0) {
        console.error("Invalid latlngs data:", latlngs);
        return;
      }

      // Ensure latlngs[0] exists and is an array
      if (Array.isArray(latlngs[0])) {
        const nestedLatLngs = latlngs[0][0]; // Access the inner array of latlngs
        if (nestedLatLngs) {
          const polygonCoords: L.LatLngTuple[] = nestedLatLngs.map(
            (latlng: { lat: number; lng: number }) =>
              [latlng.lat, latlng.lng] as L.LatLngTuple
          );
          setPolygon(polygonCoords);
        } else {
          console.error("Unexpected latlngs structure:", latlngs);
        }
      } else {
        console.error("Unexpected latlngs structure:", latlngs);
      }
      layer.remove();
    }
  };

  const LatLongFinder = () => {
    const map = useMapEvents({
      mousemove(e) {
        if (addReferenceMode) {
          setLowReferenceLocation(e.latlng);
        }
      },
      click(e) {
        if (addReferenceMode) {
          setAddReferenceMode(false);
        }
      },
    });
    return null;
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <MapContainer
      center={[10, 23]}
      zoom={10}
      scrollWheelZoom={true}
      className={styles.map}
      maxZoom={21}
    >
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={onCreate}
          draw={{
            polygon: { allowIntersection: true },
            polyline: false,
            rectangle: true,
            circle: false,
            marker: false,
            circlemarker: false,
          }}
        />
      </FeatureGroup>
      <TileLayer
        attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxNativeZoom={19}
        maxZoom={19}
      />

      {addReferenceMode && lowReferenceLocation && windowWidth >= 1000 && (
        <Marker position={lowReferenceLocation} icon={healthIcon}></Marker>
      )}
      {polygon.length !== 0 && <Polygon positions={polygon} />}
      <LatLongFinder />
    </MapContainer>
  );
}
