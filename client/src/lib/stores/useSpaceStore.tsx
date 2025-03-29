import { create } from "zustand";

interface SpaceState {
  // Camera and navigation
  focusedBody: string | null;
  cameraDistance: number;
  isLoaded: boolean;
  followSpacecraft: boolean;
  
  // Time control
  isPaused: boolean;
  timeScale: number;
  simulationTime: number;

  // Mission state
  activeMissionId: string | null;
  currentWaypointIndex: number;
  
  // Actions
  setFocusedBody: (id: string | null) => void;
  setCameraDistance: (distance: number) => void;
  setLoaded: (loaded: boolean) => void;
  setFollowSpacecraft: (follow: boolean) => void;
  
  // Time control actions
  setIsPaused: (paused: boolean) => void;
  setTimeScale: (scale: number) => void;
  incrementSimulationTime: (deltaTime: number) => void;
  resetSimulationTime: () => void;
  
  // Mission actions
  setActiveMission: (missionId: string | null) => void;
  setCurrentWaypoint: (index: number) => void;
}

export const useSpaceStore = create<SpaceState>((set) => ({
  // Initial state
  focusedBody: null,
  cameraDistance: 50,
  isLoaded: false,
  followSpacecraft: false,
  
  // Time control state
  isPaused: false,
  timeScale: 1.0,
  simulationTime: 0,
  
  // Mission state
  activeMissionId: null,
  currentWaypointIndex: 0,
  
  // Action creators
  setFocusedBody: (id) => set({ focusedBody: id }),
  setCameraDistance: (distance) => set({ cameraDistance: distance }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setFollowSpacecraft: (follow) => set({ followSpacecraft: follow }),
  
  // Time control actions
  setIsPaused: (paused) => set({ isPaused: paused }),
  setTimeScale: (scale) => set({ timeScale: scale }),
  incrementSimulationTime: (deltaTime) => set((state) => ({ 
    simulationTime: state.isPaused ? state.simulationTime : state.simulationTime + (deltaTime * state.timeScale) 
  })),
  resetSimulationTime: () => set({ simulationTime: 0 }),
  
  // Mission actions
  setActiveMission: (missionId) => set({ 
    activeMissionId: missionId,
    currentWaypointIndex: 0,
    simulationTime: 0
  }),
  setCurrentWaypoint: (index) => set({ currentWaypointIndex: index }),
}));
