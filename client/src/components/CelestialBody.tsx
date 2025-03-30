import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { useTexture, Sphere, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useSpaceStore } from "../lib/stores/useSpaceStore";
import { CelestialBodyProps } from "../lib/types";
import { SOLAR_SYSTEM } from "../assets/planet-data";
import ISSPlaceholder from "./ISSPlaceholder";
import JWSTPlaceholder from "./JWSTPlaceholder";

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

  // Set the ID immediately when the component is rendered
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.id = id;
      console.log(`Set userData.id=${id} for celestial body`);
    }
  }, [id]);

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

  // Load normal/bump map for planets to enhance surface details
  const normalMap = useMemo(() => {
    // Only load normal maps for rocky bodies or those with distinct surface features
    if (!["moon", "mercury", "venus", "earth", "mars", "pluto"].includes(id)) return null;
    
    try {
      // Specific normal maps for different bodies
      let normalMapUrl = "";
      
      if (id === "moon") normalMapUrl = "/textures/planets/moon_normal.jpg";
      else if (id === "mercury") normalMapUrl = "/textures/planets/mercury_normal.jpg";
      else if (id === "venus") normalMapUrl = "/textures/planets/venus_normal.jpg";
      else if (id === "earth") normalMapUrl = "/textures/planets/earth_normal.jpg";
      else if (id === "mars") normalMapUrl = "/textures/planets/mars_normal.jpg";
      else if (id === "pluto") normalMapUrl = "/textures/planets/pluto_normal.jpg";
      else return null;
      
      const loader = new THREE.TextureLoader();
      return loader.load(normalMapUrl, undefined, undefined, (error) => {
        console.warn(`Failed to load ${id} normal map, falling back to regular texture`);
      });
    } catch (error) {
      return null;
    }
  }, [id]);

  // Create materials with proper fallbacks
  const material = useMemo(() => {
    const isMissingTexture = !texture || texture.image?.width < 20;

    if (type === "star") {
      // Enhanced Sun material with realistic properties
      return new THREE.MeshStandardMaterial({
        map: isMissingTexture ? null : texture,
        emissive: new THREE.Color("#FFA726"),
        emissiveIntensity: 1.0,
        emissiveMap: texture, // Use texture for emission pattern
        color: isMissingTexture ? getFallbackMaterial() : 0xffffff,
        transparent: false, // Ensure the sun is not transparent
        opacity: 1.0
      });
    } else if (id === "mercury") {
      // Mercury - cratered, airless body with high metallic content
      return new THREE.MeshStandardMaterial({
        map: isMissingTexture ? null : texture,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.7, 0.7),
        roughness: 0.85,
        metalness: 0.4, // Higher metallic content
        color: isMissingTexture ? getFallbackMaterial() : 0xeeeeee
      });
    } else if (id === "venus") {
      // Venus - thick clouds, high temperature, yellowish appearance
      return new THREE.MeshStandardMaterial({
        map: isMissingTexture ? null : texture,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.2, 0.2), // Subtle normals due to cloud cover
        roughness: 0.6,
        metalness: 0.1,
        color: isMissingTexture ? getFallbackMaterial() : 0xffffdd
      });
    } else if (id === "earth") {
      // Earth - ocean, land, clouds, with subtle self-illumination for night side
      return new THREE.MeshStandardMaterial({
        map: isMissingTexture ? null : texture,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.8, 0.8),
        roughness: 0.6,
        metalness: 0.1,
        emissive: new THREE.Color("#334455"), // Subtle nighttime lights
        emissiveIntensity: 0.1,
        color: isMissingTexture ? getFallbackMaterial() : 0xffffff
      });
    } else if (id === "moon") {
      // Special material for moon with realistic properties
      return new THREE.MeshStandardMaterial({
        map: isMissingTexture ? null : texture,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.8, 0.8),
        bumpMap: isMissingTexture ? null : texture,
        bumpScale: 0.04,
        roughness: 0.9,
        metalness: 0.1,
        emissive: new THREE.Color("#111111"),
        emissiveIntensity: 0.03,
        color: isMissingTexture ? getFallbackMaterial() : 0xDDDDDD
      });
    } else if (id === "mars") {
      // Mars - reddish, dusty, with polar caps and notable features
      return new THREE.MeshStandardMaterial({
        map: isMissingTexture ? null : texture,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(1.0, 1.0), // Strong surface detail
        roughness: 0.9,
        metalness: 0.1,
        color: isMissingTexture ? getFallbackMaterial() : 0xffccbb // Slight reddish tint
      });
    } else if (id === "jupiter") {
      // Jupiter - gas giant with bands and Great Red Spot
      return new THREE.MeshStandardMaterial({
        map: isMissingTexture ? null : texture,
        roughness: 0.75,
        metalness: 0.0,
        color: isMissingTexture ? getFallbackMaterial() : 0xfff5e0
      });
    } else if (id === "saturn") {
      // Saturn - similar to Jupiter but more muted
      return new THREE.MeshStandardMaterial({
        map: isMissingTexture ? null : texture,
        roughness: 0.8,
        metalness: 0.0,
        color: isMissingTexture ? getFallbackMaterial() : 0xfffce0
      });
    } else if (id === "uranus") {
      // Uranus - ice giant with smooth, bluish appearance
      return new THREE.MeshStandardMaterial({
        map: isMissingTexture ? null : texture,
        roughness: 0.6,
        metalness: 0.1,
        color: isMissingTexture ? getFallbackMaterial() : 0xe0f5ff
      });
    } else if (id === "neptune") {
      // Neptune - ice giant with deeper blue and more visible features
      return new THREE.MeshStandardMaterial({
        map: isMissingTexture ? null : texture,
        roughness: 0.65,
        metalness: 0.1,
        color: isMissingTexture ? getFallbackMaterial() : 0xc0e0ff
      });
    } else if (id === "pluto") {
      // Pluto - icy, small with distinctive reddish-brown regions
      return new THREE.MeshStandardMaterial({
        map: isMissingTexture ? null : texture,
        normalMap: normalMap,
        normalScale: new THREE.Vector2(0.5, 0.5),
        roughness: 0.85,
        metalness: 0.0,
        color: isMissingTexture ? getFallbackMaterial() : 0xf0e0d0
      });
    } else if (type === "spacecraft") {
      // Generic spacecraft material - metallic with high specularity
      return new THREE.MeshStandardMaterial({
        map: isMissingTexture ? null : texture,
        roughness: 0.3,
        metalness: 0.8,
        emissive: new THREE.Color("#223344"), // Subtle equipment lights
        emissiveIntensity: 0.2,
        color: isMissingTexture ? getFallbackMaterial() : 0xdddddd
      });
    } else {
      // Default material for any other bodies
      return new THREE.MeshStandardMaterial({
        map: isMissingTexture ? null : texture,
        roughness: 0.7,
        metalness: 0.2,
        color: isMissingTexture ? getFallbackMaterial() : 0xffffff
      });
    }
  }, [texture, type, id, normalMap]);

  // Create atmosphere for planets with atmosphere
  const atmosphere = useMemo(() => {
    // Only Earth, Venus, Saturn, Jupiter, Uranus, Neptune have visible atmospheres
    const hasAtmosphere = ["earth", "venus", "jupiter", "saturn", "uranus", "neptune", "titan"].includes(id);

    // Special case for the Sun - create a glow effect
    if (type === "star" || id === "sun") {
      // Create a larger sphere for the glow effect
      const glowSize = 1.03; // Reduced from 1.1 to 1.03 (just 3% larger than the sun)
      const glowGeometry = new THREE.SphereGeometry(radius * glowSize, 64, 64);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#FFA726"),
        transparent: true,
        opacity: 0.15, // Reduced from 0.2 to 0.15
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      });
      
      return new THREE.Mesh(glowGeometry, glowMaterial);
    }

    if ((type === "planet" || type === "moon") && hasAtmosphere) {
      // Different atmosphere color and properties based on planet
      let atmosphereColor = "#4FC3F7"; // Default blue
      let atmosphereOpacity = 0.15;
      let atmosphereSize = 1.05; // Default atmosphere size multiplier

      if (id === "earth") {
        atmosphereColor = "#4FC3F7"; // Blue atmosphere
        atmosphereOpacity = 0.18;
        atmosphereSize = 1.05;
      } else if (id === "venus") {
        atmosphereColor = "#E6C073"; // Thick yellowish atmosphere
        atmosphereOpacity = 0.3;     // More opaque due to dense atmosphere
        atmosphereSize = 1.08;       // Thicker atmosphere
      } else if (id === "jupiter") {
        atmosphereColor = "#E0B080"; // Gas giant atmosphere
        atmosphereOpacity = 0.15;
        atmosphereSize = 1.04;
      } else if (id === "saturn") {
        atmosphereColor = "#E8D8A0"; // Gas giant atmosphere, yellowish
        atmosphereOpacity = 0.15;
        atmosphereSize = 1.04;
      } else if (id === "uranus") {
        atmosphereColor = "#B4D0CF"; // Blue-green
        atmosphereOpacity = 0.15;
        atmosphereSize = 1.04;
      } else if (id === "neptune") {
        atmosphereColor = "#334CA5"; // Deep blue
        atmosphereOpacity = 0.15;
        atmosphereSize = 1.04;
      } else if (id === "titan") {
        atmosphereColor = "#E09060"; // Titan's orangish haze
        atmosphereOpacity = 0.25;
        atmosphereSize = 1.07;
      }

      return new THREE.Mesh(
        new THREE.SphereGeometry(radius * atmosphereSize, 64, 64), // Higher resolution
        new THREE.MeshStandardMaterial({
          color: atmosphereColor,
          transparent: true,
          opacity: atmosphereOpacity,
          side: THREE.BackSide,
          depthWrite: false  // Prevent z-fighting
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

      // Special handling for moons and spacecraft
      let effectiveOrbitCenter: [number, number, number] = [...orbitCenter] as [number, number, number];

      // For Moon, don't render its path here since it needs to be dynamic
      if (id === 'moon' || id === 'iss' || id === 'jwst') {
        // Skip path rendering for objects that need dynamic paths
        return null;
      }

      // Create orbit parameters object
      const orbitParams = {
        center: effectiveOrbitCenter,
        radius: orbitRadius,
        eccentricity: e,
        tilt: tilt
      };

      // Create points for a 3D elliptical path
      const points = [];
      const segments = 100; // Reduced from 200 for better performance
      
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const pos = calculateEllipticalPosition(angle, orbitParams);
        points.push(new THREE.Vector3(pos.x, pos.y, pos.z));
      }

      // Create a simple curve from the points
      const curve = new THREE.CatmullRomCurve3(points);
      curve.closed = true;

      // Create geometry from the curve with fewer points
      const pathGeometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(100) // Reduced from 200
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

  // Get time control state
  const isPaused = useSpaceStore(state => state.isPaused);
  const timeScale = useSpaceStore(state => state.timeScale);
  const simulationTime = useSpaceStore(state => state.simulationTime);

  // Function to calculate moon's orbit position
  const calculateOrbitPosition = (time: number, earthPos: THREE.Vector3): THREE.Vector3 | null => {
    const orbitRadius = 12; // Adjust as needed
    const orbitSpeed = 0.5; // Adjust as needed
    const angle = time * orbitSpeed;
    const x = earthPos.x + orbitRadius * Math.cos(angle);
    const y = earthPos.y + orbitRadius * Math.sin(angle);
    const z = earthPos.z;
    return new THREE.Vector3(x, y, z);
  };

  // Handle orbiting and rotation
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Handle axial tilt and rotation (only needs to happen once)
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

    // Skip updates if simulation is paused
    if (isPaused) return;
    
    // Performance optimization - update less frequently for objects with slower dynamics
    let shouldUpdate = true;
    
    // Non-essential objects update less frequently based on their update frequency needs
    if (type === 'planet' && id !== 'earth') {
      // Slower planets update less frequently
      if (Math.random() > 0.5) shouldUpdate = false;
    } else if (id === 'iss' || id === 'jwst') {
      // These need to update every frame to maintain smooth orbit
      shouldUpdate = true;
    } else if (id !== 'moon' && id !== 'earth' && type !== 'star') {
      // Other objects can update less frequently
      if (Math.random() > 0.7) shouldUpdate = false;
    }
    
    if (!shouldUpdate) return;

    // Rotate the body around its axis using delta time and time scale for smooth animation
    if (rotationSpeed) {
      // Create a rotation axis that respects the axial tilt
      const rotationAxis = new THREE.Vector3(0, 1, 0);

      // Apply rotation with time scale
      meshRef.current.rotateOnAxis(rotationAxis, rotationSpeed * delta * 10 * timeScale);
    }

    // Orbit around center if applicable
    if (orbitSpeed > 0 && orbitRadius > 0) {
      // Special handling for moons and spacecraft that orbit planets
      let effectiveOrbitCenter: [number, number, number] = [...orbitCenter] as [number, number, number];

      // For Moon, find Earth's actual position
      if (id === "moon") {
        // Get Earth from the scene - try multiple ways to find it
        let earthObject = null;
        
        // Try first by searching userData.id
        earthObject = state.scene.children.find(child => 
          child.userData && child.userData.id === "earth"
        );
        
        // If not found, try looking through all meshes recursively
        if (!earthObject) {
          state.scene.traverse((object) => {
            if (object.userData && object.userData.id === "earth") {
              earthObject = object;
            }
          });
        }
        
        if (earthObject) {
          // Extract Earth's current position for the Moon to orbit around
          const earthWorldPosition = new THREE.Vector3();
          earthObject.getWorldPosition(earthWorldPosition);
          
          // Real moon orbital parameters
          // Moon's orbit is inclined by about 5.1 degrees to the ecliptic
          // Earth-Moon distance is about 384,400 km (scaled down proportionally)
          // Moon's orbital eccentricity is about 0.0549
          const moonOrbitRadius = orbitRadius; // Use the value from planet-data
          const moonOrbitTilt = orbitTilt; // Use the value from planet-data
          const moonEccentricity = eccentricity; // Use the value from planet-data
          
          // Calculate moon's position using proper elliptical orbit
          const moonTime = simulationTime * orbitSpeed;
          const moonAngle = moonTime;
          
          // Perigee-apogee variation due to eccentricity
          // r = a(1-e²)/(1+e·cos θ) - standard elliptical orbit equation
          const semiMajor = moonOrbitRadius;
          const distanceFromEarth = (semiMajor * (1 - moonEccentricity * moonEccentricity)) / 
                                   (1 + moonEccentricity * Math.cos(moonAngle));
          
          // Calculate moon's position relative to Earth with proper orbital inclination
          const moonX = earthWorldPosition.x + distanceFromEarth * Math.cos(moonAngle);
          const moonY = earthWorldPosition.y + distanceFromEarth * Math.sin(moonAngle) * Math.sin(moonOrbitTilt);
          const moonZ = earthWorldPosition.z + distanceFromEarth * Math.sin(moonAngle) * Math.cos(moonOrbitTilt);
          
          // Update moon's position directly
          meshRef.current.position.set(moonX, moonY, moonZ);
          
          // Apply correct scaling for the Moon (scaled relative to Earth)
          // Real Moon is about 27% the diameter of Earth
          meshRef.current.scale.set(0.27, 0.27, 0.27);
          
          // Skip the standard orbit calculation completely
          return;
        } else {
          console.warn("Earth not found in scene for moon orbit calculation");
        }
      }

      // For ISS, find Earth's actual position
      if (id === "iss") {
        // Get Earth from the scene - try multiple ways to find it
        let earthObject = null;
        
        // Try first by searching userData.id
        earthObject = state.scene.children.find(child => 
          child.userData && child.userData.id === "earth"
        );
        
        // If not found, try looking through all meshes recursively
        if (!earthObject) {
          state.scene.traverse((object) => {
            if (object.userData && object.userData.id === "earth") {
              earthObject = object;
            }
          });
        }

        if (earthObject) {
          // Extract Earth's current position for the ISS to orbit around
          const earthWorldPosition = new THREE.Vector3();
          earthObject.getWorldPosition(earthWorldPosition);
          
          // Calculate ISS's orbit with very fast movement (orbital period ~90 mins)
          const issTime = simulationTime * orbitSpeed * 5; // Multiply by 5 for faster movement
          const issAngle = issTime;
          
          // Use elliptical orbit equation for ISS position
          const issOrbitRadius = orbitRadius;
          const issOrbitTilt = orbitTilt;
          const issEccentricity = eccentricity;
          
          // Calculate ISS position using standard elliptical orbit formula
          const semiMajor = issOrbitRadius;
          const distanceFromEarth = (semiMajor * (1 - issEccentricity * issEccentricity)) / 
                                    (1 + issEccentricity * Math.cos(issAngle));
          
          // Calculate position with high inclination (51.6 degrees)
          const issX = earthWorldPosition.x + distanceFromEarth * Math.cos(issAngle);
          const issY = earthWorldPosition.y + distanceFromEarth * Math.sin(issAngle) * Math.sin(issOrbitTilt);
          const issZ = earthWorldPosition.z + distanceFromEarth * Math.sin(issAngle) * Math.cos(issOrbitTilt);
          
          // Set ISS position
          meshRef.current.position.set(issX, issY, issZ);
          
          // Store Earth's position for orbit path rendering
          meshRef.current.userData.earthPosition = earthWorldPosition.clone();
          
          // Skip standard orbit calculation
          return;
        } else {
          console.warn("Earth not found in scene for ISS orbit calculation");
        }
      }

      // For JWST, find Earth's actual position but offset for L2 point
      if (id === "jwst") {
        // Get Earth from the scene - try multiple ways to find it
        let earthObject = null;
        let sunObject = null;
        
        // Try first by searching userData.id
        earthObject = state.scene.children.find(child => 
          child.userData && child.userData.id === "earth"
        );
        
        sunObject = state.scene.children.find(child => 
          child.userData && child.userData.id === "sun"
        );
        
        // If not found, try looking through all meshes recursively
        if (!earthObject) {
          state.scene.traverse((object) => {
            if (object.userData && object.userData.id === "earth") {
              earthObject = object;
            }
          });
        }
        
        if (!sunObject) {
          state.scene.traverse((object) => {
            if (object.userData && object.userData.id === "sun") {
              sunObject = object;
            }
          });
        }

        if (earthObject) {
          // Get Earth and Sun positions
          const earthWorldPosition = new THREE.Vector3();
          earthObject.getWorldPosition(earthWorldPosition);
          
          // Calculate Sun direction (either from Sun object or assumed at origin)
          let sunDirection;
          
          if (sunObject) {
            const sunWorldPosition = new THREE.Vector3();
            sunObject.getWorldPosition(sunWorldPosition);
            sunDirection = earthWorldPosition.clone().sub(sunWorldPosition).normalize();
          } else {
            // If Sun not found, assume it's at origin
            sunDirection = earthWorldPosition.clone().normalize();
          }
          
          // L2 point is in the anti-Sun direction from Earth
          const l2Position = earthWorldPosition.clone().add(
            sunDirection.clone().multiplyScalar(25) // Scale factor for L2 distance
          );
          
          // JWST orbits around the L2 point in a halo orbit
          const jwstTime = simulationTime * orbitSpeed;
          const jwstAngle = jwstTime;
          
          // Use planet data for the halo orbit parameters
          const jwstOrbitRadius = orbitRadius;
          const jwstOrbitTilt = orbitTilt; // Higher inclination for visibility
          const jwstEccentricity = eccentricity;
          
          // Calculate distance from L2 point using elliptical orbit equation
          const semiMajor = jwstOrbitRadius;
          const distanceFromL2 = (semiMajor * (1 - jwstEccentricity * jwstEccentricity)) / 
                                (1 + jwstEccentricity * Math.cos(jwstAngle));
          
          // Calculate JWST position in its halo orbit around L2
          // Use a modified angle calculation to create a more visible halo pattern
          const jwstX = l2Position.x + distanceFromL2 * Math.cos(jwstAngle);
          const jwstY = l2Position.y + distanceFromL2 * Math.sin(jwstAngle) * Math.sin(jwstOrbitTilt);
          const jwstZ = l2Position.z + distanceFromL2 * Math.sin(jwstAngle) * Math.cos(jwstOrbitTilt);
          
          // Set JWST position
          meshRef.current.position.set(jwstX, jwstY, jwstZ);
          
          // Store Earth's position and L2 point for orbit path rendering
          meshRef.current.userData.earthPosition = earthWorldPosition.clone();
          meshRef.current.userData.l2Position = l2Position.clone();
          
          // Skip standard orbit calculation
          return;
        } else {
          console.warn("Earth not found in scene for JWST orbit calculation");
        }
      }

      const orbitParams = {
        center: effectiveOrbitCenter,
        radius: orbitRadius,
        eccentricity: eccentricity,
        tilt: orbitTilt
      };

      // On first render, position the celestial body on its orbit path
      if (!initialPositionRef.current && id === "moon") {
        initialPositionRef.current = true; // Mark as initialized to avoid overriding in regular update
        console.log("Initializing Moon position - skipping default positioning");
        // We'll let the regular update handle moon positioning
        return;
      } else if (!initialPositionRef.current) {
        console.log(`Initializing ${id} at its starting position`);
        // Place at a different starting angle based on the body's position in the solar system
        // This creates a more visually interesting starting arrangement
        let initialAngle = 0;

        // Different starting angles for different bodies to avoid crowding
        if (id === "mercury") initialAngle = 0;
        else if (id === "venus") initialAngle = 2.0;
        else if (id === "earth") initialAngle = 4.0;
        else if (id === "mars") initialAngle = 5.5;
        else if (id === "jupiter") initialAngle = 1.0;
        else if (id === "saturn") initialAngle = 3.0;
        else if (id === "uranus") initialAngle = 0.5;
        else if (id === "neptune") initialAngle = 2.5;
        else if (id === "pluto") initialAngle = 4.5;
        else if (id === "iss") initialAngle = 0;
        else if (id === "jwst") initialAngle = 3.0;

        // Calculate initial position using the angle
        const initialPos = calculateEllipticalPosition(initialAngle, {
          center: effectiveOrbitCenter,
          radius: orbitRadius,
          eccentricity: eccentricity,
          tilt: orbitTilt
        });
        meshRef.current.position.x = initialPos.x;
        meshRef.current.position.y = initialPos.y;
        meshRef.current.position.z = initialPos.z;
        
        // Store the ID of this celestial body in userData for identification later
        meshRef.current.userData.id = id;
        console.log(`${id} initialized at position:`, meshRef.current.position);
        initialPositionRef.current = true;
      }

      // Use simulation time for consistent animation with time scaling
      const time = simulationTime * orbitSpeed * 5; // Increased speed multiplier

      // Calculate elliptical orbit position using the same function as the path generation
      const position = calculateEllipticalPosition(time, {
        center: effectiveOrbitCenter,
        radius: orbitRadius,
        eccentricity: eccentricity,
        tilt: orbitTilt
      });

      // Update position for orbiting
      meshRef.current.position.x = position.x;
      meshRef.current.position.y = position.y;
      meshRef.current.position.z = position.z;

      // Store ID in userData for other bodies to reference
      meshRef.current.userData.id = id;

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

  // Special case for planets with ring systems
  const planetaryRings = useMemo(() => {
    // Only Saturn, Uranus, Neptune, and Jupiter have ring systems
    // Explicitly exclude the Sun ("star" type) and check the id isn't "sun"
    if (!["saturn", "uranus", "neptune", "jupiter"].includes(id) || type === "star" || id === "sun") {
      return null;
    }
    
    let ringInnerRadius = 0;
    let ringOuterRadius = 0;
    let ringColor = "#FFFFFF";
    let ringOpacity = 0.8;
    let ringRotationX = Math.PI / 2; // Default flat ring orientation
    let ringRotationY = 0; // Additional rotation for tilt
    
    if (id === "saturn") {
      // Saturn's magnificent ring system
      ringInnerRadius = radius * 1.4;
      ringOuterRadius = radius * 2.3;
      ringColor = "#E8D8A0"; // Yellowish
      ringOpacity = 0.85;
      ringRotationY = 0.3; // Slight tilt
    } else if (id === "uranus") {
      // Uranus has thin, dark rings
      ringInnerRadius = radius * 1.3;
      ringOuterRadius = radius * 1.6;
      ringColor = "#93A1A1"; // Darker, less visible
      ringOpacity = 0.6;
      // Uranus rotates on its side, so rings are perpendicular to orbital plane
      ringRotationX = Math.PI / 2 - 1.7064; // Adjust for extreme axial tilt
      ringRotationY = 0.1;
    } else if (id === "neptune") {
      // Neptune has several thin rings with gaps
      ringInnerRadius = radius * 1.2;
      ringOuterRadius = radius * 1.5;
      ringColor = "#334455"; // Dark blue/gray
      ringOpacity = 0.5;
      ringRotationY = 0.2;
    } else if (id === "jupiter") {
      // Jupiter has a very faint ring system
      ringInnerRadius = radius * 1.3;
      ringOuterRadius = radius * 1.8;
      ringColor = "#C0B090"; // Dusty color
      ringOpacity = 0.25; // Very faint but more visible than before
      ringRotationY = 0.1;
    }
    
    // Create a more detailed ring system by using multiple rings
    const ringsGroup = new THREE.Group();
    
    // Main ring
    const ringSegments = id === "saturn" ? 128 : 64; // Higher detail for Saturn
    const ringGeometry = new THREE.RingGeometry(ringInnerRadius, ringOuterRadius, ringSegments);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: ringColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: ringOpacity,
      roughness: 0.8,
      metalness: 0.1
    });
    
    // For Saturn, add divisions to show ring complexity
    if (id === "saturn") {
      // Create textured ring material that doesn't rely on external image
      const canvasSize = 1024;
      const ringCanvas = document.createElement('canvas');
      ringCanvas.width = canvasSize;
      ringCanvas.height = canvasSize / 8;
      const ctx = ringCanvas.getContext('2d');
      
      if (ctx) {
        // Fill with base color
        ctx.fillStyle = '#E8D8A0';
        ctx.fillRect(0, 0, canvasSize, canvasSize / 8);
        
        // Add ring bands
        const bandCount = 20;
        for (let i = 0; i < bandCount; i++) {
          const bandPos = Math.random() * canvasSize;
          const bandWidth = 5 + Math.random() * 20;
          const opacity = 0.3 + Math.random() * 0.5;
          
          ctx.fillStyle = `rgba(101, 84, 43, ${opacity})`;
          ctx.fillRect(bandPos, 0, bandWidth, canvasSize / 8);
        }
        
        // Add Cassini division
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(canvasSize * 0.65, 0, canvasSize * 0.05, canvasSize / 8);
        
        // Create texture from canvas
        const ringTexture = new THREE.CanvasTexture(ringCanvas);
        ringTexture.wrapS = THREE.RepeatWrapping;
        ringTexture.repeat.set(2, 1);
        ringMaterial.map = ringTexture;
        
        // Add additional ring divisions
        const divisionPositions = [0.45, 0.65, 0.75];
        divisionPositions.forEach(pos => {
          const divStart = ringInnerRadius + (ringOuterRadius - ringInnerRadius) * pos;
          const divEnd = divStart + (ringOuterRadius - ringInnerRadius) * 0.03;
          
          const divGeometry = new THREE.RingGeometry(divStart, divEnd, 128);
          const divMaterial = new THREE.MeshBasicMaterial({
            color: "#000000",
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
          });
          
          const ringDiv = new THREE.Mesh(divGeometry, divMaterial);
          ringDiv.rotation.x = ringRotationX;
          ringDiv.rotation.y = ringRotationY;
          ringsGroup.add(ringDiv);
        });
      }
    }
    
    // For Jupiter, add subtle texture to the rings
    if (id === "jupiter") {
      const canvasSize = 512;
      const ringCanvas = document.createElement('canvas');
      ringCanvas.width = canvasSize;
      ringCanvas.height = 32;
      const ctx = ringCanvas.getContext('2d');
      
      if (ctx) {
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, canvasSize, 0);
        gradient.addColorStop(0, 'rgba(192, 176, 144, 0.3)');
        gradient.addColorStop(0.3, 'rgba(192, 176, 144, 0.25)');
        gradient.addColorStop(0.7, 'rgba(192, 176, 144, 0.2)');
        gradient.addColorStop(1, 'rgba(192, 176, 144, 0.15)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasSize, 32);
        
        // Add subtle dust streaks
        for (let i = 0; i < 30; i++) {
          const x = Math.random() * canvasSize;
          const width = 1 + Math.random() * 3;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + Math.random() * 0.1})`;
          ctx.fillRect(x, 0, width, 32);
        }
        
        const ringTexture = new THREE.CanvasTexture(ringCanvas);
        ringTexture.wrapS = THREE.RepeatWrapping;
        ringTexture.repeat.set(4, 1);
        ringMaterial.map = ringTexture;
      }
    }
    
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = ringRotationX;
    ringMesh.rotation.y = ringRotationY;
    ringsGroup.add(ringMesh);
    
    return ringsGroup;
  }, [id, radius]);

  // Render spacecraft model if it's a spacecraft
  const renderSpacecraft = () => {
    if (type !== "spacecraft") return null;
    
    // Use placeholders initially for spacecraft
    if (id === "iss") {
      return <ISSPlaceholder />;
    } else if (id === "jwst") {
      return <JWSTPlaceholder />;
    }
    
    // For other spacecraft or fallback, use basic sphere with texture
    return null;
  };

  return (
    <>
      {/* Render orbit path if applicable */}
      {orbitPath && orbitPath}

      {/* Special case for Moon - render dynamic orbit path around Earth */}
      {id === 'moon' && (
        <group>
          {/* This group will move with Earth, rendering path relative to it */}
          <line>
            <bufferGeometry attach="geometry">
              {(() => {
                // Create moon's orbit path points
                const points = [];
                const segments = 100;
                
                for (let i = 0; i <= segments; i++) {
                  const angle = (i / segments) * Math.PI * 2;
                  
                  // Calculate position with proper elliptical equation
                  const distance = (orbitRadius * (1 - eccentricity * eccentricity)) / 
                                  (1 + eccentricity * Math.cos(angle));
                  
                  // Apply orbital tilt
                  const x = distance * Math.cos(angle);
                  const y = distance * Math.sin(angle) * Math.sin(orbitTilt);
                  const z = distance * Math.sin(angle) * Math.cos(orbitTilt);
                  
                  points.push(new THREE.Vector3(x, y, z));
                }
                
                // Create a smooth curve
                const curve = new THREE.CatmullRomCurve3(points);
                curve.closed = true;
                
                // Return points for the buffer geometry
                return curve.getPoints(segments);
              })()}
            </bufferGeometry>
            <lineBasicMaterial 
              attach="material" 
              color="#AAAAAA"
              opacity={0.4} 
              transparent={true} 
              linewidth={1}
            />
          </line>
        </group>
      )}

      {/* Special case for ISS - render dynamic orbit path around Earth */}
      {id === 'iss' && (
        <group>
          {(() => {
            // Only render if we have Earth's position from the useFrame callback
            if (!meshRef.current || !meshRef.current.userData.earthPosition) return null;
            
            const earthPosition = meshRef.current.userData.earthPosition;
            
            return (
              <line>
                <bufferGeometry attach="geometry">
                  {(() => {
                    const points = [];
                    const segments = 100;
                    
                    for (let i = 0; i <= segments; i++) {
                      const angle = (i / segments) * Math.PI * 2;
                      
                      // Calculate position with proper elliptical equation
                      const distance = (orbitRadius * (1 - eccentricity * eccentricity)) / 
                                      (1 + eccentricity * Math.cos(angle));
                      
                      // Apply high orbital inclination (51.6 degrees)
                      const x = earthPosition.x + distance * Math.cos(angle);
                      const y = earthPosition.y + distance * Math.sin(angle) * Math.sin(orbitTilt);
                      const z = earthPosition.z + distance * Math.sin(angle) * Math.cos(orbitTilt);
                      
                      points.push(new THREE.Vector3(x, y, z));
                    }
                    
                    const curve = new THREE.CatmullRomCurve3(points);
                    curve.closed = true;
                    
                    return curve.getPoints(segments);
                  })()}
                </bufferGeometry>
                <lineBasicMaterial 
                  attach="material" 
                  color="#55AAFF"
                  opacity={0.8} 
                  transparent={true} 
                  linewidth={2.0}
                />
              </line>
            );
          })()}
        </group>
      )}

      {/* Special case for JWST - render path around L2 point */}
      {id === 'jwst' && (
        <group>
          {(() => {
            // Only render if we have L2 position from the useFrame callback
            if (!meshRef.current || !meshRef.current.userData.l2Position) return null;
            
            const l2Position = meshRef.current.userData.l2Position;
            
            return (
              <line>
                <bufferGeometry attach="geometry">
                  {(() => {
                    const points = [];
                    const segments = 100;
                    
                    for (let i = 0; i <= segments; i++) {
                      const angle = (i / segments) * Math.PI * 2;
                      
                      // Calculate position with proper elliptical equation
                      const distance = (orbitRadius * (1 - eccentricity * eccentricity)) / 
                                      (1 + eccentricity * Math.cos(angle));
                      
                      // Apply orbital tilt for halo orbit around L2
                      const x = l2Position.x + distance * Math.cos(angle);
                      const y = l2Position.y + distance * Math.sin(angle) * Math.sin(orbitTilt);
                      const z = l2Position.z + distance * Math.sin(angle) * Math.cos(orbitTilt);
                      
                      points.push(new THREE.Vector3(x, y, z));
                    }
                    
                    const curve = new THREE.CatmullRomCurve3(points);
                    curve.closed = true;
                    
                    return curve.getPoints(segments);
                  })()}
                </bufferGeometry>
                <lineBasicMaterial 
                  attach="material" 
                  color="#FFAA22"
                  opacity={0.7} 
                  transparent={true} 
                  linewidth={1.5}
                />
              </line>
            );
          })()}
        </group>
      )}

      {/* Use position prop only for bodies that don't orbit (e.g., Sun) */}
      <group position={orbitSpeed > 0 ? [0, 0, 0] : position} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
        {/* Suspense boundary for model loading */}
        <Suspense fallback={
          // Show a simple sphere while loading
          <Sphere 
            args={[radius, 16, 8]} 
            ref={meshRef}
          >
            <meshStandardMaterial color="#CCCCCC" />
          </Sphere>
        }>
          {/* Render 3D model for spacecraft or fallback to sphere */}
          {renderSpacecraft() || (
            <Sphere 
              args={[radius, 64, 32]} 
              ref={meshRef} 
              onClick={handleClick}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredBody(id);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredBody(null);
                document.body.style.cursor = 'auto';
              }}
            >
              <primitive object={material} attach="material" />
            </Sphere>
          )}
        </Suspense>

        {/* Atmosphere for planets */}
        {atmosphere && <primitive object={atmosphere} />}

        {/* Planetary ring systems */}
        {planetaryRings && <primitive object={planetaryRings} />}

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