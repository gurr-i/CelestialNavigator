import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarsProps {
  count?: number;
  radius?: number;
}

const Stars: React.FC<StarsProps> = ({ count = 5000, radius = 1000 }) => {
  const starsRef = useRef<THREE.Points>(null);
  
  // Create stars geometry
  const starsGeometry = new THREE.BufferGeometry();
  
  // Generate random positions
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    // Random position in a sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.cbrt(Math.random());
    
    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);
    
    // Random color (white to blue)
    colors[i3] = 0.8 + Math.random() * 0.2;
    colors[i3 + 1] = 0.8 + Math.random() * 0.2;
    colors[i3 + 2] = Math.random() + 0.5;
  }
  
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Create stars material
  const starsMaterial = new THREE.PointsMaterial({
    size: 2,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  
  // Slowly rotate stars
  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.01;
    }
  });
  
  return (
    <points ref={starsRef} geometry={starsGeometry} material={starsMaterial} />
  );
};

export default Stars;
