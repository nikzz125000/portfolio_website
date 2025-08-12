import React from "react";

export default function Lighting() {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.4} color="#ffffff" />

      {/* Main directional light (sun) */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill light */}
      <pointLight position={[-10, 0, -20]} intensity={0.5} color="#4f46e5" />
      <pointLight position={[0, -10, 0]} intensity={0.3} color="#f59e0b" />
    </>
  );
}
