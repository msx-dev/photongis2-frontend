"use client";
import L, { Icon, LatLngTuple } from "leaflet";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-transform";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
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
  iconSize: [35, 35],
});

export default function Map() {
  const [polygon, setPolygon] = useState<LatLngTuple[]>([]);
  const [rotation, setRotation] = useState(0); // rotation in degrees
  const [addReferenceMode, setAddReferenceMode] = useState(false);
  const [lowReferenceLocation, setLowReferenceLocation] =
    useState<L.LatLngExpression>();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const polygonRef = useRef<L.Polygon>(null);
  const mapRef = useRef<L.Map | null>(null);

  const onCreate = (e: any) => {
    if (e.layerType !== "rectangle") return;

    const latlngs = e.layer.getLatLngs();
    if (
      !Array.isArray(latlngs) ||
      latlngs.length === 0 ||
      !Array.isArray(latlngs[0])
    ) {
      console.error("Unexpected latlngs structure:", latlngs);
      return;
    }

    const polygonCoords: LatLngTuple[] = latlngs[0].map((latlng: L.LatLng) => [
      latlng.lat,
      latlng.lng,
    ]);

    setPolygon(polygonCoords);
    e.layer.remove();
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

  // Rotate a polygon around its center
  const rotatePolygon = (coords: LatLngTuple[], angleDeg: number) => {
    if (!mapRef.current) return coords;

    const angleRad = (angleDeg * Math.PI) / 180;

    // Compute center in LatLng
    const centerLat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
    const centerLng = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
    const center = L.latLng(centerLat, centerLng);

    return coords.map(([lat, lng]) => {
      const point = mapRef.current!.latLngToLayerPoint([lat, lng]);
      const centerPoint = mapRef.current!.latLngToLayerPoint(center);

      const x = point.x - centerPoint.x;
      const y = point.y - centerPoint.y;

      const rotatedX = x * Math.cos(angleRad) - y * Math.sin(angleRad);
      const rotatedY = x * Math.sin(angleRad) + y * Math.cos(angleRad);

      const rotatedPoint = L.point(
        rotatedX + centerPoint.x,
        rotatedY + centerPoint.y
      );
      const rotatedLatLng = mapRef.current!.layerPointToLatLng(rotatedPoint);
      return [rotatedLatLng.lat, rotatedLatLng.lng] as LatLngTuple;
    });
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
      ref={mapRef}
      scrollWheelZoom={true}
      className={styles.map}
      maxZoom={19}
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
        attribution="Tiles &copy; Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxNativeZoom={19}
        maxZoom={21}
      />

      {addReferenceMode && lowReferenceLocation && windowWidth >= 1000 && (
        <Marker position={lowReferenceLocation} icon={healthIcon}></Marker>
      )}
      {polygon.length !== 0 && (
        <Polygon positions={rotatePolygon(polygon, rotation)} />
      )}
      {polygon.length !== 0 && (
        <div
          style={{ marginTop: "10px", position: "absolute", zIndex: 10000 }}
          onMouseDown={(e) => {
            e.stopPropagation();
            mapRef.current?.dragging.disable(); // disable map drag
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            mapRef.current?.dragging.enable(); // re-enable map drag
          }}
          onMouseLeave={() => {
            mapRef.current?.dragging.enable(); // safety
          }}
        >
          <label>
            Rotate Rectangle: {rotation}°
            <input
              type="range"
              min={0}
              max={360}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
            />
          </label>
        </div>
      )}
      <LatLongFinder />
    </MapContainer>
  );
}
