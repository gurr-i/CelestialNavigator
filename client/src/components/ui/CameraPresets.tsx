import { useThree } from "@react-three/fiber";
import { Button } from "./button";

const presets = {
  overview: { position: [0, 30, 100], target: [0, 0, 0] },
  topDown: { position: [0, 200, 0], target: [0, 0, 0] },
  sideView: { position: [200, 0, 0], target: [0, 0, 0] },
  closeUp: { position: [0, 10, 30], target: [0, 0, 0] }
};

// This component goes inside the Canvas
export function CameraPresetsController() {
  const { camera } = useThree();
  
  // Expose camera control through window for UI to access
  (window as any).setCameraPreset = (preset: keyof typeof presets) => {
    const { position, target } = presets[preset];
    camera.position.set(...position);
    camera.lookAt(...target);
  };
  
  return null;
}

// This component goes outside the Canvas as UI
export function CameraPresets() {
  const setPreset = (preset: keyof typeof presets) => {
    (window as any).setCameraPreset?.(preset);
  };

  return (
    <div className="absolute bottom-4 left-4 flex flex-col gap-2">
      {Object.entries(presets).map(([name]) => (
        <Button
          key={name}
          onClick={() => setPreset(name as keyof typeof presets)}
          className="text-sm"
        >
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Button>
      ))}
    </div>
  );
} 