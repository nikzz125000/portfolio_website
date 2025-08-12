import React from "react";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Noise,
  Vignette,
} from "@react-three/postprocessing";

interface EffectsProps {
  enableEffects?: boolean;
}

export default function Effects({ enableEffects = true }: EffectsProps) {
  if (!enableEffects) return null;

  return (
    <EffectComposer>
      <Bloom intensity={0.5} />
      <DepthOfField
        focusDistance={0}
        focalLength={0.02}
        bokehScale={2}
        height={480}
      />
      <Noise opacity={0.02} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
