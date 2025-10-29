"use client";

import useAdditionalPanels from "@/hooks/useAdditionalPanels";
import { getSideMarkers } from "@/utils/initialPanelUtils";
import { Icon, LatLngTuple } from "leaflet";
import { RefObject, useEffect, useState } from "react";
import { Marker, Polygon, useMap } from "react-leaflet";
import DraggablePanel from "../DraggablePanel/DraggablePanel";
import LatLongFinder from "../LatLongFinder/LatLongFinder";

const healthIcon = new Icon({
  iconUrl: "/images/plus.png",
  iconSize: [25, 25],
});

interface PanelGroupProps {
  mapRef: RefObject<L.Map | null>;
}

const PanelGroup = ({ mapRef }: PanelGroupProps) => {
  const map = useMap();
  const [additionalPanel, setAdditionalPanel] = useState<LatLngTuple[]>([]);
  const { addPolygon } = useAdditionalPanels();
  const [dragging, setDragging] = useState(false);
  const [showPluses, setShowPluses] = useState(false);
  const [movingPolygon, setMovingPolygon] = useState<LatLngTuple[]>([]);
  const [initialPolygon, setInitialPolygon] = useState<LatLngTuple[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [addReferenceMode, setAddReferenceMode] = useState(false);

  useEffect(() => {
    // Update zoom level on zoom change
    const handleZoomEnd = () => {
      const currentZoom = map.getZoom();
      if (currentZoom > 20) {
        setShowPluses(true);
      } else {
        setShowPluses(false);
      }
    };

    // Attach the zoomend event listener
    map.on("zoomend", handleZoomEnd);

    // Cleanup the event listener on component unmount
    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [map]); // On

  return (
    <>
      {initialPolygon.length !== 0 && (
        <DraggablePanel
          mapRef={mapRef}
          initialPolygon={initialPolygon}
          setDragging={setDragging}
          setInitialPolygon={setInitialPolygon}
        />
      )}
      {additionalPanel.length !== 0 && (
        <Polygon positions={additionalPanel} pathOptions={{ color: "green" }} />
      )}
      {movingPolygon && (
        <Polygon positions={movingPolygon} pathOptions={{ color: "red" }} />
      )}
      {initialPolygon.length > 0 &&
        showPluses &&
        !dragging &&
        getSideMarkers(initialPolygon).map((pos, idx) => (
          <Marker
            key={idx}
            position={pos}
            icon={healthIcon}
            eventHandlers={{ click: () => addPolygon(idx) }}
          />
        ))}

      <div style={{ marginTop: "50px", position: "absolute", zIndex: 10000 }}>
        <button
          onClick={() => {
            setAddReferenceMode(true);
          }}
        >
          Add Polygon
        </button>
      </div>
      <LatLongFinder
        setInitialPolygon={setInitialPolygon}
        addReferenceMode={addReferenceMode}
        initialPolygon={initialPolygon}
        setMovingPolygon={setMovingPolygon}
        setAddReferenceMode={setAddReferenceMode}
        movingPolygon={movingPolygon}
      />
    </>
  );
};

export default PanelGroup;
