import React from "react";

interface Controls3DProps {
  carColor: string;
  setCarColor: (color: string) => void;
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  enableRotation: boolean;
  setEnableRotation: (enabled: boolean) => void;
  enableHover: boolean;
  setEnableHover: (enabled: boolean) => void;
  enableLights: boolean;
  setEnableLights: (enabled: boolean) => void;
}

export default function Controls3D({
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
}: Controls3DProps) {
  return (
    <div className="controls-3d">
      <h3>Swift Car Controls</h3>

      {/* Car Color Control */}
      <div className="control-group">
        <label>Car Color:</label>
        <input
          type="color"
          value={carColor}
          onChange={(e) => setCarColor(e.target.value)}
        />
      </div>

      {/* Animation Speed Control */}
      <div className="control-group">
        <label>Animation Speed: {animationSpeed.toFixed(1)}x</label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
        />
      </div>

      {/* Rotation Toggle */}
      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={enableRotation}
            onChange={(e) => setEnableRotation(e.target.checked)}
          />
          Enable Rotation
        </label>
      </div>

      {/* Hover Effects Toggle */}
      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={enableHover}
            onChange={(e) => setEnableHover(e.target.checked)}
          />
          Enable Hover Effects
        </label>
      </div>

      {/* Lights Toggle */}
      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={enableLights}
            onChange={(e) => setEnableLights(e.target.checked)}
          />
          Enable Lights
        </label>
      </div>
    </div>
  );
}
