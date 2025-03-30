/**
 * Orbital Mechanics Utility Functions
 * This module provides functions for calculating orbital parameters and trajectories
 * based on Keplerian orbital mechanics.
 */

import * as THREE from "three";

// Gravitational constant G times the Sun's mass (μ = GM)
// For simulation purposes, scaled down
export const GRAVITATIONAL_PARAMETER = 100000;

/**
 * Calculate orbital velocity for a circular orbit 
 * @param radius - Distance from central body (semi-major axis)
 * @param centralMass - Mass of the central body (usually the Sun)
 * @returns Orbital velocity in simulation units
 */
export function calculateCircularOrbitVelocity(radius: number, centralMass: number = GRAVITATIONAL_PARAMETER): number {
  return Math.sqrt(centralMass / radius);
}

/**
 * Calculate the orbital period based on semi-major axis (Kepler's Third Law)
 * @param semiMajorAxis - The semi-major axis of the orbit
 * @param centralMass - Mass of the central body (usually the Sun)
 * @returns Orbital period in simulation time units
 */
export function calculateOrbitalPeriod(semiMajorAxis: number, centralMass: number = GRAVITATIONAL_PARAMETER): number {
  return 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / centralMass);
}

/**
 * Calculate position on an elliptical orbit at a specific time
 * @param time - Current time in simulation units
 * @param params - Orbital parameters
 * @returns Position vector in 3D space
 */
export function calculateEllipticalPosition(time: number, params: {
  center: [number, number, number], // Center of orbit
  semiMajorAxis: number,           // Semi-major axis
  eccentricity: number,            // Eccentricity (0 = circle, <1 = ellipse)
  inclination: number,             // Orbital inclination (radians)
  longitudeOfAscendingNode: number, // Longitude of ascending node (radians)
  argumentOfPeriapsis: number,     // Argument of periapsis (radians)
  period: number,                  // Orbital period (used to normalize time)
  startTime?: number               // Optional start time offset
}): THREE.Vector3 {
  const { 
    center, 
    semiMajorAxis, 
    eccentricity, 
    inclination, 
    longitudeOfAscendingNode, 
    argumentOfPeriapsis, 
    period,
    startTime = 0
  } = params;

  // Calculate mean anomaly (M) - this grows linearly with time
  const meanAnomaly = 2 * Math.PI * ((time - startTime) % period) / period;
  
  // Solve Kepler's equation to get eccentric anomaly (E)
  // M = E - e * sin(E)
  // Using a simple iterative solver
  let eccentricAnomaly = meanAnomaly;
  for (let i = 0; i < 10; i++) {
    eccentricAnomaly = meanAnomaly + eccentricity * Math.sin(eccentricAnomaly);
  }
  
  // Calculate position in orbital plane (2D)
  const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
  const xPrime = semiMajorAxis * (Math.cos(eccentricAnomaly) - eccentricity);
  const yPrime = semiMinorAxis * Math.sin(eccentricAnomaly);
  
  // Rotate from orbital plane to reference plane
  // 1. Rotate by argument of periapsis in orbital plane
  const xOrbit = xPrime * Math.cos(argumentOfPeriapsis) - yPrime * Math.sin(argumentOfPeriapsis);
  const yOrbit = xPrime * Math.sin(argumentOfPeriapsis) + yPrime * Math.cos(argumentOfPeriapsis);
  
  // 2. Rotate by inclination around the x-axis
  const x = xOrbit;
  const y = yOrbit * Math.cos(inclination);
  const z = yOrbit * Math.sin(inclination);
  
  // 3. Rotate by longitude of ascending node around the z-axis
  const xFinal = center[0] + x * Math.cos(longitudeOfAscendingNode) - y * Math.sin(longitudeOfAscendingNode);
  const yFinal = center[1] + x * Math.sin(longitudeOfAscendingNode) + y * Math.cos(longitudeOfAscendingNode);
  const zFinal = center[2] + z;
  
  return new THREE.Vector3(xFinal, yFinal, zFinal);
}

/**
 * Calculate the Hohmann Transfer orbit parameters
 * @param r1 - Radius of starting orbit
 * @param r2 - Radius of target orbit
 * @param centralMass - Mass of the central body
 * @returns Object containing transfer orbit data
 */
export function calculateHohmannTransfer(r1: number, r2: number, centralMass: number = GRAVITATIONAL_PARAMETER) {
  // Calculate semi-major axis of transfer orbit
  const a = (r1 + r2) / 2;
  
  // Calculate velocities
  const v1 = calculateCircularOrbitVelocity(r1, centralMass);
  const v2 = calculateCircularOrbitVelocity(r2, centralMass);
  
  // Calculate velocities on transfer orbit
  const vTransfer1 = Math.sqrt(centralMass * (2/r1 - 1/a));
  const vTransfer2 = Math.sqrt(centralMass * (2/r2 - 1/a));
  
  // Calculate delta-v requirements
  const deltaV1 = Math.abs(vTransfer1 - v1);
  const deltaV2 = Math.abs(v2 - vTransfer2);
  const totalDeltaV = deltaV1 + deltaV2;
  
  // Calculate transfer time (half of the orbit period)
  const transferTime = Math.PI * Math.sqrt(Math.pow(a, 3) / centralMass);
  
  return {
    semiMajorAxis: a,
    transferTime,
    deltaV1,
    deltaV2,
    totalDeltaV,
    eccentricity: (r2 - r1) / (r2 + r1) // Eccentricity of transfer orbit
  };
}

/**
 * Calculate points for a trajectory path
 * @param params - Orbital parameters
 * @param points - Number of points to calculate
 * @returns Array of Vector3 points forming the trajectory
 */
export function calculateTrajectoryPath(params: {
  center: [number, number, number],
  semiMajorAxis: number,
  eccentricity: number,
  inclination: number,
  longitudeOfAscendingNode: number,
  argumentOfPeriapsis: number,
  period: number,
  startTime?: number
}, points: number = 100): THREE.Vector3[] {
  const path: THREE.Vector3[] = [];
  const period = params.period;
  
  for (let i = 0; i <= points; i++) {
    const time = (i / points) * period;
    const position = calculateEllipticalPosition(time, params);
    path.push(position);
  }
  
  return path;
}

/**
 * Calculate a gravity assist trajectory (simplified model)
 * @param v1 - Incoming velocity vector
 * @param planet - Planet being used for gravity assist
 * @param closestApproach - Distance of closest approach (as fraction of planet radius)
 * @returns New velocity vector after gravity assist
 */
export function calculateGravityAssist(
  v1: THREE.Vector3, 
  planetMass: number, 
  planetRadius: number,
  closestApproach: number = 1.5
): THREE.Vector3 {
  // Simplified model of gravitational slingshot
  // In reality, this is much more complex and depends on detailed planetary parameters
  
  const speed = v1.length();
  // Turning angle depends on closest approach and planet mass
  const turnAngle = Math.atan(planetMass / (closestApproach * planetRadius * speed * speed));
  
  // Create a rotation matrix to apply the turn
  // This is simplified - in reality the plane of deflection depends on the approach geometry
  const rotationAxis = new THREE.Vector3(0, 1, 0).cross(v1).normalize();
  
  // Clone the incoming velocity and apply the rotation
  const v2 = v1.clone();
  v2.applyAxisAngle(rotationAxis, turnAngle);
  
  // The speed increases slightly due to the planet's orbital motion
  // This is a simplified model - real gravity assists are more complex
  v2.multiplyScalar(1.1);
  
  return v2;
}

/**
 * Calculate a bi-elliptic transfer (for larger orbit changes)
 * @param r1 - Radius of starting orbit
 * @param r2 - Radius of target orbit 
 * @param rIntermediate - Radius of intermediate point (should be much larger than both r1 and r2)
 * @returns Object containing transfer data
 */
export function calculateBiEllipticTransfer(
  r1: number, 
  r2: number, 
  rIntermediate: number, 
  centralMass: number = GRAVITATIONAL_PARAMETER
) {
  // For significant orbit changes, bi-elliptic transfers can be more efficient than Hohmann
  
  // First elliptical orbit (from r1 to rIntermediate)
  const a1 = (r1 + rIntermediate) / 2;
  const v1 = calculateCircularOrbitVelocity(r1, centralMass);
  const vTransfer1 = Math.sqrt(centralMass * (2/r1 - 1/a1));
  const deltaV1 = Math.abs(vTransfer1 - v1);
  
  // At rIntermediate
  const vIntermediate1 = Math.sqrt(centralMass * (2/rIntermediate - 1/a1));
  
  // Second elliptical orbit (from rIntermediate to r2)
  const a2 = (rIntermediate + r2) / 2;
  const vIntermediate2 = Math.sqrt(centralMass * (2/rIntermediate - 1/a2));
  const v2 = calculateCircularOrbitVelocity(r2, centralMass);
  const vTransfer2 = Math.sqrt(centralMass * (2/r2 - 1/a2));
  
  // Delta-v at rIntermediate and arrival
  const deltaVIntermediate = Math.abs(vIntermediate2 - vIntermediate1);
  const deltaV2 = Math.abs(v2 - vTransfer2);
  
  // Total delta-v and transfer times
  const totalDeltaV = deltaV1 + deltaVIntermediate + deltaV2;
  const transferTime1 = Math.PI * Math.sqrt(Math.pow(a1, 3) / centralMass);
  const transferTime2 = Math.PI * Math.sqrt(Math.pow(a2, 3) / centralMass);
  const totalTransferTime = transferTime1 + transferTime2;
  
  return {
    firstSemiMajorAxis: a1,
    secondSemiMajorAxis: a2,
    totalTransferTime,
    transferTime1,
    transferTime2,
    deltaV1,
    deltaVIntermediate,
    deltaV2,
    totalDeltaV,
    firstEccentricity: (rIntermediate - r1) / (rIntermediate + r1),
    secondEccentricity: (rIntermediate - r2) / (rIntermediate + r2)
  };
}

/**
 * Calculate position on elliptical orbit using simplified Kepler's laws
 * @param time Current time or angle
 * @param params Object containing orbital parameters
 * @returns Position as THREE.Vector3
 */
export function calculateKeplerianPosition(time: number, params: {
  center: [number, number, number],
  radius: number,
  eccentricity: number,
  tilt: number
}): THREE.Vector3 {
  const { center, radius, eccentricity, tilt } = params;
  
  // Mean anomaly (changes linearly with time)
  const M = time % (Math.PI * 2);
  
  // Solve Kepler's equation to get eccentric anomaly (E)
  // M = E - e * sin(E)
  let E = M; // Initial guess
  
  // Newton-Raphson iteration to find E
  for(let i = 0; i < 5; i++) {
    const E_next = E - (E - eccentricity * Math.sin(E) - M) / (1 - eccentricity * Math.cos(E));
    if (Math.abs(E_next - E) < 1e-6) break; // Convergence check
    E = E_next;
  }
  
  // Convert eccentric anomaly to true anomaly (f)
  const cos_f = (Math.cos(E) - eccentricity) / (1 - eccentricity * Math.cos(E));
  const sin_f = (Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(E)) / (1 - eccentricity * Math.cos(E));
  const f = Math.atan2(sin_f, cos_f);
  
  // Calculate distance from focus (r)
  const r = radius * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(f));
  
  // Position in orbital plane
  const x = center[0] + r * Math.cos(f);
  const y = 0;
  const z = center[2] + r * Math.sin(f);
  
  // Apply orbital inclination (tilt)
  const y_rotated = y * Math.cos(tilt) - z * Math.sin(tilt);
  const z_rotated = y * Math.sin(tilt) + z * Math.cos(tilt);
  
  return new THREE.Vector3(x, y_rotated, z_rotated);
}

// Utility to convert an angle in degrees to radians
export function degToRad(degrees: number): number {
  return degrees * Math.PI / 180;
}

// Utility to convert an angle in radians to degrees
export function radToDeg(radians: number): number {
  return radians * 180 / Math.PI;
}