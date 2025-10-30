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

  // New: store the original (unrotated/unmoved) polygon
  const [originalInitialPolygon, setOriginalInitialPolygon] = useState<LatLngTuple[]>([]);

  // Update original polygon reference when initialPolygon is first set or after drag
  useEffect(() => {
    if (initialPolygon.length > 0 && originalInitialPolygon.length === 0) {
      setOriginalInitialPolygon(initialPolygon);
    }
  }, [initialPolygon, originalInitialPolygon]);

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

  // Utility: Rotate around a center, matching DraggablePanel logic
  const rotateAndTranslatePanel = (
    coords: LatLngTuple[],
    center: { x: number; y: number },
    angleDeg: number
  ): LatLngTuple[] => {
    if (!map || coords.length === 0) return [];

    const points = coords.map(([lat, lng]) => map.project([lat, lng]));
    const angleRad = (angleDeg * Math.PI) / 180;

    const rotatedPoints = points.map((p) => {
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const rx = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
      const ry = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);
      return L.point(center.x + rx, center.y + ry);
    });
    return rotatedPoints.map((p) => {
      const latlng = map.unproject(p);
      return [latlng.lat, latlng.lng] as LatLngTuple;
    });
  };

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

      {Array.from(additionalPanels.values()).map((panel) => {
        // Find the center of the initialPolygon in pixel space
        const initialPoints = initialPolygon.map(([lat, lng]) =>
          map.project([lat, lng])
        );
        const cx =
          initialPoints.reduce((sum, p) => sum + p.x, 0) / initialPoints.length;
        const cy =
          initialPoints.reduce((sum, p) => sum + p.y, 0) / initialPoints.length;
        const center = { x: cx, y: cy };

        // Rotate+translate this additional panel around the same center
        const transformedCoords = rotateAndTranslatePanel(
          panel.coords,
          center,
          rangeValue
        );
        return (
          <Polygon
            key={`${panel.x}${panel.y}`}
            positions={transformedCoords}
            pathOptions={{ color: "green" }}
            eventHandlers={{
              click: () => removePanel(`${panel.x},${panel.y}`),
            }}
          />
        );
      })}

      {movingPolygon && (
        <Polygon positions={movingPolygon} pathOptions={{ color: "red" }} />
      )}

      {initialPolygon.length > 0 && showPluses && !dragging && (
        <SideMarkers
          initialPolygon={initialPolygon}
          originalInitialPolygon={originalInitialPolygon}
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
