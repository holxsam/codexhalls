import { Object3D, Color, Matrix4 } from "three";

import { Vector3Array } from "@/utils/types";
import { isRefObject } from "@/utils/utils";
import { forwardRef, useMemo, useRef, useLayoutEffect } from "react";

const o = new Object3D(); // reusable object3D
const m = new Matrix4(); // reusable matrix
const c = new Color(); // reusable color
const prevC = new Color(); // reusable color for previous color only

type BoxesProps = {
  maxLength?: number;
  positions: Vector3Array[];
  scales: Vector3Array[];
  rotations: Vector3Array[];
  colors: Vector3Array[];
};

export const Boxes = forwardRef<THREE.InstancedMesh, BoxesProps>(function Boxes(
  { maxLength = 5000, positions, scales, rotations, colors },
  ref
) {
  // const nodes = useGraphStore((state) => state.nodes);
  // const ref = useRef<THREE.InstancedMesh>(null!);
  const size: Vector3Array = useMemo(() => [1, 1, 1], []);
  const COLORS = useMemo(() => new Float32Array(colors.flat()), [colors]);
  const length = positions.length;
  const spreadAnimationDone = useRef(false);

  useLayoutEffect(() => {
    // set initial positions, scales, and rotations:

    if (!isRefObject(ref) || !ref.current) return;

    const length = positions.length;
    for (let i = 0; i < length; i++) {
      const p = positions[i];
      const s = scales[i];
      const r = rotations[i];

      o.position.set(p[0], p[1], p[2]);
      o.scale.set(s[0], s[1], s[2]);
      o.rotation.set(r[0], r[1], r[2]);
      o.updateMatrix();

      //  ref.current.getMatrixAt(i, m);
      // m.setPosition(p[0], p[1], p[2]);
      // // m.
      //  ref.current.setMatrixAt(i, m);

      ref.current.setMatrixAt(i, o.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;

    // set initial colors:
    colors.forEach((color, i) => {
      if (!isRefObject(ref) || !ref.current) return;

      // must call setColorAt before first render
      ref.current.setColorAt(i, c.setRGB(color[0], color[1], color[2]));
    });
    if (ref.current.instanceColor?.needsUpdate)
      ref.current.instanceColor.needsUpdate = true;
  }, [positions, scales, rotations, colors]);

  // useFrame((state, delta) => {
  //   if (spreadAnimationDone.current) {
  //     for (let i = 0; i < length; i++) {
  //       const p = positions[i];
  //       const s = scales[i];
  //       const r = rotations[i];

  //       o.position.set(p[0], p[1], p[2]);
  //       o.scale.set(s[0], s[1], s[2]);
  //       // o.rotation.set(r[0], r[1], r[2]);
  //       o.rotation.set(
  //         o.rotation.x + (delta * Math.PI) / 5 / 180,
  //         o.rotation.y,
  //         o.rotation.z
  //       );

  //       o.updateMatrix();
  //       ref.current.setMatrixAt(i, o.matrix);
  //     }
  //     ref.current.instanceMatrix.needsUpdate = true;
  //   }
  // });

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, positions.length]}
      onPointerOver={(e) => {
        e.stopPropagation(); // stops the raycasting from picking objects behind
        const id = e.instanceId;

        // prettier-ignore
        if (!isRefObject(ref) || !ref.current || ref.current.instanceColor === null || id === undefined) return;

        ref.current.getColorAt(id, prevC);
        ref.current.setColorAt(id, prevC.clone().addScalar(0.3));
        ref.current.instanceColor.needsUpdate = true;
      }}
      onPointerOut={(e) => {
        const id = e.instanceId;

        // prettier-ignore
        if (!isRefObject(ref) || !ref.current || ref.current.instanceColor === null || id === undefined) return;

        ref.current.setColorAt(id, prevC);
        ref.current.instanceColor.needsUpdate = true;
      }}
      onClick={(e) => {
        e.stopPropagation();
        console.log(e.instanceId);
      }}
    >
      <boxGeometry>
        <instancedBufferAttribute
          attach="attributes-color"
          array={COLORS}
          count={COLORS.length / 3}
          itemSize={3}
          normalized
        />
      </boxGeometry>
      {/* <meshStandardMaterial /> */}
      <meshPhongMaterial shininess={100} />
    </instancedMesh>
  );
  // <instancedMesh ref={outlines} args={[null, null, length]}>
  //   <meshEdgesMaterial
  //     transparent
  //     polygonOffset
  //     polygonOffsetFactor={-10}
  //     size={size}
  //     color="black"
  //     thickness={0.001}
  //     smoothness={0.005}
  //   />
  // </instancedMesh>
});
