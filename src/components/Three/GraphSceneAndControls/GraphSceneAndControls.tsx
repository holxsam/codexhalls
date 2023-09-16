import { useGraphStore } from "@/store/GraphStore";
import { Controls } from "../Controls/Controls";
import { GraphScene } from "../GraphScene/GraphScene";

export const GraphSceneAndControls = () => {
  const mobileControls = useGraphStore((state) => state.enableMobileControls);

  return (
    <Controls
      global
      enableMobileControls={mobileControls}
      rotation={[Math.PI / 4, Math.PI / 4, 0]}
    >
      <GraphScene />
    </Controls>
  );
};
