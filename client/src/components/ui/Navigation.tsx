import { useState } from "react";
import { useSpaceStore } from "../../lib/stores/useSpaceStore";
import { SOLAR_SYSTEM } from "../../assets/planet-data";
import { cn } from "../../lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const setFocusedBody = useSpaceStore(state => state.setFocusedBody);
  const focusedBody = useSpaceStore(state => state.focusedBody);
  const isLoaded = useSpaceStore(state => state.isLoaded);
  
  // Group celestial bodies by type
  const groupedBodies = SOLAR_SYSTEM.reduce((acc: Record<string, any[]>, body) => {
    if (!acc[body.type]) {
      acc[body.type] = [];
    }
    acc[body.type].push(body);
    return acc;
  }, {});
  
  // Order of types to display
  const typeOrder = ["star", "planet", "moon", "dwarf", "spacecraft"];
  
  if (!isLoaded) return null;
  
  return (
    <div className="absolute top-6 left-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          "bg-[#1A237E] hover:bg-[#283593] text-white transition-colors",
          "border border-[#4FC3F7] shadow-lg"
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="4"></circle>
          <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
          <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
          <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
          <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
        </svg>
      </button>
      
      {isOpen && (
        <div 
          className={cn(
            "mt-2 p-4 bg-[#111111] bg-opacity-80 backdrop-blur-md rounded-lg",
            "border border-[#1A237E] w-64 shadow-lg"
          )}
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[#FFA726] text-lg font-bold">Navigation</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[#4FC3F7] hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="space-y-3">
            {typeOrder.map(type => {
              if (!groupedBodies[type] || groupedBodies[type].length === 0) return null;
              
              return (
                <div key={type}>
                  <h3 className="text-[#4FC3F7] text-sm font-semibold mb-1 capitalize">
                    {type === "dwarf" ? "Dwarf Planets" : type + "s"}
                  </h3>
                  <div className="space-y-1">
                    {groupedBodies[type].map(body => (
                      <button
                        key={body.id}
                        onClick={() => {
                          setFocusedBody(body.id);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors",
                          focusedBody === body.id
                            ? "bg-[#1A237E] text-white"
                            : "hover:bg-[#424242] text-gray-200 bg-[#212121]"
                        )}
                      >
                        {body.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          <button 
            onClick={() => setFocusedBody(null)}
            className={cn(
              "mt-3 w-full py-2 bg-[#1A237E] hover:bg-[#283593] text-white rounded-md transition-colors",
              "border border-[#1A237E]"
            )}
          >
            Overview
          </button>
        </div>
      )}
    </div>
  );
};

export default Navigation;
