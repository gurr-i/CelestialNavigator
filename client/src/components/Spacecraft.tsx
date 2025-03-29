import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceStore } from "../lib/stores/useSpaceStore";

interface SpacecraftProps {
  position: [number, number, number];
}

const Spacecraft: React.FC<SpacecraftProps> = ({ position }) => {
  const spacecraftRef = useRef<THREE.Group>(null);
  const toggleFollow = useKeyboardControls(state => state.toggle);
  const followSpacecraft = useSpaceStore(state => state.followSpacecraft);
  const setFollowSpacecraft = useSpaceStore(state => state.setFollowSpacecraft);

  // Toggle spacecraft following
  useKeyboardControls(
    state => state.toggle,
    value => {
      if (value) {
        setFollowSpacecraft(!followSpacecraft);
      }
    }
  );

  // Basic movement pattern
  useFrame(({ clock }) => {
    if (!spacecraftRef.current) return;

    const time = clock.getElapsedTime();
    
    // Create a wavy movement pattern
    spacecraftRef.current.position.x = position[0] + Math.sin(time * 0.3) * 20;
    spacecraftRef.current.position.y = position[1] + Math.sin(time * 0.2) * 5;
    spacecraftRef.current.position.z = position[2] + Math.cos(time * 0.3) * 20;
    
    // Rotate to face movement direction
    const lookAtPos = new THREE.Vector3(
      spacecraftRef.current.position.x + Math.sin(time * 0.3 + 0.1) * 20,
      spacecraftRef.current.position.y + Math.sin(time * 0.2 + 0.1) * 5,
      spacecraftRef.current.position.z + Math.cos(time * 0.3 + 0.1) * 20
    );
    
    spacecraftRef.current.lookAt(lookAtPos);
  });

  return (
    <group ref={spacecraftRef} position={position}>
      {/* Main body */}
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[1, 5, 16, 16]} />
        <meshStandardMaterial color="#424242" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Cockpit */}
      <mesh position={[0, 2, 0]} castShadow>
        <sphereGeometry args={[1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#4FC3F7" opacity={0.9} transparent={true} metalness={0.2} />
      </mesh>
      
      {/* Wings */}
      <mesh position={[0, -1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 8, 8]} />
        <meshStandardMaterial color="#424242" metalness={0.7} />
      </mesh>
      
      {/* Engine glow */}
      <pointLight position={[0, -3, 0]} color="#4FC3F7" intensity={2} distance={10} />
      <mesh position={[0, -3, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#4FC3F7" />
      </mesh>
    </group>
  );
};

import { useKeyboardControls } from "@react-three/drei";

export default Spacecraft;
