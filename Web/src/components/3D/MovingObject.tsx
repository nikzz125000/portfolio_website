import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Box, Sphere, Cone, Text } from "@react-three/drei";
import * as THREE from "three";

interface MovingObjectProps {
  type?: "cube" | "sphere" | "cone" | "text";
  animationSpeed?: number;
  position?: [number, number, number];
  color?: string;
}

export default function MovingObject({
  type = "cube",
  animationSpeed = 1,
  position = [0, 0, 0],
  color = "#4f46e5",
}: MovingObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Animation loop - runs every frame
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Y-axis movement (bouncing motion)
    meshRef.current.position.y = Math.sin(time * animationSpeed) * 2;

    // Optional: Add rotation
    meshRef.current.rotation.x += delta * animationSpeed * 0.5;
    meshRef.current.rotation.y += delta * animationSpeed * 0.3;

    // Interactive scaling on hover
    const targetScale = hover ? 1.2 : clicked ? 0.8 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  // Object type renderer
  const renderObject = () => {
    const commonProps = {
      ref: meshRef,
      position,
      onClick: (e) => {
        e.stopPropagation(); // Prevent event bubbling
        setClicked(!clicked);
      },
      onPointerOver: (e) => {
        e.stopPropagation(); // Prevent event bubbling
        setHover(true);
      },
      onPointerOut: (e) => setHover(false),
      castShadow: true,
      receiveShadow: true,
    };

    const materialProps = {
      color: hover ? "#ff6b6b" : color,
      metalness: 0.2,
      roughness: 0.1,
      transparent: true,
      opacity: clicked ? 0.7 : 1,
    };

    switch (type) {
      case "sphere":
        return (
          <Sphere {...commonProps} args={[1, 32, 32]}>
            <meshStandardMaterial {...materialProps} />
          </Sphere>
        );

      case "cone":
        return (
          <Cone {...commonProps} args={[1, 2, 8]}>
            <meshStandardMaterial {...materialProps} />
          </Cone>
        );

      case "text":
        return (
          <Text
            {...commonProps}
            fontSize={1}
            maxWidth={200}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
          >
            Hello 3D!
            <meshStandardMaterial {...materialProps} />
          </Text>
        );

      default: // cube
        return (
          <Box {...commonProps} args={[1.5, 1.5, 1.5]}>
            <meshStandardMaterial {...materialProps} />
          </Box>
        );
    }
  };

  return (
    <>
      {renderObject()}
      {/* Optional: Add a shadow plane */}
      <mesh
        position={[position[0], -3, position[2]]}
        rotation-x={-Math.PI / 2}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
    </>
  );
}
