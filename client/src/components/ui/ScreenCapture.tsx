import { useThree } from "@react-three/fiber";

// This component goes inside the Canvas
export function ScreenCaptureController() {
  const { gl, scene, camera } = useThree();
  
  // Expose screenshot function through window for UI to access
  (window as any).takeScreenshot = () => {
    gl.render(scene, camera);
    return gl.domElement.toDataURL();
  };
  
  return null;
}

// This component goes outside the Canvas as UI
export function ScreenCapture() {
  const handleScreenshot = () => {
    const dataUrl = (window as any).takeScreenshot?.();
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = 'celestial-navigator-screenshot.png';
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <button 
      onClick={handleScreenshot}
      className="absolute bottom-4 right-4 p-2 bg-gray-800 text-white rounded"
    >
      Take Screenshot
    </button>
  );
} 