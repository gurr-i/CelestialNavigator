import { PlanetData } from "../lib/types";

export const SOLAR_SYSTEM: PlanetData[] = [
  // Sun
  {
    id: "sun",
    name: "Sun",
    type: "star",
    position: [0, 0, 0],
    radius: 20,
    rotationSpeed: 0.0001,
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
    radius: 2,
    rotationSpeed: 0.0005,
    orbitSpeed: 0.00047,
    orbitRadius: 35,
    orbitCenter: [0, 0, 0],
    textureUrl: "/textures/planets/mercury.jpg",
    diameter: 4879,
    dayLength: "58.7 Earth days",
    yearLength: "88 Earth days",
    temperature: "-173°C to 427°C",
    description: "Mercury is the smallest and innermost planet in the Solar System. It has no atmosphere to retain heat, resulting in extreme temperature variations."
  },
  
  // Venus
  {
    id: "venus",
    name: "Venus",
    type: "planet",
    position: [50, 0, 0],
    radius: 3.8,
    rotationSpeed: 0.0002,
    orbitSpeed: 0.00035,
    orbitRadius: 50,
    orbitCenter: [0, 0, 0],
    textureUrl: "/textures/planets/venus.jpg",
    diameter: 12104,
    dayLength: "243 Earth days",
    yearLength: "225 Earth days",
    temperature: "462°C (average)",
    description: "Venus is the second planet from the Sun and the hottest planet in our solar system. Its thick atmosphere traps heat in a runaway greenhouse effect."
  },
  
  // Earth
  {
    id: "earth",
    name: "Earth",
    type: "planet",
    position: [70, 0, 0],
    radius: 4,
    rotationSpeed: 0.001,
    orbitSpeed: 0.0003,
    orbitRadius: 70,
    orbitCenter: [0, 0, 0],
    textureUrl: "/textures/planets/earth.jpg",
    diameter: 12756,
    dayLength: "24 hours",
    yearLength: "365.25 days",
    temperature: "-88°C to 58°C",
    description: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. It has one natural satellite, the Moon."
  },
  
  // Moon
  {
    id: "moon",
    name: "Moon",
    type: "moon",
    position: [76, 0, 0],
    radius: 1.1,
    rotationSpeed: 0.0001,
    orbitSpeed: 0.001,
    orbitRadius: 6,
    orbitCenter: [70, 0, 0],
    textureUrl: "/textures/planets/moon.jpg",
    diameter: 3475,
    dayLength: "29.5 Earth days",
    temperature: "-173°C to 127°C",
    description: "The Moon is Earth's only natural satellite. It is the fifth-largest satellite in the Solar System and the largest and most massive relative to its parent planet."
  },
  
  // Mars
  {
    id: "mars",
    name: "Mars",
    type: "planet",
    position: [90, 0, 0],
    radius: 3.5,
    rotationSpeed: 0.0009,
    orbitSpeed: 0.00024,
    orbitRadius: 90,
    orbitCenter: [0, 0, 0],
    textureUrl: "/textures/planets/mars.jpg",
    diameter: 6792,
    dayLength: "24.6 hours",
    yearLength: "687 Earth days",
    temperature: "-153°C to 20°C",
    description: "Mars is the fourth planet from the Sun. Often called the 'Red Planet' due to its reddish appearance, it features polar ice caps, volcanoes, and ancient river valleys."
  },
  
  // Jupiter
  {
    id: "jupiter",
    name: "Jupiter",
    type: "planet",
    position: [130, 0, 0],
    radius: 8,
    rotationSpeed: 0.002,
    orbitSpeed: 0.00013,
    orbitRadius: 130,
    orbitCenter: [0, 0, 0],
    textureUrl: "/textures/planets/jupiter.jpg",
    diameter: 142984,
    dayLength: "9.9 hours",
    yearLength: "11.9 Earth years",
    temperature: "-145°C (cloud tops)",
    description: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It's a gas giant with a Great Red Spot storm that has been ongoing for at least 400 years."
  },
  
  // Saturn
  {
    id: "saturn",
    name: "Saturn",
    type: "planet",
    position: [170, 0, 0],
    radius: 7,
    rotationSpeed: 0.0018,
    orbitSpeed: 0.00009,
    orbitRadius: 170,
    orbitCenter: [0, 0, 0],
    textureUrl: "/textures/planets/saturn.jpg",
    diameter: 120536,
    dayLength: "10.7 hours",
    yearLength: "29.5 Earth years",
    temperature: "-178°C (cloud tops)",
    description: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System. It is best known for its spectacular ring system, composed mainly of ice particles."
  },
  
  // Uranus
  {
    id: "uranus",
    name: "Uranus",
    type: "planet",
    position: [200, 0, 0],
    radius: 5.5,
    rotationSpeed: 0.0014,
    orbitSpeed: 0.00006,
    orbitRadius: 200,
    orbitCenter: [0, 0, 0],
    textureUrl: "/textures/planets/uranus.jpg",
    diameter: 51118,
    dayLength: "17.2 hours",
    yearLength: "84 Earth years",
    temperature: "-224°C (cloud tops)",
    description: "Uranus is the seventh planet from the Sun. It rotates on its side, with an axial tilt of 98 degrees, resulting in extreme seasonal variations."
  },
  
  // Neptune
  {
    id: "neptune",
    name: "Neptune",
    type: "planet",
    position: [230, 0, 0],
    radius: 5.3,
    rotationSpeed: 0.0015,
    orbitSpeed: 0.00004,
    orbitRadius: 230,
    orbitCenter: [0, 0, 0],
    textureUrl: "/textures/planets/neptune.jpg",
    diameter: 49528,
    dayLength: "16.1 hours",
    yearLength: "165 Earth years",
    temperature: "-218°C (cloud tops)",
    description: "Neptune is the eighth and farthest known Solar planet from the Sun. It has the strongest winds of any planet, reaching speeds of 2,100 km/h."
  },
  
  // Pluto (Dwarf Planet)
  {
    id: "pluto",
    name: "Pluto",
    type: "dwarf",
    position: [260, 0, 0],
    radius: 1,
    rotationSpeed: 0.0003,
    orbitSpeed: 0.00003,
    orbitRadius: 260,
    orbitCenter: [0, 0, 0],
    textureUrl: "/textures/planets/pluto.jpg",
    diameter: 2376,
    dayLength: "6.4 Earth days",
    yearLength: "248 Earth years",
    temperature: "-240°C (average)",
    description: "Pluto is a dwarf planet in the Kuiper belt. It was classified as the ninth planet from 1930 until 2006, when it was reclassified as a dwarf planet."
  },
  
  // International Space Station
  {
    id: "iss",
    name: "International Space Station",
    type: "spacecraft",
    position: [70, 6, 0],
    radius: 0.2,
    rotationSpeed: 0,
    orbitSpeed: 0.005,
    orbitRadius: 2,
    orbitCenter: [70, 0, 0],
    description: "The International Space Station is a modular space station in low Earth orbit. It serves as a microgravity and space environment research laboratory."
  },
  
  // James Webb Space Telescope
  {
    id: "jwst",
    name: "James Webb Telescope",
    type: "spacecraft",
    position: [100, 10, 30],
    radius: 0.3,
    rotationSpeed: 0.0001,
    description: "The James Webb Space Telescope is a space telescope designed to observe the infrared universe, allowing for unprecedented astronomical observations."
  }
];
