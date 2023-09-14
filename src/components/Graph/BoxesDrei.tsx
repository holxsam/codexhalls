import { Vector3Array } from "@/utils/types";
import { isRefObject } from "@/utils/utils";
import { Instances, Instance } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import {
  MutableRefObject,
  forwardRef,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import { Group, Matrix4, Object3D } from "three";

const o = new Object3D(); // reusable object3D
const m = new Matrix4(); // reusable matrix

type BoxesInstanceProps = {
  maxLength?: number;
  positions: Vector3Array[];
  scales: Vector3Array[];
  rotations: Vector3Array[];
  colors: Vector3Array[];
  animRef: MutableRefObject<boolean>;
};

export const BoxesDrei = forwardRef<THREE.InstancedMesh, BoxesInstanceProps>(
  function BoxesDrei(
    { maxLength = 5000, positions, scales, rotations, colors, animRef },
    ref
  ) {
    // const mode = useGraphStore((state) => state.mode);
    // const animating = useGraphStore((state) => state.animating);
    // const test = useGraphStore((state) => state.test);
    // const ref = useRef<THREE.InstancedMesh>(null!);
    const size: Vector3Array = useMemo(() => [1, 1, 1], []);
    const COLORS = useMemo(() => new Float32Array(colors.flat()), [colors]);
    const length = positions.length;
    // const spreadAnimationDone = useRef(false);

    // useLayoutEffect(() => {
    //   if (!isRefObject(ref) || !ref.current) return;

    //   // set initial positions, scales, and rotations:
    //   const length = positions.length;
    //   for (let i = 0; i < length; i++) {
    //     const p = positions[i];
    //     const s = scales[i];
    //     const r = rotations[i];

    //     o.position.set(p[0], p[1], p[2]);
    //     o.scale.set(s[0], s[1], s[2]);
    //     o.rotation.set(r[0], r[1], r[2]);
    //     o.updateMatrix();

    //     ref.current.setMatrixAt(i, o.matrix);
    //   }
    //   ref.current.instanceMatrix.needsUpdate = true;

    //   // set initial colors:
    //   colors.forEach((color, i) => {
    //     if (!isRefObject(ref) || !ref.current) return;

    //     // must call setColorAt before first render
    //     ref.current.setColorAt(i, c.setRGB(color[0], color[1], color[2]));
    //   });
    //   if (ref.current.instanceColor?.needsUpdate)
    //     ref.current.instanceColor.needsUpdate = true;
    // }, [positions, scales, rotations, colors]);

    // useFrame((state, delta) => {
    //   if (!isRefObject(ref) || !ref.current) return;

    //   // if (!animRef.current) {
    //   if (true) {
    //     console.log("change");
    //     console.log(positions[50]);
    //     for (let i = 0; i < length; i++) {
    //       const p = positions[i];
    //       const s = scales[i];
    //       const r = rotations[i];

    //       // ref.current.getMatrixAt(i, m);
    //       // m.makeRotationX((delta * Math.PI) / 5 / 180);

    //       o.position.set(p[0], p[1], p[2]);
    //       o.scale.set(s[0], s[1], s[2]);
    //       // o.rotation.set(r[0], r[1], r[2]);

    //       o.rotation.set(
    //         o.rotation.x + (delta * Math.PI) / 5 / 180,
    //         o.rotation.y,
    //         o.rotation.z
    //       );
    //       o.updateMatrix();
    //       ref.current.setMatrixAt(i, m);
    //     }
    //     ref.current.instanceMatrix.needsUpdate = true;
    //   }
    // });

    return (
      <Instances
        limit={positions.length}
        range={positions.length}
        frames={1}
        // ref={ref}
        // args={[undefined, undefined, positions.length]}
        // onPointerOver={(e) => {
        //   e.stopPropagation(); // stops the raycasting from picking objects behind
        //   const id = e.instanceId;

        //   // prettier-ignore
        //   if (!isRefObject(ref) || !ref.current || ref.current.instanceColor === null || id === undefined) return;

        //   ref.current.getColorAt(id, prevC);
        //   ref.current.setColorAt(id, prevC.clone().addScalar(0.3));
        //   ref.current.instanceColor.needsUpdate = true;
        // }}
        // onPointerOut={(e) => {
        //   const id = e.instanceId;

        //   // prettier-ignore
        //   if (!isRefObject(ref) || !ref.current || ref.current.instanceColor === null || id === undefined) return;

        //   ref.current.setColorAt(id, prevC);
        //   ref.current.instanceColor.needsUpdate = true;
        // }}
        onClick={(e) => {
          e.stopPropagation();
          console.log(e.instanceId);
        }}
      >
        <boxGeometry>
          {/* <instancedBufferAttribute
          attach="attributes-color"
          array={COLORS}
          count={COLORS.length / 3}
          itemSize={3}
          normalized
        /> */}
        </boxGeometry>
        <meshStandardMaterial />
        {positions.map((p, i) => (
          <Box key={i} position={p} />
        ))}
      </Instances>
    );
  }
);

type BoxProps = {
  position: Vector3Array;
};

const Box = ({ position }: BoxProps) => {
  const ref = useRef<Group>();

  useLayoutEffect(() => {
    console.log(ref.current);
    if (!ref.current) return;

    ref.current.position.x = position[0];
    ref.current.position.y = position[1];
    ref.current.position.z = position[2];
  }, []);

  // useFrame((state, delta) => {
  //   if (!ref.current) return;

  //   // ref.current.position.x = position[0];
  //   // ref.current.position.y = position[1];
  //   // ref.current.position.z = position[2];

  //   // ref.current.rotation.x += delta * (1 / Math.PI);
  // });

  return (
    <Instance
      ref={ref}
      // position={p}
      // color={colors[i]}
      // scale={scales[i]}
      // rotation={rotations[i]}
      onPointerOver={(e) => {
        // e.stopPropagation(); // stops the raycasting from picking objects behind
        const id = e.instanceId;

        console.log(e.instanceId);

        // prettier-ignore
        // if (!isRefObject(ref) || !ref.current || ref.current.instanceColor === null || id === undefined) return;

        // ref.current.getColorAt(id, prevC);
        // ref.current.setColorAt(id, prevC.clone().addScalar(0.3));
        // ref.current.instanceColor.needsUpdate = true;
      }}
      onPointerOut={(e) => {
        const id = e.instanceId;

        // prettier-ignore
        // if (!isRefObject(ref) || !ref.current || ref.current.instanceColor === null || id === undefined) return;

        // ref.current.setColorAt(id, prevC);
        // ref.current.instanceColor.needsUpdate = true;
      }}
    />
  );
};
