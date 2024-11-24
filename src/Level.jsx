import * as THREE from "three";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

/**
 * BlockStart Component
 *
 * This component renders a 3D block group in a Three.js scene. It includes:
 * - A floor mesh with a box geometry that acts as the base.
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
        receiveShadow
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      >
        <meshStandardMaterial color="limegreen" />
      </mesh>
    </group>
  );
}

export default function Level() {
  return (
    <>
      <BlockStart position={[0, 0, 0]} />
    </>
  );
}
