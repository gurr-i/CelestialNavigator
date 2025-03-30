import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector2 } from 'three';

export function TouchControls() {
  const { camera } = useThree();
  const touchStart = useRef(new Vector2());
  const isDragging = useRef(false);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        touchStart.current.set(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      
      // Rotate camera based on touch movement
      camera.rotation.y -= deltaX * 0.01;
      camera.rotation.x -= deltaY * 0.01;
      
      touchStart.current.set(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    // Add touch event listeners
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [camera]);

  return null;
} 