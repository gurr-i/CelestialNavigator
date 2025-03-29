import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { 
  Stars, 
  useKeyboardControls, 
  PerspectiveCamera 
} from "@react-three/drei";
import * as THREE from "three";
import CelestialBody from "./CelestialBody";
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
  
  // Disable touchpad zooming
  useEffect(() => {
    const preventZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('wheel', preventZoom, { passive: false });
    gl.domElement.addEventListener('wheel', preventZoom, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', preventZoom);
      gl.domElement.removeEventListener('wheel', preventZoom);
    };
  }, [gl]);
  
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

  // Handle camera controls
  useFrame((state, delta) => {
    if (!cameraRef.current) return;
    
    // Update the target position for the focused body if it's orbiting
    if (focusedBody) {
      const bodyData = SOLAR_SYSTEM.find(body => body.id === focusedBody);
      if (bodyData && bodyData.orbitSpeed && bodyData.orbitRadius && bodyData.orbitCenter) {
        // Use the clock for consistent orbit animation
        const time = state.clock.getElapsedTime() * bodyData.orbitSpeed * 5;
        
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
        
        // Update the target for the camera to look at
        targetRef.current.set(x, y, z);
        
        // Store this position for other calculations
        bodyRefs.current[bodyData.id] = new THREE.Vector3(x, y, z);
      }
    }
    
    // Create a vector pointing from camera to target
    const cameraDirection = new THREE.Vector3();
    cameraDirection.subVectors(targetRef.current, cameraRef.current.position).normalize();
    
    // Create perpendicular vectors for movement
    const right = new THREE.Vector3();
    right.crossVectors(cameraDirection, cameraRef.current.up).normalize();
    
    const up = new THREE.Vector3(0, 1, 0);
    
    // Move camera based on input
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
    
    // Zoom controls
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
          
          // Get current position (may be updated from orbit)
          const bodyPosition = bodyRefs.current[bodyData.id] || 
                              new THREE.Vector3(
                                bodyData.position[0], 
                                bodyData.position[1], 
                                bodyData.position[2]
                              );
          
          cameraRef.current.position.set(
            bodyPosition.x + distance,
            bodyPosition.y + distance * 0.5,
            bodyPosition.z + distance
          );
        }
      } else {
        // Default reset position
        cameraRef.current.position.set(0, 30, 100);
      }
    }
    
    // Always look at the current target
    cameraRef.current.lookAt(targetRef.current);
    
    // Apply the same transform to the actual three.js camera
    camera.position.copy(cameraRef.current.position);
    camera.quaternion.copy(cameraRef.current.quaternion);
  });

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
      
      {/* Ambient light - increased to make planets more visible */}
      <ambientLight intensity={0.5} />
      
      {/* Sun (central bright light) - increased intensity */}
      <pointLight position={[0, 0, 0]} intensity={3} color="#FFA726" castShadow />
      
      {/* Additional lights to better illuminate dark areas */}
      <pointLight position={[100, 50, 100]} intensity={0.8} color="#FFFFFF" />
      <pointLight position={[-100, -50, -100]} intensity={0.8} color="#FFFFFF" />
      
      {/* Stars background */}
      <Stars radius={1000} depth={50} count={7000} factor={4} saturation={0} fade />
      
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
        />
      ))}
      
      {/* Add spacecraft */}
      <Spacecraft position={[50, 10, 30]} />
    </>
  );
};

export default SpaceScene;
