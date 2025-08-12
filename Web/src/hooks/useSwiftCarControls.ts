import { useState, useCallback } from "react";

export function useSwiftCarControls() {
  const [carColor, setCarColor] = useState("#e11d48"); // Swift red
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [enableRotation, setEnableRotation] = useState(true);
  const [enableHover, setEnableHover] = useState(true);
  const [enableLights, setEnableLights] = useState(true);

  const resetControls = useCallback(() => {
    setCarColor("#e11d48");
    setAnimationSpeed(1);
    setEnableRotation(true);
    setEnableHover(true);
    setEnableLights(true);
  }, []);

  return {
    carColor,
    setCarColor,
    animationSpeed,
    setAnimationSpeed,
    enableRotation,
    setEnableRotation,
    enableHover,
    setEnableHover,
    enableLights,
    setEnableLights,
    resetControls,
  };
}
