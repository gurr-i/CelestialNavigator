import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { calculateTrajectoryPath } from "../lib/orbital-mechanics";
import { MissionWaypoint, getWaypointOrbitalParams } from "../lib/mission-data";
import { SOLAR_SYSTEM } from "../assets/planet-data";

interface MissionTrajectoryProps {
  waypointIndex: number;
  waypoints: MissionWaypoint[];
  missionTime: number;
  isActive: boolean;
  color?: string;
}

const MissionTrajectory: React.FC<MissionTrajectoryProps> = ({
  waypointIndex,
  waypoints,
  missionTime,
  isActive,
  color = "#FFA726" // Default to solar orange
}) => {
  const trajectoryRef = useRef<any>();
  const spacecraftRef = useRef<THREE.Group>(null);
  const [trajectoryPoints, setTrajectoryPoints] = useState<THREE.Vector3[]>([]);
  const [currentPosition, setCurrentPosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  
  // Time parameters for animation
  const startTimeRef = useRef<number>(0);
  const waypointDurationRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  
  // Get source and target positions for the current waypoint
  useEffect(() => {
    if (waypointIndex >= waypoints.length) return;
    
    const currentWaypoint = waypoints[waypointIndex];
    
    // Find celestial body references
    const targetBody = SOLAR_SYSTEM.find(body => body.id === currentWaypoint.targetBody);
    
    if (!targetBody) {
      console.error(`Target body not found: ${currentWaypoint.targetBody}`);
      return;
    }
    
    // Reset elapsed time when waypoint changes
    startTimeRef.current = missionTime;
    waypointDurationRef.current = currentWaypoint.duration;
    
    // For orbit waypoints, calculate a circular/elliptical orbit
    if (currentWaypoint.type === 'orbit' && currentWaypoint.orbitRadius) {
      const orbitParams = getWaypointOrbitalParams(
        currentWaypoint, 
        targetBody.position
      );
      
      // Calculate points along the orbit
      const points = calculateTrajectoryPath(orbitParams, 100);
      setTrajectoryPoints(points);
      
      // Set initial position
      setCurrentPosition(points[0]);
    }
    // For transfer waypoints, calculate transfer orbit
    else if (currentWaypoint.type === 'hohmann-transfer') {
      // Determine previous and next bodies
      const prevBodyId = waypointIndex > 0 
        ? waypoints[waypointIndex - 1].targetBody 
        : waypoints[0].targetBody;
      
      const prevBody = SOLAR_SYSTEM.find(body => body.id === prevBodyId);
      
      if (!prevBody) {
        console.error(`Previous body not found: ${prevBodyId}`);
        return;
      }
      
      // Simplified transfer orbit
      const r1 = prevBody.orbitRadius || Math.sqrt(prevBody.position[0] * prevBody.position[0] + prevBody.position[2] * prevBody.position[2]);
      const r2 = targetBody.orbitRadius || Math.sqrt(targetBody.position[0] * targetBody.position[0] + targetBody.position[2] * targetBody.position[2]);
      
      const semiMajorAxis = (r1 + r2) / 2;
      const eccentricity = Math.abs(r2 - r1) / (r2 + r1);
      
      // Calculate transfer orbit path
      const transferParams = {
        center: [0, 0, 0] as [number, number, number],
        semiMajorAxis,
        eccentricity,
        inclination: Math.atan2(targetBody.position[1] - prevBody.position[1], 
                             Math.sqrt(Math.pow(targetBody.position[0] - prevBody.position[0], 2) + 
                                      Math.pow(targetBody.position[2] - prevBody.position[2], 2))),
        longitudeOfAscendingNode: Math.atan2(targetBody.position[2] - prevBody.position[2], 
                                          targetBody.position[0] - prevBody.position[0]),
        argumentOfPeriapsis: 0,
        period: currentWaypoint.duration * 2, // Full orbit would be twice the transfer time
        startTime: 0
      };
      
      const points = calculateTrajectoryPath(transferParams, 100);
      setTrajectoryPoints(points);
      
      // Set initial position
      setCurrentPosition(points[0]);
    }
    // For gravity assists
    else if (currentWaypoint.type === 'gravity-assist') {
      // For now, using simplified path - a curved trajectory around the planet
      const points: THREE.Vector3[] = [];
      
      // Create an arc around the planet
      const radius = targetBody.radius ? targetBody.radius * 1.5 : 5;
      const center = new THREE.Vector3(targetBody.position[0], targetBody.position[1], targetBody.position[2]);
      
      for (let i = 0; i <= 100; i++) {
        const angle = (i / 100) * Math.PI; // Half circle
        const x = center.x + radius * Math.cos(angle);
        const z = center.z + radius * Math.sin(angle);
        const y = center.y + (radius * Math.sin(angle)) * 0.2; // Slight inclination
        
        points.push(new THREE.Vector3(x, y, z));
      }
      
      setTrajectoryPoints(points);
      setCurrentPosition(points[0]);
    }
    // For flyby waypoints, create a path that passes by the target
    else if (currentWaypoint.type === 'flyby') {
      // Start at current position and create a path that passes near the target
      let startPos = new THREE.Vector3(0, 0, 0);
      if (waypointIndex > 0) {
        const prevBody = SOLAR_SYSTEM.find(body => body.id === waypoints[waypointIndex - 1].targetBody);
        if (prevBody) {
          startPos = new THREE.Vector3(prevBody.position[0], prevBody.position[1], prevBody.position[2]);
        }
      }
      
      const endPos = new THREE.Vector3(targetBody.position[0], targetBody.position[1], targetBody.position[2]);
      const dist = startPos.distanceTo(endPos);
      const points: THREE.Vector3[] = [];
      
      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        // Create a slight curve to the path
        const x = startPos.x + (endPos.x - startPos.x) * t;
        const z = startPos.z + (endPos.z - startPos.z) * t;
        const y = startPos.y + (endPos.y - startPos.y) * t + Math.sin(t * Math.PI) * (dist * 0.1);
        
        points.push(new THREE.Vector3(x, y, z));
      }
      
      setTrajectoryPoints(points);
      setCurrentPosition(points[0]);
    }
    // For custom position waypoints
    else if (currentWaypoint.position) {
      let startPos = new THREE.Vector3(0, 0, 0);
      if (waypointIndex > 0) {
        const prevBody = SOLAR_SYSTEM.find(body => body.id === waypoints[waypointIndex - 1].targetBody);
        if (prevBody) {
          startPos = new THREE.Vector3(prevBody.position[0], prevBody.position[1], prevBody.position[2]);
        }
      }
      
      const endPos = new THREE.Vector3(
        currentWaypoint.position[0], 
        currentWaypoint.position[1], 
        currentWaypoint.position[2]
      );
      
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const pos = new THREE.Vector3().lerpVectors(startPos, endPos, t);
        points.push(pos);
      }
      
      setTrajectoryPoints(points);
      setCurrentPosition(points[0]);
    }
  }, [waypointIndex, waypoints]);
  
  // Update spacecraft position along trajectory
  useFrame((state) => {
    if (!isActive || trajectoryPoints.length === 0 || !spacecraftRef.current) return;
    
    // Update elapsed time
    elapsedTimeRef.current = missionTime - startTimeRef.current;
    
    // Calculate how far along the path we are (0 to 1)
    const progress = Math.min(1, elapsedTimeRef.current / waypointDurationRef.current);
    
    // Find position along path
    const index = Math.floor(progress * (trajectoryPoints.length - 1));
    const remainder = progress * (trajectoryPoints.length - 1) - index;
    
    if (index < trajectoryPoints.length - 1) {
      // Interpolate between points
      const currentPoint = trajectoryPoints[index];
      const nextPoint = trajectoryPoints[index + 1];
      
      const newPosition = new THREE.Vector3().lerpVectors(
        currentPoint,
        nextPoint,
        remainder
      );
      
      setCurrentPosition(newPosition);
      
      // Update spacecraft position
      spacecraftRef.current.position.copy(newPosition);
      
      // Make spacecraft face the direction of travel
      if (index < trajectoryPoints.length - 2) {
        const lookAtPoint = trajectoryPoints[index + 2]; // Look ahead
        spacecraftRef.current.lookAt(lookAtPoint);
      }
    }
  });
  
  return (
    <group>
      {/* Visualize the trajectory path */}
      {trajectoryPoints.length > 0 && (
        <Line
          ref={trajectoryRef}
          points={trajectoryPoints}
          color={isActive ? color : "#444444"}
          lineWidth={isActive ? 2 : 1}
          opacity={isActive ? 1 : 0.5}
          transparent={!isActive}
          dashed={!isActive}
        />
      )}
      
      {/* Spacecraft indicator (only shown for active waypoint) */}
      {isActive && (
        <group ref={spacecraftRef} position={currentPosition}>
          {/* Simple indicator for the spacecraft position */}
          <mesh>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default MissionTrajectory;