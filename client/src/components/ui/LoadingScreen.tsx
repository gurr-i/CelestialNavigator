import { useState, useEffect } from "react";
import { useSpaceStore } from "../../lib/stores/useSpaceStore";
import { cn } from "../../lib/utils";

const LoadingScreen = () => {
  const isLoaded = useSpaceStore(state => state.isLoaded);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  // Simulate loading progress
  useEffect(() => {
    if (isLoaded) {
      // When loaded, complete progress to 100%
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            
            // Wait a bit then fade out
            setTimeout(() => {
              setIsVisible(false);
            }, 500);
            
            return 100;
          }
          return Math.min(prev + 5, 100);
        });
      }, 50);
      
      return () => clearInterval(interval);
    } else {
      // While loading, progress to 90%
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + Math.random() * 5;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [isLoaded]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={cn(
        "fixed inset-0 bg-[#000000] z-50 flex flex-col items-center justify-center",
        "transition-opacity duration-1000", 
        progress >= 100 ? "opacity-0" : "opacity-100"
      )}
    >
      <h1 className="text-[#FFA726] text-5xl md:text-6xl font-bold mb-6 text-center">
        Cosmic Explorer
      </h1>
      
      <div className="w-64 md:w-80 bg-[#212121] rounded-full h-3 mb-4 overflow-hidden">
        <div
          className="h-full bg-[#4FC3F7] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="text-[#4FC3F7] text-lg">
        {progress < 100 ? "Loading space assets..." : "Launching exploration..."}
      </p>
      
      <div className="mt-10 flex justify-center space-x-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-[#1A237E] animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: "1s"
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
