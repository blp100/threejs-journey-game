import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Material = new THREE.MeshStandardMaterial({
  color: "limegreen",
});
const floor2Material = new THREE.MeshStandardMaterial({
  color: "greenyellow",
});
const obstacleMaterial = new THREE.MeshStandardMaterial({
  color: "orangered",
});
const wallMaterial = new THREE.MeshStandardMaterial({
  color: "slategrey",
});

/**
 * BlockStart Component
 *
 * This component renders a simple 3D block group in a Three.js scene.
 * It consists of a floor mesh with custom geometry and material.
 *
 * @param {Object} props - Component props.
 * @param {Array<number>} props.position - The position of the block group in 3D space.
 * Defaults to `[0, 0, 0]`.
 * @returns {JSX.Element} - A Three.js group containing the block's geometry and material.
 */
function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Floor */}
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  );
}

/**
 * BlockSpinner Component
 *
 * This component renders a more complex 3D block group in a Three.js scene.
 * It consists of:
 * - A floor mesh with custom geometry and material.
 * - A spinning obstacle represented as a kinematic rigid body, positioned above the floor.
 *
 * @param {Object} props - Component props.
 * @param {Array<number>} props.position - The position of the block group in 3D space.
 * Defaults to `[0, 0, 0]`.
 * @returns {JSX.Element} - A Three.js group containing the floor and spinning obstacle.
 */
function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const speed = useRef(Math.random() + 0.2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed.current, 0));
    if (obstacle.current) obstacle.current.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      {/* Floor */}
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

/**
 * BlockLimbo Component
 *
 * This component renders a 3D block with a dynamic, oscillating obstacle in a Three.js scene.
 * It includes:
 * - A static floor mesh.
 * - A kinematic rigid body obstacle that moves up and down.
 *
 * @param {Object} props - Component props.
 * @param {Array<number>} props.position - The position of the block group in 3D space.
 * Defaults to `[0, 0, 0]`.
 * @returns {JSX.Element} - A Three.js group containing the floor and oscillating obstacle.
 */
function BlockLimbo({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const timeOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const y = Math.sin(time + timeOffset.current) + 1.15;
    if (obstacle.current)
      obstacle.current.setNextKinematicTranslation({
        x: position[0],
        y: position[1] + y,
        z: position[2],
      });
  });

  return (
    <group position={position}>
      {/* Floor */}
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

function BlockAxe({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const timeOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 1.25;

    const x = Math.sin(time + timeOffset.current);
    if (obstacle.current)
      obstacle.current.setNextKinematicTranslation({
        x: position[0] + x,
        y: position[1] + 0.75,
        z: position[2],
      });
  });

  return (
    <group position={position}>
      {/* Floor */}
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

export default function Level() {
  return (
    <>
      <BlockStart position={[0, 0, 12]} />
      <BlockSpinner position={[0, 0, 8]} />
      <BlockLimbo position={[0, 0, 4]} />
      <BlockAxe position={[0, 0, 0]} />
    </>
  );
}
