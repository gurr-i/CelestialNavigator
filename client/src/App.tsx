import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
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
import { CameraPresets } from "./components/ui/CameraPresets";
import { ScreenCapture, ScreenCaptureController } from "./components/ui/ScreenCapture";
import { TouchControls } from "./components/TouchControls";
import { VRScene } from "./components/VRScene";
import { CameraPresetsController } from "./components/ui/CameraPresets";

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
  const isVRMode = useSpaceStore(state => state.isVRMode);
  const [webGLSupported, setWebGLSupported] = useState(true);

  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      console.error('WebGL is not supported by your browser or device');
      setWebGLSupported(false);
    }
  }, []);

  // Set up background music
  useEffect(() => {
    const bgMusic = new Audio(`${import.meta.env.BASE_URL}sounds/background.mp3`);
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    
    // Add error handling
    bgMusic.addEventListener('error', (e) => {
      console.error('Error loading background music:', e);
    });
    
    setBackgroundMusic(bgMusic);
    
    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    };
  }, [setBackgroundMusic]);

  if (!webGLSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white p-8 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">WebGL Support Required</h1>
          <p className="mb-4">
            Celestial Navigator requires WebGL to render 3D graphics. 
            Your browser or device does not support WebGL.
          </p>
          <p>
            Please try using a modern browser like Chrome, Firefox, or Edge,
            or check if WebGL is enabled in your browser settings.
          </p>
        </div>
      </div>
    );
  }

  if (isVRMode) {
    return <VRScene />;
  }

  return (
    <div className="w-full h-full bg-black">
      <KeyboardControls map={controls}>
        <Canvas
          shadows={false}
          dpr={[0.5, 1]}
          camera={{
            position: [0, 30, 100],
            fov: 45,
            near: 0.1,
            far: 10000
          }}
          gl={{
            antialias: false,
            powerPreference: "high-performance",
            alpha: false,
            stencil: false,
            depth: true,
            failIfMajorPerformanceCaveat: false,
            precision: "lowp"
          }}
          frameloop="demand"
          performance={{ 
            min: 0.5,
            max: 1
          }}
          onCreated={({ gl, scene, camera }) => {
            gl.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
            
            console.log('WebGL Renderer Information:', gl.getContextAttributes());
            
            const context = gl.getContext();
            if (context) {
              console.log('WebGL Version:', context.getParameter(context.VERSION));
              console.log('WebGL Vendor:', context.getParameter(context.VENDOR));
              console.log('WebGL Renderer:', context.getParameter(context.RENDERER));
            }
            
            scene.children.forEach(child => {
              if (child.type === 'AmbientLight' || child.type === 'DirectionalLight') {
                if ('intensity' in child) {
                  (child as any).intensity *= 0.8;
                }
              }
            });
          }}
        >
          <color attach="background" args={["#000000"]} />
          <Suspense fallback={null}>
            <SpaceScene />
            <TouchControls />
            <CameraPresetsController />
            <ScreenCaptureController />
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
        <CameraPresets />
        <ScreenCapture />
      </KeyboardControls>
    </div>
  );
}

export default App;
