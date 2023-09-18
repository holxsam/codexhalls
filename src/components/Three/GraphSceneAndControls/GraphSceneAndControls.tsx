import { useGraphStore } from "@/store/GraphStore";
import { Controls } from "../Controls/Controls";
import { GraphScene } from "../GraphScene/GraphScene";
import { Vector3Array } from "@/utils/types";

const initialPosition: Vector3Array = [0, -60, 0];
const initialRotation: Vector3Array = [Math.PI / 4, Math.PI / 4, 0];
const initialScale = 1.3;

export const GraphSceneAndControls = () => {
  const touchControls = useGraphStore((state) => state.touchControls);

  return (
    <Controls
      global
      enableTouchControls={touchControls}
      position={initialPosition}
      rotation={initialRotation}
      scale={initialScale}
      // showHelper
      // showAxes
    >
      <GraphScene />
    </Controls>
  );
};
