import { useRef, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
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
  
  // Default textures based on planet type
  const getDefaultTexture = () => {
    if (type === "star") return "/textures/sun.jpg";
    if (id === "mercury") return "/textures/planets/mercury.jpg";
    if (id === "venus") return "/textures/planets/venus.jpg";
    if (id === "earth") return "/textures/planets/earth.jpg";
    if (id === "moon") return "/textures/planets/moon.jpg";
    if (id === "mars") return "/textures/planets/mars.jpg";
    if (id === "jupiter") return "/textures/planets/jupiter.jpg";
    if (id === "saturn") return "/textures/planets/saturn.jpg";
    if (id === "uranus") return "/textures/planets/uranus.jpg";
    if (id === "neptune") return "/textures/planets/neptune.jpg";
    if (id === "pluto") return "/textures/planets/pluto.jpg";
    // For spacecraft or unknown types
    return null;
  };
  
  // Use fallback color materials if texture can't be loaded
  const getFallbackMaterial = () => {
    if (type === "star") return new THREE.Color("#FFA726"); // Solar orange
    if (id === "mercury") return new THREE.Color("#A37B7B"); // Mercury gray-brown
    if (id === "venus") return new THREE.Color("#E6C073"); // Venus yellow-white
    if (id === "earth") return new THREE.Color("#4B6CB7"); // Earth blue
    if (id === "moon") return new THREE.Color("#BFBFBF"); // Moon gray
    if (id === "mars") return new THREE.Color("#C75D48"); // Mars reddish
    if (id === "jupiter") return new THREE.Color("#E0B080"); // Jupiter beige
    if (id === "saturn") return new THREE.Color("#E8D8A0"); // Saturn beige-yellow
    if (id === "uranus") return new THREE.Color("#99CCCC"); // Uranus blue-green
    if (id === "neptune") return new THREE.Color("#334CA5"); // Neptune blue
    if (id === "pluto") return new THREE.Color("#D9C6B0"); // Pluto beige
    // Default for spacecraft or unknown
    return new THREE.Color("#CCCCCC");
  };
  
  // Determine texture URL
  const effectiveTextureUrl = textureUrl || getDefaultTexture();
  
  // Load texture - safely handle loading or fallback
  const texture = useMemo(() => {
    if (!effectiveTextureUrl) return null;
    try {
      // Create a simple texture for now, which will be replaced when loaded
      const fallbackTexture = new THREE.Texture();
      fallbackTexture.needsUpdate = true;
      
      // Load the actual texture asynchronously
      const loader = new THREE.TextureLoader();
      const loadedTexture = loader.load(effectiveTextureUrl);
      
      return loadedTexture;
    } catch (error) {
      console.warn(`Failed to load texture for ${name}:`, error);
      return null;
    }
  }, [effectiveTextureUrl, name]);
  
  // Create materials with proper fallbacks
  const material = useMemo(() => {
    if (type === "star") {
      return new THREE.MeshStandardMaterial({
        map: texture,
        emissive: new THREE.Color("#FFA726"),
        emissiveIntensity: 1,
        color: texture ? 0xffffff : getFallbackMaterial()
      });
    } else {
      return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.7,
        metalness: 0.2,
        color: texture ? 0xffffff : getFallbackMaterial()
      });
    }
  }, [texture, type]);
  
  // Create atmosphere for planets with atmosphere
  const atmosphere = useMemo(() => {
    // Only Earth, Venus, Saturn, Jupiter, Uranus, Neptune have visible atmospheres
    const hasAtmosphere = ["earth", "venus", "jupiter", "saturn", "uranus", "neptune"].includes(id);
    
    if (type === "planet" && hasAtmosphere) {
      // Different atmosphere color based on planet
      let atmosphereColor = "#4FC3F7"; // Default blue
      let atmosphereOpacity = 0.15;
      
      if (id === "venus") {
        atmosphereColor = "#E6C073"; // Yellowish
        atmosphereOpacity = 0.2;
      } else if (id === "jupiter" || id === "saturn") {
        atmosphereColor = "#E0B080"; // Gas giant atmosphere
        atmosphereOpacity = 0.1;
      } else if (id === "uranus") {
        atmosphereColor = "#99CCCC"; // Blue-green
        atmosphereOpacity = 0.15;
      } else if (id === "neptune") {
        atmosphereColor = "#334CA5"; // Deep blue
        atmosphereOpacity = 0.15;
      }
      
      return new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.05, 32, 32),
        new THREE.MeshStandardMaterial({
          color: atmosphereColor,
          transparent: true,
          opacity: atmosphereOpacity,
          side: THREE.BackSide
        })
      );
    }
    return null;
  }, [type, radius, id]);
  
  // Create orbit path geometry
  const orbitPath = useMemo(() => {
    if (orbitSpeed > 0 && orbitRadius > 0) {
      const curve = new THREE.EllipseCurve(
        orbitCenter[0], orbitCenter[2],  // center x, z
        orbitRadius, orbitRadius,        // xRadius, zRadius
        0, 2 * Math.PI,                  // startAngle, endAngle
        false,                           // clockwise
        0                                // rotation
      );
      
      const points = curve.getPoints(100);
      const pathGeometry = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, orbitCenter[1], p.y))
      );
      
      return (
        <line>
          <bufferGeometry attach="geometry" {...pathGeometry} />
          <lineBasicMaterial 
            attach="material" 
            color={type === 'moon' || type === 'spacecraft' ? '#4FC3F7' : '#555555'} 
            opacity={0.3} 
            transparent={true} 
            linewidth={1}
          />
        </line>
      );
    }
    return null;
  }, [orbitCenter, orbitRadius, orbitSpeed, type]);

  // Handle orbiting and rotation
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Rotate the body around its axis
    meshRef.current.rotation.y += rotationSpeed * delta * 10;
    
    // Orbit around center if applicable
    if (orbitSpeed > 0 && orbitRadius > 0) {
      // Use elapsed time from the clock for consistent animation
      const time = state.clock.getElapsedTime() * orbitSpeed * 5; // Increased speed multiplier
      const x = orbitCenter[0] + Math.cos(time) * orbitRadius;
      const z = orbitCenter[2] + Math.sin(time) * orbitRadius;
      
      // Update position for orbiting
      meshRef.current.position.x = x;
      meshRef.current.position.z = z;
    }
  });
  
  // Handle click to focus on this body
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setFocusedBody(id);
  };
  
  // Determine if this body is focused for highlighting
  const isFocused = focusedBody === id;
  
  // Special case for Saturn - add rings
  const saturnRings = useMemo(() => {
    if (id === "saturn") {
      const ringGeometry = new THREE.RingGeometry(radius * 1.4, radius * 2.2, 64);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: "#E8D8A0",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      
      // Rotate the rings to proper orientation
      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.rotation.y = 0.3;
      
      return ringMesh;
    }
    return null;
  }, [id, radius]);
  
  return (
    <>
      {/* Render orbit path if applicable */}
      {orbitPath && orbitPath}
      
      <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
        <Sphere args={[radius, 64, 32]} ref={meshRef} onClick={handleClick}>
          <primitive object={material} attach="material" />
        </Sphere>
        
        {/* Atmosphere for planets */}
        {atmosphere && <primitive object={atmosphere} />}
        
        {/* Saturn's rings */}
        {saturnRings && <primitive object={saturnRings} />}
        
        {/* Simple highlight effect when focused */}
        {isFocused && (
          <Sphere args={[radius * 1.1, 32, 32]}>
            <meshBasicMaterial 
              color="#4FC3F7" 
              transparent={true}
              opacity={0.2}
              wireframe={true}
            />
          </Sphere>
        )}
      </group>
    </>
  );
};

export default CelestialBody;
