import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useSpaceStore } from "../lib/stores/useSpaceStore";
import { CelestialBodyProps } from "../lib/types";

const CelestialBody: React.FC<CelestialBodyProps> = ({
  id,
  position,
  rotation = [0, 0, 0],
  radius = 1,
  textureUrl,
  type,
  name,
  rotationSpeed = 0.001,
  orbitSpeed = 0,
  orbitRadius = 0,
  orbitCenter = [0, 0, 0]
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const focusedBody = useSpaceStore(state => state.focusedBody);
  const setFocusedBody = useSpaceStore(state => state.setFocusedBody);
  
  // Load texture only if it exists in our public folder
  const texture = textureUrl && textureUrl.startsWith("/textures/") 
    ? useTexture(textureUrl) 
    : null;
  
  // Create emissive material for stars
  const material = useMemo(() => {
    if (type === "star") {
      return new THREE.MeshStandardMaterial({
        map: texture || undefined,
        emissive: new THREE.Color("#FFA726"),
        emissiveIntensity: 1,
      });
    } else {
      return new THREE.MeshStandardMaterial({
        map: texture || undefined,
        roughness: 0.7,
        metalness: 0.2
      });
    }
  }, [texture, type]);
  
  // Create atmosphere for planets with atmosphere
  const atmosphere = useMemo(() => {
    if (type === "planet" && radius > 3) {
      return new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.05, 32, 32),
        new THREE.MeshStandardMaterial({
          color: "#4FC3F7",
          transparent: true,
          opacity: 0.1,
          side: THREE.BackSide
        })
      );
    }
    return null;
  }, [type, radius]);
  
  // Handle orbiting and rotation
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    // Rotate the body around its axis
    meshRef.current.rotation.y += rotationSpeed * delta * 10;
    
    // Orbit around center if applicable
    if (orbitSpeed > 0 && orbitRadius > 0) {
      const time = Date.now() * orbitSpeed * 0.001;
      const x = orbitCenter[0] + Math.cos(time) * orbitRadius;
      const z = orbitCenter[2] + Math.sin(time) * orbitRadius;
      meshRef.current.position.x = x;
      meshRef.current.position.z = z;
    }
  });
  
  // Handle click to focus on this body
  const handleClick = (e: THREE.Event) => {
    e.stopPropagation();
    setFocusedBody(id);
  };
  
  // Determine if this body is focused for highlighting
  const isFocused = focusedBody === id;
  
  return (
    <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
      <Sphere args={[radius, 32, 32]} ref={meshRef} onClick={handleClick}>
        <primitive object={material} attach="material" />
      </Sphere>
      
      {/* Atmosphere for planets */}
      {atmosphere && <primitive object={atmosphere} />}
      
      {/* Simple highlight effect when focused */}
      {isFocused && (
        <Sphere args={[radius * 1.1, 16, 16]}>
          <meshBasicMaterial 
            color="#4FC3F7" 
            transparent={true}
            opacity={0.2}
            wireframe={true}
          />
        </Sphere>
      )}
    </group>
  );
};

export default CelestialBody;
