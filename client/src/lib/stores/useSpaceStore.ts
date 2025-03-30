import { create } from 'zustand';

export interface SpaceState {
  // Navigation
  focusedBody: string | null;
  hoveredBody: string | null;
  cameraDistance: number;
  isLoaded: boolean;
  followSpacecraft: boolean;
  
  // Time
  isPaused: boolean;
  timeScale: number;
  simulationTime: number;
  
  // UI
  isEducationalPanelOpen: boolean;
  isVRMode: boolean;
  
  // Actions
  setFocusedBody: (id: string | null) => void;
  setHoveredBody: (id: string | null) => void;
  setCameraDistance: (distance: number) => void;
  setLoaded: (loaded: boolean) => void;
  setFollowSpacecraft: (follow: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  setTimeScale: (scale: number) => void;
  incrementSimulationTime: (deltaTime: number) => void;
  setEducationalPanelOpen: (isOpen: boolean) => void;
  setVRMode: (enabled: boolean) => void;
}

export const useSpaceStore = create<SpaceState>((set) => ({
  // Initial state
  focusedBody: null,
  hoveredBody: null,
  cameraDistance: 50,
  isLoaded: false,
  followSpacecraft: false,
  isPaused: false,
  timeScale: 1.0,
  simulationTime: 0,
  isEducationalPanelOpen: false,
  isVRMode: false,
  
  // Actions
  setFocusedBody: (id) => set({ focusedBody: id }),
  setHoveredBody: (id) => set({ hoveredBody: id }),
  setCameraDistance: (distance) => set({ cameraDistance: distance }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setFollowSpacecraft: (follow) => set({ followSpacecraft: follow }),
  setIsPaused: (paused) => set({ isPaused: paused }),
  setTimeScale: (scale) => set({ timeScale: scale }),
  incrementSimulationTime: (deltaTime) => set((state) => ({ 
    simulationTime: state.isPaused ? state.simulationTime : state.simulationTime + (deltaTime * state.timeScale) 
  })),
  setEducationalPanelOpen: (isOpen) => set({ isEducationalPanelOpen: isOpen }),
  setVRMode: (enabled) => set({ isVRMode: enabled }),
})); 