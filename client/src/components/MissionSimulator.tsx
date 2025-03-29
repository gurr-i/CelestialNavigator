import { useState, useEffect, useRef } from "react";
import MissionTrajectory from "./MissionTrajectory";
import { Mission, MissionWaypoint } from "../lib/mission-data";
import { useSpaceStore } from "../lib/stores/useSpaceStore";
import { useAudio } from "../lib/stores/useAudio";
import { SOLAR_SYSTEM } from "../assets/planet-data";

interface MissionSimulatorProps {
  mission: Mission;
  onComplete: () => void;
  onCancel: () => void;
}

const MissionSimulator: React.FC<MissionSimulatorProps> = ({ 
  mission, 
  onComplete, 
  onCancel 
}) => {
  // State for mission progress
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [missionTime, setMissionTime] = useState<number>(0);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState<number>(0);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [waypointProgress, setWaypointProgress] = useState<number>(0);
  const [missionCompleted, setMissionCompleted] = useState<boolean>(false);
  
  // Audio for mission events
  const { playHit, playSuccess } = useAudio();
  
  // Access space store for camera controls
  const setFocusedBody = useSpaceStore(state => state.setFocusedBody);
  
  // Refs for animation timing
  const lastTimeRef = useRef<number>(0);
  const missionStartTimeRef = useRef<number>(Date.now());
  const waypointStartTimeRef = useRef<number>(0);
  
  // Set focus on starting body when mission loads
  useEffect(() => {
    setFocusedBody(mission.startingBody);
  }, [mission, setFocusedBody]);
  
  // Start the mission
  const startMission = () => {
    setIsRunning(true);
    setIsPaused(false);
    missionStartTimeRef.current = Date.now();
    waypointStartTimeRef.current = missionTime;
    
    // Focus camera on the starting body
    setFocusedBody(mission.startingBody);
    
    // Play sound
    playHit();
  };
  
  // Pause the mission
  const pauseMission = () => {
    setIsPaused(!isPaused);
  };
  
  // Update mission time and check for waypoint completion
  useEffect(() => {
    if (!isRunning || isPaused) return;
    
    const updateMissionTime = () => {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 1000; // in seconds
      lastTimeRef.current = now;
      
      // Update time based on simulation speed
      setMissionTime(prevTime => prevTime + (deltaTime * simulationSpeed));
      
      // Check if current waypoint is complete
      if (currentWaypointIndex < mission.waypoints.length) {
        const currentWaypoint = mission.waypoints[currentWaypointIndex];
        const waypointElapsedTime = missionTime - waypointStartTimeRef.current;
        const progress = Math.min(1, waypointElapsedTime / currentWaypoint.duration);
        
        setWaypointProgress(progress);
        
        // If waypoint is complete, move to next
        if (progress >= 1) {
          // Play completion sound
          playHit();
          
          // Move to next waypoint
          if (currentWaypointIndex < mission.waypoints.length - 1) {
            setCurrentWaypointIndex(prev => prev + 1);
            waypointStartTimeRef.current = missionTime;
            
            // Focus on new target body
            const nextWaypoint = mission.waypoints[currentWaypointIndex + 1];
            setFocusedBody(nextWaypoint.targetBody);
          } else {
            // Mission completed
            setMissionCompleted(true);
            setIsRunning(false);
            onComplete();
            playSuccess();
          }
        }
      }
    };
    
    // Initialize lastTimeRef on first run
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = Date.now();
    }
    
    // Set up animation frame
    const animationId = requestAnimationFrame(updateMissionTime);
    return () => cancelAnimationFrame(animationId);
  }, [
    isRunning, 
    isPaused, 
    missionTime, 
    currentWaypointIndex, 
    mission.waypoints, 
    simulationSpeed,
    setFocusedBody,
    playHit,
    playSuccess,
    onComplete
  ]);
  
  // Get the current waypoint
  const currentWaypoint = mission.waypoints[currentWaypointIndex];
  
  // Format time display (MM:SS)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <>
      {/* Render all trajectory paths */}
      {mission.waypoints.map((waypoint, index) => (
        <MissionTrajectory
          key={`${mission.id}-waypoint-${index}`}
          waypointIndex={index}
          waypoints={mission.waypoints}
          missionTime={missionTime}
          isActive={index === currentWaypointIndex && isRunning && !missionCompleted}
          color={index === currentWaypointIndex ? "#4FC3F7" : "#FFA726"}
        />
      ))}
      
      {/* Mission control UI */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 p-4 bg-black bg-opacity-80 backdrop-blur-md rounded-lg border border-[#1A237E] text-white w-[600px]">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[#FFA726] text-xl font-bold">{mission.name}</h2>
          <div className="flex gap-2">
            {!isRunning && !missionCompleted ? (
              <button 
                onClick={startMission}
                className="px-4 py-1 bg-[#1A237E] hover:bg-[#283593] rounded-md transition-colors"
              >
                Start Mission
              </button>
            ) : (
              <>
                <button 
                  onClick={pauseMission}
                  className="px-4 py-1 bg-[#1A237E] hover:bg-[#283593] rounded-md transition-colors"
                >
                  {isPaused ? "Resume" : "Pause"}
                </button>
                <button 
                  onClick={onCancel}
                  className="px-4 py-1 bg-[#FFA726] hover:bg-[#FFB74D] text-black rounded-md transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Mission time and controls */}
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm">
            <span className="text-[#4FC3F7]">Mission Time:</span> {formatTime(missionTime)}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#4FC3F7]">Speed:</span>
            <button 
              onClick={() => setSimulationSpeed(1)}
              className={`px-2 py-1 text-xs rounded ${simulationSpeed === 1 ? 'bg-[#1A237E]' : 'bg-[#424242]'}`}
            >
              1x
            </button>
            <button 
              onClick={() => setSimulationSpeed(2)}
              className={`px-2 py-1 text-xs rounded ${simulationSpeed === 2 ? 'bg-[#1A237E]' : 'bg-[#424242]'}`}
            >
              2x
            </button>
            <button 
              onClick={() => setSimulationSpeed(5)}
              className={`px-2 py-1 text-xs rounded ${simulationSpeed === 5 ? 'bg-[#1A237E]' : 'bg-[#424242]'}`}
            >
              5x
            </button>
            <button 
              onClick={() => setSimulationSpeed(10)}
              className={`px-2 py-1 text-xs rounded ${simulationSpeed === 10 ? 'bg-[#1A237E]' : 'bg-[#424242]'}`}
            >
              10x
            </button>
          </div>
        </div>
        
        {/* Waypoint info */}
        {currentWaypoint && (
          <div className="mb-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-[#4FC3F7] text-md font-semibold">{currentWaypoint.name}</h3>
                <p className="text-sm text-gray-300">{currentWaypoint.description}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#4FC3F7]">Target: {SOLAR_SYSTEM.find(body => body.id === currentWaypoint.targetBody)?.name}</div>
                {currentWaypoint.deltaV && (
                  <div className="text-xs text-gray-300">Delta-v: {currentWaypoint.deltaV} km/s</div>
                )}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-2 h-2 bg-[#424242] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#4FC3F7]" 
                style={{ width: `${waypointProgress * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Waypoint list */}
        <div className="mt-2 max-h-32 overflow-y-auto pr-2 border-t border-[#424242] pt-2">
          <div className="text-xs text-[#4FC3F7] mb-1">Mission Waypoints:</div>
          {mission.waypoints.map((waypoint, index) => (
            <div 
              key={`waypoint-list-${index}`}
              className={`flex justify-between items-center py-1 text-xs ${
                index === currentWaypointIndex 
                  ? 'text-white bg-[#1A237E] bg-opacity-50 px-2 rounded' 
                  : index < currentWaypointIndex 
                    ? 'text-gray-400' 
                    : 'text-gray-300'
              }`}
            >
              <span>
                {index + 1}. {waypoint.name} {index < currentWaypointIndex && '✓'}
              </span>
              <span>{waypoint.type}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MissionSimulator;