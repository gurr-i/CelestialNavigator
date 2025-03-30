import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useTexture, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useSpaceStore } from "../lib/stores/useSpaceStore";
import { CelestialBodyProps } from "../lib/types";
import { SOLAR_SYSTEM } from "../assets/planet-data";
import { calculateKeplerianPosition } from '../lib/orbital-mechanics';

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
  const setHoveredBody = useSpaceStore(state => state.setHoveredBody);
  const isPaused = useSpaceStore(state => state.isPaused);
  const timeScale = useSpaceStore(state => state.timeScale);
  const simulationTime = useSpaceStore(state => state.simulationTime);

  // Set ID in user data for identification
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.id = id;
    }
  }, [id]);

  // Create texture and basic material
  const texture = useMemo(() => {
    const url = textureUrl || `${import.meta.env.BASE_URL}textures/planets/${id}.jpg`;
    try {
      const loader = new THREE.TextureLoader();
      return loader.load(url);
    } catch (error) {
      console.warn(`Failed to load texture for ${name}`);
      return null;
    }
  }, [id, name, textureUrl]);

  // Create simple atmosphere
  const atmosphere = useMemo(() => {
    if (type === "star" || ["venus", "jupiter", "saturn"].includes(id)) {
      const color = type === "star" ? "#FFA726" : "#4FC3F7";
      const atmosphereRadius = radius * 1.05;
      
      return new THREE.Mesh(
        new THREE.SphereGeometry(atmosphereRadius, 32, 16),
        new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.2,
          side: THREE.BackSide
        })
      );
    }
    
    // Enhanced Earth atmosphere with clouds
    if (id === "earth") {
      // Create a more vibrant glow atmosphere
      const atmosphereGlow = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.15, 32, 16),
        new THREE.MeshBasicMaterial({
          color: "#88c1ff", // More vibrant blue
          transparent: true,
          opacity: 0.15,
          side: THREE.BackSide
        })
      );
      
      // Create cloud layer
      const cloudsMaterial = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}textures/planets/earth_clouds.jpg`),
        transparent: true,
        opacity: 0.8,
        roughness: 1.0,
        metalness: 0.0,
      });
      
      const cloudsRadius = radius * 1.02;
      const cloudsSphere = new THREE.Mesh(
        new THREE.SphereGeometry(cloudsRadius, 48, 24),
        cloudsMaterial
      );
      
      // Add clouds as a child of atmosphere
      atmosphereGlow.add(cloudsSphere);
      
      // Assign cloud rotation data
      cloudsSphere.userData.isEarthClouds = true;
      
      return atmosphereGlow;
    }
    
    return null;
  }, [radius, type, id]);

  // Create simple material
  const material = useMemo(() => {
    if (type === "star") {
      return new THREE.MeshBasicMaterial({
        map: texture,
        color: texture ? 0xffffff : 0xFFA726
      });
    } else if (id === "earth") {
      // Enhanced Earth material with normal map and specular highlights
      const normalMap = new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}textures/planets/earth_normal.jpg`);
      const specularMap = new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}textures/planets/earth_specular.jpg`);
      const nightMap = new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}textures/planets/earth_night.jpg`);
      
      // Custom shader material for Earth with day/night cycle
      const earthShader = {
        uniforms: {
          dayTexture: { value: texture },
          nightTexture: { value: nightMap },
          normalMap: { value: normalMap },
          specularMap: { value: specularMap },
          sunDirection: { value: new THREE.Vector3(1, 0, 0) }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D dayTexture;
          uniform sampler2D nightTexture;
          uniform sampler2D normalMap;
          uniform sampler2D specularMap;
          uniform vec3 sunDirection;
          
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            // Get normal from normal map and apply to surface normal
            vec3 normal = normalize(vNormal);
            vec3 normalMapValue = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
            normal = normalize(normal + normalMapValue * 0.8);
            
            // Calculate day/night mix factor based on angle to sun
            // Higher values when normal points toward sun (day side)
            float dayMix = dot(normal, normalize(sunDirection));
            
            // Create smooth transition between day and night
            // Adjust these values to control twilight zone width
            float twilightStart = -0.15;  // Start of twilight (night->day transition)
            float twilightEnd = 0.15;    // End of twilight (full day)
            dayMix = smoothstep(twilightStart, twilightEnd, dayMix);
            
            // Get colors from day and night textures
            vec3 dayColor = texture2D(dayTexture, vUv).rgb;
            vec3 nightColor = texture2D(nightTexture, vUv).rgb * 2.0;
            
            // Add specular highlight on day side
            float specular = texture2D(specularMap, vUv).r;
            float specHighlight = pow(max(0.0, dot(normalize(reflect(-sunDirection, normal)), normalize(-vPosition))), 20.0) * specular;
            
            // Add atmosphere rim effect
            float rim = 1.0 - max(0.0, dot(normalize(-vPosition), normal));
            rim = pow(rim, 2.0) * 0.15;
            vec3 rimColor = vec3(0.5, 0.7, 1.0);
            
            // Blend day and night textures based on sun angle
            vec3 color = mix(nightColor, dayColor, dayMix);
            
            // Add specular highlights only on day side
            color += specHighlight * dayMix * 0.5;
            
            // Add rim lighting (slightly more on day side)
            color += rim * rimColor * (dayMix * 0.5 + 0.5);
            
            gl_FragColor = vec4(color, 1.0);
          }
        `
      };
      
      const earthMaterial = new THREE.ShaderMaterial(earthShader);
      earthMaterial.needsUpdate = true;
      
      return earthMaterial;
    } else {
      return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.7,
        metalness: 0.1,
        color: texture ? 0xffffff : 0xCCCCCC
      });
    }
  }, [texture, type, id]);

  // Update sun direction in Earth shader
  useEffect(() => {
    if (id === "earth" && material instanceof THREE.ShaderMaterial && material.uniforms.sunDirection) {
      // Calculate direction from Earth to Sun (always at [0,0,0])
      // We invert the position since we want direction TO the sun, not FROM it
      const sunDirection = new THREE.Vector3(-position[0], -position[1], -position[2]).normalize();
      material.uniforms.sunDirection.value = sunDirection;
    }
  }, [id, position, material]);

  // Continuously update Earth shader's sun direction during orbit
  useFrame((state, delta) => {
    if (id === "earth" && material instanceof THREE.ShaderMaterial && material.uniforms.sunDirection && meshRef.current) {
      // Get current world position of Earth
      const earthPosition = new THREE.Vector3();
      meshRef.current.getWorldPosition(earthPosition);
      
      // Calculate direction vector pointing from Earth to Sun at [0,0,0]
      const sunDirection = new THREE.Vector3(0, 0, 0).sub(earthPosition).normalize();
      
      // Calculate sun direction in object space (shader needs local coordinates)
      const worldToLocal = new THREE.Matrix4();
      worldToLocal.copy(meshRef.current.matrixWorld).invert();
      
      const localSunDirection = sunDirection.clone().applyMatrix4(worldToLocal).normalize();
      
      // Update the shader uniform
      material.uniforms.sunDirection.value = localSunDirection;
    }
  });

  // Create asteroid belt or other particle-based objects
  const particleField = useMemo(() => {
    // If not a belt type, return null
    if (type !== "belt") return null;
    
    // Parameters for different belt objects
    let particleCount = 2000;
    let innerRadiusFactor = 0.8;
    let outerRadiusFactor = 1.2;
    let verticalSpread = 5;
    let particleColor = "#AA9977"; // Default asteroid color
    let particleSize = 0.5;
    let particleOpacity = 0.7;
    
    // Custom settings for different objects
    if (id === "saturn-rings") {
      particleCount = 10000;
      innerRadiusFactor = 1.2; // Start from Saturn's surface
      outerRadiusFactor = 2.2; // Extend outward in a disc
      verticalSpread = 0.5;   // Very flat disc
      particleColor = "#E8D8A0"; // Icy yellowish
      particleSize = 0.3;
      particleOpacity = 0.9;
    } else if (id === "kuiper-belt") {
      particleCount = 5000;
      innerRadiusFactor = 0.9;
      outerRadiusFactor = 1.1;
      verticalSpread = 20;    // Wider spread for Kuiper Belt
      particleColor = "#BBBBCC"; // Icy bluish
      particleSize = 0.4;
      particleOpacity = 0.5;
    } else if (id === "oort-cloud") {
      particleCount = 8000;
      innerRadiusFactor = 0.7;
      outerRadiusFactor = 1.3;
      verticalSpread = 100;   // Spherical cloud
      particleColor = "#AABBCC"; // Very faint blue
      particleSize = 0.2;
      particleOpacity = 0.3;
    }
    
    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const sizes = [];
    const colors = [];
    
    // Convert hexadecimal color to RGB
    const color = new THREE.Color(particleColor);
    
    // Calculate boundary radii
    const innerRadius = orbitRadius * innerRadiusFactor;
    const outerRadius = orbitRadius * outerRadiusFactor;
    
    // Generate random particles
    for (let i = 0; i < particleCount; i++) {
      let x, y, z;
      
      if (id === "saturn-rings") {
        // Flat ring system
        const r = innerRadius + Math.random() * (outerRadius - innerRadius);
        const theta = Math.random() * Math.PI * 2;
        
        // Almost flat with tiny vertical variation
        x = Math.cos(theta) * r;
        y = (Math.random() - 0.5) * verticalSpread;
        z = Math.sin(theta) * r;
        
        // Apply rotation to match Saturn's tilt
        const tilt = orbitTilt || 0;
        const yn = y * Math.cos(tilt) - z * Math.sin(tilt);
        const zn = y * Math.sin(tilt) + z * Math.cos(tilt);
        y = yn;
        z = zn;
      } else if (id === "oort-cloud") {
        // Spherical distribution for Oort Cloud
        const phi = Math.random() * Math.PI * 2;
        const cosTheta = Math.random() * 2 - 1;
        const u = Math.random();
        const theta = Math.acos(cosTheta);
        const r = outerRadius * Math.cbrt(u); // Cube root for volumetric distribution
        
        x = r * Math.sin(theta) * Math.cos(phi);
        y = r * Math.sin(theta) * Math.sin(phi);
        z = r * Math.cos(theta);
      } else {
        // Standard belt distribution (asteroid belt, Kuiper belt)
        const r = innerRadius + Math.random() * (outerRadius - innerRadius);
        const theta = Math.random() * Math.PI * 2;
        
        x = Math.cos(theta) * r;
        y = (Math.random() - 0.5) * verticalSpread;
        z = Math.sin(theta) * r;
      }
      
      // Add position
      positions.push(x, y, z);
      
      // Random sizes
      const size = Math.random() * particleSize + 0.1;
      sizes.push(size);
      
      // Add slightly varied colors
      const colorVariation = 0.1;
      const vr = Math.random() * colorVariation - colorVariation/2;
      const vg = Math.random() * colorVariation - colorVariation/2;
      const vb = Math.random() * colorVariation - colorVariation/2;
      
      colors.push(color.r + vr, color.g + vg, color.b + vb);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    return { 
      geometry,
      size: particleSize,
      opacity: particleOpacity
    };
  }, [id, type, orbitRadius, orbitTilt]);
  
  // Function to handle moons orbiting planets
  useEffect(() => {
    if (type === "moon" && orbitRadius > 0) {
      // Find the parent planet
      let parentId = null;
      
      if (id === "moon") parentId = "earth";
      else if (id === "io" || id === "europa") parentId = "jupiter";
      else if (id === "titan") parentId = "saturn";
      
      // Store parent ID for orbit calculations in useFrame
      if (meshRef.current && parentId) {
        meshRef.current.userData.parentId = parentId;
      }
    }
  }, [id, type, orbitRadius]);
  
  // Create simplified orbit path with proper elliptical shape
  const orbitPath = useMemo(() => {
    if (orbitSpeed > 0 && orbitRadius > 0) {
      // Skip orbit paths for objects that get orbits dynamically
      if (type === "moon") return null;
      
      const points = [];
      const segments = 100; // More segments for smoother elliptical orbits
      
      const params = {
        center: orbitCenter as [number, number, number],
        radius: orbitRadius,
        eccentricity: eccentricity,
        tilt: orbitTilt
      };
      
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const pos = calculateKeplerianPosition(angle, params);
        points.push(pos);
      }
      
      return (
        <line>
          <bufferGeometry attach="geometry">
            <float32BufferAttribute attach="attributes-position" args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]} />
          </bufferGeometry>
          <lineBasicMaterial 
            attach="material" 
            color={type === "dwarf" ? "#AA8866" : "#AAAAAA"}
            opacity={0.3} 
            transparent={true} 
          />
        </line>
      );
    }
    return null;
  }, [orbitRadius, orbitSpeed, orbitCenter, orbitTilt, eccentricity, type]);
  
  // Handle moon orbit calculations in useFrame
  useFrame((state, delta) => {
    if (!meshRef.current || isPaused) return;
    
    // Rotate the body around its own axis
    if (rotationSpeed) {
      // Apply axial tilt if specified
      if (axialTilt && !meshRef.current.userData.axialTiltApplied) {
        const tiltAxis = new THREE.Vector3(0, 0, 1);
        const tiltQuaternion = new THREE.Quaternion().setFromAxisAngle(tiltAxis, axialTilt);
        meshRef.current.quaternion.premultiply(tiltQuaternion);
        meshRef.current.userData.axialTiltApplied = true;
      }
      
      // Rotate around the tilted axis
      const rotationAxis = new THREE.Vector3(0, 1, 0);
      meshRef.current.rotateOnAxis(rotationAxis, rotationSpeed * delta * timeScale);
      
      // Rotate Earth's clouds at a slightly different speed for realism
      if (id === "earth" && atmosphere) {
        // Find clouds in atmosphere children
        atmosphere.children.forEach(child => {
          if (child.userData.isEarthClouds) {
            // Rotate clouds slightly faster than Earth for dynamic effect
            child.rotateOnAxis(rotationAxis, rotationSpeed * 1.2 * delta * timeScale);
          }
        });
      }
    }
    
    // Update orbit position
    if (orbitSpeed > 0 && orbitRadius > 0) {
      // Check if this is a moon that needs to orbit a planet
      if (type === "moon" && meshRef.current.userData.parentId) {
        const parentId = meshRef.current.userData.parentId;
        
        // Find parent planet in the scene
        let parentObject = null;
        state.scene.traverse((object) => {
          if (object.userData && object.userData.id === parentId) {
            parentObject = object;
          }
        });
        
        if (parentObject) {
          // Get parent position
          const parentPosition = new THREE.Vector3();
          (parentObject as THREE.Object3D).getWorldPosition(parentPosition);
          
          // Calculate orbit around parent
          const time = simulationTime * orbitSpeed;
          
          // Keplerian parameters for moon orbit
          const moonParams = {
            center: [parentPosition.x, parentPosition.y, parentPosition.z] as [number, number, number],
            radius: orbitRadius,
            eccentricity: eccentricity,
            tilt: orbitTilt
          };
          
          // Calculate position using Keplerian orbit
          const position = calculateKeplerianPosition(time, moonParams);
          
          // Update position
          meshRef.current.position.copy(position);
          return; // Exit early since we've set position
        }
      }
      
      // Handle spacecraft like JWST orbiting at L2 point
      if (id === "jwst") {
        // Find Earth in the scene
        let earthObject = null;
        state.scene.traverse((object) => {
          if (object.userData && object.userData.id === "earth") {
            earthObject = object;
          }
        });
        
        if (earthObject) {
          // Get Earth position
          const earthPosition = new THREE.Vector3();
          (earthObject as THREE.Object3D).getWorldPosition(earthPosition);
          
          // Calculate Sun direction (from origin to Earth, normalized)
          const sunDirection = earthPosition.clone().normalize();
          
          // L2 point is in the anti-Sun direction from Earth
          const l2Position = earthPosition.clone().add(
            sunDirection.clone().multiplyScalar(25)
          );
          
          // Orbit around L2 point
          const time = simulationTime * orbitSpeed;
          
          // Create a halo orbit around L2
          const x = l2Position.x + Math.cos(time) * orbitRadius * 0.5;
          const y = l2Position.y + Math.sin(time) * Math.cos(time) * orbitRadius * 0.3;
          const z = l2Position.z + Math.sin(time) * orbitRadius * 0.7;
          
          meshRef.current.position.set(x, y, z);
          return;
        }
      }
      
      // Standard orbit calculation for non-moons
      const time = simulationTime * orbitSpeed;
      
      // Keplerian parameters
      const params = {
        center: orbitCenter as [number, number, number],
        radius: orbitRadius,
        eccentricity: eccentricity,
        tilt: orbitTilt
      };
      
      // Calculate position using Keplerian orbit
      const position = calculateKeplerianPosition(time, params);
      
      // Update position
      meshRef.current.position.copy(position);
    }
  });

  // Handle click to focus
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setFocusedBody(id);
  };

  const isFocused = focusedBody === id;

  return (
    <group>
      {orbitPath}
      
      {/* Render particle field if present */}
      {particleField && (
        <points>
          <primitive object={particleField.geometry} attach="geometry" />
          <pointsMaterial
            size={particleField.size}
            sizeAttenuation={true}
            vertexColors={true}
            transparent={true}
            opacity={particleField.opacity}
          />
        </points>
      )}
      
      {/* Render mesh for standard bodies */}
      {type !== "belt" && (
        <mesh
          ref={meshRef}
          position={position}
          onClick={handleClick}
          onPointerOver={() => setHoveredBody(id)}
          onPointerOut={() => setHoveredBody(null)}
        >
          <sphereGeometry args={[radius, 32, 16]} />
          <primitive object={material} attach="material" />
          {atmosphere && <primitive object={atmosphere} />}
          
          {/* Highlight effect when focused */}
          {isFocused && (
            <Sphere args={[radius * 1.1, 16, 8]}>
              <meshBasicMaterial
                color="#4FC3F7"
                transparent={true}
                opacity={0.2}
                wireframe={true}
              />
            </Sphere>
          )}
        </mesh>
      )}
      
      {/* For belt objects, add an invisible mesh for clicking/hovering */}
      {type === "belt" && (
        <mesh
          ref={meshRef}
          position={position}
          onClick={handleClick}
          onPointerOver={() => setHoveredBody(id)}
          onPointerOut={() => setHoveredBody(null)}
          visible={false}
        >
          <sphereGeometry args={[1, 4, 4]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}
    </group>
  );
};

export default CelestialBody;