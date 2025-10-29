import { useState } from "react";

export interface AdditionalPanelsType {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const useAdditionalPolygons = () => {
  const [additionalPolygons, setAdditionalPolygons] =
    useState<AdditionalPanelsType>({ top: 0, right: 0, bottom: 0, left: 0 });

  const addPolygon = (index: number) => {
    let side: keyof typeof additionalPolygons | null = null;

    if (index === 0) side = "top";
    else if (index === 1) side = "right";
    else if (index === 2) side = "bottom";
    else if (index === 3) side = "left";

    if (side) {
      setAdditionalPolygons((prevState) => ({
        ...prevState,
        [side]: prevState[side] + 1,
      }));
    }
  };

  return { additionalPolygons, setAdditionalPolygons, addPolygon };
};

export default useAdditionalPolygons;
