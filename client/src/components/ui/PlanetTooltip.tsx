import { useState, useRef, useEffect } from 'react';
import { useSpaceStore } from '../../lib/stores/useSpaceStore';
import { SOLAR_SYSTEM } from '../../assets/planet-data';
import { cn } from '../../lib/utils';

interface PlanetTooltipProps {
  hoveredObjectId?: string | null;
}

/**
 * PlanetTooltip component provides a hover tooltip with basic info about celestial bodies
 */
const PlanetTooltip: React.FC<PlanetTooltipProps> = ({ hoveredObjectId }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Find the hovered body data
  const bodyData = hoveredObjectId 
    ? SOLAR_SYSTEM.find(body => body.id === hoveredObjectId)
    : null;

  // Update mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Position the tooltip to the right of the cursor with some offset
      setPosition({
        x: e.clientX + 15,
        y: e.clientY - 10
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Show/hide the tooltip based on hovered body
  useEffect(() => {
    if (hoveredObjectId) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [hoveredObjectId]);

  // Adjust tooltip position if it would go off-screen
  useEffect(() => {
    if (tooltipRef.current && visible) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Only adjust position if we actually need to (prevents infinite loops)
      let needsAdjustment = false;
      let adjustedX = position.x;
      let adjustedY = position.y;
      
      // Adjust X position if tooltip would overflow right edge
      if (position.x + tooltipRect.width > windowWidth) {
        adjustedX = position.x - tooltipRect.width - 30; // Position to the left of cursor
        needsAdjustment = true;
      }
      
      // Adjust Y position if tooltip would overflow bottom edge
      if (position.y + tooltipRect.height > windowHeight) {
        adjustedY = windowHeight - tooltipRect.height - 10;
        needsAdjustment = true;
      }
      
      // Only update position if we need to adjust it
      if (needsAdjustment) {
        setPosition({ x: adjustedX, y: adjustedY });
      }
    }
  // Only include visible in dependency array to prevent infinite loops
  }, [visible]);

  if (!visible || !bodyData) return null;

  return (
    <div
      ref={tooltipRef}
      className={cn(
        "fixed z-50 p-3 rounded-md shadow-md",
        "bg-black bg-opacity-80 border border-[#1A237E]",
        "text-white backdrop-blur-sm",
        "transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: '300px'
      }}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-[#4FC3F7] font-bold text-lg">{bodyData.name}</h3>
        <p className="text-xs text-gray-300 uppercase tracking-wider">{bodyData.type}</p>
        
        {bodyData.description && (
          <p className="text-sm mt-1">{bodyData.description}</p>
        )}
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-gray-200">
          {bodyData.diameter && (
            <div className="flex justify-between gap-2">
              <span className="text-gray-400">Diameter:</span>
              <span>{bodyData.diameter} km</span>
            </div>
          )}
          
          {bodyData.temperature && (
            <div className="flex justify-between gap-2">
              <span className="text-gray-400">Temperature:</span>
              <span>{bodyData.temperature}</span>
            </div>
          )}
          
          {bodyData.dayLength && (
            <div className="flex justify-between gap-2 col-span-2">
              <span className="text-gray-400">Day Length:</span>
              <span>{bodyData.dayLength}</span>
            </div>
          )}
          
          {bodyData.yearLength && (
            <div className="flex justify-between gap-2 col-span-2">
              <span className="text-gray-400">Year Length:</span>
              <span>{bodyData.yearLength}</span>
            </div>
          )}
        </div>
        
        <p className="text-xs mt-2 text-[#FFA726] italic">Click for more details</p>
      </div>
    </div>
  );
};

export default PlanetTooltip;