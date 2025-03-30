import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { CelestialBodyProps } from "../lib/types";
import { useSpaceStore } from "../lib/stores/useSpaceStore";
import { calculateKeplerianPosition } from '../lib/orbital-mechanics';

// This component will render 3D models for spacecraft
const SpacecraftModel: React.FC<CelestialBodyProps> = ({
  id,
  position,
  radius = 1,
  rotationSpeed = 0.001,
  orbitSpeed = 0,
  orbitRadius = 0,
  orbitCenter = [0, 0, 0],
  eccentricity = 0,
  orbitTilt = 0
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const initialPositionRef = useRef<boolean>(false);
  
  // Get the appropriate model path based on spacecraft ID
  const getModelPath = () => {
    if (id === "iss") return `${import.meta.env.BASE_URL}models/iss.glb`;
    if (id === "jwst") return `${import.meta.env.BASE_URL}models/jwst.glb`;
    if (id === "voyager") return `${import.meta.env.BASE_URL}models/voyager.glb`;
    // Default fallback
    return `${import.meta.env.BASE_URL}models/iss.glb`;
  };

  // Load the 3D model
  const { scene: model } = useGLTF(getModelPath()) as GLTF & {
    scene: THREE.Group
  };

  // Update loading state when model is available
  useEffect(() => {
    if (model) {
      setModelLoaded(true);
      console.log(`Spacecraft model for ${id} loaded successfully`);
      
      // Scale the model appropriately
      if (groupRef.current) {
        // Scale adjustments for specific models
        if (id === "iss") {
          groupRef.current.scale.set(0.02, 0.02, 0.02);
        } else if (id === "jwst") {
          groupRef.current.scale.set(0.03, 0.03, 0.03);
        } else if (id === "voyager") {
          groupRef.current.scale.set(0.02, 0.02, 0.02);
        }
      }
    }
  }, [model, id]);

  // Get time control state
  const isPaused = useSpaceStore(state => state.isPaused);
  const timeScale = useSpaceStore(state => state.timeScale);
  const simulationTime = useSpaceStore(state => state.simulationTime);

  // Handle orbit calculation in useFrame
  useFrame((state, delta) => {
    if (!groupRef.current || !modelLoaded || isPaused) return;
    
    // Update position if orbiting
    if (orbitSpeed > 0 && orbitRadius > 0) {
      const time = simulationTime * orbitSpeed;
      
      // Calculate position using Keplerian orbit
      const params = {
        center: orbitCenter as [number, number, number],
        radius: orbitRadius,
        eccentricity: eccentricity,
        tilt: orbitTilt
      };
      
      const position = calculateKeplerianPosition(time, params);
      
      // Update position
      groupRef.current.position.copy(position);
    }
    
    // Rotate the model with time scale applied
    groupRef.current.rotation.y += rotationSpeed * delta * 5 * timeScale;
    
    // Find Earth's position for ISS and JWST
    if ((id === "iss" || id === "jwst") && orbitSpeed > 0 && orbitRadius > 0) {
      // Get Earth from the scene
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
        // Extract Earth's current position
        const earthWorldPosition = new THREE.Vector3();
        earthObject.getWorldPosition(earthWorldPosition);
        
        // Update orbit params with Earth's actual position
        const orbitParams = {
          center: [earthWorldPosition.x, earthWorldPosition.y, earthWorldPosition.z] as [number, number, number],
          radius: orbitRadius,
          eccentricity: eccentricity,
          tilt: orbitTilt
        };
        
        // Use simulation time for consistent animation with time scaling
        const time = simulationTime * orbitSpeed * 5;
        
        // Calculate position
        const position = calculateKeplerianPosition(time, orbitParams);
        
        // Update position for orbiting around Earth
        groupRef.current.position.copy(position);
        
        // Make spacecraft point in the direction of travel
        const nextPosition = calculateKeplerianPosition(time + 0.01, orbitParams);
        const direction = new THREE.Vector3(
          nextPosition.x - position.x,
          nextPosition.y - position.y,
          nextPosition.z - position.z
        ).normalize();
        
        // Set orientation based on orbital movement
        if (direction.length() > 0) {
          const lookAtPos = new THREE.Vector3(
            groupRef.current.position.x + direction.x,
            groupRef.current.position.y + direction.y,
            groupRef.current.position.z + direction.z
          );
          groupRef.current.lookAt(lookAtPos);
          
          // Additional rotation adjustments for specific spacecraft
          if (id === "iss") {
            groupRef.current.rotation.x += Math.PI / 2;
          } else if (id === "jwst") {
            groupRef.current.rotation.z += Math.PI / 4;
          }
        }
        return;
      }
    }
    
    // For other spacecraft or if Earth not found, use regular fixed orbit
    if (orbitSpeed > 0 && orbitRadius > 0) {
      const orbitParams = {
        center: orbitCenter as [number, number, number],
        radius: orbitRadius,
        eccentricity: eccentricity,
        tilt: orbitTilt
      };
      
      // On first render, position the spacecraft on its orbit path
      if (!initialPositionRef.current) {
        // Different starting angles for different spacecraft
        let initialAngle = 0;
        
        if (id === "iss") initialAngle = 0;
        else if (id === "jwst") initialAngle = 3.0;
        else if (id === "voyager") initialAngle = 5.0;
        
        // Calculate initial position using the angle
        const initialPos = calculateKeplerianPosition(initialAngle, orbitParams);
        groupRef.current.position.copy(initialPos);
        initialPositionRef.current = true;
      }
      
      // Use simulation time for consistent animation with time scaling
      const time = simulationTime * orbitSpeed * 5;
      
      // Calculate position
      const position = calculateKeplerianPosition(time, orbitParams);
      
      // Update position
      groupRef.current.position.copy(position);
      
      // Make spacecraft point in the direction of travel
      const nextPosition = calculateKeplerianPosition(time + 0.01, orbitParams);
      const direction = new THREE.Vector3(
        nextPosition.x - position.x,
        nextPosition.y - position.y,
        nextPosition.z - position.z
      ).normalize();
      
      // Set orientation based on orbital movement
      if (direction.length() > 0) {
        const lookAtPos = new THREE.Vector3(
          groupRef.current.position.x + direction.x,
          groupRef.current.position.y + direction.y,
          groupRef.current.position.z + direction.z
        );
        groupRef.current.lookAt(lookAtPos);
        
        // Additional rotation adjustments for specific spacecraft
        if (id === "iss") {
          groupRef.current.rotation.x += Math.PI / 2;
        } else if (id === "jwst") {
          groupRef.current.rotation.z += Math.PI / 4;
        }
      }
    } else {
      // If not orbiting, place at the initial position
      groupRef.current.position.set(position[0], position[1], position[2]);
    }
  });

  // Preload models
  useGLTF.preload(`${import.meta.env.BASE_URL}models/iss.glb`);
  useGLTF.preload(`${import.meta.env.BASE_URL}models/jwst.glb`);
  useGLTF.preload(`${import.meta.env.BASE_URL}models/voyager.glb`);

  // Return the 3D model
  return (
    <group ref={groupRef}>
      {modelLoaded ? (
        <primitive object={model.clone()} />
      ) : (
        // Fallback box while loading
        <mesh>
          <boxGeometry args={[radius, radius, radius]} />
          <meshStandardMaterial color="#CCCCCC" />
        </mesh>
      )}
    </group>
  );
};

export default SpacecraftModel;