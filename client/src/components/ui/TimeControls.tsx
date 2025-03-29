import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { useSpaceStore } from "../../lib/stores/useSpaceStore";

/**
 * TimeControls component provides UI for time scaling in the simulation
 * It allows users to pause, play, speed up, or slow down time
 */
const TimeControls = () => {
  const [isVisible, setIsVisible] = useState(true);
  const isPaused = useSpaceStore(state => state.isPaused);
  const timeScale = useSpaceStore(state => state.timeScale);
  const setIsPaused = useSpaceStore(state => state.setIsPaused);
  const setTimeScale = useSpaceStore(state => state.setTimeScale);
  const isLoaded = useSpaceStore(state => state.isLoaded);

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

  // Time scale options
  const timeScaleOptions = [
    { label: "0.25x", value: 0.25 },
    { label: "0.5x", value: 0.5 },
    { label: "1x", value: 1 },
    { label: "2x", value: 2 },
    { label: "5x", value: 5 },
    { label: "10x", value: 10 }
  ];

  // Toggle pause/play
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div 
      className={cn(
        "absolute top-6 right-6 p-3 bg-[#111111] bg-opacity-70",
        "backdrop-blur-md rounded-lg border border-[#1A237E] transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Pause/Play button */}
        <button 
          onClick={togglePause}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            "border border-[#1A237E] transition-colors",
            isPaused ? "bg-[#FFA726] text-black" : "bg-[#1A237E] text-white"
          )}
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          )}
        </button>
        
        {/* Time scale controls */}
        <div className="flex flex-col">
          <span className="text-[#4FC3F7] text-xs mb-1">Time Scale</span>
          <div className="flex space-x-1">
            {timeScaleOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setTimeScale(option.value)}
                className={cn(
                  "px-2 py-1 text-xs rounded transition-colors",
                  timeScale === option.value 
                    ? "bg-[#1A237E] text-white" 
                    : "bg-[#424242] text-gray-300 hover:bg-[#616161]"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Current time scale indicator */}
      <div className="mt-2 text-center text-xs text-[#4FC3F7]">
        {isPaused 
          ? "Simulation Paused" 
          : `Simulation running at ${timeScale}x speed`}
      </div>
    </div>
  );
};

export default TimeControls;