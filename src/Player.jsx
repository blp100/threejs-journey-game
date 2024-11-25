import { useRapier, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Player() {
  const body = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();

  const smoothedCameraPosition = useRef(new THREE.Vector3(10, 10, 10));
  const smoothedCameraTarget = useRef(new THREE.Vector3());

  /**
   * Handles the jump action for the player.
   * Uses a raycast to detect if the player is close to the ground before allowing a jump.
   */
  const jump = (value) => {
    const origin = body.current.translation();
    origin.y -= 0.31; // Offset to place the raycast slightly below the player.
    const direction = { x: 0, y: -1, z: 0 }; // Raycast direction (downwards).
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    if (hit.timeOfImpact < 0.15)
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
  };

  /**
   * Subscribe to the jump key and trigger the jump method when the key is pressed.
   */
  useEffect(() => {
    const unsubscribeJump = subscribeKeys((state) => state.jump, jump);
    return () => unsubscribeJump();
  }, []);

  useFrame((state, delta) => {
    /**
     * Controls
     */
    const { forward, backward, leftward, rightward } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 1 * delta;
    const torqueStrength = 1 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }

    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }

    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    if (body.current) {
      body.current.applyImpulse(impulse);
      body.current.applyTorqueImpulse(torque);
    }
    /**
     * Camera
     */
    if(body.current){
      const bodyPosition = body.current.translation();
      const cameraPostion = new THREE.Vector3();
      cameraPostion.copy(bodyPosition);
      cameraPostion.z += 2.25;
      cameraPostion.y += 0.65;

      const cameraTarget = new THREE.Vector3();
      cameraTarget.copy(bodyPosition);
      cameraTarget.y += 0.25;

      // Smooth the camera's position using lerp (linear interpolation) for a smooth transition over time
      smoothedCameraPosition.current.lerp(cameraPostion, 5 * delta);
      smoothedCameraTarget.current.lerp(cameraTarget, 5 * delta);

      state.camera.position.copy(smoothedCameraPosition.current);
      state.camera.lookAt(smoothedCameraTarget.current);
    }
  });

  return (
    <RigidBody
      ref={body}
      canSleep={false}
      colliders="ball"
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
      position={[0, 1, 0]}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
}
