import React, { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Box, Sphere, Cylinder, Text, Html } from "@react-three/drei";
import * as THREE from "three";

interface SwiftCar3DProps {
  position?: [number, number, number];
  color?: string;
  animationSpeed?: number;
  enableRotation?: boolean;
  enableHover?: boolean;
  enableLights?: boolean;
}

export default function SwiftCar3D({
  position = [0, 0, 0],
  color = "#e11d48", // Swift red color
  animationSpeed = 1,
  enableRotation = true,
  enableHover = true,
  enableLights = true,
}: SwiftCar3DProps) {
  const carRef = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);

  // Swift car realistic dimensions (in meters)
  const dimensions = {
    length: 3.84, // 3.84m actual Swift length
    width: 1.73, // 1.73m actual Swift width
    height: 1.53, // 1.53m actual Swift height
    wheelbase: 2.45, // 2.45m wheelbase
    groundClearance: 0.17, // 17cm ground clearance
  };

  const wheelRadius = 0.3; // 30cm wheel radius
  const wheelWidth = 0.2; // 20cm wheel width

  // Interactive states
  const [doorOpen, setDoorOpen] = useState(false);
  const [hoodOpen, setHoodOpen] = useState(false);
  const [trunkOpen, setTrunkOpen] = useState(false);

  useFrame((state, delta) => {
    if (carRef.current) {
      const time = state.clock.elapsedTime;

      // Gentle floating animation
      carRef.current.position.y =
        Math.sin(time * animationSpeed * 0.3) * 0.05 + position[1];

      // Rotation animation
      if (enableRotation) {
        carRef.current.rotation.y += delta * animationSpeed * 0.2;
      }

      // Interactive scaling
      const targetScale = hover ? 1.02 : clicked ? 0.98 : 1;
      carRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  const handlePointerOver = (e: any) => {
    if (enableHover) {
      e.stopPropagation();
      setHover(true);
    }
  };

  const handlePointerOut = (e: any) => {
    if (enableHover) {
      e.stopPropagation();
      setHover(false);
    }
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    setClicked(!clicked);
  };

  const toggleLights = (e: any) => {
    e.stopPropagation();
    setLightsOn(!lightsOn);
  };

  const toggleDoor = (e: any) => {
    e.stopPropagation();
    setDoorOpen(!doorOpen);
  };

  const toggleHood = (e: any) => {
    e.stopPropagation();
    setHoodOpen(!hoodOpen);
  };

  const toggleTrunk = (e: any) => {
    e.stopPropagation();
    setTrunkOpen(!trunkOpen);
  };

  // Material colors
  const carColor = hover ? "#f43f5e" : color; // Brighter red on hover
  const wheelColor = "#1f2937";
  const glassColor = "#0ea5e9";
  const chromeColor = "#fbbf24";
  const blackColor = "#111827";
  const silverColor = "#9ca3af";

  // Create realistic materials
  const materials = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({
        color: carColor,
        metalness: 0.4,
        roughness: 0.3,
        envMapIntensity: 1.0,
      }),
      glass: new THREE.MeshStandardMaterial({
        color: glassColor,
        metalness: 0.1,
        roughness: 0.05,
        transparent: true,
        opacity: 0.7,
        envMapIntensity: 1.5,
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: chromeColor,
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 2.0,
      }),
      wheel: new THREE.MeshStandardMaterial({
        color: wheelColor,
        metalness: 0.2,
        roughness: 0.8,
      }),
      black: new THREE.MeshStandardMaterial({
        color: blackColor,
        metalness: 0.1,
        roughness: 0.9,
      }),
      silver: new THREE.MeshStandardMaterial({
        color: silverColor,
        metalness: 0.3,
        roughness: 0.6,
      }),
    }),
    [carColor]
  );

  return (
    <group
      ref={carRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      castShadow
      receiveShadow
    >
      {/* Main Car Body - Swift's distinctive shape */}
      <Box
        args={[dimensions.length, dimensions.height, dimensions.width]}
        position={[0, dimensions.height / 2 + dimensions.groundClearance, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.body} />
      </Box>

      {/* Car Roof - Swift's curved roof */}
      <Box
        args={[
          dimensions.length * 0.65,
          dimensions.height * 0.35,
          dimensions.width * 0.75,
        ]}
        position={[
          0,
          dimensions.height +
            dimensions.height * 0.175 +
            dimensions.groundClearance,
          0,
        ]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.body} />
      </Box>

      {/* Front Hood */}
      <Box
        args={[
          dimensions.length * 0.25,
          dimensions.height * 0.15,
          dimensions.width * 0.8,
        ]}
        position={[
          dimensions.length * 0.375,
          dimensions.height * 0.075 + dimensions.groundClearance,
          0,
        ]}
        rotation={[hoodOpen ? -Math.PI * 0.15 : 0, 0, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.body} />
      </Box>

      {/* Trunk */}
      <Box
        args={[
          dimensions.length * 0.2,
          dimensions.height * 0.15,
          dimensions.width * 0.8,
        ]}
        position={[
          -dimensions.length * 0.4,
          dimensions.height * 0.075 + dimensions.groundClearance,
          0,
        ]}
        rotation={[trunkOpen ? Math.PI * 0.15 : 0, 0, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.body} />
      </Box>

      {/* Front Windshield */}
      <Box
        args={[0.05, dimensions.height * 0.65, dimensions.width * 0.7]}
        position={[
          dimensions.length * 0.325,
          dimensions.height +
            dimensions.height * 0.075 +
            dimensions.groundClearance,
          0,
        ]}
        rotation={[0, 0, Math.PI * 0.12]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.glass} />
      </Box>

      {/* Rear Windshield */}
      <Box
        args={[0.05, dimensions.height * 0.65, dimensions.width * 0.7]}
        position={[
          -dimensions.length * 0.325,
          dimensions.height +
            dimensions.height * 0.075 +
            dimensions.groundClearance,
          0,
        ]}
        rotation={[0, 0, -Math.PI * 0.12]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.glass} />
      </Box>

      {/* Side Windows */}
      <Box
        args={[dimensions.length * 0.55, dimensions.height * 0.45, 0.05]}
        position={[
          0,
          dimensions.height +
            dimensions.height * 0.075 +
            dimensions.groundClearance,
          dimensions.width * 0.325,
        ]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.glass} />
      </Box>

      <Box
        args={[dimensions.length * 0.55, dimensions.height * 0.45, 0.05]}
        position={[
          0,
          dimensions.height +
            dimensions.height * 0.075 +
            dimensions.groundClearance,
          -dimensions.width * 0.325,
        ]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.glass} />
      </Box>

      {/* Front Bumper */}
      <Box
        args={[0.15, dimensions.height * 0.25, dimensions.width]}
        position={[
          dimensions.length * 0.495,
          dimensions.height * 0.125 + dimensions.groundClearance,
          0,
        ]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.black} />
      </Box>

      {/* Rear Bumper */}
      <Box
        args={[0.15, dimensions.height * 0.25, dimensions.width]}
        position={[
          -dimensions.length * 0.495,
          dimensions.height * 0.125 + dimensions.groundClearance,
          0,
        ]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.black} />
      </Box>

      {/* Front Grille */}
      <Box
        args={[0.05, dimensions.height * 0.3, dimensions.width * 0.6]}
        position={[
          dimensions.length * 0.49,
          dimensions.height * 0.15 + dimensions.groundClearance,
          0,
        ]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.black} />
      </Box>

      {/* Front Wheels */}
      <Cylinder
        args={[wheelRadius, wheelRadius, wheelWidth, 16]}
        position={[
          dimensions.wheelbase / 2,
          wheelRadius + dimensions.groundClearance,
          dimensions.width * 0.35,
        ]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.wheel} />
      </Cylinder>

      <Cylinder
        args={[wheelRadius, wheelRadius, wheelWidth, 16]}
        position={[
          dimensions.wheelbase / 2,
          wheelRadius + dimensions.groundClearance,
          -dimensions.width * 0.35,
        ]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.wheel} />
      </Cylinder>

      {/* Rear Wheels */}
      <Cylinder
        args={[wheelRadius, wheelRadius, wheelWidth, 16]}
        position={[
          -dimensions.wheelbase / 2,
          wheelRadius + dimensions.groundClearance,
          dimensions.width * 0.35,
        ]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.wheel} />
      </Cylinder>

      <Cylinder
        args={[wheelRadius, wheelRadius, wheelWidth, 16]}
        position={[
          -dimensions.wheelbase / 2,
          wheelRadius + dimensions.groundClearance,
          -dimensions.width * 0.35,
        ]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.wheel} />
      </Cylinder>

      {/* Wheel Rims */}
      <Cylinder
        args={[wheelRadius * 0.65, wheelRadius * 0.65, wheelWidth + 0.01, 16]}
        position={[
          dimensions.wheelbase / 2,
          wheelRadius + dimensions.groundClearance,
          dimensions.width * 0.35,
        ]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.chrome} />
      </Cylinder>

      <Cylinder
        args={[wheelRadius * 0.65, wheelRadius * 0.65, wheelWidth + 0.01, 16]}
        position={[
          dimensions.wheelbase / 2,
          wheelRadius + dimensions.groundClearance,
          -dimensions.width * 0.35,
        ]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.chrome} />
      </Cylinder>

      <Cylinder
        args={[wheelRadius * 0.65, wheelRadius * 0.65, wheelWidth + 0.01, 16]}
        position={[
          -dimensions.wheelbase / 2,
          wheelRadius + dimensions.groundClearance,
          dimensions.width * 0.35,
        ]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.chrome} />
      </Cylinder>

      <Cylinder
        args={[wheelRadius * 0.65, wheelRadius * 0.65, wheelWidth + 0.01, 16]}
        position={[
          -dimensions.wheelbase / 2,
          wheelRadius + dimensions.groundClearance,
          -dimensions.width * 0.35,
        ]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.chrome} />
      </Cylinder>

      {/* Headlights */}
      <Sphere
        args={[0.12, 16, 16]}
        position={[
          dimensions.length * 0.48,
          dimensions.height * 0.35 + dimensions.groundClearance,
          dimensions.width * 0.25,
        ]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#ffffff"
          emissive={lightsOn ? "#ffffff" : "#666666"}
          emissiveIntensity={lightsOn ? 0.8 : 0.1}
          metalness={0.1}
          roughness={0.1}
        />
      </Sphere>

      <Sphere
        args={[0.12, 16, 16]}
        position={[
          dimensions.length * 0.48,
          dimensions.height * 0.35 + dimensions.groundClearance,
          -dimensions.width * 0.25,
        ]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#ffffff"
          emissive={lightsOn ? "#ffffff" : "#666666"}
          emissiveIntensity={lightsOn ? 0.8 : 0.1}
          metalness={0.1}
          roughness={0.1}
        />
      </Sphere>

      {/* Taillights */}
      <Sphere
        args={[0.1, 16, 16]}
        position={[
          -dimensions.length * 0.48,
          dimensions.height * 0.25 + dimensions.groundClearance,
          dimensions.width * 0.25,
        ]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#dc2626"
          emissive="#dc2626"
          emissiveIntensity={lightsOn ? 0.6 : 0.05}
          metalness={0.1}
          roughness={0.1}
        />
      </Sphere>

      <Sphere
        args={[0.1, 16, 16]}
        position={[
          -dimensions.length * 0.48,
          dimensions.height * 0.25 + dimensions.groundClearance,
          -dimensions.width * 0.25,
        ]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#dc2626"
          emissive="#dc2626"
          emissiveIntensity={lightsOn ? 0.6 : 0.05}
          metalness={0.1}
          roughness={0.1}
        />
      </Sphere>

      {/* Door Handles */}
      <Box
        args={[0.08, 0.04, 0.02]}
        position={[
          0,
          dimensions.height * 0.6 + dimensions.groundClearance,
          dimensions.width * 0.46,
        ]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.chrome} />
      </Box>

      <Box
        args={[0.08, 0.04, 0.02]}
        position={[
          0,
          dimensions.height * 0.6 + dimensions.groundClearance,
          -dimensions.width * 0.46,
        ]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.chrome} />
      </Box>

      {/* Exhaust Pipe */}
      <Cylinder
        args={[0.06, 0.06, 0.4, 8]}
        position={[
          -dimensions.length * 0.48,
          dimensions.height * 0.15 + dimensions.groundClearance,
          -dimensions.width * 0.12,
        ]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.black} />
      </Cylinder>

      {/* Side Mirrors */}
      <Box
        args={[0.15, 0.08, 0.05]}
        position={[
          0,
          dimensions.height +
            dimensions.height * 0.1 +
            dimensions.groundClearance,
          dimensions.width * 0.4,
        ]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.body} />
      </Box>

      <Box
        args={[0.15, 0.08, 0.05]}
        position={[
          0,
          dimensions.height +
            dimensions.height * 0.1 +
            dimensions.groundClearance,
          -dimensions.width * 0.4,
        ]}
        castShadow
        receiveShadow
      >
        <primitive object={materials.body} />
      </Box>

      {/* Shadow Plane */}
      <mesh
        position={[0, -0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry
          args={[dimensions.length * 2.5, dimensions.width * 2.5]}
        />
        <shadowMaterial opacity={0.3} />
      </mesh>

      {/* Interactive Controls */}
      {hover && (
        <Html position={[0, dimensions.height + 1.5, 0]} center>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.8)",
              color: "white",
              padding: "10px 15px",
              borderRadius: "8px",
              fontSize: "14px",
              whiteSpace: "nowrap",
              pointerEvents: "auto",
            }}
          >
            <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
              Swift Car Controls
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={toggleLights}
                style={{
                  background: lightsOn ? "#22c55e" : "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {lightsOn ? "Lights ON" : "Lights OFF"}
              </button>
              <button
                onClick={toggleDoor}
                style={{
                  background: doorOpen ? "#22c55e" : "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {doorOpen ? "Close Door" : "Open Door"}
              </button>
              <button
                onClick={toggleHood}
                style={{
                  background: hoodOpen ? "#22c55e" : "#f59e0b",
                  color: "white",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {hoodOpen ? "Close Hood" : "Open Hood"}
              </button>
              <button
                onClick={toggleTrunk}
                style={{
                  background: trunkOpen ? "#22c55e" : "#8b5cf6",
                  color: "white",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {trunkOpen ? "Close Trunk" : "Open Trunk"}
              </button>
            </div>
          </div>
        </Html>
      )}

      {/* Car Info Display */}
      {clicked && (
        <Html position={[0, dimensions.height + 2.5, 0]} center>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.9)",
              color: "white",
              padding: "15px",
              borderRadius: "10px",
              fontSize: "14px",
              maxWidth: "300px",
              pointerEvents: "auto",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#fbbf24" }}>
              Maruti Suzuki Swift
            </h3>
            <div style={{ lineHeight: "1.6" }}>
              <div>
                <strong>Length:</strong> {dimensions.length}m
              </div>
              <div>
                <strong>Width:</strong> {dimensions.width}m
              </div>
              <div>
                <strong>Height:</strong> {dimensions.height}m
              </div>
              <div>
                <strong>Wheelbase:</strong> {dimensions.wheelbase}m
              </div>
              <div>
                <strong>Ground Clearance:</strong>{" "}
                {dimensions.groundClearance * 100}cm
              </div>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "12px",
                  color: "#9ca3af",
                }}
              >
                Click car parts to interact • Hover for controls
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
