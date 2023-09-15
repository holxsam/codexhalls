"use client";

import * as THREE from "three";
import {
  Ref,
  useMemo,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { Canvas } from "@react-three/fiber";
import { GraphData, useGraphStore } from "@/store/GraphStore";
import { useKeyboardDebug } from "@/hooks/useKeyboardDebug";
import { config, useSpring } from "@react-spring/three";
import { Vector3Array } from "@/utils/types";
import { Lights } from "./Lights";
import { Lines } from "./Lines";
import { InstancedNodes } from "./InstancedNodes";
import { Controls } from "./Controls";
import { Helpers } from "./Helpers";
import { DISTANCE_FROM_ORIGIN } from "@/utils/constants";
import {
  getFibonocciSphere,
  getFibonocciSphereRadiusFromDistance,
  hexToArray,
  isRefObject,
} from "@/utils/utils";
import { LineHighlight } from "./LineHighlight";

THREE.ColorManagement.enabled = true;

const cameraPosition = new THREE.Vector3().setFromSphericalCoords(
  DISTANCE_FROM_ORIGIN / 4,
  Math.PI / 3,
  0
);

export default function Graph({ data }: { data: GraphData }) {
  const initGraph = useGraphStore((state) => state.initGraph);

  useEffect(() => {
    initGraph(data);
  }, [data, initGraph]);

  return (
    <div className="relative w-full h-screen-dvh">
      <ModeButton />
      <Canvas camera={{ position: cameraPosition }}>
        <Lights />
        <Scene />
        <Controls />
        <Helpers />
      </Canvas>
    </div>
  );
}

const ModeButton = () => {
  const toggleMode = useGraphStore((state) => state.toggleMode);
  const mode = useGraphStore((state) => state.mode);

  return (
    <button
      type="button"
      className="z-10 absolute bottom-0 left-0 rounded-md bg-indigo-500 uppercase font-medium w-24 h-10 m-2"
      onClick={toggleMode}
    >
      {mode}
    </button>
  );
};

const o = new THREE.Object3D(); // reusable matrix

const GraphNodes = () => {
  const boxesRef = useGraphStore((state) => state.nodesRef);
  const linesRef = useGraphStore((state) => state.edgesRef);

  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);

  const nodeIdMap = useGraphStore((state) => state.instanceIdToNodeId);
  const mode = useGraphStore((state) => state.mode);

  const setMode = useGraphStore((state) => state.setMode);
  const setAnimating = useGraphStore((state) => state.setAnimating);
  const setHover = useGraphStore((state) => state.setNodeHoverId);

  const radius = useMemo(
    () => getFibonocciSphereRadiusFromDistance(nodes.length, 15),
    [nodes]
  );

  // Boxes state:
  const startPositions = useMemo(
    () => nodes.map((_, i) => getFibonocciSphere(i, nodes.length, radius)),
    [nodes, radius]
  );
  const endPositions = useMemo(
    () => nodes.map((node) => node.position),
    [nodes]
  );
  const scales = useMemo(() => nodes.map((node) => node.scale), [nodes]);
  const rotations = useMemo(() => nodes.map((node) => node.rotation), [nodes]);
  const colors = useMemo(
    () => nodes.map((node) => hexToArray(node.color)),
    [nodes]
  );

  const length = endPositions.length;

  const nodePositionVectorMap = useRef(
    new Map(
      nodes.map(({ id }, i) => {
        const [x, y, z] = startPositions[i];
        return [id, new THREE.Vector3(x, y, z)];
      })
    )
  );

  // each item in the 'points' array references a node position vector (a THREE.Vector object)
  // therefore if you update the node position vector (ex: calling THREE.Vector.set(x,y,z)),
  // the 'points' array will still have reference to the udpate vector without having to know where in the array that vector got updated
  // ex:
  // lets say we had 3 nodes with positions Va, Vb, Vc (each position is a THREE.Vector3)
  // nodePositionVectorMap = { "1": Va, "2": Vb, "3": Vc } where the key is the id and a,b,c are THREE.Vector3's
  // also our edges (links) are defined like so:
  // edges: Va -> Vb , Vb -> Vc , Vc -> Va , Va -> Vc, Vb <- Vc (notice the arrow direction)
  // therefore our 'points' array has to look like:
  // points = [Va, Vb, Vb, Vc, Vc, Va, Va, Vc, Vc, Vb]
  // notice how the vector Va appears 3 times in our 'points' array
  // so if we wanted to update it, we would need to know the each index that Va is in
  // thankfully since we made each vector a THREE.Vector (not a plain [x, y, z] or {x, y, z}) AND we referenced the same vector in different spots in the array, we can just update the vector itself
  // we need to do this the performance of the spring animation
  const points = useRef(
    edges.flatMap((edge) => {
      const start = nodePositionVectorMap.current.get(edge.source);
      const end = nodePositionVectorMap.current.get(edge.target);
      return [start!, end!];
    })
  );

  const initialLines = useMemo(
    () =>
      edges.map((edge) => {
        const start: Vector3Array = nodePositionVectorMap.current
          .get(edge.source)!
          .toArray();
        const end: Vector3Array = nodePositionVectorMap.current
          .get(edge.target)!
          .toArray();

        return [start, end];
      }),
    [edges]
  );

  // this spreads an array into an object (despite what the infered type says)
  // ex: ["cat", "dog", "bob"] -> { 0: "cat", 1: "dog", 2: "bob"}
  // we need it in this form or else useSpring cannot animate the values
  // it cannot animate an array of arrays which is what startPositions/endPositions are
  const sphere = useMemo(
    () => Object.assign({ opacity: 0.05 }, startPositions),
    [startPositions]
  );

  const tree = useMemo(
    () => Object.assign({ opacity: 0.2 }, endPositions),
    [endPositions]
  );

  const [spring, api] = useSpring(
    {
      from: mode === "tree" ? sphere : tree,
      to: mode === "tree" ? tree : sphere,
      config: config.stiff,
      onStart: () => {
        setAnimating(true);
        setHover("");
      },
      onChange: (result) => {
        if (!boxesRef.current || !linesRef.current) return;

        const positions = result.value as typeof sphere;

        // iId is the instanceId
        for (let iId = 0; iId < length; iId++) {
          const p = positions[iId];
          const id = nodeIdMap[iId];

          // mutates the vector to the updated position
          nodePositionVectorMap.current.get(id)?.set(p[0], p[1], p[2]);

          // updates the position matrix:
          boxesRef.current.getMatrixAt(iId, o.matrix);
          o.matrix.decompose(o.position, o.quaternion, o.scale);
          o.position.set(p[0], p[1], p[2]);
          o.updateMatrix();
          boxesRef.current.setMatrixAt(iId, o.matrix);
        }

        // tells three.js it needs to update its render
        boxesRef.current.instanceMatrix.needsUpdate = true;
        linesRef.current.geometry.setFromPoints(points.current);

        // @ts-ignore / update opacity
        linesRef.current.material.opacity = positions.opacity;
      },
      onRest: () => {
        setAnimating(false);
      },
    },
    [mode]
  );

  useKeyboardDebug("s", () => {
    setMode(mode === "sphere" ? "tree" : "sphere");
  });

  return (
    <>
      <InstancedNodes
        ref={boxesRef as Ref<THREE.InstancedMesh>}
        positions={startPositions}
        colors={colors}
        scales={scales}
        rotations={rotations}
      />
      <Lines ref={linesRef as Ref<THREE.LineSegments>} lines={initialLines} />
      <LineHighlight />
    </>
  );
};

function Scene() {
  return (
    <>
      <GraphNodes />
      {/* <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1]}></sphereGeometry>
        <meshStandardMaterial color="red" />
      </mesh> */}
    </>
  );
}
