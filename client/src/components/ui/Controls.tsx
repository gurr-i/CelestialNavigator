import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { useSpaceStore } from "../../lib/stores/useSpaceStore";
import { useAudio } from "../../lib/stores/useAudio";

const Controls = () => {
  const [isVisible, setIsVisible] = useState(true);
  const isLoaded = useSpaceStore(state => state.isLoaded);
  const setCameraDistance = useSpaceStore(state => state.setCameraDistance);
  const cameraDistance = useSpaceStore(state => state.cameraDistance);
  const { isMuted, toggleMute } = useAudio();

  // Hide controls after a short period
  useEffect(() => {
    if (isLoaded) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoaded]);

  // Toggle controls visibility on mouse move
  useEffect(() => {
    const handleMouseMove = () => {
      setIsVisible(true);
      
      // Hide again after 3 seconds of inactivity
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      
      return () => clearTimeout(timeout);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className={cn(
        "absolute bottom-6 left-1/2 transform -translate-x-1/2 p-4 bg-[#111111] bg-opacity-70",
        "backdrop-blur-md rounded-lg border border-[#1A237E] transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="flex space-x-4 items-center">
        {/* Camera distance slider */}
        <div className="flex flex-col">
          <span className="text-[#4FC3F7] text-xs mb-1">Camera Distance</span>
          <input 
            type="range" 
            min="10" 
            max="200" 
            value={cameraDistance} 
            onChange={(e) => setCameraDistance(Number(e.target.value))}
            className="w-40 accent-[#FFA726]"
          />
        </div>
        
        {/* Mute button */}
        <button 
          onClick={toggleMute}
          className={cn(
            "px-3 py-2 rounded-md bg-[#424242] hover:bg-[#616161] transition-colors",
            "border border-[#1A237E] flex items-center gap-2"
          )}
        >
          <span className="text-white text-sm">
            {isMuted ? "Unmute" : "Mute"} Sound
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-[#4FC3F7]"
          >
            {isMuted ? (
              <>
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </>
            ) : (
              <>
                <path d="M3 10v4a1 1 0 0 0 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4a1 1 0 0 0-1 1z"></path>
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"></path>
              </>
            )}
          </svg>
        </button>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-white">
        <div className="flex items-center">
          <kbd className="px-2 py-1 bg-[#424242] rounded mr-2">W/↑</kbd>
          <span>Move Forward</span>
        </div>
        <div className="flex items-center">
          <kbd className="px-2 py-1 bg-[#424242] rounded mr-2">S/↓</kbd>
          <span>Move Backward</span>
        </div>
        <div className="flex items-center">
          <kbd className="px-2 py-1 bg-[#424242] rounded mr-2">A/←</kbd>
          <span>Move Left</span>
        </div>
        <div className="flex items-center">
          <kbd className="px-2 py-1 bg-[#424242] rounded mr-2">D/→</kbd>
          <span>Move Right</span>
        </div>
        <div className="flex items-center">
          <kbd className="px-2 py-1 bg-[#424242] rounded mr-2">E</kbd>
          <span>Zoom In</span>
        </div>
        <div className="flex items-center">
          <kbd className="px-2 py-1 bg-[#424242] rounded mr-2">Q</kbd>
          <span>Zoom Out</span>
        </div>
        <div className="flex items-center">
          <kbd className="px-2 py-1 bg-[#424242] rounded mr-2">R</kbd>
          <span>Reset Camera</span>
        </div>
        <div className="flex items-center">
          <kbd className="px-2 py-1 bg-[#424242] rounded mr-2">T</kbd>
          <span>Toggle Spacecraft</span>
        </div>
      </div>
    </div>
  );
};

export default Controls;
