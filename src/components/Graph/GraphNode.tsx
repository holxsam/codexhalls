import { useGraphStore } from "@/store/GraphStore";
import { Vector3, useFrame } from "@react-three/fiber";
import { forwardRef, memo, useRef } from "react";
import { Text } from "@react-three/drei";

export type GraphNodeProps = {
  id: string;
  radius?: number;
  segments?: number;
  opacity?: number;
  color?: string;
  isHover: boolean;
  x: number;
  y: number;
  z: number;
};

function arePropsEqual(
  prev: Readonly<GraphNodeProps>,
  next: Readonly<GraphNodeProps>
) {
  return (
    prev.id === next.id &&
    prev.radius === next.radius &&
    prev.segments === next.segments &&
    prev.opacity === next.opacity &&
    prev.color === next.color &&
    prev.isHover === next.isHover &&
    prev.x === next.x &&
    prev.y === next.y &&
    prev.z === next.z
  );
}

export const GraphNode = memo(
  forwardRef<THREE.Mesh, GraphNodeProps>(function GraphNodeObject(
    {
      id,
      radius = 1,
      segments = 32,
      opacity = 1,
      color = "#ff0000",
      isHover,
      x,
      y,
      z,
    },
    ref
  ) {
    const textRef = useRef<Text>();
    const setHover = useGraphStore((state) => state.setNodeHoverId);
    const cameraChanging = useGraphStore((state) => state.cameraChanging);

    // useFrame(({ camera }) => {
    //   // Make text face the camera
    //   // textRef.current?.quaternion.copy(camera.quaternion);
    // });

    return (
      <mesh
        ref={ref}
        position={[x, y, z]}
        onPointerEnter={() => {
          if (cameraChanging) return;
          setHover(id);
        }}
        onPointerLeave={() => setHover("")}
      >
        <sphereGeometry args={[radius, segments]} />
        {/* <boxGeometry args={[radius, radius, radius]} /> */}
        <meshStandardMaterial
          // transparent={true}
          // opacity={0.1}
          color={isHover ? "#ff0000" : color}
        />
        {/* <Text ref={textRef} fontSize={12} anchorX="center" anchorY="middle">
          {id}
        </Text> */}
      </mesh>
    );
  }),
  arePropsEqual
);
