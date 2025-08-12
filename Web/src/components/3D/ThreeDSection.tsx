import React from "react";
import Scene3D from "./Scene3D";
import Controls3D from "../ui/Controls3D";
import { useSwiftCarControls } from "../../hooks/useSwiftCarControls";

interface ThreeDSectionProps {
  className?: string;
  style?: React.CSSProperties;
  showControls?: boolean;
  height?: string;
  deviceType?: "mobile" | "tablet" | "desktop";
}

export default function ThreeDSection({
  className = "",
  style = {},
  showControls = true,
  height = "500px",
  deviceType = "desktop",
}: ThreeDSectionProps) {
  const {
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
  } = useSwiftCarControls();

  return (
    <div
      className={`3d-section ${className}`}
      style={{
        width: "100%",
        padding:
          deviceType === "mobile"
            ? "20px 15px"
            : deviceType === "tablet"
            ? "30px 20px"
            : "40px 20px",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        borderTop: "1px solid #e2e8f0",
        borderBottom: "1px solid #e2e8f0",
        /* Ensure proper touch handling and scroll compatibility */
        touchAction: "pan-y",
        pointerEvents: "auto",
        ...style,
      }}
      onWheel={(e) => {
        // Allow wheel events to bubble up to the custom scroll system
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        // Allow touch events to bubble up to the custom scroll system
        e.stopPropagation();
      }}
      onTouchMove={(e) => {
        // Allow touch events to bubble up to the custom scroll system
        e.stopPropagation();
      }}
    >
      <div
        className="3d-section-header"
        style={{ textAlign: "center", marginBottom: "30px" }}
      >
        <h2
          style={{
            fontSize:
              deviceType === "mobile"
                ? "24px"
                : deviceType === "tablet"
                ? "26px"
                : "28px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "10px",
          }}
        >
          Interactive Swift Car Experience
        </h2>
        <p
          style={{
            fontSize: deviceType === "mobile" ? "14px" : "16px",
            color: "#64748b",
            maxWidth: deviceType === "mobile" ? "100%" : "600px",
            margin: "0 auto",
          }}
        >
          Explore our realistic Swift car model with interactive controls,
          lights, and detailed features
        </p>
      </div>

      <div
        className="3d-container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* 3D Scene */}
        <div
          className="3d-scene-wrapper"
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Scene3D
            carColor={carColor}
            animationSpeed={animationSpeed}
            enableRotation={enableRotation}
            enableHover={enableHover}
            enableLights={enableLights}
            className="main-3d-scene"
            style={{ height }}
          />
        </div>

        {/* Controls */}
        {showControls && deviceType !== "mobile" && (
          <div
            className="3d-controls-wrapper"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <Controls3D
              carColor={carColor}
              setCarColor={setCarColor}
              animationSpeed={animationSpeed}
              setAnimationSpeed={setAnimationSpeed}
              enableRotation={enableRotation}
              setEnableRotation={setEnableRotation}
              enableHover={enableHover}
              setEnableHover={setEnableHover}
              enableLights={enableLights}
              setEnableLights={setEnableLights}
            />

            <div style={{ textAlign: "center" }}>
              <button
                onClick={resetControls}
                style={{
                  padding: "10px 20px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(102, 126, 234, 0.3)";
                }}
              >
                Reset 3D Scene
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
