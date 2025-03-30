import React from 'react';
import * as THREE from 'three';

// A placeholder for the ISS model until the actual GLB is downloaded
const ISSPlaceholder: React.FC = () => {
  // Create a simple model resembling the ISS with basic shapes
  const createISSModel = () => {
    const group = new THREE.Group();

    // Main body - central cylinder
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.8, roughness: 0.2 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI / 2; // Orient horizontally
    group.add(body);

    // Solar panels - two large flat rectangles
    const panelGeometry = new THREE.BoxGeometry(3, 1, 0.05);
    const panelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2244aa, 
      metalness: 0.3, 
      roughness: 0.4,
      side: THREE.DoubleSide 
    });
    
    // Left panel
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    leftPanel.position.set(-1.6, 0, 0);
    group.add(leftPanel);
    
    // Right panel
    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    rightPanel.position.set(1.6, 0, 0);
    group.add(rightPanel);
    
    // Connect panels to body with cylinders
    const connectorGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    const connectorMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.1 });
    
    const leftConnector = new THREE.Mesh(connectorGeometry, connectorMaterial);
    leftConnector.rotation.z = Math.PI / 2;
    leftConnector.position.set(-0.8, 0, 0);
    group.add(leftConnector);
    
    const rightConnector = new THREE.Mesh(connectorGeometry, connectorMaterial);
    rightConnector.rotation.z = Math.PI / 2;
    rightConnector.position.set(0.8, 0, 0);
    group.add(rightConnector);
    
    // Add some small modules and details
    for (let i = -0.5; i <= 0.5; i += 0.25) {
      const moduleGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
      const moduleMaterial = new THREE.MeshStandardMaterial({ 
        color: Math.random() > 0.5 ? 0xffffff : 0xbbbbbb, 
        metalness: 0.7, 
        roughness: 0.3 
      });
      const module = new THREE.Mesh(moduleGeometry, moduleMaterial);
      module.position.set(0, i, 0.2);
      group.add(module);
    }
    
    return group;
  };

  const issModel = createISSModel();
  
  // Add a point light to make it visible
  const light = new THREE.PointLight(0xffffff, 0.5, 10);
  light.position.set(0, 0, 0);
  
  return (
    <group>
      <primitive object={issModel} />
      <primitive object={light} />
    </group>
  );
};

export default ISSPlaceholder; 