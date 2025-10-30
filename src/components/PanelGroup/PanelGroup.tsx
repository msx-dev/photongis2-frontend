"use client";

import useAdditionalPanels from "@/hooks/useAdditionalPanels";
import L, { LatLngTuple } from "leaflet";
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
  const [rangeValue, setRangeValue] = useState(0);

  useEffect(() => {
    // Update zoom level on zoom change
    const handleZoomEnd = () => {
      const currentZoom = map.getZoom();
      if (currentZoom > 21) {
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
          rangeValue={rangeValue}
          mapRef={mapRef}
          initialPolygon={initialPolygon}
          setDragging={setDragging}
          setInitialPolygon={setInitialPolygon}
          onInitialPanelChange={onInitialPanelChange}
        />
      )}

      {Array.from(additionalPanels.values()).map((panel) => (
        <Polygon
          key={`${panel.x}${panel.y}`}
          positions={panel.coords}
          pathOptions={{ color: "green" }}
          eventHandlers={{
            click: () => removePanel(`${panel.x},${panel.y}`),
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

      {/* ✅ UI Controls */}
      <div
        style={{
          position: "absolute",
          top: "50px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10000,
          background: "rgba(255, 255, 255, 0.8)",
          padding: "10px",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <button onClick={() => setAddReferenceMode(true)}>Add Polygon</button>

        {/* 🆕 Range Input */}

        <div
          style={{ marginTop: "10px", width: "250px" }}
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
            Rotation: {rangeValue}°
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={rangeValue}
              onChange={(e) => setRangeValue(Number(e.target.value))}
              style={{ width: "200px", marginLeft: "10px" }}
            />
          </label>
        </div>
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
