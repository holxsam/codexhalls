import * as THREE from "three";
import { useGraphStore } from "@/store/GraphStore";
import { Vector3Array } from "@/utils/types";
import { getRandomIntInclusive, isRefObject } from "@/utils/utils";
import { forwardRef, useLayoutEffect, useMemo, useRef } from "react";

const rColor = () => getRandomIntInclusive(0, 255);

type LinesProps = {
  lines: Vector3Array[][];
};

export const Lines = forwardRef<THREE.LineSegments, LinesProps>(function Lines(
  { lines },
  ref
) {
  const edges = useGraphStore((state) => state.edges);
  const matRef = useRef<THREE.LineBasicMaterial>(null);
  const points = useMemo(() => new Float32Array(lines.flat(2)), [lines]);

  useLayoutEffect(() => {
    if (!isRefObject(ref) || !ref.current) return;
    // ref.current.computeLineDistances();
  });

  const colors = useMemo(() => {
    const colors = edges
      .flatMap(() => {
        // const color = [rColor(), rColor(), rColor(), rColor()];
        // const color = [255, 255, 255, rColor()];
        // const color = [255, 255, 255, 255];
        const color = [255, 255, 255];
        // const color = [rColor(), rColor(), rColor()];
        return [color, color];
      })
      .flat();
    return new Uint8Array(colors); // MUST USE Uint8Array or colors won't work
  }, [edges]);

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={points}
          count={points.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={colors.length / 3}
          itemSize={3}
          normalized
        />
      </bufferGeometry>
      <lineBasicMaterial ref={matRef} vertexColors transparent />
    </lineSegments>
  );
});

// imperative way:
// const points = useRef(lines.map((v) => new THREE.Vector3(v[0], v[1], v[2])));
// useKeyboardDebug("l", () => {
//   points.current.forEach((v, i) => {
//     v.set(i, i, i);
//   });

//   if (isRefObject(ref) && ref.current)
//     ref.current.geometry.setFromPoints(points.current);
// });

// const { scene } = useThree();
// useLayoutEffect(() => {
//   let positions: { [id: string]: THREE.Vector3 } = {};
//   nodes.forEach((nodes) => {
//     const [x, y, z] = nodes.position;
//     positions[nodes.id] = new THREE.Vector3(x, y, z);
//   });

//   const points = edges.flatMap((edge) => {
//     const start = positions[edge.source];
//     const end = positions[edge.target];

//     return [start, end];
//   });

//   const geometry = new THREE.BufferGeometry().setFromPoints(points);

//   const colors = edges
//     .flatMap((edge) => {
//       // const t: Vector3Array = [r(), r(), r()];
//       const t: Vector3Array = [255, 0, 0];

//       return [t, t];
//     })
//     .flat();

// geometry.setAttribute(
//   "color",
//   new THREE.Uint8BufferAttribute(colors, 3, true)
// );

//   const material = new THREE.LineBasicMaterial({
//     vertexColors: true,
//   });

//   const lines = new THREE.LineSegments(geometry, material);

//   scene.add(lines);

//   console.log(lines.geometry.attributes);
// }, [nodes, edges]);
