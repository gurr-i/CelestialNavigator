import { VRButton } from '@react-three/xr';
import { Canvas } from '@react-three/fiber';
import SpaceScene from './SpaceScene';

export function VRScene() {
  return (
    <>
      <VRButton />
      <Canvas>
        <SpaceScene />
      </Canvas>
    </>
  );
} 