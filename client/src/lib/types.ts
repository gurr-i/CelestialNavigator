export interface CelestialBodyProps {
  id: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  radius?: number;
  textureUrl?: string;
  type: "star" | "planet" | "moon" | "dwarf" | "spacecraft" | "belt";
  name: string;
  rotationSpeed?: number;
  orbitSpeed?: number;
  orbitRadius?: number;
  orbitCenter?: [number, number, number];
  eccentricity?: number;  // Orbital eccentricity (0 = circle, approaching 1 = very elliptical)
  orbitTilt?: number;     // Orbit inclination in radians
  axialTilt?: number;     // Planet's axial tilt in radians
  description?: string;
  temperature?: string;
  diameter?: number | string;  // Can be string for variable sizes like in asteroid belt
  dayLength?: string;
  yearLength?: string;
}

export interface PlanetData extends CelestialBodyProps {
  diameter?: number | string;
  dayLength?: string;
  yearLength?: string;
  temperature?: string;
  description?: string;
}
