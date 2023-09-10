"use client";

import { useHasMounted } from "@/hooks/useHasMounted";
import { getMidpointOffset, getRandomIntInclusive } from "@/utils/utils";
import { Line2Props, QuadraticBezierLine } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RefObject, memo, useEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";

const zeroPoint = new Vector3(0, 0, 0);

export type GraphEdgeProps = {
  id: string;
  startRef: RefObject<THREE.Mesh> | null;
  endRef: RefObject<THREE.Mesh> | null;
  isDragging: boolean;
  isHovering: boolean;
  curvation?: number;
  edgeAnimation?: boolean;
};

function arePropsEqual(
  prev: Readonly<GraphEdgeProps>,
  next: Readonly<GraphEdgeProps>
) {
  return (
    prev.id === next.id &&
    prev.startRef === next.startRef &&
    prev.endRef === next.endRef &&
    prev.isDragging === next.isDragging &&
    prev.isHovering === next.isHovering &&
    prev.curvation === next.curvation &&
    prev.edgeAnimation === next.edgeAnimation
  );
}

export const GraphEdge = memo(function GraphEdge({
  startRef,
  endRef,
  isDragging,
  isHovering,
  curvation = 40,
  edgeAnimation = false,
}: GraphEdgeProps) {
  useHasMounted(); // if you don't call this hook then the links wont render on the first render
  const animateLineRef = useRef<Line2Props>(null!);
  const staticLineRef = useRef<Line2Props>(null!);
  const randomOffset = useMemo(() => getRandomIntInclusive(0, 1000), []);

  const getPoints = () => {
    const start = startRef?.current?.position || zeroPoint;
    const end = endRef?.current?.position || zeroPoint;
    const midpoint = getMidpointOffset(start, end, curvation);

    return { start, end, midpoint };
  };

  const updatePoints = () => {
    const { start, end, midpoint } = getPoints();

    animateLineRef.current?.setPoints(start, end, midpoint);
    staticLineRef.current?.setPoints(start, end, midpoint);
  };

  const { start, end, midpoint } = getPoints();

  useFrame((_, delta) => {
    if (animateLineRef.current && animateLineRef.current.material) {
      animateLineRef.current.material.uniforms.dashOffset.value += delta * 1000;
    }

    if (isDragging) updatePoints();
  });

  return (
    <>
      {edgeAnimation && (
        <QuadraticBezierLine
          ref={animateLineRef}
          dashOffset={randomOffset}
          color="#ffffff"
          dashed
          transparent={true}
          opacity={0.5}
          lineWidth={1}
          dashScale={1}
          dashSize={50}
          gapSize={500}
          start={start}
          end={end}
          mid={midpoint}
        />
      )}
      <QuadraticBezierLine
        ref={staticLineRef}
        lineWidth={1}
        color="#ffffff"
        transparent
        opacity={isDragging || isHovering ? 0.25 : 0.15}
        start={start}
        end={end}
        mid={midpoint}
      />
    </>
  );
},
arePropsEqual);
