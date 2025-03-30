import { PlanetData } from "../lib/types";

export const SOLAR_SYSTEM: PlanetData[] = [
  // Sun
  {
    id: "sun",
    name: "Sun",
    type: "star",
    position: [0, 0, 0],
    radius: 20,
    rotationSpeed: 0.001,
    textureUrl: "/textures/sun.jpg",
    diameter: 1392700,
    temperature: "5,500°C (surface), 15,000,000°C (core)",
    description: "The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core."
  },
  
  // Mercury
  {
    id: "mercury",
    name: "Mercury",
    type: "planet",
    position: [35, 0, 0],
    radius: 1.74, // 38% of Earth's radius (Earth = 4.6)
    rotationSpeed: 0.0005,
    orbitSpeed: 0.15,     // Faster for better visualization
    orbitRadius: 35,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.205,  // Mercury has the highest eccentricity of the Solar System planets
    orbitTilt: 0.1222,    // 7 degrees in radians
    axialTilt: 0.0017,    // 0.03 degrees - negligible axial tilt
    textureUrl: "/textures/planets/mercury.jpg",
    diameter: 4879,
    dayLength: "58.7 Earth days",
    yearLength: "88 Earth days",
    temperature: "-173°C to 427°C",
    description: "Mercury is the smallest and innermost planet in the Solar System. It has the most eccentric orbit of all planets, creating a notably elliptical path."
  },
  
  // Venus
  {
    id: "venus",
    name: "Venus",
    type: "planet",
    position: [50, 0, 0],
    radius: 4.35, // 95% of Earth's radius
    rotationSpeed: -0.0002, // Retrograde rotation (negative value)
    orbitSpeed: 0.12,     // Faster for better visualization
    orbitRadius: 50,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.007,  // Venus has a nearly circular orbit
    orbitTilt: 0.0594,    // 3.4 degrees in radians
    axialTilt: 3.0963,    // 177.4 degrees - retrograde rotation
    textureUrl: "/textures/planets/venus.jpg",
    diameter: 12104,
    dayLength: "243 Earth days",
    yearLength: "225 Earth days",
    temperature: "462°C (average)",
    description: "Venus is the second planet from the Sun and the hottest planet in our solar system. It rotates in the opposite direction to most planets."
  },
  
  // Earth
  {
    id: "earth",
    name: "Earth",
    type: "planet",
    position: [70, 0, 0],
    radius: 4.6, // Reference size (slightly increased from 4.0)
    rotationSpeed: 0.01,   // Faster rotation to be visible
    orbitSpeed: 0.1,      // Faster for better visualization
    orbitRadius: 70,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.017,  // Earth's orbit is slightly elliptical
    orbitTilt: 0.0,       // Reference plane
    axialTilt: 0.4101,    // 23.5 degrees axial tilt
    textureUrl: "/textures/planets/earth.jpg",
    diameter: 12756,
    dayLength: "24 hours",
    yearLength: "365.25 days",
    temperature: "-88°C to 58°C",
    description: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. Its 23.5° axial tilt causes seasons."
  },
  
  // Moon
  {
    id: "moon",
    name: "Moon",
    type: "moon",
    position: [0, 0, 0], // Position will be dynamically set based on Earth
    radius: 1.26, // 27.3% of Earth's radius (Earth = 4.6)
    rotationSpeed: 0.000001, // Moon is tidally locked - very slow rotation
    orbitSpeed: 0.1, // Synchronized with lunar month (about 27.3 days)
    orbitRadius: 10, // Set to match average Earth-Moon distance scaled down
    orbitCenter: [0, 0, 0], // Will be dynamically updated to Earth's position
    eccentricity: 0.0549, // Moon's actual orbital eccentricity
    orbitTilt: 0.089, // 5.14 degrees inclination to ecliptic
    axialTilt: 0.116, // 6.68 degrees axial tilt relative to its orbital plane
    textureUrl: "/textures/planets/moon.jpg",
    diameter: 3475,
    dayLength: "29.5 Earth days",
    temperature: "-173°C to 127°C",
    description: "The Moon is Earth's only natural satellite. It is tidally locked to Earth, meaning the same side always faces us."
  },
  
  // Mars
  {
    id: "mars",
    name: "Mars",
    type: "planet",
    position: [90, 0, 0],
    radius: 2.45, // 53% of Earth's radius
    rotationSpeed: 0.01,   // Similar to Earth
    orbitSpeed: 0.08,     // Faster for better visualization
    orbitRadius: 90,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.094,  // Mars has a moderately elliptical orbit
    orbitTilt: 0.0323,    // 1.85 degrees in radians
    axialTilt: 0.4398,    // 25.2 degrees axial tilt
    textureUrl: "/textures/planets/mars.jpg",
    diameter: 6792,
    dayLength: "24.6 hours",
    yearLength: "687 Earth days",
    temperature: "-153°C to 20°C",
    description: "Mars is the fourth planet from the Sun. Its reddish appearance is due to iron oxide (rust) on its surface. Its axial tilt is similar to Earth's."
  },
  
  // Jupiter
  {
    id: "jupiter",
    name: "Jupiter",
    type: "planet",
    position: [130, 0, 0],
    radius: 11.2, // 11.2 times Earth's radius
    rotationSpeed: 0.02,   // Fast rotation (Jupiter rotates quickly)
    orbitSpeed: 0.06,     // Adjusted for better visualization
    orbitRadius: 130,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.049,  // Jupiter's eccentricity
    orbitTilt: 0.0227,    // 1.3 degrees
    axialTilt: 0.0546,    // 3.13 degrees
    textureUrl: "/textures/planets/jupiter.jpg",
    diameter: 142984,
    dayLength: "9.9 hours",
    yearLength: "11.9 Earth years",
    temperature: "-145°C (cloud tops)",
    description: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. Its fast rotation causes a visible equatorial bulge."
  },
  
  // Saturn
  {
    id: "saturn",
    name: "Saturn",
    type: "planet",
    position: [170, 0, 0],
    radius: 9.45, // 9.45 times Earth's radius
    rotationSpeed: 0.018,  // Fast rotation
    orbitSpeed: 0.04,     // Adjusted for better visualization
    orbitRadius: 170,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.057,  // Saturn's eccentricity
    orbitTilt: 0.0435,    // 2.49 degrees
    axialTilt: 0.466,     // 26.7 degrees - will affect ring orientation
    textureUrl: "/textures/planets/saturn.jpg",
    diameter: 120536,
    dayLength: "10.7 hours",
    yearLength: "29.5 Earth years",
    temperature: "-178°C (cloud tops)",
    description: "Saturn is the sixth planet from the Sun, known for its spectacular ring system. Like Jupiter, it's a gas giant with a fast rotation period."
  },
  
  // Uranus
  {
    id: "uranus",
    name: "Uranus",
    type: "planet",
    position: [200, 0, 0],
    radius: 4.0, // 4.0 times Earth's radius
    rotationSpeed: 0.012,  // Uranus has a unique rotation (on its side)
    orbitSpeed: 0.03,     // Adjusted for better visualization
    orbitRadius: 200,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.046,  // Uranus's eccentricity
    orbitTilt: 0.0134,    // 0.77 degrees
    axialTilt: 1.7064,    // 97.8 degrees (extreme tilt, rotates on its side)
    textureUrl: "/textures/planets/uranus.jpg",
    diameter: 51118,
    dayLength: "17.2 hours",
    yearLength: "84 Earth years",
    temperature: "-224°C (cloud tops)",
    description: "Uranus is the seventh planet from the Sun. Its extreme axial tilt of 98 degrees means it essentially rotates on its side, likely due to a massive collision."
  },
  
  // Neptune
  {
    id: "neptune",
    name: "Neptune",
    type: "planet",
    position: [230, 0, 0],
    radius: 3.88, // 3.88 times Earth's radius
    rotationSpeed: 0.014,
    orbitSpeed: 0.025,    // Adjusted for better visualization
    orbitRadius: 230,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.011,  // Neptune's eccentricity
    orbitTilt: 0.0309,    // 1.77 degrees
    axialTilt: 0.4939,    // 28.3 degrees
    textureUrl: "/textures/planets/neptune.jpg",
    diameter: 49528,
    dayLength: "16.1 hours",
    yearLength: "165 Earth years",
    temperature: "-218°C (cloud tops)",
    description: "Neptune is the eighth and farthest known planet from the Sun. Despite being smaller than Uranus, it's more massive and has the strongest winds in the Solar System."
  },
  
  // Pluto (Dwarf Planet)
  {
    id: "pluto",
    name: "Pluto",
    type: "dwarf",
    position: [260, 0, 0],
    radius: 0.19, // 0.19 times Earth's radius
    rotationSpeed: 0.006,
    orbitSpeed: 0.02,     // Adjusted for better visualization
    orbitRadius: 260,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.244,  // Pluto has a highly eccentric orbit
    orbitTilt: 0.2967,    // 17 degrees (highest inclination)
    axialTilt: 2.0856,    // 119.5 degrees (extreme tilt)
    textureUrl: "/textures/planets/pluto.jpg",
    diameter: 2376,
    dayLength: "6.4 Earth days",
    yearLength: "248 Earth years",
    temperature: "-240°C (average)",
    description: "Pluto is a dwarf planet with the most eccentric and inclined orbit of the former planets. Its orbit is so elliptical that it sometimes comes closer to the Sun than Neptune."
  },
  
  // International Space Station
  {
    id: "iss",
    name: "International Space Station",
    type: "spacecraft",
    position: [70, 6, 0],
    radius: 0.4,         // Increased to be visible with placeholder model
    rotationSpeed: 0.02,
    orbitSpeed: 1.5,      // Much faster orbit (low Earth orbit)
    orbitRadius: 7,       // Closer to Earth but visibly separate
    orbitCenter: [0, 0, 0], // Will be dynamically updated to Earth's position
    eccentricity: 0.0003, // Nearly circular orbit
    orbitTilt: 0.9,       // 51.6 degrees (ISS orbital inclination)
    description: "The International Space Station is a modular space station in low Earth orbit with an inclination of 51.6 degrees, completing an orbit every 90 minutes."
  },
  
  // James Webb Space Telescope
  {
    id: "jwst",
    name: "James Webb Telescope",
    type: "spacecraft",
    position: [100, 10, 30],
    radius: 0.6,         // Increased to be visible with placeholder model
    rotationSpeed: 0.01,
    orbitSpeed: 0.4,     // Increased for better visibility of movement
    orbitRadius: 25,      // Located at Earth-Sun L2 point
    orbitCenter: [0, 0, 0], // Will be dynamically updated to Earth's L2 point
    eccentricity: 0.0035, // Nearly circular 'halo' orbit around L2
    orbitTilt: 0.4,       // More visible inclined orbit around L2
    description: "The James Webb Space Telescope orbits around the Sun-Earth L2 point, 1.5 million km from Earth, with a 6-month orbital period in a complex 'halo' pattern."
  },
  
  // Voyager Spacecraft
  {
    id: "voyager",
    name: "Voyager",
    type: "spacecraft",
    position: [300, 20, 150],
    radius: 0.04,         // Make it visible but to scale
    rotationSpeed: 0.008,
    orbitSpeed: 0.01,     // Very slow orbit far from the Sun
    orbitRadius: 300,
    orbitCenter: [0, 0, 0], // Far from the Sun
    eccentricity: 0.2,
    orbitTilt: 0.35,      // Voyager's trajectory takes it out of the ecliptic plane
    description: "The Voyager spacecraft (Voyager 1 and 2) are space probes launched in 1977 that have now traveled beyond our solar system into interstellar space, making them the most distant human-made objects."
  }
];
