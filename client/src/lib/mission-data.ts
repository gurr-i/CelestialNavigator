import { calculateOrbitalPeriod, degToRad } from "./orbital-mechanics";

// Types for mission data
export interface MissionWaypoint {
  name: string;
  description: string;
  targetBody: string;  // ID of target celestial body
  orbitRadius?: number; // For orbit waypoints
  position?: [number, number, number]; // For specific position waypoints
  type: 'flyby' | 'orbit' | 'landing' | 'gravity-assist' | 'hohmann-transfer' | 'bi-elliptic-transfer';
  duration: number; // Duration at this waypoint in simulation time
  deltaV?: number; // Delta-v budget required for this waypoint
  completed?: boolean; // Whether this waypoint has been reached in the simulation
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  spacecraft: string; // ID of spacecraft to use
  difficulty: 'easy' | 'medium' | 'hard';
  startingBody: string; // ID of starting celestial body
  waypoints: MissionWaypoint[];
  totalDeltaV: number; // Total delta-v budget for mission
  totalDuration: number; // Estimated mission duration
  unlocked: boolean; // Whether this mission is available to play
  completed: boolean; // Whether the mission has been successfully completed
}

// Sample mission data
export const MISSIONS: Mission[] = [
  // Mission 1: Earth to Mars Direct Transfer
  {
    id: "earth-mars-direct",
    name: "Mars Direct",
    description: "Launch from Earth and perform a Hohmann transfer to reach Mars orbit. This is a basic interplanetary mission to understand transfer orbits.",
    spacecraft: "voyager",
    difficulty: "easy",
    startingBody: "earth",
    waypoints: [
      {
        name: "Earth Orbit",
        description: "Begin in Earth orbit at an altitude of 300km",
        targetBody: "earth",
        orbitRadius: 71.5, // Earth radius (4) + 300km in simulation units
        type: "orbit",
        duration: 10
      },
      {
        name: "Trans-Mars Injection",
        description: "Perform a Hohmann transfer burn to leave Earth orbit and enter a Mars transfer orbit",
        targetBody: "mars",
        type: "hohmann-transfer",
        deltaV: 3.6,
        duration: 120
      },
      {
        name: "Mars Orbit Insertion",
        description: "Perform a capture burn to enter Mars orbit",
        targetBody: "mars",
        orbitRadius: 93.5, // Mars radius (3.5) + 300km in simulation units
        type: "orbit",
        deltaV: 2.1,
        duration: 30
      }
    ],
    totalDeltaV: 5.7,
    totalDuration: 160,
    unlocked: true,
    completed: false
  },
  
  // Mission 2: Gravity Assist with Venus to reach Mercury
  {
    id: "venus-mercury-assist",
    name: "Inner System Explorer",
    description: "Use a Venus gravity assist to reduce the delta-v required to reach Mercury. This mission demonstrates how gravity assists can save fuel.",
    spacecraft: "jwst", // Using JWST for this simulation
    difficulty: "medium",
    startingBody: "earth",
    waypoints: [
      {
        name: "Earth Departure",
        description: "Launch from Earth and enter a Venus transfer orbit",
        targetBody: "venus",
        type: "hohmann-transfer",
        deltaV: 3.5,
        duration: 80
      },
      {
        name: "Venus Gravity Assist",
        description: "Perform a close flyby of Venus to alter trajectory and gain velocity",
        targetBody: "venus",
        type: "gravity-assist",
        duration: 10
      },
      {
        name: "Mercury Transfer",
        description: "After the gravity assist, coast to Mercury",
        targetBody: "mercury",
        type: "flyby",
        duration: 100
      },
      {
        name: "Mercury Orbit Insertion",
        description: "Enter orbit around Mercury",
        targetBody: "mercury",
        orbitRadius: 37, // Mercury radius (2) + orbit altitude
        type: "orbit",
        deltaV: 2.8,
        duration: 30
      }
    ],
    totalDeltaV: 6.3,
    totalDuration: 220,
    unlocked: false,
    completed: false
  },
  
  // Mission 3: Grand Tour of Outer Planets
  {
    id: "grand-tour",
    name: "Grand Tour",
    description: "Follow in the footsteps of Voyager with a 'Grand Tour' of the outer planets, using multiple gravity assists. This advanced mission shows how the actual Voyager missions were designed.",
    spacecraft: "voyager",
    difficulty: "hard",
    startingBody: "earth",
    waypoints: [
      {
        name: "Earth Departure",
        description: "Launch from Earth toward Jupiter",
        targetBody: "jupiter",
        type: "hohmann-transfer",
        deltaV: 6.4,
        duration: 400
      },
      {
        name: "Jupiter Flyby",
        description: "Perform a gravity assist at Jupiter to boost velocity",
        targetBody: "jupiter",
        type: "gravity-assist",
        duration: 20
      },
      {
        name: "Saturn Flyby",
        description: "Use Saturn for an additional gravity assist",
        targetBody: "saturn",
        type: "gravity-assist",
        duration: 800
      },
      {
        name: "Uranus Flyby",
        description: "Continue to Uranus for scientific observations",
        targetBody: "uranus",
        type: "flyby",
        duration: 1200
      },
      {
        name: "Neptune Flyby",
        description: "Final planetary encounter at Neptune",
        targetBody: "neptune",
        type: "flyby",
        duration: 1400
      },
      {
        name: "Interstellar Space",
        description: "Exit the solar system into interstellar space",
        targetBody: "sun", // Using sun as reference
        position: [500, 0, 500], // Far point outside the solar system
        type: "flyby",
        duration: 1000
      }
    ],
    totalDeltaV: 6.4, // Main delta-v is just the initial boost, gravity assists do the rest
    totalDuration: 4820,
    unlocked: false,
    completed: false
  }
];

// Helper function to get a mission by ID
export function getMission(id: string): Mission | undefined {
  return MISSIONS.find(mission => mission.id === id);
}

// Calculate orbital parameters for a mission waypoint
export function getWaypointOrbitalParams(waypoint: MissionWaypoint, referenceBodyPosition: [number, number, number]) {
  // For orbit waypoints
  if (waypoint.type === 'orbit' && waypoint.orbitRadius) {
    return {
      center: referenceBodyPosition as [number, number, number],
      semiMajorAxis: waypoint.orbitRadius,
      eccentricity: 0.01, // Near circular orbit
      inclination: degToRad(15), // Some inclination for visibility
      longitudeOfAscendingNode: degToRad(30),
      argumentOfPeriapsis: degToRad(0),
      period: calculateOrbitalPeriod(waypoint.orbitRadius),
      startTime: 0
    };
  }
  
  // For hohmann transfer waypoints, we'd need source and destination radii
  // This is simplified - in a full implementation we'd have more parameters
  return {
    center: [0, 0, 0] as [number, number, number], // Simplified - would normally calculate actual transfer orbit
    semiMajorAxis: 100,
    eccentricity: 0.3,
    inclination: degToRad(5),
    longitudeOfAscendingNode: degToRad(0),
    argumentOfPeriapsis: degToRad(0),
    period: calculateOrbitalPeriod(100),
    startTime: 0
  };
}