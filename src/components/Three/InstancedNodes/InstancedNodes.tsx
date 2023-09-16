import { Object3D, Color } from "three";
import { Vector3Array } from "@/utils/types";
import { isRefObject } from "@/utils/utils";
import { forwardRef, useMemo, useLayoutEffect } from "react";
import { InstancedMeshProps, useFrame } from "@react-three/fiber";
import { useGraphStore } from "@/store/GraphStore";

const o = new Object3D(); // reusable object3D
const tempColor = new Color(); // reusable color
const prevC = new Color(); // reusable color for previous color only

type BoxesProps = {
  maxLength?: number;
  positions: Vector3Array[];
  scales: Vector3Array[];
  rotations: Vector3Array[];
  colors: Vector3Array[];
};

export const InstancedNodes = forwardRef<THREE.InstancedMesh, BoxesProps>(
  function InstancedNodes(
    { maxLength = 10000, positions, scales, rotations, colors },
    ref
  ) {
    const instanceIdToNodeId = useGraphStore(
      (state) => state.instanceIdToNodeId
    );
    const COLORS = useMemo(() => new Float32Array(colors.flat()), [colors]);
    // const length = positions.length;

    const setHover = useGraphStore((state) => state.setNodeHoverId);

    const onPointerOver: InstancedMeshProps["onPointerOver"] = (e) => {
      e.stopPropagation(); // stops the raycasting from picking objects behind
      const iId = e.instanceId;

      // prettier-ignore
      if (!isRefObject(ref) || !ref.current || ref.current.instanceColor === null || iId === undefined) return;

      // const instanceIdToNodeId;
      ref.current.getColorAt(iId, prevC);
      ref.current.setColorAt(iId, prevC.clone().addScalar(0.3));
      ref.current.instanceColor.needsUpdate = true;

      setHover(instanceIdToNodeId[iId]);
    };

    const onPointerOut: InstancedMeshProps["onPointerOut"] = (e) => {
      const iId = e.instanceId;

      // prettier-ignore
      if (!isRefObject(ref) || !ref.current || ref.current.instanceColor === null || iId === undefined) return;

      ref.current.setColorAt(iId, prevC);
      ref.current.instanceColor.needsUpdate = true;

      setHover("");
    };

    const onClick: InstancedMeshProps["onClick"] = (e) => {
      e.stopPropagation();
      const iId = e.instanceId;

      if (iId === undefined) return;

      const nodeId = useGraphStore.getState().instanceIdToNodeId[iId];
      console.log("-------------------");
      console.log("Node", nodeId, iId);
    };

    useLayoutEffect(() => {
      if (!isRefObject(ref) || !ref.current) return;
      ref.current.setColorAt(0, tempColor); // needs to be called at least once before render
    }, [ref]);

    useLayoutEffect(() => {
      // type guards to satisfy typescript
      if (
        !isRefObject(ref) ||
        !ref.current ||
        ref.current.instanceColor === null // once setColor is called once instanceColor should no longer be null
      )
        return;

      // if (ref.current.instanceColor === null) return; // once setColor is called once instanceColor should no longer be null

      // set initial positions, scales, rotations, and colors:
      const length = positions.length;
      for (let i = 0; i < length; i++) {
        // GEOMETRIES:
        o.position.set(...positions[i]);
        o.scale.set(...scales[i]);
        o.rotation.set(...rotations[i]);
        o.updateMatrix();
        ref.current.setMatrixAt(i, o.matrix);

        // COLOR:
        ref.current.setColorAt(i, tempColor.setRGB(...colors[i]));
      }

      // commit the updates:
      ref.current.instanceMatrix.needsUpdate = true;
      ref.current.instanceColor.needsUpdate = true;
    }, [ref, positions, scales, rotations, colors]);

    // useFrame((state, delta) => {
    //   if (useGraphStore.getState().animating) return; // for performance
    //   if (!isRefObject(ref) || !ref.current) return;

    //   for (let i = 0; i < length; i++) {
    //     // get current values:
    //     ref.current.getMatrixAt(i, o.matrix);
    //     o.matrix.decompose(o.position, o.quaternion, o.scale);

    //     // update components:
    //     o.rotateX(delta * (1 / Math.PI));

    //     // commit the updates to the object:
    //     o.updateMatrix();

    //     // commit the updates to the instance matrix
    //     ref.current.setMatrixAt(i, o.matrix);
    //   }

    //   ref.current.instanceMatrix.needsUpdate = true;
    // });

    return (
      <instancedMesh
        ref={ref}
        args={[undefined, undefined, positions.length]}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
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
  }
);
