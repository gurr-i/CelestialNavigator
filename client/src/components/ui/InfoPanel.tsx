import { useEffect, useState } from "react";
import { useSpaceStore } from "../../lib/stores/useSpaceStore";
import { SOLAR_SYSTEM } from "../../assets/planet-data";
import { cn } from "../../lib/utils";

const InfoPanel = () => {
  const focusedBody = useSpaceStore(state => state.focusedBody);
  const [bodyInfo, setBodyInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Get information about the currently focused body
  useEffect(() => {
    if (focusedBody) {
      const info = SOLAR_SYSTEM.find(body => body.id === focusedBody);
      setBodyInfo(info);
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [focusedBody]);

  if (!isVisible || !bodyInfo) return null;

  return (
    <div 
      className={cn(
        "absolute bottom-6 right-6 p-6 w-80 bg-[#111111] bg-opacity-70 backdrop-blur-md",
        "text-white rounded-lg border border-[#1A237E] shadow-lg transition-all duration-300",
        "transform origin-bottom-right hover:scale-105"
      )}
    >
      <h2 className="text-[#FFA726] text-2xl font-bold mb-3">{bodyInfo.name}</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-[#4FC3F7]">Type:</span>
          <span className="text-white capitalize">{bodyInfo.type}</span>
        </div>
        
        {bodyInfo.diameter && (
          <div className="flex justify-between">
            <span className="text-[#4FC3F7]">Diameter:</span>
            <span className="text-white">{bodyInfo.diameter} km</span>
          </div>
        )}
        
        {bodyInfo.dayLength && (
          <div className="flex justify-between">
            <span className="text-[#4FC3F7]">Day Length:</span>
            <span className="text-white">{bodyInfo.dayLength}</span>
          </div>
        )}
        
        {bodyInfo.yearLength && (
          <div className="flex justify-between">
            <span className="text-[#4FC3F7]">Year Length:</span>
            <span className="text-white">{bodyInfo.yearLength}</span>
          </div>
        )}
        
        {bodyInfo.temperature && (
          <div className="flex justify-between">
            <span className="text-[#4FC3F7]">Temperature:</span>
            <span className="text-white">{bodyInfo.temperature}</span>
          </div>
        )}
      </div>
      
      {bodyInfo.description && (
        <div className="mt-4 border-t border-[#1A237E] pt-3">
          <p className="text-white text-sm leading-relaxed">{bodyInfo.description}</p>
        </div>
      )}
      
      <button 
        className="mt-4 w-full py-2 bg-[#1A237E] hover:bg-[#283593] text-white rounded-md transition-colors"
        onClick={() => setIsVisible(false)}
      >
        Close
      </button>
    </div>
  );
};

export default InfoPanel;
