"use client";

import { useGraphStore } from "@/store/GraphStore";
import { Vector3, useFrame } from "@react-three/fiber";
import { forwardRef, memo, useRef } from "react";
import { Text } from "@react-three/drei";
import { useSpring, a } from "@react-spring/three";
import { Vector3Array } from "@/utils/types";
import * as THREE from "three";
import { isRefObject } from "@/utils/utils";

const material = new THREE.MeshStandardMaterial({ color: "white" });
const geometry = new THREE.SphereGeometry(1);

const red = new THREE.Color(255, 0, 0);
const white = new THREE.Color(255, 255, 255);

THREE.ColorManagement.enabled = true;

export type GraphNodeProps = {
  id: string;
  radius?: number;
  segments?: number;
  opacity?: number;
  color?: string;
  isHover: boolean;
  position: Vector3Array;
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
    prev.position === next.position
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
      position,
    },
    ref
  ) {
    const textRef = useRef<Text>();
    const setHover = useGraphStore((state) => state.setNodeHoverId);
    const cameraChanging = useGraphStore((state) => state.cameraChanging);
    const setAnimation = useGraphStore(
      (state) => state.setNodesSpringAnimation
    );

    const [s, api] = useSpring(() => ({
      from: { position: [0, 0, 0] as Vector3Array },
      position: position as Vector3Array,
      config: { mass: 20, tension: 150, friction: 100 },
      onRest() {
        // console.log("done");
        setAnimation(false);
      },
    }));

    // useFrame(({ camera }) => {
    //   // Make text face the camera
    //   // textRef.current?.quaternion.copy(camera.quaternion);
    // });

    return (
      <a.mesh
        // <mesh
        ref={ref}
        position={s.position}
        // position={position}
        onPointerEnter={() => {
          if (cameraChanging) return;
          setHover(id);
          // material.color.setHex(0xff0000);

          // if (isRefObject(ref) && ref.current) {
          //   ref.current.material;
          // }
        }}
        onPointerLeave={() => {
          setHover("");
          // material.color.setHex(0xffffff);

          // if (isRefObject(ref) && ref.current) {
          //   ref.current.material.color = white;
          // }
        }}
        material={material}
        geometry={geometry}
      >
        {/* <sphereGeometry args={[radius, segments]} /> */}
        {/* <boxGeometry args={[radius, radius, radius]} /> */}
        {/* <meshStandardMaterial
          // transparent={true}
          // opacity={0.1}
          // emissive={isHover ? "rgba(255,255,255,0.1)" : "#000000"}
          // color={color}
          color={isHover ? "#ff0000" : color}
        /> */}
        {/* <Text ref={textRef} fontSize={12} anchorX="center" anchorY="middle">
          {id}
        </Text> */}
        {/* </mesh> */}
      </a.mesh>
    );
  }),
  arePropsEqual
);
