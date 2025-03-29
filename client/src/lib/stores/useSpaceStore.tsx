import { create } from "zustand";

interface SpaceState {
  // Camera and navigation
  focusedBody: string | null;
  cameraDistance: number;
  isLoaded: boolean;
  followSpacecraft: boolean;
  
  // Actions
  setFocusedBody: (id: string | null) => void;
  setCameraDistance: (distance: number) => void;
  setLoaded: (loaded: boolean) => void;
  setFollowSpacecraft: (follow: boolean) => void;
}

export const useSpaceStore = create<SpaceState>((set) => ({
  // Initial state
  focusedBody: null,
  cameraDistance: 50,
  isLoaded: false,
  followSpacecraft: false,
  
  // Action creators
  setFocusedBody: (id) => set({ focusedBody: id }),
  setCameraDistance: (distance) => set({ cameraDistance: distance }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setFollowSpacecraft: (follow) => set({ followSpacecraft: follow }),
}));
