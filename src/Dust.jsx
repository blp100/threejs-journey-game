import { shaderMaterial, Points } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const vertextShader = /* glsl */ `
  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = 100.0;
    gl_PointSize *= 1.0 / -viewPosition.z;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uAlpha;

  void main() {
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - 0.5);

    if(distanceToCenter > 0.5)
      discard;

    vec3 color = vec3(1.0);
    float alpha = clamp(uAlpha, 0.0, 1.0);

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function Dust({ position = { x: 0, y: 0, z: 0 } }) {
  const pointsCount = 100;

  // Positions
  const positions = useMemo(() => {
    const positions = new Float32Array(pointsCount * 3);

    for (let i = 0; i < pointsCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 0.3 + position.x;
      positions[i3 + 1] = Math.random() * 0.15;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.3 + position.z;
    }

    return positions;
  }, [position]);

  // Uniform, to fix alpha didn't change issue
  const uniforms = useMemo(() => {
    return {
      uAlpha: new THREE.Uniform(1),
    };
  }, []);

  const particlesMaterial = useRef();

  useFrame((state, delta) => {
    if (particlesMaterial.current) {
      const alpha = particlesMaterial.current.uniforms.uAlpha.value;
      particlesMaterial.current.uniforms.uAlpha.value = Math.max(
        0,
        alpha - delta * 5
      );
    }
  });

  useEffect(() => {
    particlesMaterial.current.uniforms.uAlpha.value = 1;
  }, [positions]);

  return (
    <Points positions={positions} frustumCulled={false}>
      <shaderMaterial
        ref={particlesMaterial}
        vertexShader={vertextShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
      />
    </Points>
  );
}
