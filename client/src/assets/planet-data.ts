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
    textureUrl: `${import.meta.env.BASE_URL}textures/sun.jpg`,
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
    rotationSpeed: 0.0005, // Very slow rotation (58.7 Earth days per rotation)
    orbitSpeed: 0.048,     // Fastest planet orbit speed (88 days), 4.8x Earth's speed
    orbitRadius: 35,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.205,  // Mercury has the highest eccentricity of the Solar System planets
    orbitTilt: 0.1222,    // 7 degrees in radians
    axialTilt: 0.0017,    // 0.03 degrees - negligible axial tilt
    textureUrl: `${import.meta.env.BASE_URL}textures/planets/mercury.jpg`,
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
    orbitSpeed: 0.019,     // 1.9x slower than Earth (225 days)
    orbitRadius: 50,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.007,  // Venus has a nearly circular orbit
    orbitTilt: 0.0594,    // 3.4 degrees in radians
    axialTilt: 3.0963,    // 177.4 degrees - retrograde rotation
    textureUrl: `${import.meta.env.BASE_URL}textures/planets/venus.jpg`,
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
    radius: 4.6, // Reference size
    rotationSpeed: 0.01,   // Base rotation speed (1 day)
    orbitSpeed: 0.01,     // Reference speed (1 Earth year)
    orbitRadius: 70,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.017,  // Earth's orbit is slightly elliptical
    orbitTilt: 0.0,       // Reference plane
    axialTilt: 0.4101,    // 23.5 degrees axial tilt
    textureUrl: `${import.meta.env.BASE_URL}textures/planets/earth.jpg`,
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
    radius: 1.26, // 27.3% of Earth's radius
    rotationSpeed: 0.00037, // Tidally locked to match orbital period
    orbitSpeed: 0.37,     // 27.3 days to orbit Earth (13.4x faster than Earth's orbit)
    orbitRadius: 10, // Set to match average Earth-Moon distance scaled down
    orbitCenter: [0, 0, 0], // Will be dynamically updated to Earth's position
    eccentricity: 0.0549, // Moon's actual orbital eccentricity
    orbitTilt: 0.089, // 5.14 degrees inclination to ecliptic
    axialTilt: 0.116, // 6.68 degrees axial tilt relative to its orbital plane
    textureUrl: `${import.meta.env.BASE_URL}textures/planets/moon.jpg`,
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
    rotationSpeed: 0.0097, // Slightly slower than Earth (24.6 hours)
    orbitSpeed: 0.0053,   // 1.88 Earth years (0.53x Earth's speed)
    orbitRadius: 90,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.094,  // Mars has a moderately elliptical orbit
    orbitTilt: 0.0323,    // 1.85 degrees in radians
    axialTilt: 0.4398,    // 25.2 degrees axial tilt
    textureUrl: `${import.meta.env.BASE_URL}textures/planets/mars.jpg`,
    diameter: 6792,
    dayLength: "24.6 hours",
    yearLength: "687 Earth days",
    temperature: "-153°C to 20°C",
    description: "Mars is the fourth planet from the Sun. Its reddish appearance is due to iron oxide (rust) on its surface. Its axial tilt is similar to Earth's."
  },
  
  // Asteroid Belt
  {
    id: "asteroid-belt",
    name: "Asteroid Belt",
    type: "belt",
    position: [110, 0, 0],
    radius: 0.5,         // Individual asteroid size
    rotationSpeed: 0.005, // Slow rotation of individual asteroids
    orbitSpeed: 0.07,    // Speed between Mars and Jupiter
    orbitRadius: 110,    // Distance between Mars and Jupiter
    orbitCenter: [0, 0, 0],
    eccentricity: 0.0,   // Circular belt for visualization
    orbitTilt: 0.1,      // Slight tilt for 3D effect
    textureUrl: undefined,    // No texture needed for particle system
    diameter: "Variable (Ceres: 940 km, Vesta: 525 km)",
    yearLength: "3-6 Earth years for most asteroids",
    temperature: "Variable",
    description: "The asteroid belt is a torus-shaped region between the orbits of Mars and Jupiter, occupied by numerous irregularly shaped bodies called asteroids or minor planets."
  },
  
  // Jupiter
  {
    id: "jupiter",
    name: "Jupiter",
    type: "planet",
    position: [130, 0, 0],
    radius: 11.2, // 11.2 times Earth's radius
    rotationSpeed: 0.024,  // Fastest rotating planet (9.9 hours, 2.4x Earth's rotation)
    orbitSpeed: 0.00084,  // 11.9 Earth years (0.084x Earth's speed)
    orbitRadius: 130,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.049,  // Jupiter's eccentricity
    orbitTilt: 0.0227,    // 1.3 degrees
    axialTilt: 0.0546,    // 3.13 degrees
    textureUrl: `${import.meta.env.BASE_URL}textures/planets/jupiter.jpg`,
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
    rotationSpeed: 0.022,  // Fast rotation (10.7 hours, 2.2x Earth's rotation)
    orbitSpeed: 0.00034,  // 29.5 Earth years (0.034x Earth's speed)
    orbitRadius: 170,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.057,  // Saturn's eccentricity
    orbitTilt: 0.0435,    // 2.49 degrees
    axialTilt: 0.466,     // 26.7 degrees - will affect ring orientation
    textureUrl: `${import.meta.env.BASE_URL}textures/planets/saturn.jpg`,
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
    rotationSpeed: 0.014,  // 17.2 hours, but appears different due to extreme axial tilt
    orbitSpeed: 0.00012,  // 84 Earth years (0.012x Earth's speed)
    orbitRadius: 200,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.046,  // Uranus's eccentricity
    orbitTilt: 0.0134,    // 0.77 degrees
    axialTilt: 1.7064,    // 97.8 degrees (extreme tilt, rotates on its side)
    textureUrl: `${import.meta.env.BASE_URL}textures/planets/uranus.jpg`,
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
    rotationSpeed: 0.015,  // 16.1 hours (1.5x Earth's rotation)
    orbitSpeed: 0.00006,  // 165 Earth years (0.006x Earth's speed)
    orbitRadius: 230,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.011,  // Neptune's eccentricity
    orbitTilt: 0.0309,    // 1.77 degrees
    axialTilt: 0.4939,    // 28.3 degrees
    textureUrl: `${import.meta.env.BASE_URL}textures/planets/neptune.jpg`,
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
    rotationSpeed: 0.0039, // 6.4 Earth days
    orbitSpeed: 0.00004,  // 248 Earth years (0.004x Earth's speed)
    orbitRadius: 260,
    orbitCenter: [0, 0, 0],
    eccentricity: 0.244,  // Pluto has a highly eccentric orbit
    orbitTilt: 0.2967,    // 17 degrees (highest inclination)
    axialTilt: 2.0856,    // 119.5 degrees (extreme tilt)
    textureUrl: `${import.meta.env.BASE_URL}textures/planets/pluto.jpg`,
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
    rotationSpeed: 0.01, // Same as Earth's rotation
    orbitSpeed: 16.5,    // Orbits Earth once every 90 minutes (16.5x Earth's rotation)
    orbitRadius: 7,      // Closer to Earth but visibly separate
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
    rotationSpeed: 0.01, // Same as Earth's rotation
    orbitSpeed: 0.055,   // 6-month orbit around L2 point (5.5% of Earth's orbit)
    orbitRadius: 25,     // Located at Earth-Sun L2 point
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
  },
  
  // Saturn's Rings
  {
    id: "saturn-rings",
    name: "Saturn's Rings",
    type: "belt",
    position: [170, 0, 0], // Same as Saturn
    radius: 0.2,          // Individual ring particle size
    rotationSpeed: 0.022, // Same as Saturn's rotation
    orbitSpeed: 0.00034,  // Same as Saturn
    orbitRadius: 170,     // Same as Saturn
    orbitCenter: [0, 0, 0],
    eccentricity: 0.057,  // Same as Saturn
    orbitTilt: 0.0435,    // Same as Saturn
    textureUrl: undefined,
    diameter: "Extends from 7,000 to 80,000 km above Saturn's equator",
    yearLength: "29.5 Earth years",
    temperature: "-178°C",
    description: "Saturn's rings are composed of billions of particles ranging from tiny dust-sized icy grains to chunks as large as mountains, forming a vast, thin structure around the planet."
  },
  
  // Jupiter's Galilean Moons
  // Io
  {
    id: "io",
    name: "Io (Jupiter I)",
    type: "moon",
    position: [130, 0, 0], // Will be dynamically set
    radius: 1.0,          // Similar to our Moon in scale
    rotationSpeed: 0.024, // Same as Jupiter's rotation (tidally locked)
    orbitSpeed: 1.9,      // 1.77 days around Jupiter (1.9x Jupiter's rotation)
    orbitRadius: 15,      // Close to Jupiter
    orbitCenter: [0, 0, 0], // Will be dynamically updated to Jupiter's position
    eccentricity: 0.004,
    orbitTilt: 0.04,
    textureUrl: `${import.meta.env.BASE_URL}textures/moons/io.jpg`,
    diameter: 3643,
    temperature: "-155°C to 400°C (volcanic regions)",
    description: "Io is the innermost of Jupiter's Galilean moons and the most volcanically active body in the Solar System, with hundreds of active volcanoes and lakes of molten sulfur."
  },
  
  // Europa
  {
    id: "europa",
    name: "Europa (Jupiter II)",
    type: "moon",
    position: [130, 0, 0], // Will be dynamically set
    radius: 0.9,
    rotationSpeed: 0.024, // Same as Jupiter's rotation (tidally locked)
    orbitSpeed: 1.0,      // 3.55 days around Jupiter (1.0x Jupiter's rotation)
    orbitRadius: 18,      // Further from Jupiter than Io
    orbitCenter: [0, 0, 0], // Will be dynamically updated to Jupiter's position
    eccentricity: 0.009,
    orbitTilt: 0.06,
    textureUrl: `${import.meta.env.BASE_URL}textures/moons/europa.jpg`,
    diameter: 3122,
    temperature: "-171°C (average)",
    description: "Europa has a smooth, icy surface covering a global saltwater ocean, making it one of the most promising places to search for extraterrestrial life in our solar system."
  },
  
  // Saturn's major moon - Titan
  {
    id: "titan",
    name: "Titan (Saturn VI)",
    type: "moon",
    position: [170, 0, 0], // Will be dynamically set
    radius: 1.5,          // Largest of Saturn's moons
    rotationSpeed: 0.022, // Same as Saturn's rotation (tidally locked)
    orbitSpeed: 0.14,     // 15.95 days around Saturn (0.14x Saturn's rotation)
    orbitRadius: 20,      // Distance from Saturn
    orbitCenter: [0, 0, 0], // Will be dynamically updated to Saturn's position
    eccentricity: 0.0288,
    orbitTilt: 0.34,
    textureUrl: `${import.meta.env.BASE_URL}textures/moons/titan.jpg`,
    diameter: 5150,
    temperature: "-179°C (average)",
    description: "Titan is Saturn's largest moon and the only moon in the Solar System with a substantial atmosphere. It has lakes of liquid methane and ethane on its surface."
  },
  
  // Kuiper Belt (including dwarf planets like Eris)
  {
    id: "kuiper-belt",
    name: "Kuiper Belt",
    type: "belt",
    position: [300, 0, 0],
    radius: 0.3,          // Small objects
    rotationSpeed: 0.001,
    orbitSpeed: 0.01,     // Very slow orbit
    orbitRadius: 300,     // Beyond Neptune
    orbitCenter: [0, 0, 0],
    eccentricity: 0.2,    // More eccentric orbits for objects
    orbitTilt: 0.3,       // More variation in inclination
    textureUrl: undefined,
    diameter: "30-50 AU from Sun, objects up to 2,400 km diameter",
    yearLength: "200-500 Earth years",
    temperature: "-240°C to -230°C",
    description: "The Kuiper Belt is a circumstellar disc in the outer Solar System, extending from Neptune's orbit (~30 AU) to 50 AU from the Sun, containing thousands of small icy bodies including Pluto, Eris, and other dwarf planets."
  },
  
  // Oort Cloud (theoretical)
  {
    id: "oort-cloud",
    name: "Oort Cloud",
    type: "belt",
    position: [500, 0, 0],
    radius: 0.2,
    rotationSpeed: 0.0001,
    orbitSpeed: 0.002,    // Extremely slow orbit
    orbitRadius: 500,     // Far beyond all planets
    orbitCenter: [0, 0, 0],
    eccentricity: 0.5,    // Highly varied and eccentric orbits
    orbitTilt: 1.0,       // All possible inclinations
    textureUrl: undefined,
    diameter: "5,000-100,000 AU from Sun",
    yearLength: "Millions of Earth years",
    temperature: "Near absolute zero",
    description: "The Oort Cloud is a theoretical cloud of predominantly icy planetesimals at the edge of our Solar System, about 1,000 times further than the Kuiper Belt and the outer limit of the Sun's gravitational influence."
  }
];
