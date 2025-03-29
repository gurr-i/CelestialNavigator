/**
 * Educational content for space exploration application
 * This file contains structured information about celestial bodies, 
 * space missions, and astronomical concepts.
 */

export interface EducationalSection {
  title: string;
  content: string;
  imageUrl?: string;
  additionalInfo?: string[];
  sourceUrl?: string;
}

export interface CelestialBodyInfo {
  id: string;
  name: string;
  type: string;
  overview: string;
  composition: string;
  atmosphere?: string;
  surfaceFeatures?: string;
  moons?: string[];
  notableFeatures: string[];
  explorationHistory: EducationalSection[];
  funFacts: string[];
  additionalResources?: string[];
}

export interface SpaceMissionInfo {
  id: string;
  name: string;
  agency: string;
  launchDate: string;
  endDate?: string;
  status: 'Active' | 'Completed' | 'Planned' | 'Failed';
  overview: string;
  objectives: string[];
  accomplishments?: string[];
  images?: string[];
  additionalResources?: string[];
}

export interface AstronomicalConceptInfo {
  id: string;
  name: string;
  overview: string;
  details: string;
  relatedConcepts: string[];
  scientificImportance: string;
  illustrations?: string[];
  additionalResources?: string[];
}

// Celestial Body Information
export const CELESTIAL_BODIES_INFO: CelestialBodyInfo[] = [
  {
    id: "sun",
    name: "The Sun",
    type: "Star",
    overview: "The Sun is the star at the center of our Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core. The Sun radiates energy mainly as light, ultraviolet, and infrared radiation, and is the most important source of energy for life on Earth.",
    composition: "The Sun is composed primarily of hydrogen (73%) and helium (25%), with the remaining 2% consisting of heavier elements such as oxygen, carbon, neon, and iron.",
    atmosphere: "The Sun's atmosphere consists of the photosphere (the visible surface), the chromosphere (a thin layer above the photosphere), and the corona (the extended outer atmosphere).",
    notableFeatures: [
      "Solar flares - sudden, intense brightening on the Sun's surface, often followed by a coronal mass ejection",
      "Sunspots - temporarily dark areas on the Sun's photosphere that appear dark because they are cooler than surrounding areas",
      "Solar wind - a stream of charged particles released from the Sun's corona, which influences Earth's magnetosphere",
      "Core temperature of about 15 million degrees Celsius (27 million degrees Fahrenheit)",
      "Surface temperature of about 5,500 degrees Celsius (9,940 degrees Fahrenheit)"
    ],
    explorationHistory: [
      {
        title: "Early Observations",
        content: "Humans have observed the Sun since prehistoric times. Many ancient civilizations, including the Egyptians and Aztecs, considered it a deity. Galileo Galilei was one of the first to observe sunspots through a telescope in 1610."
      },
      {
        title: "Solar and Heliospheric Observatory (SOHO)",
        content: "Launched in 1995, SOHO is a joint mission between NASA and ESA. It has provided valuable data about the Sun's internal structure, outer atmosphere, solar wind, and solar activities.",
        imageUrl: "/images/educational/soho.jpg"
      },
      {
        title: "Parker Solar Probe",
        content: "Launched in 2018, NASA's Parker Solar Probe will fly closer to the Sun than any previous spacecraft. It aims to trace how energy and heat move through the Sun's corona and explore what accelerates the solar wind.",
        imageUrl: "/images/educational/parker.jpg"
      },
      {
        title: "Solar Orbiter",
        content: "Launched in 2020, the ESA-led Solar Orbiter mission will provide close-up, high-latitude observations of the Sun to better understand the solar wind, the heliospheric magnetic field, solar energetic particles, and the Sun's polar regions."
      }
    ],
    funFacts: [
      "The Sun is about 4.6 billion years old and is expected to remain relatively stable for another 5 billion years.",
      "The Sun makes up 99.86% of the mass of the Solar System.",
      "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.",
      "Every second, the Sun converts about 600 million tons of hydrogen into helium.",
      "The Sun is a yellow dwarf star, classified as a G2V star, with G2 indicating its surface temperature and V representing that it is in the main sequence."
    ]
  },
  {
    id: "mercury",
    name: "Mercury",
    type: "Planet",
    overview: "Mercury is the smallest and innermost planet in the Solar System. It orbits the Sun every 88 days, the fastest of all the planets. Despite being close to the Sun, it is not the hottest planet (Venus is hotter due to its dense atmosphere). Mercury has a large iron core and a very thin atmosphere.",
    composition: "Mercury is primarily composed of iron, with a thin silicate mantle and crust. Its iron core makes up about 60% of its mass, higher than any other major planet in the Solar System.",
    atmosphere: "Mercury has a very thin, almost negligible atmosphere (exosphere) consisting mainly of oxygen, sodium, hydrogen, helium, and potassium. This atmosphere is constantly being lost and replenished from various sources.",
    surfaceFeatures: "Mercury's surface is heavily cratered, similar to the Moon, with smooth plains and no plate tectonics. It has cliff-like escarpments called 'rupes' and valleys called 'valles'. The Caloris Basin is one of the largest impact craters in the Solar System.",
    notableFeatures: [
      "Extreme temperature variations ranging from -173°C (-280°F) at night to 427°C (800°F) during the day",
      "Caloris Basin, a massive impact crater about 1,550 km in diameter",
      "The presence of ice in permanently shadowed craters at the poles",
      "A global magnetic field, though weaker than Earth's",
      "A 3:2 spin-orbit resonance, meaning it rotates three times for every two orbits around the Sun"
    ],
    explorationHistory: [
      {
        title: "Mariner 10",
        content: "Launched in 1973, NASA's Mariner 10 was the first spacecraft to visit Mercury. It flew past Mercury three times in 1974-1975 and mapped about 45% of the planet's surface.",
        imageUrl: "/images/educational/mariner10.jpg"
      },
      {
        title: "MESSENGER",
        content: "NASA's MESSENGER (MErcury Surface, Space ENvironment, GEochemistry, and Ranging) orbited Mercury from 2011 to 2015. It provided comprehensive data about Mercury's surface, geology, magnetic field, and exosphere.",
        imageUrl: "/images/educational/messenger.jpg"
      },
      {
        title: "BepiColombo",
        content: "Launched in 2018, BepiColombo is a joint mission between ESA and JAXA. It consists of two orbiters that will study Mercury's composition, geophysics, atmosphere, magnetosphere, and history. It is scheduled to reach Mercury in 2025.",
        imageUrl: "/images/educational/bepicolombo.jpg"
      }
    ],
    funFacts: [
      "A day on Mercury (from noon to noon) lasts about 176 Earth days, while its year is just 88 Earth days.",
      "Mercury is gradually slowing down; in about 5 billion years, it will be tidally locked with the Sun.",
      "Mercury is shrinking! As its iron core cools and contracts, the planet's diameter has decreased by about 14 kilometers.",
      "Despite being closer to the Sun, Mercury's surface can be colder than Mars at night because it has almost no atmosphere to retain heat.",
      "Mercury's orbit is the most eccentric (oval-shaped) of all the planets, and it has the highest orbital inclination relative to Earth's orbit."
    ]
  },
  {
    id: "venus",
    name: "Venus",
    type: "Planet",
    overview: "Venus is the second planet from the Sun and Earth's closest planetary neighbor. It's a terrestrial planet similar in size and composition to Earth, but with a dense, toxic atmosphere of carbon dioxide and clouds of sulfuric acid. The extreme greenhouse effect makes it the hottest planet in our solar system, despite being farther from the Sun than Mercury.",
    composition: "Venus is composed of a central iron core, a rocky mantle, and a silicate crust. Its composition is believed to be similar to Earth's, but with less water and more carbon dioxide.",
    atmosphere: "Venus has an extremely dense atmosphere consisting of 96% carbon dioxide, 3.5% nitrogen, and traces of other gases. The atmospheric pressure at the surface is about 92 times that of Earth's - equivalent to the pressure found 900 m (3,000 ft) underwater on Earth. Its thick cloud layers of sulfuric acid reflect light, making it the brightest natural object in Earth's night sky after the Moon.",
    surfaceFeatures: "The surface of Venus features vast volcanic plains, highland regions, and numerous large volcanoes. It has few impact craters, suggesting a relatively young surface that has been reshaped by volcanic activity. Notable features include Maxwell Montes, the highest mountain on Venus, and extensive lava flows.",
    notableFeatures: [
      "Surface temperature of about 462°C (864°F), hot enough to melt lead",
      "Atmospheric pressure at the surface is 92 times that of Earth",
      "Rotates in the opposite direction to most planets (retrograde rotation)",
      "A day on Venus is longer than its year (243 Earth days vs. 225 Earth days)",
      "No magnetic field despite its similar size to Earth"
    ],
    explorationHistory: [
      {
        title: "Early Soviet Missions",
        content: "The Soviet Union's Venera program (1961-1983) included the first spacecraft to land on another planet. Venera 7 was the first to make a soft landing on Venus in 1970, and Venera 9 provided the first images from the surface in 1975.",
        imageUrl: "/images/educational/venera.jpg"
      },
      {
        title: "NASA Missions",
        content: "NASA's Mariner 2 was the first successful planetary flyby mission in 1962. The Pioneer Venus missions (1978) studied the atmosphere and mapped the surface using radar. Magellan (1989-1994) created the first global radar map of Venus, revealing its surface features hidden beneath the clouds.",
        imageUrl: "/images/educational/magellan.jpg"
      },
      {
        title: "Venus Express",
        content: "ESA's Venus Express orbited Venus from 2006 to 2014, studying its atmosphere, plasma environment, and surface. It confirmed lightning in Venus's atmosphere and discovered evidence of recent volcanic activity.",
        imageUrl: "/images/educational/venus_express.jpg"
      },
      {
        title: "Akatsuki",
        content: "JAXA's Akatsuki (launched in 2010) is currently orbiting Venus, studying its meteorology and searching for evidence of active volcanoes and lightning."
      }
    ],
    funFacts: [
      "Venus rotates so slowly that its day (243 Earth days) is longer than its year (225 Earth days).",
      "If you stood on Venus, the Sun would rise in the west and set in the east due to its retrograde rotation.",
      "Venus has more volcanoes than any other planet in our solar system, with over 1,600 major volcanoes.",
      "The atmospheric pressure on Venus's surface is equivalent to being about 900 meters (3,000 feet) underwater on Earth.",
      "Despite its harsh conditions now, Venus may have had oceans and been habitable for billions of years before undergoing a runaway greenhouse effect."
    ]
  },
  {
    id: "earth",
    name: "Earth",
    type: "Planet",
    overview: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth's surface is covered with water, with the remaining 29% consisting of continents and islands. Earth's atmosphere, which supports life, consists primarily of nitrogen and oxygen.",
    composition: "Earth has an inner core, outer core, mantle, and crust. The inner core is solid iron, while the outer core is liquid iron mixed with nickel. The mantle consists of semi-solid rock, and the crust is Earth's outer layer made up of solid rocks and minerals.",
    atmosphere: "Earth's atmosphere consists of 78% nitrogen, 21% oxygen, and 1% other gases including argon, carbon dioxide, and water vapor. The atmosphere protects Earth from harmful solar radiation and regulates temperature through the greenhouse effect.",
    surfaceFeatures: "Earth has diverse terrains including mountains, plains, deserts, forests, tundras, and bodies of water. Plate tectonics shapes the surface through the movement of large sections of the crust, creating mountain ranges and ocean trenches.",
    moons: [
      "The Moon - Earth's only natural satellite, about 1/4 of Earth's diameter and formed around 4.5 billion years ago, likely from a massive collision with a Mars-sized body."
    ],
    notableFeatures: [
      "The only known planet to support life",
      "71% of surface covered by liquid water",
      "Strong magnetic field that protects against solar radiation",
      "Active plate tectonics that constantly reshape the surface",
      "Diverse ecosystems spanning from deep oceans to high mountains"
    ],
    explorationHistory: [
      {
        title: "First View from Space",
        content: "The first photographs of Earth from space were taken by the V-2 rockets launched in the late 1940s. The first full-disk image of Earth was taken by the ATS-3 satellite in 1967.",
        imageUrl: "/images/educational/earth_from_space.jpg"
      },
      {
        title: "Apollo Program",
        content: "NASA's Apollo missions provided the first human observations of Earth from space and the iconic 'Earthrise' photo taken by Apollo 8 in 1968. The 'Blue Marble' photo from Apollo 17 in 1972 became one of the most reproduced images in history.",
        imageUrl: "/images/educational/blue_marble.jpg"
      },
      {
        title: "Earth Observation Satellites",
        content: "Numerous satellites monitor Earth's weather, climate, oceans, land, and atmosphere. Notable programs include NASA's Landsat series (since 1972), which provides the longest continuous space-based record of Earth's land, and the European Space Agency's Copernicus program.",
        imageUrl: "/images/educational/landsat.jpg"
      },
      {
        title: "International Space Station",
        content: "The ISS, continuously occupied since 2000, serves as a platform for Earth observation and research on how living in space affects humans. Astronauts on the ISS take thousands of photographs of Earth, documenting changes over time.",
        imageUrl: "/images/educational/iss_earth.jpg"
      }
    ],
    funFacts: [
      "Earth is the only planet not named after a god or goddess from Greek or Roman mythology.",
      "Earth's rotation is gradually slowing at approximately 17 milliseconds per hundred years.",
      "The highest point on Earth is Mount Everest (8,848.86 meters above sea level), and the deepest point is the Challenger Deep in the Mariana Trench (10,994 meters below sea level).",
      "Earth has a powerful magnetic field created by its iron core, which shields us from harmful solar radiation and creates the beautiful aurora borealis and aurora australis.",
      "Earth's atmosphere extends about 10,000 kilometers (6,200 miles) above the planet's surface, gradually becoming thinner until it merges with space."
    ]
  },
  {
    id: "mars",
    name: "Mars",
    type: "Planet",
    overview: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. Known as the 'Red Planet' due to the iron oxide prevalent on its surface, Mars has a thin atmosphere, surface features reminiscent of Earth, and seasons similar to our own due to its axial tilt.",
    composition: "Mars has a core made primarily of iron, nickel, and sulfur, surrounded by a silicate mantle and a crust composed mainly of basalt. The planet's distinctive red color comes from iron oxide (rust) on its surface.",
    atmosphere: "Mars has a thin atmosphere consisting of about 95% carbon dioxide, 2.7% nitrogen, 1.6% argon, and traces of oxygen and water vapor. The atmospheric pressure on Mars is less than 1% of Earth's, equivalent to the pressure at about 35 km (22 mi) above Earth's surface.",
    surfaceFeatures: "Mars has diverse terrain including the largest volcano in the Solar System (Olympus Mons), the largest canyon system (Valles Marineris), polar ice caps, channels, gullies, and vast plains. Evidence suggests water once flowed on the surface.",
    moons: [
      "Phobos - A small, irregularly shaped moon orbiting close to Mars, likely to crash into Mars or break apart within 50 million years",
      "Deimos - The smaller and outermost of Mars' two moons, orbiting farther from the planet"
    ],
    notableFeatures: [
      "Olympus Mons, the tallest volcano in the Solar System (about 22 km or 13.6 mi high)",
      "Valles Marineris, a system of canyons stretching over 4,000 km (2,500 mi) long",
      "Polar ice caps composed of water ice and carbon dioxide ice that expand and contract seasonally",
      "Evidence of ancient river valleys, lake beds, and deltas suggesting liquid water once flowed on the surface",
      "Dust storms that can cover the entire planet and last for months"
    ],
    explorationHistory: [
      {
        title: "Early Missions",
        content: "The first successful Mars flyby was NASA's Mariner 4 in 1965, which sent back 22 images. Mariner 9 (1971-1972) was the first spacecraft to orbit another planet and mapped about 85% of Mars' surface.",
        imageUrl: "/images/educational/mariner9.jpg"
      },
      {
        title: "Viking Program",
        content: "NASA's Viking 1 and 2 (1976) were the first successful Mars landers, conducting experiments to search for microbial life. They provided the first detailed surface images and analyzed soil samples.",
        imageUrl: "/images/educational/viking.jpg"
      },
      {
        title: "Mars Exploration Rovers",
        content: "NASA's Spirit and Opportunity rovers (2004) significantly advanced our understanding of Mars's geology and past water activity. Opportunity operated for over 14 years, far exceeding its planned 90-day mission.",
        imageUrl: "/images/educational/opportunity.jpg"
      },
      {
        title: "Curiosity and Perseverance",
        content: "NASA's Curiosity rover (2012-present) and Perseverance rover (2021-present) are investigating Mars's habitability, climate, geology, and potential for past life. Perseverance is collecting samples for future return to Earth and deployed the Ingenuity helicopter, the first aircraft to fly on another planet.",
        imageUrl: "/images/educational/perseverance.jpg"
      },
      {
        title: "International Missions",
        content: "Multiple space agencies have sent missions to Mars, including ESA's Mars Express orbiter (2003-present), India's Mars Orbiter Mission (2014-2022), and the UAE's Hope orbiter (2021-present). China's Tianwen-1 mission (2021) successfully delivered the Zhurong rover to the surface.",
        imageUrl: "/images/educational/mars_express.jpg"
      }
    ],
    funFacts: [
      "A day on Mars (called a sol) is only slightly longer than an Earth day at 24 hours and 37 minutes.",
      "Mars experiences seasons similar to Earth because its axis is tilted at about 25 degrees, comparable to Earth's 23.5-degree tilt.",
      "Gravity on Mars is about 38% of Earth's, so you could jump nearly three times higher on Mars.",
      "Mars has the largest dust storms in the Solar System, sometimes engulfing the entire planet for months.",
      "Scientists have found evidence that liquid water may still flow on Mars's surface during the warmest months, though only briefly and in very small amounts."
    ]
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "Planet",
    overview: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant composed mainly of hydrogen and helium, with a mass more than two and a half times that of all the other planets combined. Jupiter's rapid rotation (a day is just under 10 hours) causes its equatorial regions to bulge and its polar regions to flatten, giving it a slightly oblate shape.",
    composition: "Jupiter consists primarily of hydrogen (~90%) and helium (~10%), with traces of ammonia, methane, water vapor, and other compounds. Unlike terrestrial planets, Jupiter lacks a solid surface and instead transitions from gaseous to liquid as the pressure increases with depth.",
    atmosphere: "Jupiter's atmosphere is the largest planetary atmosphere in the Solar System, extending up to 5,000 km (3,000 mi) above the 'surface'. It is organized into latitudinal bands of clouds composed of ammonia crystals, ammonium hydrosulfide, and water that appear as light (zones) and dark (belts) bands.",
    moons: [
      "Jupiter has at least 79 moons, with the four largest, known as the Galilean moons (Io, Europa, Ganymede, and Callisto), being easily observable with a small telescope.",
      "Ganymede is the largest moon in the Solar System, even larger than the planet Mercury.",
      "Io is the most volcanically active body in the Solar System.",
      "Europa has a global ocean of liquid water beneath its icy crust and is considered a promising place to search for extraterrestrial life."
    ],
    notableFeatures: [
      "The Great Red Spot, a persistent anticyclonic storm larger than Earth that has existed for at least 400 years",
      "A faint planetary ring system composed of dust particles ejected from its moons",
      "The strongest planetary magnetic field in the Solar System, about 14 times stronger than Earth's",
      "Powerful auroras around Jupiter's poles from charged particles captured by its magnetic field",
      "Cloud bands and atmospheric zones that circulate at different speeds, creating turbulent patterns"
    ],
    explorationHistory: [
      {
        title: "Pioneer Missions",
        content: "NASA's Pioneer 10 and 11 (1973-1974) were the first spacecraft to fly past Jupiter, capturing close-up images and studying its radiation environment, magnetic field, and atmosphere.",
        imageUrl: "/images/educational/pioneer_jupiter.jpg"
      },
      {
        title: "Voyager Missions",
        content: "NASA's Voyager 1 and 2 (1979) provided more detailed images of Jupiter and its moons, discovering Jupiter's rings, volcanic activity on Io, and detailed views of the Great Red Spot.",
        imageUrl: "/images/educational/voyager_jupiter.jpg"
      },
      {
        title: "Galileo Mission",
        content: "NASA's Galileo spacecraft (1995-2003) was the first to orbit Jupiter, studying the planet and its moons extensively. It also deployed a probe into Jupiter's atmosphere, providing direct measurements of its composition.",
        imageUrl: "/images/educational/galileo.jpg"
      },
      {
        title: "Juno Mission",
        content: "NASA's Juno spacecraft (2016-present) is currently orbiting Jupiter, studying its gravity field, magnetic field, polar magnetosphere, and deep atmospheric composition. Juno's close polar orbits allow it to observe Jupiter's previously unseen polar regions.",
        imageUrl: "/images/educational/juno.jpg"
      }
    ],
    funFacts: [
      "Jupiter is the fastest rotating planet in the Solar System, completing a rotation in just under 10 hours.",
      "Jupiter's Great Red Spot is a storm that could fit about 3 Earths inside it and has been observed since at least the 1600s.",
      "Jupiter acts as a 'cosmic vacuum cleaner', its strong gravity attracting and capturing comets and asteroids that might otherwise hit inner planets.",
      "If Jupiter were about 80 times more massive, it would become a star rather than a planet.",
      "Jupiter emits more heat than it receives from the Sun, primarily due to the Kelvin-Helmholtz mechanism (gravitational contraction) and possibly helium rain in its interior."
    ]
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "Planet",
    overview: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant known for its spectacular ring system, which consists of countless small particles of rock and ice. Like Jupiter, Saturn is primarily composed of hydrogen and helium and lacks a solid surface.",
    composition: "Saturn is composed primarily of hydrogen (about 96%) and helium (about 3%), with traces of methane, ammonia, water vapor, and other compounds. Saturn's density is the lowest of all planets in the Solar System—less than that of water, meaning it would float if placed in a large enough body of water.",
    atmosphere: "Saturn's upper atmosphere is divided into bands similar to Jupiter, but Saturn's appear more subdued due to a layer of ammonia haze. Winds in Saturn's atmosphere can reach up to 1,800 km/h (1,120 mph), the second-fastest in the Solar System after Neptune.",
    moons: [
      "Saturn has at least 83 moons, with the largest being Titan, which is larger than the planet Mercury and the only moon in the Solar System with a substantial atmosphere.",
      "Enceladus features geysers at its south pole that shoot plumes of water vapor, ice particles, and organic compounds from an underground ocean.",
      "Other significant moons include Mimas (with a large crater giving it a 'Death Star' appearance), Tethys, Dione, Rhea, and Iapetus."
    ],
    notableFeatures: [
      "Saturn's ring system extends up to 282,000 km (175,000 mi) from the planet, yet is typically less than 10 meters (30 feet) thick",
      "The rings are composed primarily of water ice particles ranging from tiny dust-sized grains to chunks several meters across",
      "Saturn has a hexagonal cloud pattern at its north pole, a unique feature in the Solar System",
      "Periodically occurring large storms called 'Great White Spots' that can encircle the entire planet",
      "Saturn's magnetic field is weaker than Jupiter's but still about 578 times stronger than Earth's"
    ],
    explorationHistory: [
      {
        title: "Pioneer and Voyager",
        content: "NASA's Pioneer 11 (1979) was the first spacecraft to fly by Saturn, followed by Voyager 1 and 2 (1980-1981). These missions discovered new moons and rings and provided detailed images of Saturn's atmosphere and ring system.",
        imageUrl: "/images/educational/voyager_saturn.jpg"
      },
      {
        title: "Cassini-Huygens",
        content: "The Cassini-Huygens mission (2004-2017), a joint project of NASA, ESA, and ASI, was the first to orbit Saturn. Cassini extensively studied Saturn, its rings, and moons, while the Huygens probe landed on Titan in 2005, providing the first images from its surface. Cassini's 'Grand Finale' involved 22 orbits diving between Saturn and its rings before intentionally plunging into Saturn's atmosphere.",
        imageUrl: "/images/educational/cassini.jpg"
      },
      {
        title: "Future Missions",
        content: "NASA's Dragonfly mission, scheduled to launch in 2027, will send a rotorcraft to explore Titan. While primarily focused on Titan, it will provide new observations of Saturn as well."
      }
    ],
    funFacts: [
      "Saturn's rings were first observed by Galileo Galilei in 1610, though he couldn't identify them as rings with his primitive telescope.",
      "The particles in Saturn's rings orbit at different speeds, with inner particles moving faster than outer ones, in accordance with Kepler's laws of planetary motion.",
      "Saturn's moon Enceladus has geysers that shoot water ice particles into space, some of which eventually become part of Saturn's E ring.",
      "A day on Saturn lasts only about 10.7 hours, but a year is equivalent to about 29.5 Earth years.",
      "Saturn has oval-shaped storms similar to Jupiter's Great Red Spot, but they don't last as long, typically surviving for months rather than centuries."
    ]
  }
];

// Space Mission Information
export const SPACE_MISSIONS_INFO: SpaceMissionInfo[] = [
  {
    id: "apollo11",
    name: "Apollo 11",
    agency: "NASA",
    launchDate: "July 16, 1969",
    endDate: "July 24, 1969",
    status: "Completed",
    overview: "Apollo 11 was the first manned mission to land on the Moon. The spacecraft carried three astronauts: Mission Commander Neil Armstrong, Lunar Module Pilot Edwin 'Buzz' Aldrin, and Command Module Pilot Michael Collins.",
    objectives: [
      "Land humans on the lunar surface and return them safely to Earth",
      "Establish technological superiority in space over the Soviet Union",
      "Collect lunar surface samples for scientific study",
      "Deploy scientific experiments on the lunar surface"
    ],
    accomplishments: [
      "Neil Armstrong became the first human to step on the Moon on July 21, 1969, with the famous words: 'That's one small step for man, one giant leap for mankind'",
      "Successfully collected 21.5 kg (47.5 lb) of lunar material to return to Earth",
      "Deployed the Early Apollo Scientific Experiments Package (EASEP)",
      "Captured iconic photographs of bootprints on the lunar surface and Earth rising above the lunar horizon",
      "Demonstrated the capability of humans to travel to and work on another celestial body"
    ],
    images: [
      "/images/educational/apollo11_launch.jpg",
      "/images/educational/apollo11_moonwalk.jpg",
      "/images/educational/apollo11_plaque.jpg"
    ],
    additionalResources: [
      "NASA Apollo 11 Mission Overview: https://www.nasa.gov/mission_pages/apollo/missions/apollo11.html",
      "Smithsonian National Air and Space Museum Apollo Program: https://airandspace.si.edu/explore/topics/apollo/apollo-program",
      "Apollo Lunar Surface Journal: https://www.hq.nasa.gov/alsj/"
    ]
  },
  {
    id: "voyager",
    name: "Voyager Program",
    agency: "NASA",
    launchDate: "1977 (Voyager 1: September 5, Voyager 2: August 20)",
    status: "Active",
    overview: "The Voyager program consists of two spacecraft, Voyager 1 and Voyager 2, launched in 1977 to take advantage of a favorable alignment of Jupiter, Saturn, Uranus, and Neptune. After completing their primary mission of studying these outer planets, both spacecraft continued on an extended mission to study the outer reaches of the Solar System and interstellar space.",
    objectives: [
      "Study the outer planets Jupiter, Saturn, Uranus, and Neptune, their moons, and ring systems",
      "Investigate the interplanetary medium (the space between planets)",
      "Search for the boundary of the Solar System and study interstellar space beyond",
      "Carry the 'Golden Record' containing sounds and images portraying Earth's diversity of life and culture"
    ],
    accomplishments: [
      "First detailed, close-up images of Jupiter, Saturn, Uranus, and Neptune and their moons",
      "Discovered previously unknown moons around the outer planets",
      "Revealed active volcanoes on Jupiter's moon Io, the first observed beyond Earth",
      "Discovered that Jupiter, Saturn, Uranus, and Neptune all have ring systems",
      "Observed Neptune's Great Dark Spot and high-speed winds",
      "Voyager 1 became the first human-made object to enter interstellar space in 2012",
      "Both spacecraft continue to send scientific information about their surroundings through the Deep Space Network"
    ],
    images: [
      "/images/educational/voyager_spacecraft.jpg",
      "/images/educational/voyager_jupiter.jpg",
      "/images/educational/voyager_golden_record.jpg"
    ],
    additionalResources: [
      "NASA Voyager Mission: https://voyager.jpl.nasa.gov/",
      "The Planetary Society - Voyager: https://www.planetary.org/space-missions/voyager",
      "NASA Solar System Exploration - Voyager: https://solarsystem.nasa.gov/missions/voyager-1/in-depth/"
    ]
  },
  {
    id: "hubble",
    name: "Hubble Space Telescope",
    agency: "NASA and ESA",
    launchDate: "April 24, 1990",
    status: "Active",
    overview: "The Hubble Space Telescope (HST) is a space telescope that was launched into low Earth orbit in 1990 and remains in operation. It is one of NASA's Great Observatories and was named after astronomer Edwin Hubble. With a 2.4-meter (7.9 ft) mirror, Hubble's four main instruments observe in the ultraviolet, visible, and near-infrared regions of the electromagnetic spectrum.",
    objectives: [
      "Study the planets, stars, galaxies, and other celestial objects without the distortion of Earth's atmosphere",
      "Determine the age of the universe",
      "Search for extrasolar planets and study their atmospheres",
      "Analyze the composition and physical processes of celestial bodies",
      "Observe distant galaxies formed shortly after the Big Bang"
    ],
    accomplishments: [
      "Helped determine the rate of expansion of the universe (the Hubble constant)",
      "Provided evidence that the expansion of the universe is accelerating, leading to the discovery of dark energy",
      "Captured detailed images of the Deep Field and Ultra Deep Field, revealing thousands of galaxies in seemingly empty patches of sky",
      "Observed the collision of Comet Shoemaker-Levy 9 with Jupiter in 1994",
      "Contributed to understanding the atmospheres of planets both in and outside our solar system",
      "Captured iconic images like the 'Pillars of Creation' in the Eagle Nebula",
      "Serviced five times by Space Shuttle missions, with new instruments and repairs extending its lifetime"
    ],
    images: [
      "/images/educational/hubble.jpg",
      "/images/educational/hubble_deep_field.jpg",
      "/images/educational/hubble_pillars_of_creation.jpg"
    ],
    additionalResources: [
      "NASA Hubble Space Telescope: https://www.nasa.gov/mission_pages/hubble/main/index.html",
      "ESA Hubble: https://esahubble.org/",
      "HubbleSite: https://hubblesite.org/",
      "Space Telescope Science Institute: https://www.stsci.edu/"
    ]
  },
  {
    id: "iss",
    name: "International Space Station",
    agency: "NASA, Roscosmos, ESA, JAXA, CSA",
    launchDate: "November 20, 1998 (first module launch)",
    status: "Active",
    overview: "The International Space Station (ISS) is a modular space station in low Earth orbit. It is a multinational collaborative project involving NASA (United States), Roscosmos (Russia), JAXA (Japan), ESA (Europe), and CSA (Canada). The station serves as a microgravity and space environment research laboratory where scientific research is conducted in astrobiology, astronomy, meteorology, physics, and other fields.",
    objectives: [
      "Maintain a continuous human presence in space (achieved since November 2000)",
      "Provide a platform for scientific research that cannot be conducted on Earth",
      "Develop and test technologies for future space exploration",
      "Foster international cooperation in space",
      "Study the effects of long-duration spaceflight on humans for future missions to the Moon and Mars"
    ],
    accomplishments: [
      "Continuous human presence in space for over 20 years",
      "More than 3,000 scientific experiments conducted by researchers from over 100 countries",
      "Significant advances in our understanding of human physiology in space, including bone density loss, muscle atrophy, and vision changes",
      "Development and testing of life support systems, space habitats, and other technologies needed for long-duration spaceflight",
      "Demonstrations of international cooperation in the post-Cold War era",
      "Serves as a platform for testing commercial spaceflight capabilities, including SpaceX and Boeing crew vehicles"
    ],
    images: [
      "/images/educational/iss_orbit.jpg",
      "/images/educational/iss_interior.jpg",
      "/images/educational/iss_eva.jpg"
    ],
    additionalResources: [
      "NASA International Space Station: https://www.nasa.gov/mission_pages/station/main/index.html",
      "ESA International Space Station: https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/International_Space_Station",
      "JAXA ISS Program: https://iss.jaxa.jp/en/",
      "Canadian Space Agency ISS: https://www.asc-csa.gc.ca/eng/iss/",
      "ISS Live Stream: https://www.nasa.gov/multimedia/nasatv/iss_ustream.html"
    ]
  },
  {
    id: "jwst",
    name: "James Webb Space Telescope",
    agency: "NASA, ESA, CSA",
    launchDate: "December 25, 2021",
    status: "Active",
    overview: "The James Webb Space Telescope (JWST) is a space telescope designed primarily to conduct infrared astronomy. As the largest optical telescope in space, its high infrared resolution and sensitivity allow it to view objects too old, distant, or faint for the Hubble Space Telescope. This enables investigations across many fields of astronomy and cosmology, such as observation of the earliest stars and formation of the first galaxies, and detailed atmospheric characterization of potentially habitable exoplanets.",
    objectives: [
      "Study the formation and evolution of galaxies, stars, and planetary systems",
      "Examine the atmospheres of exoplanets for possible signs of life",
      "Observe the earliest stars and galaxies that formed after the Big Bang",
      "Expand our understanding of dark matter and dark energy",
      "Investigate the formation of stars and planetary systems"
    ],
    accomplishments: [
      "Successfully deployed at the L2 Lagrange point, 1.5 million kilometers from Earth",
      "Captured unprecedented high-resolution infrared images of the universe, including the deepest and sharpest infrared image of the distant universe to date",
      "Detected water vapor in the atmosphere of distant exoplanets",
      "Observed detailed structure of early galaxies, revealing new information about their formation and evolution",
      "Provided new insights into star formation processes and the chemical composition of galaxies"
    ],
    images: [
      "/images/educational/jwst.jpg",
      "/images/educational/jwst_deep_field.jpg",
      "/images/educational/jwst_deployment.jpg"
    ],
    additionalResources: [
      "NASA James Webb Space Telescope: https://www.nasa.gov/mission_pages/webb/main/index.html",
      "ESA Webb: https://www.esa.int/Science_Exploration/Space_Science/Webb",
      "Canadian Space Agency Webb: https://www.asc-csa.gc.ca/eng/satellites/jwst/",
      "Webb Space Telescope at STScI: https://webbtelescope.org/"
    ]
  }
];

// Astronomical Concepts Information
export const ASTRONOMICAL_CONCEPTS_INFO: AstronomicalConceptInfo[] = [
  {
    id: "gravity",
    name: "Gravity and Orbital Mechanics",
    overview: "Gravity is the force that attracts objects with mass towards each other. Orbital mechanics is the application of physics, specifically Newton's laws of motion and his law of universal gravitation, to the movement of satellites, spacecraft, and celestial bodies.",
    details: "Sir Isaac Newton's law of universal gravitation states that every particle attracts every other particle in the universe with a force directly proportional to the product of their masses and inversely proportional to the square of the distance between their centers. This force keeps planets in orbit around the Sun and moons around planets.\n\nIn the early 20th century, Albert Einstein's theory of general relativity expanded our understanding of gravity, describing it as a consequence of the curvature of spacetime caused by mass. This theory successfully explains phenomena that Newton's theory couldn't, such as the precession of Mercury's orbit.\n\nFor spacecraft navigation, several key orbital elements are calculated: semi-major axis (size of the orbit), eccentricity (shape of the orbit), inclination (tilt relative to the reference plane), longitude of the ascending node (orientation of the orbit), argument of periapsis (orientation of the ellipse in the orbital plane), and mean anomaly (position of the orbiting body along the ellipse at a specific time).\n\nManeuvers in space rely on precise calculations of delta-v (change in velocity) to move between orbits. The most efficient orbital transfer is the Hohmann transfer, which uses two engine burns to move between circular orbits.",
    relatedConcepts: [
      "Kepler's Laws of Planetary Motion",
      "Escape Velocity",
      "Lagrange Points",
      "Gravitational Assist",
      "Orbital Resonance"
    ],
    scientificImportance: "Understanding orbital mechanics is crucial for successful space exploration and satellite deployment. It allows us to predict the motion of natural and artificial satellites, plan spacecraft trajectories for interplanetary missions, perform gravitational assist maneuvers, maintain satellite constellations like GPS, and study the evolution of planetary systems.",
    illustrations: [
      "/images/educational/orbital_mechanics.jpg",
      "/images/educational/hohmann_transfer.jpg",
      "/images/educational/gravity_assist.jpg"
    ],
    additionalResources: [
      "NASA's Basics of Space Flight: https://solarsystem.nasa.gov/basics/",
      "European Space Agency Orbital Mechanics: https://www.esa.int/Education/Teach_with_space/Orbital_mechanics",
      "Fundamentals of Astrodynamics by Roger R. Bate, Donald D. Mueller, and Jerry E. White"
    ]
  },
  {
    id: "stellar-evolution",
    name: "Stellar Evolution",
    overview: "Stellar evolution is the process by which a star changes over the course of time, from its formation from a gas cloud to its eventual demise. The lifetime and evolutionary path of a star are primarily determined by its initial mass.",
    details: "Stars begin their lives in dense regions of molecular clouds called stellar nurseries. When parts of these clouds reach a critical density, they begin to collapse under their own gravity. As the cloud collapses, it fragments into smaller clumps that will form individual stars. The central region of a collapsing fragment grows increasingly hot and dense, forming a protostar.\n\nWhen the core temperature reaches about 10 million Kelvin, nuclear fusion of hydrogen into helium begins, and the star enters the main sequence phase—the longest period of a star's life. Our Sun is currently in this phase and will remain so for about 10 billion years in total.\n\nThe fate of a star after it exhausts its hydrogen fuel depends on its mass:\n\n- Low-mass stars (less than about 0.8 solar masses) haven't had enough time in the universe's history to evolve beyond the main sequence.\n\n- Sun-like stars (0.8 to 8 solar masses) expand into red giants, fuse helium into carbon and oxygen, lose their outer layers as planetary nebulae, and end as white dwarfs.\n\n- Massive stars (8 to 50 solar masses) proceed through a series of nuclear fusion stages, producing progressively heavier elements up to iron. They end their lives in spectacular core-collapse supernovae, leaving behind neutron stars.\n\n- Very massive stars (more than 50 solar masses) may experience pair-instability supernovae or directly collapse to form black holes.\n\nThrough supernovae and stellar winds, stars enrich the interstellar medium with heavy elements (metals), which are incorporated into new generations of stars and planets.",
    relatedConcepts: [
      "Nucleosynthesis",
      "Hertzsprung-Russell Diagram",
      "Supernovae",
      "Neutron Stars",
      "Black Holes"
    ],
    scientificImportance: "The study of stellar evolution is fundamental to astrophysics and cosmology. It helps us understand the origin of elements heavier than hydrogen and helium (which were produced in the Big Bang), the life cycles of galaxies, the potential for planetary systems around different types of stars, and the ultimate fate of our own Sun and Solar System. The elements created inside stars and distributed by supernovae are essential for the formation of planets and for life as we know it.",
    illustrations: [
      "/images/educational/stellar_evolution.jpg",
      "/images/educational/hr_diagram.jpg",
      "/images/educational/supernova.jpg"
    ],
    additionalResources: [
      "NASA's Imagine the Universe: https://imagine.gsfc.nasa.gov/science/objects/stars1.html",
      "European Space Agency Science: Stars: https://www.esa.int/Science_Exploration/Space_Science/Stars",
      "An Introduction to the Theory of Stellar Structure and Evolution by Dina Prialnik"
    ]
  },
  {
    id: "big-bang",
    name: "The Big Bang and Cosmic Evolution",
    overview: "The Big Bang theory is the prevailing cosmological model explaining the existence of the observable universe from the earliest known periods through its subsequent large-scale evolution. The model describes how the universe expanded from an initial state of extremely high density and temperature.",
    details: "According to the Big Bang theory, the universe began about 13.8 billion years ago as an extremely hot, dense point (singularity) and has been expanding ever since. The earliest stages of the universe's existence are subject to much speculation, but the timeline of cosmic evolution according to current understanding proceeds as follows:\n\n- Planck Epoch (before 10^-43 seconds): The laws of physics as we know them may not apply.\n\n- Grand Unification Epoch (10^-43 to 10^-36 seconds): The strong nuclear force separates from the electroweak force.\n\n- Inflationary Epoch (10^-36 to 10^-32 seconds): The universe undergoes exponential expansion.\n\n- Electroweak Epoch (10^-32 to 10^-12 seconds): The electromagnetic and weak nuclear forces separate.\n\n- Quark Epoch (10^-12 to 10^-6 seconds): Quarks and gluons form a quark-gluon plasma.\n\n- Hadron Epoch (10^-6 to 1 second): Quarks combine to form hadrons like protons and neutrons.\n\n- Lepton Epoch (1 to 10 seconds): The universe is dominated by leptons (electrons, positrons, neutrinos).\n\n- Nucleosynthesis (10 seconds to 20 minutes): Protons and neutrons combine to form the nuclei of the lightest elements (primarily hydrogen and helium, with traces of lithium).\n\n- Recombination (380,000 years): The universe cools enough for electrons to combine with nuclei, forming neutral atoms. Photons can now travel freely, creating the Cosmic Microwave Background (CMB) radiation.\n\n- Dark Ages (380,000 to 150 million years): Before the first stars, the universe was filled with neutral hydrogen gas.\n\n- Reionization (150 million to 1 billion years): The first stars and galaxies form and begin to reionize the neutral hydrogen.\n\n- Galaxy Formation (1 billion years onward): Galaxies form, evolve, and organize into clusters and superclusters, creating the large-scale structure we observe today.\n\nEvidence supporting the Big Bang theory includes the expansion of the universe (observed as redshift), the abundance of light elements, and the Cosmic Microwave Background radiation, which is the afterglow of the Big Bang.",
    relatedConcepts: [
      "Cosmic Inflation",
      "Dark Matter",
      "Dark Energy",
      "Cosmic Microwave Background",
      "Nucleosynthesis"
    ],
    scientificImportance: "The Big Bang theory provides the framework for understanding the origin and evolution of the universe. It explains the observed abundance of light elements, the existence of the Cosmic Microwave Background radiation, and the large-scale structure of the universe. Research in this field addresses fundamental questions about the nature of space, time, matter, and energy, as well as the ultimate fate of the universe. The interplay between particle physics and cosmology has led to insights in both fields, demonstrating the fundamental interconnectedness of the very large and the very small.",
    illustrations: [
      "/images/educational/big_bang.jpg",
      "/images/educational/cmb.jpg",
      "/images/educational/cosmic_timeline.jpg"
    ],
    additionalResources: [
      "NASA Universe 101: Big Bang Theory: https://map.gsfc.nasa.gov/universe/bb_theory.html",
      "CERN: The Big Bang: https://home.cern/science/physics/early-universe",
      "A Brief History of Time by Stephen Hawking",
      "The First Three Minutes by Steven Weinberg"
    ]
  },
  {
    id: "exoplanets",
    name: "Exoplanets and Planetary Systems",
    overview: "Exoplanets are planets outside our Solar System that orbit other stars. The study of exoplanets has revolutionized our understanding of planetary systems, providing insights into the diversity of planets and planetary system architectures throughout the galaxy.",
    details: "The first confirmed detection of an exoplanet orbiting a main-sequence star occurred in 1995, when a giant planet was discovered in a four-day orbit around the star 51 Pegasi. Since then, thousands of exoplanets have been discovered using various detection methods:\n\n- Transit Method: Observing the slight dimming of a star when a planet passes in front of it.\n\n- Radial Velocity Method: Measuring the slight wobble of a star caused by the gravitational pull of an orbiting planet.\n\n- Direct Imaging: Capturing actual images of exoplanets, typically very large planets far from their host stars.\n\n- Gravitational Microlensing: Detecting the gravitational lensing effect when a planet-star system passes in front of a more distant star.\n\n- Astrometry: Measuring the precise position of a star and detecting its subtle movement caused by orbiting planets.\n\nThe discovered exoplanets show incredible diversity, including:\n\n- Hot Jupiters: Gas giants orbiting very close to their stars.\n\n- Super-Earths: Planets with masses between Earth and Neptune.\n\n- Mini-Neptunes: Planets smaller than Neptune but with significant gaseous envelopes.\n\n- Terrestrial planets: Rocky worlds similar in composition to Earth, Venus, Mars, and Mercury.\n\n- Circumbinary planets: Planets that orbit around both stars in a binary star system.\n\nOf particular interest are potentially habitable planets that orbit in the 'habitable zone' of their star, where conditions might be right for liquid water to exist on the surface. Several such planets have been discovered, including those in the TRAPPIST-1 system, which contains seven Earth-sized planets, several potentially in the habitable zone.\n\nExoplanet atmospheres can be studied through spectroscopy during transits, revealing information about their composition. Atmospheric studies have detected water vapor, methane, carbon dioxide, and other molecules in exoplanet atmospheres.",
    relatedConcepts: [
      "Habitable Zone",
      "Planetary Formation",
      "Protoplanetary Disks",
      "Planetary Migration",
      "Astrobiology"
    ],
    scientificImportance: "The study of exoplanets has transformed our understanding of planetary systems and our place in the universe. It provides context for our own Solar System, showing that planetary systems are common but often quite different from our own. This research helps answer questions about how planets form and evolve, the conditions necessary for life, and the potential prevalence of habitable worlds in the galaxy. Current and future missions like TESS, JWST, and planned missions such as PLATO and HabEx are designed to discover and characterize more exoplanets, with a particular focus on finding potentially habitable worlds and studying their atmospheres for possible biosignatures.",
    illustrations: [
      "/images/educational/exoplanets.jpg",
      "/images/educational/exoplanet_transit.jpg",
      "/images/educational/habitable_zone.jpg"
    ],
    additionalResources: [
      "NASA Exoplanet Exploration: https://exoplanets.nasa.gov/",
      "European Space Agency Exoplanets: https://www.esa.int/Science_Exploration/Space_Science/Exoplanets",
      "The Exoplanet Handbook by Michael Perryman",
      "Exoplanet Atmospheres by Sara Seager"
    ]
  }
];