import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { useSpaceStore } from "./lib/stores/useSpaceStore";
import "@fontsource/inter";
import SpaceScene from "./components/SpaceScene";
import LoadingScreen from "./components/ui/LoadingScreen";
import Controls from "./components/ui/Controls";
import InfoPanel from "./components/ui/InfoPanel";
import Navigation from "./components/ui/Navigation";
import TimeControls from "./components/ui/TimeControls";
import EducationalPanel from "./components/educational/EducationalPanel";
import PlanetTooltip from "./components/ui/PlanetTooltip";

// Define control keys for navigation
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "zoomIn", keys: ["KeyE"] },
  { name: "zoomOut", keys: ["KeyQ"] },
  { name: "reset", keys: ["KeyR"] },
  { name: "toggle", keys: ["KeyT"] }
];

// Main App component
function App() {
  const { setBackgroundMusic } = useAudio();
  const isEducationalPanelOpen = useSpaceStore(state => state.isEducationalPanelOpen);
  const setEducationalPanelOpen = useSpaceStore(state => state.setEducationalPanelOpen);
  const hoveredBody = useSpaceStore(state => state.hoveredBody);

  // Set up background music
  useEffect(() => {
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);
    
    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, [setBackgroundMusic]);

  return (
    <div className="w-full h-full bg-black">
      <KeyboardControls map={controls}>
        <Canvas
          shadows
          camera={{
            position: [0, 30, 100],
            fov: 45,
            near: 0.1,
            far: 10000
          }}
          gl={{
            antialias: true,
            powerPreference: "default"
          }}
        >
          <color attach="background" args={["#000000"]} />
          <Suspense fallback={null}>
            <SpaceScene />
          </Suspense>
        </Canvas>
        
        {/* UI Overlays */}
        <InfoPanel />
        <Controls />
        <Navigation />
        <TimeControls />
        <LoadingScreen />
        <PlanetTooltip hoveredObjectId={hoveredBody} />
        <EducationalPanel 
          isOpen={isEducationalPanelOpen} 
          onClose={() => setEducationalPanelOpen(false)} 
        />
      </KeyboardControls>
    </div>
  );
}

export default App;
