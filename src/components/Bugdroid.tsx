/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import * as THREE from 'three';

export const Bugdroid = ({ position, rotation, scale = 1, isEpic = false }: { position?: [number, number, number], rotation?: [number, number, number], scale?: number | [number, number, number], isEpic?: boolean }) => {
  const green = "#34A853";
  
  const materialProps = {
    color: green,
    roughness: 0.4,
    metalness: 0.1,
    emissive: isEpic ? green : '#000000',
    emissiveIntensity: isEpic ? 1.5 : 0
  };
  
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Body */}
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 1.8, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      {/* Head (Dome) */}
      <mesh position={[0, 3.3, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.4, 3.7, 0.9]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} emissive={isEpic ? "#FFFFFF" : "#000000"} emissiveIntensity={isEpic ? 1 : 0} />
      </mesh>
      <mesh position={[0.4, 3.7, 0.9]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} emissive={isEpic ? "#FFFFFF" : "#000000"} emissiveIntensity={isEpic ? 1 : 0} />
      </mesh>
      
      {/* Antennas */}
      <mesh position={[-0.4, 4.3, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.6]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <mesh position={[0.4, 4.3, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.6]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-1.4, 2.4, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.25, 1.3, 4, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <mesh position={[1.4, 2.4, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.25, 1.3, 4, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.4, 0.75, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.25, 1, 4, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <mesh position={[0.4, 0.75, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.25, 1, 4, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    </group>
  );
};
