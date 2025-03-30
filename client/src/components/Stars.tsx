import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarsProps {
  count?: number;
  radius?: number;
  depth?: number;
  size?: number;
  layered?: boolean;
}

const Stars: React.FC<StarsProps> = ({ 
  count = 10000, 
  radius = 1000, 
  depth = 300,
  size = 2,
  layered = true
}) => {
  // Create multiple star layers with different properties
  const layers = useMemo(() => {
    const layers = [];
    // Reduced number of layers for better performance
    const layerCount = layered ? 2 : 1;
    
    for (let l = 0; l < layerCount; l++) {
      const layerRef = useRef<THREE.Points>(null);
      const layerGeometry = new THREE.BufferGeometry();
      
      // Calculate per-layer properties
      const layerSize = size * (1 - l * 0.2);  // Decrease size for deeper layers
      const layerOpacity = 1 - l * 0.2;        // Decrease opacity for deeper layers
      const layerRadius = radius - l * depth;  // Position layers at different depths
      const layerRotationSpeed = 0.005 - l * 0.002; // Different rotation speeds
      const layerCount = Math.floor(count / (l + 1));  // Fewer stars in deeper layers
      
      // Generate random positions
      const positions = new Float32Array(layerCount * 3);
      const colors = new Float32Array(layerCount * 3);
      const sizes = new Float32Array(layerCount);
      
      for (let i = 0; i < layerCount; i++) {
        const i3 = i * 3;
        
        // Random position in a sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = layerRadius * Math.cbrt(Math.random());
        
        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);
        
        // Simplified color distribution - reduced complexity
        const colorType = Math.random();
        if (colorType < 0.7) {
          // White to yellow-white (common stars)
          colors[i3] = 0.9 + Math.random() * 0.1;
          colors[i3 + 1] = 0.9 + Math.random() * 0.1;
          colors[i3 + 2] = 0.9;
        } else {
          // Blue-white (hot stars)
          colors[i3] = 0.7 + Math.random() * 0.2;
          colors[i3 + 1] = 0.7 + Math.random() * 0.2;
          colors[i3 + 2] = 0.9 + Math.random() * 0.1;
        }
        
        // Simplified size variation
        sizes[i] = layerSize;
      }
      
      layerGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      layerGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      layerGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      // Create simpler shader material for better performance
      const starsMaterial = new THREE.ShaderMaterial({
        uniforms: {
          opacity: { value: layerOpacity }
        },
        vertexShader: `
          attribute float size;
          varying vec3 vColor;
          
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform float opacity;
          varying vec3 vColor;
          
          void main() {
            gl_FragColor = vec4(vColor, opacity);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      layers.push({
        ref: layerRef,
        geometry: layerGeometry,
        material: starsMaterial,
        rotationSpeed: layerRotationSpeed
      });
    }
    
    return layers;
  }, [count, radius, depth, size, layered]);
  
  // Animate star layers - optimized to only update every other frame
  const frameCounter = useRef(0);
  
  useFrame((_, delta) => {
    frameCounter.current++;
    
    // Only update rotation every other frame
    if (frameCounter.current % 2 !== 0) return;
    
    layers.forEach(layer => {
      if (layer.ref.current) {
        // Update rotation
        layer.ref.current.rotation.y += delta * layer.rotationSpeed;
      }
    });
  });
  
  return (
    <group>
      {layers.map((layer, index) => (
        <points 
          key={`star-layer-${index}`} 
          ref={layer.ref} 
          geometry={layer.geometry} 
          material={layer.material}
        />
      ))}
    </group>
  );
};

export default Stars;
