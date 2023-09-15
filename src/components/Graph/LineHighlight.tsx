import * as THREE from "three";
import { useGraphStore } from "@/store/GraphStore";
import { Vector3Array } from "@/utils/types";
import { LineSegments2 } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useMemo, useRef } from "react";

const o = new THREE.Object3D();

const smallDots = {
  lineWidth: 2,
  dashScale: 10,
  dashSize: 1,
  gapSize: 40,
};

const neuronFiring = {
  lineWidth: 1,
  dashScale: 1,
  dashSize: 50,
  gapSize: 500,
};

export type LineHighlightProps = {
  opacity?: number;
  color?: THREE.ColorRepresentation;
};

export const LineHighlight = ({
  opacity = 1,
  color = "white",
}: LineHighlightProps) => {
  const ref = useRef<LineSegments2>(null!);
  const lineRef2 = useRef<LineSegments2>(null!);
  const nodesRef = useGraphStore((state) => state.nodesRef);
  const nodeHoverId = useGraphStore((state) => state.nodeHoverId);
  const connections = useGraphStore((state) => state.connections);
  const nodeIdToInstanceId = useGraphStore((state) => state.nodeIdToInstanceId);

  const dashProps = neuronFiring;

  const getPosition = (nodeId: string) => {
    const iId = nodeIdToInstanceId[nodeId];
    nodesRef.current?.getMatrixAt(iId, o.matrix);
    o.matrix.decompose(o.position, o.quaternion, o.scale);
    return o.position.toArray();
  };

  const points = useMemo(() => {
    if (nodeHoverId === "" || !nodesRef.current) return [];

    const { sources, targets } = connections[nodeHoverId];
    const mainNodePosition = getPosition(nodeHoverId);
    const points: Vector3Array[] = [];

    sources.forEach((nodeId) =>
      points.push(mainNodePosition, getPosition(nodeId))
    );
    targets.forEach((nodeId) =>
      points.push(getPosition(nodeId), mainNodePosition)
    );

    return points;
  }, [nodeHoverId, connections]);

  useFrame((state, delta) => {
    ref.current.material.uniforms.dashOffset.value += delta * 1000;
  });

  return (
    <>
      <Line
        ref={ref}
        points={points}
        opacity={opacity}
        color={color}
        dashed
        segments
        transparent
        {...dashProps}
      />
      <Line
        ref={lineRef2}
        points={points}
        opacity={0.25}
        color={color}
        segments
        transparent
        lineWidth={1}
      />
    </>
  );
};
