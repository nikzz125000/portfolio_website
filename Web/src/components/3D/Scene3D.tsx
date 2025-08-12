import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Html,
  useProgress,
} from "@react-three/drei";
import SwiftCar3D from "./SwiftCar3D";
import Lighting from "./Lighting";
import Effects from "./Effects";

// Loading fallback
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="loading-container">
        <div>Loading 3D Scene: {Math.round(progress)}%</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </Html>
  );
}

interface Scene3DProps {
  carColor?: string;
  animationSpeed?: number;
  enableControls?: boolean;
  className?: string;
  style?: React.CSSProperties;
  enableRotation?: boolean;
  enableHover?: boolean;
  enableLights?: boolean;
  position?: [number, number, number];
}

export default function Scene3D({
  carColor = "#e11d48",
  animationSpeed = 1,
  enableControls = true,
  className = "",
  style = {},
  enableRotation = true,
  enableHover = true,
  enableLights = true,
  position = [0, 0, 0],
}: Scene3DProps) {
  return (
    <div
      className={`3d-scene-container ${className}`}
      style={{ width: "100%", height: "400px", ...style }}
    >
      <Canvas
        camera={{ position: [3, 3, 3], fov: 60 }}
        shadows
        dpr={[1, 2]} // Device pixel ratio for retina displays
        onWheel={(e) => {
          // Allow wheel events to bubble up to the custom scroll system
          e.stopPropagation();
          e.preventDefault();
        }}
        onTouchStart={(e) => {
          // Allow touch events to bubble up to the custom scroll system
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          // Allow touch events to bubble up to the custom scroll system
          e.stopPropagation();
        }}
        onPointerDown={(e) => {
          // Only capture pointer events when explicitly clicking on 3D objects
          if (e.target === e.currentTarget) {
            e.stopPropagation();
          }
        }}
        style={{
          touchAction: "pan-y", // Allow vertical scrolling
          pointerEvents: "auto", // Ensure pointer events work properly
        }}
      >
        <Suspense fallback={<Loader />}>
          {/* Scene Setup */}
          <Lighting />
          <Environment preset="sunset" background={false} />

          {/* Interactive Swift Car */}
          <SwiftCar3D
            color={carColor}
            animationSpeed={animationSpeed}
            enableRotation={enableRotation}
            enableHover={enableHover}
            enableLights={enableLights}
            position={position}
          />

          {/* Camera Controls */}
          {enableControls && (
            <OrbitControls
              enablePan={false} // Disable panning to prevent interference with page scroll
              enableZoom={true}
              enableRotate={true}
              maxPolarAngle={Math.PI / 2}
              minDistance={2}
              maxDistance={10}
              enableDamping={true}
              dampingFactor={0.05}
              // Only allow controls when explicitly clicking on the 3D scene
              onStart={() => {
                // Optional: Add visual feedback when controls are active
              }}
            />
          )}

          {/* Visual Effects */}
          <Effects />
        </Suspense>
      </Canvas>
    </div>
  );
}
