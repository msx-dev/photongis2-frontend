"use client";
import L from "leaflet";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-draw-drag";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-path-drag";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import PanelGroup from "../PanelGroup/PanelGroup";
import styles from "./Map2.module.scss";

export default function Map2() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <MapContainer
      center={[43, 12]}
      zoom={19}
      ref={mapRef}
      scrollWheelZoom={true}
      className={styles.map}
      maxZoom={25}
    >
      <TileLayer
        attribution="Tiles &copy; Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxNativeZoom={19}
        maxZoom={25}
      />
      <PanelGroup mapRef={mapRef} />
    </MapContainer>
  );
}
