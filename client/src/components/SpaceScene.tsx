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

  // Update camera target when focused body changes
  useEffect(() => {
    if (focusedBody) {
      const bodyData = SOLAR_SYSTEM.find(body => body.id === focusedBody);
      if (bodyData) {
        // Account for the body's current orbital position
        if (bodyData.orbitRadius && bodyData.orbitSpeed && bodyData.orbitCenter) {
          const time = Date.now() * bodyData.orbitSpeed * 0.001;
          const x = bodyData.orbitCenter[0] + Math.cos(time) * bodyData.orbitRadius;
          const z = bodyData.orbitCenter[2] + Math.sin(time) * bodyData.orbitRadius;
          targetRef.current.set(x, bodyData.position[1], z);
        } else {
          targetRef.current.set(
            bodyData.position[0],
            bodyData.position[1],
            bodyData.position[2]
          );
        }
        
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
  useFrame((_, delta) => {
    if (!cameraRef.current) return;
    
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
          
          // Calculate the current position of orbiting bodies
          let posX = bodyData.position[0];
          let posZ = bodyData.position[2];
          
          if (bodyData.orbitRadius && bodyData.orbitSpeed && bodyData.orbitCenter) {
            const time = Date.now() * bodyData.orbitSpeed * 0.001;
            posX = bodyData.orbitCenter[0] + Math.cos(time) * bodyData.orbitRadius;
            posZ = bodyData.orbitCenter[2] + Math.sin(time) * bodyData.orbitRadius;
          }
          
          cameraRef.current.position.set(
            posX + distance,
            bodyData.position[1] + distance * 0.5,
            posZ + distance
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
      
      {/* Ambient light */}
      <ambientLight intensity={0.2} />
      
      {/* Sun (central bright light) */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#FFA726" castShadow />
      
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
