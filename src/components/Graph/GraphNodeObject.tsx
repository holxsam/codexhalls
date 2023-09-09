import { useGraphStore } from "@/store/GraphStore";
import { Vector3 } from "@react-three/fiber";
import { forwardRef, memo } from "react";

export type GraphNodeObjectProps = {
  id: string;
  radius?: number;
  segments?: number;
  opacity?: number;
  color?: string;
  position?: Vector3;
  isHover: boolean;
};

function arePropsEqual(
  prev: Readonly<GraphNodeObjectProps>,
  next: Readonly<GraphNodeObjectProps>
) {
  return (
    prev.id === next.id &&
    prev.radius === next.radius &&
    prev.segments === next.segments &&
    prev.opacity === next.opacity &&
    prev.color === next.color &&
    prev.position === next.position &&
    prev.isHover === next.isHover
  );
}

export const GraphNodeObject = memo(
  forwardRef<THREE.Mesh, GraphNodeObjectProps>(function GraphNodeObject(
    {
      id,
      radius = 1,
      segments = 32,
      opacity = 1,
      color = "#ff0000",
      position = [0, 0, 0],
      isHover,
    },
    ref
  ) {
    const setHover = useGraphStore((state) => state.setNodeHoverId);
    const cameraChanging = useGraphStore((state) => state.cameraChanging);

    return (
      <mesh
        ref={ref}
        position={position}
        onPointerEnter={() => {
          if (cameraChanging) return;
          setHover(id);
        }}
        onPointerLeave={() => setHover("")}
      >
        <sphereGeometry args={[radius, segments]} />
        {/* <boxGeometry args={[radius, radius, radius]} /> */}
        <meshStandardMaterial
          transparent={false}
          color={isHover ? "#ff0000" : color}
        />
      </mesh>
    );
  }),
  arePropsEqual
);
