import React from 'react';
import * as THREE from 'three';

// A placeholder for the James Webb Space Telescope model until the actual GLB is downloaded
const JWSTPlaceholder: React.FC = () => {
  // Create a simple model resembling the JWST with basic shapes
  const createJWSTModel = () => {
    const group = new THREE.Group();

    // Main mirror - hexagonal shape
    const mirrorGeometry = new THREE.CircleGeometry(0.8, 6);
    const mirrorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xd4af37, // Gold color
      metalness: 1.0, 
      roughness: 0.2,
      side: THREE.DoubleSide,
      emissive: 0x444422,
      emissiveIntensity: 0.2
    });
    const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    group.add(mirror);
    
    // Honeycomb pattern on the mirror
    for (let i = 0; i < 19; i++) {
      const angle = (Math.PI * 2 / 19) * i;
      const radius = 0.5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      // Small hexagon for each mirror segment
      const segmentGeometry = new THREE.CircleGeometry(0.15, 6);
      const segmentMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, // Bright gold
        metalness: 1.0, 
        roughness: 0.1,
        side: THREE.DoubleSide 
      });
      
      const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
      segment.position.set(x, y, 0.01); // Slightly in front of main mirror
      group.add(segment);
    }
    
    // Secondary mirror support
    const supportGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.6, 8);
    const supportMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7, roughness: 0.3 });
    const support = new THREE.Mesh(supportGeometry, supportMaterial);
    support.position.set(0, 0, 0.8); // Extend in front of the mirror
    support.rotation.x = Math.PI / 2;
    group.add(support);
    
    // Secondary mirror
    const secondaryGeometry = new THREE.CircleGeometry(0.2, 32);
    const secondaryMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xd4af37, 
      metalness: 1.0, 
      roughness: 0.1,
      side: THREE.DoubleSide 
    });
    const secondaryMirror = new THREE.Mesh(secondaryGeometry, secondaryMaterial);
    secondaryMirror.position.set(0, 0, 1.6); // At the end of the support
    group.add(secondaryMirror);
    
    // Sun shield (5 layers)
    const shieldGeometry = new THREE.PlaneGeometry(3, 2);
    
    for (let i = 0; i < 5; i++) {
      const shieldMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf2f2f2, 
        metalness: 0.5, 
        roughness: 0.4,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      
      const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
      shield.position.set(0, 0, -0.1 - (i * 0.05)); // Below the mirror, with spacing
      shield.rotation.x = Math.PI / 10; // Slight angle
      group.add(shield);
    }
    
    // Spacecraft bus (the "body")
    const busGeometry = new THREE.BoxGeometry(0.8, 0.8, 1);
    const busMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      metalness: 0.7, 
      roughness: 0.3 
    });
    const bus = new THREE.Mesh(busGeometry, busMaterial);
    bus.position.set(0, 0, -0.7); // Below the sun shield
    group.add(bus);
    
    // Solar panels
    const panelGeometry = new THREE.BoxGeometry(1.8, 0.6, 0.05);
    const panelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2244aa, 
      metalness: 0.3, 
      roughness: 0.4,
      side: THREE.DoubleSide 
    });
    
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(0, -1, -0.7);
    group.add(panel);
    
    return group;
  };

  const jwstModel = createJWSTModel();
  
  // Add a point light to make it visible
  const light = new THREE.PointLight(0xffffff, 0.5, 10);
  light.position.set(0, 0, 0);
  
  return (
    <group>
      <primitive object={jwstModel} />
      <primitive object={light} />
    </group>
  );
};

export default JWSTPlaceholder; 