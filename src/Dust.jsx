import { shaderMaterial, Points } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";
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
    float alpha = 1.0 * uAlpha;

    gl_FragColor = vec4(color, alpha);
  }
`;

const ParticlesMaterial = shaderMaterial(
  { uTime: 0, uAlpha: 0 },
  vertextShader,
  fragmentShader
);
extend({ ParticlesMaterial });

export default function Dust() {
  const pointsCount = 100;
  const positions = new Float32Array(pointsCount * 3);

  for (let i = 0; i < pointsCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 0.5;
    positions[i3 + 1] = Math.random() * 0.2;
    positions[i3 + 2] = (Math.random() - 0.5) * 0.5;
  }

  const particlesMaterial = useRef();

  useFrame((state, delta) => {
    const alpha = particlesMaterial.current.uniforms.uAlpha.value;
    if (alpha <= 1 && alpha >= 0) {
      particlesMaterial.current.uniforms.uAlpha.value -= 2 * delta;
    }
    console.log(particlesMaterial.current.uniforms.uAlpha.value);
  });

  return (
    <Points positions={positions}>
      <shaderMaterial
        ref={particlesMaterial}
        vertexShader={vertextShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uAlpha: new THREE.Uniform(1) }}
      />
    </Points>
  );
}
