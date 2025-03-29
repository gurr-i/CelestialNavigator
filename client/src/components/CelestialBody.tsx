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
  orbitCenter = [0, 0, 0],
  eccentricity = 0,
  orbitTilt = 0,
  axialTilt = 0
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
    const isMissingTexture = !texture || texture.image?.width < 20;
    
    if (type === "star") {
      return new THREE.MeshStandardMaterial({
        map: isMissingTexture ? null : texture,
        emissive: new THREE.Color("#FFA726"),
        emissiveIntensity: 1,
        color: isMissingTexture ? getFallbackMaterial() : 0xffffff
      });
    } else {
      return new THREE.MeshStandardMaterial({
        map: isMissingTexture ? null : texture,
        roughness: 0.7,
        metalness: 0.2,
        color: isMissingTexture ? getFallbackMaterial() : 0xffffff
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
  
  // Function to calculate position on an elliptical orbit - used for both orbit path and animation
  const calculateEllipticalPosition = (angle: number, params: {
    center: [number, number, number],
    radius: number,
    eccentricity: number,
    tilt: number
  }) => {
    const { center, radius, eccentricity, tilt } = params;
    
    // Calculate position using polar form of ellipse equation: r = a(1-e²)/(1+e·cos θ)
    const semiMajor = radius;
    const r = (semiMajor * (1 - eccentricity*eccentricity)) / (1 + eccentricity * Math.cos(angle));
    
    // Calculate base position in the orbital plane
    let x = center[0] + r * Math.cos(angle);
    let y = 0;
    let z = center[2] + r * Math.sin(angle);
    
    // Apply orbital tilt (rotation around x-axis)
    const y1 = y * Math.cos(tilt) - z * Math.sin(tilt);
    const z1 = y * Math.sin(tilt) + z * Math.cos(tilt);
    
    return { x, y: y1, z: z1 };
  };

  // Create orbit path geometry
  const orbitPath = useMemo(() => {
    if (orbitSpeed > 0 && orbitRadius > 0) {
      // Get orbital parameters
      const e = eccentricity;
      const tilt = orbitTilt;
      
      // Create orbit parameters object
      const orbitParams = {
        center: orbitCenter,
        radius: orbitRadius,
        eccentricity: e,
        tilt: tilt
      };
      
      // Create points for a 3D elliptical path
      const points = [];
      const segments = 200; // More segments for smoother ellipses
      
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const pos = calculateEllipticalPosition(angle, orbitParams);
        points.push(new THREE.Vector3(pos.x, pos.y, pos.z));
      }
      
      // Create a smooth curve from the points
      const curve = new THREE.CatmullRomCurve3(points);
      curve.closed = true;
      
      // Create geometry from the curve
      const pathGeometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(200)
      );
      
      // Color based on body type with more vivid colors
      let pathColor = '#555555';
      let pathOpacity = 0.3;
      let pathWidth = 1.2;
      
      if (type === 'moon' || type === 'spacecraft') {
        pathColor = '#4FC3F7';
        pathOpacity = 0.6;
        pathWidth = 1.8;
      } else if (type === 'planet') {
        pathOpacity = 0.7;
        pathWidth = 1.5;
        
        // Assign different colors to different planets
        if (id === "mercury") pathColor = '#A6A6A6';  // Gray
        else if (id === "venus") pathColor = '#E8A735';  // Yellowish
        else if (id === "earth") pathColor = '#3498DB';  // Blue
        else if (id === "mars") pathColor = '#C0392B';  // Red
        else if (id === "jupiter") pathColor = '#E67E22';  // Orange
        else if (id === "saturn") pathColor = '#F1C40F';  // Yellow
        else if (id === "uranus") pathColor = '#1ABC9C';  // Teal
        else if (id === "neptune") pathColor = '#3498DB';  // Blue
        else if (id === "pluto") pathColor = '#BDC3C7';  // Light gray
      }
      
      return (
        <line>
          <bufferGeometry attach="geometry" {...pathGeometry} />
          <lineBasicMaterial 
            attach="material" 
            color={pathColor}
            opacity={pathOpacity} 
            transparent={true} 
            linewidth={pathWidth}
          />
        </line>
      );
    }
    return null;
  }, [orbitCenter, orbitRadius, orbitSpeed, eccentricity, orbitTilt, type, id]);
  
  // Handle initial position alignment with orbit
  const initialPositionRef = useRef<boolean>(false);
  
  // Handle orbiting and rotation
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Handle axial tilt and rotation
    if (axialTilt) {
      // Set the axial tilt (this should only happen once)
      if (!meshRef.current.userData.axialTiltApplied) {
        // Apply the axial tilt
        const tiltAxis = new THREE.Vector3(0, 0, 1); // Default tilt axis
        const tiltAngle = axialTilt || 0;
        
        // Use the Quaternion system for rotation
        const tiltQuaternion = new THREE.Quaternion().setFromAxisAngle(tiltAxis, tiltAngle);
        meshRef.current.quaternion.premultiply(tiltQuaternion);
        
        // Mark as applied
        meshRef.current.userData.axialTiltApplied = true;
      }
    }
    
    // Rotate the body around its axis using delta time for smooth animation
    if (rotationSpeed) {
      // Create a rotation axis that respects the axial tilt
      const rotationAxis = new THREE.Vector3(0, 1, 0);
      
      // Apply rotation
      meshRef.current.rotateOnAxis(rotationAxis, rotationSpeed * delta * 10);
    }
    
    // Orbit around center if applicable
    if (orbitSpeed > 0 && orbitRadius > 0) {
      const orbitParams = {
        center: orbitCenter,
        radius: orbitRadius,
        eccentricity: eccentricity,
        tilt: orbitTilt
      };
      
      // On first render, position the planet on its orbit path
      // We need to do this because the initial positions in planet-data.ts
      // might not align perfectly with the calculated elliptical orbits
      if (!initialPositionRef.current) {
        // Place at a different starting angle based on the planet's position in the solar system
        // This creates a more visually interesting starting arrangement
        let initialAngle = 0;
        
        // Different starting angles for different planets to avoid crowding
        if (id === "mercury") initialAngle = 0;
        else if (id === "venus") initialAngle = 2.0;
        else if (id === "earth") initialAngle = 4.0;
        else if (id === "mars") initialAngle = 5.5;
        else if (id === "jupiter") initialAngle = 1.0;
        else if (id === "saturn") initialAngle = 3.0;
        else if (id === "uranus") initialAngle = 0.5;
        else if (id === "neptune") initialAngle = 2.5;
        else if (id === "pluto") initialAngle = 4.5;
        else if (id === "moon") initialAngle = 1.5;
        else if (id === "iss") initialAngle = 0;
        else if (id === "jwst") initialAngle = 3.0;
        
        // Calculate initial position using the angle
        const initialPos = calculateEllipticalPosition(initialAngle, orbitParams);
        meshRef.current.position.x = initialPos.x;
        meshRef.current.position.y = initialPos.y;
        meshRef.current.position.z = initialPos.z;
        initialPositionRef.current = true;
      }
      
      // Use elapsed time from the clock for consistent animation
      const time = state.clock.getElapsedTime() * orbitSpeed * 5; // Increased speed multiplier
      
      // Calculate elliptical orbit position using the same function as the path generation
      const position = calculateEllipticalPosition(time, orbitParams);
      
      // Update position for orbiting
      meshRef.current.position.x = position.x;
      meshRef.current.position.y = position.y;
      meshRef.current.position.z = position.z;
      
      // For Saturn, make sure the rings always face slightly upward regardless of orbit
      if (id === "saturn" && meshRef.current.children.length > 0) {
        // Ensure rings maintain proper orientation
        meshRef.current.children[0].rotation.x = Math.PI / 2;
        meshRef.current.children[0].rotation.y = 0.3;
      }
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
      
      {/* Use position prop only for bodies that don't orbit (e.g., Sun) */}
      <group position={orbitSpeed > 0 ? [0, 0, 0] : position} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
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
