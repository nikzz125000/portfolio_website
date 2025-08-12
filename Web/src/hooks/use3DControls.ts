import { useState, useCallback } from "react";

export function use3DControls() {
  const [objectType, setObjectType] = useState("cube");
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [objectColor, setObjectColor] = useState("#4f46e5");
  const [enableControls, setEnableControls] = useState(true);

  const resetControls = useCallback(() => {
    setObjectType("cube");
    setAnimationSpeed(1);
    setObjectColor("#4f46e5");
  }, []);

  return {
    objectType,
    setObjectType,
    animationSpeed,
    setAnimationSpeed,
    objectColor,
    setObjectColor,
    enableControls,
    setEnableControls,
    resetControls,
  };
}
