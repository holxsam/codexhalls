import * as THREE from "three";
import { useGraphStore } from "@/store/GraphStore";
import { Controls } from "../Controls/Controls";
import { GraphScene } from "../GraphScene/GraphScene";
import { Vector3Array } from "@/utils/types";
import { useKeyboardDebug } from "@/hooks/useKeyboardDebug";
import { useGraph, useThree } from "@react-three/fiber";
import { useEffect } from "react";

const vec = new THREE.Vector3(); // create once and reuse
const pos = new THREE.Vector3(); // create once and reuse

const initialPosition: Vector3Array = [0, -60, 0];
const initialRotation: Vector3Array = [Math.PI / 4, Math.PI / 4, 0];
const initialScale = 1.3;

export const GraphSceneAndControls = () => {
  const camera = useThree((state) => state.camera);
  const touchControls = useGraphStore((state) => state.touchControls);
  const graphPosition = useGraphStore((state) => state.graphPosition);
  const graphScale = useGraphStore((state) => state.graphScale);
  const setGraphPosition = useGraphStore((state) => state.setGraphPosition);
  const setGraphScale = useGraphStore((state) => state.setGraphScale);
  const fullscreen = useGraphStore((state) => state.fullscreen);
  const minimizedPosition = useGraphStore((state) => state.minimizedPosition);

  useEffect(() => {
    if (fullscreen) {
      setGraphPosition(initialPosition);
      setGraphScale(initialScale);
    } else {
      const [x, y] = minimizedPosition;

      const dx = (x / window.innerWidth) * 2 - 1;
      const dy = -(y / window.innerHeight) * 2 + 1;
      vec.set(dx, dy, 0.5);

      vec.unproject(camera);
      vec.sub(camera.position).normalize();

      const distance = -camera.position.z / vec.z;
      pos.copy(camera.position).add(vec.multiplyScalar(distance));

      setGraphPosition([pos.x, pos.y, 0]);
      setGraphScale(0.25);
    }
  }, [fullscreen, minimizedPosition]);

  return (
    <Controls
      global
      enableTouchControls={touchControls}
      position={graphPosition}
      rotation={initialRotation}
      scale={graphScale}
      // showHelper
      // showAxes
    >
      <GraphScene />
    </Controls>
  );
};
