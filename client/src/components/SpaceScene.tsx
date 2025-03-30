import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { 
  Stars, 
  useKeyboardControls, 
  PerspectiveCamera,
  OrbitControls 
} from "@react-three/drei";
import * as THREE from "three";
import CelestialBody from "./CelestialBody";
import SpacecraftModel from "./SpacecraftModel";
import Spacecraft from "./Spacecraft";
import { useSpaceStore } from "../lib/stores/useSpaceStore";
import { SOLAR_SYSTEM } from "../assets/planet-data";

const SpaceScene = () => {
  const { camera, gl } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const orbitSpeed = useRef(0.001);
  
  const focusedBody = useSpaceStore(state => state.focusedBody);
  const setLoaded = useSpaceStore(state => state.setLoaded);
  const cameraDistance = useSpaceStore(state => state.cameraDistance);
  
  // Get keyboard controls
  const forward = useKeyboardControls(state => state.forward);
  const backward = useKeyboardControls(state => state.backward);
  const leftward = useKeyboardControls(state => state.leftward);
  const rightward = useKeyboardControls(state => state.rightward);
  const zoomIn = useKeyboardControls(state => state.zoomIn);
  const zoomOut = useKeyboardControls(state => state.zoomOut);
  const reset = useKeyboardControls(state => state.reset);
  
  // Camera movement speed
  const moveSpeed = 2.0;
  const zoomSpeed = 5.0;
  
  // Reference for OrbitControls
  const orbitControlsRef = useRef<any>(null);
  
  // Enable mouse and touchpad controls while still preventing browser zoom
  useEffect(() => {
    const preventBrowserZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('wheel', preventBrowserZoom, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', preventBrowserZoom);
    };
  }, []);
  
  // Set the scene as loaded after a short delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoaded(true);
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [setLoaded]);

  // Store the object references for all bodies to use in dynamic tracking
  const bodyRefs = useRef<{[key: string]: THREE.Vector3}>({});
  
  // Initialize body positions
  useEffect(() => {
    SOLAR_SYSTEM.forEach(body => {
      bodyRefs.current[body.id] = new THREE.Vector3(
        body.position[0],
        body.position[1],
        body.position[2]
      );
    });
  }, []);
  
  // Update camera target when focused body changes
  useEffect(() => {
    if (focusedBody) {
      const bodyData = SOLAR_SYSTEM.find(body => body.id === focusedBody);
      if (bodyData) {
        // We'll update the target in the render loop to follow the orbiting body
        
        // Adjust orbit speed based on the body type
        if (bodyData.type === "star") {
          orbitSpeed.current = 0.0001;
        } else if (bodyData.type === "planet") {
          orbitSpeed.current = 0.0005;
        } else {
          orbitSpeed.current = 0.001;
        }
      }
    } else {
      // Default to looking at the sun
      targetRef.current.set(0, 0, 0);
      orbitSpeed.current = 0.0001;
    }
  }, [focusedBody]);

  // Get time control state
  const isPaused = useSpaceStore(state => state.isPaused);
  const timeScale = useSpaceStore(state => state.timeScale);
  const simulationTime = useSpaceStore(state => state.simulationTime);
  const incrementSimulationTime = useSpaceStore(state => state.incrementSimulationTime);
  
  // Handle body positions and keyboard camera controls
  useFrame((state, delta) => {
    if (!cameraRef.current) return;
    
    // Update simulation time based on delta and time scale
    incrementSimulationTime(delta);
    
    // Update the positions of all orbiting bodies for tracking and targeting
    SOLAR_SYSTEM.forEach(bodyData => {
      if (bodyData.orbitSpeed && bodyData.orbitRadius && bodyData.orbitCenter) {
        // Use the simulation time for consistent orbit animation (affected by time scale)
        const time = simulationTime * bodyData.orbitSpeed * 5;
        
        // Determine the orbital plane angle from body ID
        let orbitAngle = 0;
        if (bodyData.id === "mercury") orbitAngle = 0.12;
        else if (bodyData.id === "venus") orbitAngle = 0.05;
        else if (bodyData.id === "earth") orbitAngle = 0;
        else if (bodyData.id === "mars") orbitAngle = -0.03;
        else if (bodyData.id === "jupiter") orbitAngle = 0.02;
        else if (bodyData.id === "saturn") orbitAngle = -0.05;
        else if (bodyData.id === "uranus") orbitAngle = 0.08;
        else if (bodyData.id === "neptune") orbitAngle = -0.06;
        else if (bodyData.id === "pluto") orbitAngle = 0.17;
        
        // Calculate position with orbital plane
        const x = bodyData.orbitCenter[0] + Math.cos(time) * bodyData.orbitRadius;
        const y = bodyData.orbitCenter[1] + Math.sin(time) * Math.sin(orbitAngle) * bodyData.orbitRadius;
        const z = bodyData.orbitCenter[2] + Math.sin(time) * Math.cos(orbitAngle) * bodyData.orbitRadius;
        
        // Store this position for other calculations
        bodyRefs.current[bodyData.id] = new THREE.Vector3(x, y, z);
        
        // If this is the focused body, update orbit controls target
        if (focusedBody === bodyData.id && orbitControlsRef.current) {
          orbitControlsRef.current.target.set(x, y, z);
        }
      }
    });
    
    // Keyboard controls still work alongside mouse controls
    
    // Create a vector pointing from camera to target
    const target = focusedBody ? 
      bodyRefs.current[focusedBody] || new THREE.Vector3(0, 0, 0) :
      new THREE.Vector3(0, 0, 0);
      
    const cameraDirection = new THREE.Vector3();
    cameraDirection.subVectors(target, cameraRef.current.position).normalize();
    
    // Create perpendicular vectors for movement
    const right = new THREE.Vector3();
    right.crossVectors(cameraDirection, cameraRef.current.up).normalize();
    
    const up = new THREE.Vector3(0, 1, 0);
    
    // Move camera based on keyboard input
    if (forward) {
      cameraRef.current.position.addScaledVector(cameraDirection, moveSpeed * delta * 50);
    }
    if (backward) {
      cameraRef.current.position.addScaledVector(cameraDirection, -moveSpeed * delta * 50);
    }
    if (leftward) {
      cameraRef.current.position.addScaledVector(right, -moveSpeed * delta * 50);
    }
    if (rightward) {
      cameraRef.current.position.addScaledVector(right, moveSpeed * delta * 50);
    }
    
    // Zoom controls with keyboard
    if (zoomIn) {
      cameraRef.current.position.addScaledVector(cameraDirection, zoomSpeed * delta * 50);
    }
    if (zoomOut) {
      cameraRef.current.position.addScaledVector(cameraDirection, -zoomSpeed * delta * 50);
    }
    
    // Reset position
    if (reset) {
      if (focusedBody) {
        const bodyData = SOLAR_SYSTEM.find(body => body.id === focusedBody);
        if (bodyData) {
          // Position camera at an appropriate distance from the body
          const distance = (bodyData.radius || 1) * 5 + cameraDistance;
          
          // Get current position (updated from orbit calculations above)
          const bodyPosition = bodyRefs.current[bodyData.id] || 
                              new THREE.Vector3(
                                bodyData.position[0], 
                                bodyData.position[1], 
                                bodyData.position[2]
                              );
          
          // Set camera position
          cameraRef.current.position.set(
            bodyPosition.x + distance,
            bodyPosition.y + distance * 0.5,
            bodyPosition.z + distance
          );
          
          // Update orbit controls target
          if (orbitControlsRef.current) {
            orbitControlsRef.current.target.copy(bodyPosition);
          }
        }
      } else {
        // Default reset position
        cameraRef.current.position.set(0, 30, 100);
        
        // Reset orbit controls target to sun
        if (orbitControlsRef.current) {
          orbitControlsRef.current.target.set(0, 0, 0);
        }
      }
    }
  });

  // Effect to update orbit controls target when focus changes
  useEffect(() => {
    if (orbitControlsRef.current && focusedBody) {
      const bodyData = SOLAR_SYSTEM.find(body => body.id === focusedBody);
      if (bodyData) {
        // Set the target to the current body position
        const position = bodyRefs.current[bodyData.id] || 
                    new THREE.Vector3(bodyData.position[0], bodyData.position[1], bodyData.position[2]);
        
        orbitControlsRef.current.target.copy(position);
      }
    }
  }, [focusedBody]);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 30, 100]}
        fov={45}
        near={0.1}
        far={10000}
      />
      
      {/* Add OrbitControls for mouse/touchpad interaction */}
      <OrbitControls
        ref={orbitControlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        zoomSpeed={1.0}
        rotateSpeed={0.8}
        panSpeed={0.8}
        minDistance={30}
        maxDistance={1000}
        target={[0, 0, 0]}
      />
      
      {/* Ambient light - increased to make planets more visible */}
      <ambientLight intensity={0.5} />
      
      {/* Sun (central bright light) - reduced intensity */}
      <pointLight position={[0, 0, 0]} intensity={2.5} color="#FFA726" castShadow={false} />
      
      {/* Reduced additional lights to improve performance */}
      <pointLight position={[100, 50, 100]} intensity={0.6} color="#FFFFFF" castShadow={false} />
      
      {/* Enhanced stars background with reduced count for better performance */}
      <Stars radius={1500} depth={300} count={5000} />
      
      {/* Render all celestial bodies */}
      {SOLAR_SYSTEM.map(body => (
        <CelestialBody
          key={body.id}
          id={body.id}
          position={body.position}
          rotation={body.rotation}
          radius={body.radius}
          textureUrl={body.textureUrl}
          type={body.type}
          name={body.name}
          rotationSpeed={body.rotationSpeed}
          orbitSpeed={body.orbitSpeed}
          orbitRadius={body.orbitRadius}
          orbitCenter={body.orbitCenter}
          eccentricity={body.eccentricity}
          orbitTilt={body.orbitTilt}
          axialTilt={body.axialTilt}
        />
      ))}
      
      {/* Add spacecraft models */}
      <SpacecraftModel 
        id="iss"
        name="ISS"
        type="spacecraft"
        position={[0, 0, 0]}
        radius={0.5}
        rotationSpeed={0.01}
        orbitSpeed={0.6}
        orbitRadius={8}
        orbitCenter={[0, 0, 0]} /* Earth's position will be found dynamically */
        eccentricity={0.001}
        orbitTilt={0.8}
      />
      
      <SpacecraftModel 
        id="jwst"
        name="James Webb Space Telescope"
        type="spacecraft"
        position={[0, 0, 0]}
        radius={0.6}
        rotationSpeed={0.005}
        orbitSpeed={0.05}
        orbitRadius={20}
        orbitCenter={[0, 0, 0]} /* Earth's position will be found dynamically */
        eccentricity={0.1}
        orbitTilt={0.2}
      />
      
      <SpacecraftModel 
        id="voyager"
        name="Voyager"
        type="spacecraft"
        position={[0, 0, 0]}
        radius={0.4}
        rotationSpeed={0.008}
        orbitSpeed={0.01}
        orbitRadius={300}
        orbitCenter={[0, 0, 0]} // Far from the Sun
        eccentricity={0.2}
        orbitTilt={0.35}
      />
      
      {/* Original generic spacecraft model */}
      <Spacecraft position={[50, 10, 30]} />
    </>
  );
};

export default SpaceScene;
