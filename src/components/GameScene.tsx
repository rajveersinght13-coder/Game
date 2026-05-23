/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Canvas, useThree } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { ClawMachine } from './ClawMachine';
import { Claw } from './Claw';
import { Prizes } from './Prizes';
import { Bugdroid } from './Bugdroid';
import { useGameStore } from '../store';
import { useEffect } from 'react';

const CameraSetup = ({ isLocal }: { isLocal: boolean }) => {
  const { camera, size } = useThree();
  const isPortrait = size.height > size.width;

  useEffect(() => {
    if (isLocal) {
      // Front view when playing
      if (isPortrait) {
        camera.position.set(0, 8, 35); // Further back for portrait
        (camera as any).fov = 55;
      } else {
        camera.position.set(0, 8, 26);
        (camera as any).fov = 45;
      }
    } else {
      // Diagonal view when spectating
      if (isPortrait) {
        camera.position.set(22, 10, 22);
        (camera as any).fov = 55;
      } else {
        camera.position.set(18, 8, 18);
        (camera as any).fov = 45;
      }
    }
    camera.lookAt(new THREE.Vector3(0, 4, 0));
    camera.updateProjectionMatrix();
  }, [isLocal, camera, isPortrait]);

  return null;
};

export const GameScene = () => {
  const activePlayer = useGameStore(state => state.activePlayer);
  const myId = useGameStore(state => state.myId);
  const isLocal = activePlayer === myId && myId !== null;

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return (
    <Canvas shadows dpr={isTouch ? [1, 1.5] : [1, 2]} gl={{ antialias: !isTouch }}>
      <PerspectiveCamera makeDefault position={[18, 8, 22]} fov={45} />
      <CameraSetup isLocal={isLocal} />
      <ambientLight intensity={2.5} />
      <pointLight 
        position={[0, 9, 0]} 
        intensity={4.0} 
        castShadow 
        shadow-mapSize={isTouch ? [512, 512] : [1024, 1024]} 
        shadow-bias={-0.001} 
      />

      <Physics gravity={[0, -15, 0]}>
        <ClawMachine />
        <Claw isLocal={isLocal} />
        <Prizes isLocal={isLocal} />
      </Physics>

      <Bugdroid position={[0, 10.5, 0]} rotation={[0, Math.PI / 4, 0]} scale={0.6} />

      <Environment files="/google-office.jpg" background={!isTouch} environmentIntensity={1.5} backgroundRotation={[0, Math.PI * 0.725, 0]} environmentRotation={[0, Math.PI * 1.2, 0]} />
    </Canvas>
  );
};
