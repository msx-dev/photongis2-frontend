"use client";

import useAdditionalPanels from "@/hooks/useAdditionalPanels";
import { LatLngTuple } from "leaflet";
import { RefObject, useEffect, useState } from "react";
import { Polygon, useMap } from "react-leaflet";
import DraggablePanel from "../DraggablePanel/DraggablePanel";
import LatLongFinder from "../LatLongFinder/LatLongFinder";
import SideMarkers from "../SideMarkers/SideMarkers";

interface PanelGroupProps {
  mapRef: RefObject<L.Map | null>;
}

const PanelGroup = ({ mapRef }: PanelGroupProps) => {
  const map = useMap();
  const { additionalPanels, addPanel, onInitialPanelChange, removePanel } =
    useAdditionalPanels();
  const [dragging, setDragging] = useState(false);
  const [showPluses, setShowPluses] = useState(false);
  const [movingPolygon, setMovingPolygon] = useState<LatLngTuple[]>([]);
  const [initialPolygon, setInitialPolygon] = useState<LatLngTuple[]>([]);
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

  useEffect(() => {
    console.log(additionalPanels);
  }, [additionalPanels]);

  return (
    <>
      {initialPolygon.length !== 0 && (
        <DraggablePanel
          mapRef={mapRef}
          initialPolygon={initialPolygon}
          setDragging={setDragging}
          setInitialPolygon={setInitialPolygon}
          onInitialPanelChange={onInitialPanelChange}
        />
      )}
      {Array.from(additionalPanels.values()).map((panel, index) => (
        <Polygon
          key={`${panel.x}${panel.y}`}
          positions={panel.coords}
          pathOptions={{ color: "green" }}
          eventHandlers={{
            click: () => {
              removePanel(`${panel.x},${panel.y}`);
            },
          }}
        />
      ))}
      {movingPolygon && (
        <Polygon positions={movingPolygon} pathOptions={{ color: "red" }} />
      )}
      {initialPolygon.length > 0 && showPluses && !dragging && (
        <SideMarkers
          initialPolygon={initialPolygon}
          addPanel={addPanel}
          additionalPanels={additionalPanels}
        />
      )}

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
