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

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { GraphData, useGraphStore } from "@/store/GraphStore";
import { useKeyboardDebug } from "@/hooks/useKeyboardDebug";
import { config, useSpring, useSpringRef } from "@react-spring/three";
import { Vector3Array } from "@/utils/types";
import { Lights } from "./Lights";
import { Lines } from "./Lines";
import { Boxes } from "./Boxes";
import { Controls } from "./Controls";
import { Helpers } from "./Helpers";
import { DISTANCE_FROM_ORIGIN } from "@/utils/constants";
import {
  getFibonocciSphere,
  getFibonocciSphereRadiusFromDistance,
  hexToArray,
} from "@/utils/utils";

THREE.ColorManagement.enabled = true;

const cameraPosition = new THREE.Vector3().setFromSphericalCoords(
  DISTANCE_FROM_ORIGIN / 4,
  0,
  0
);

export default function Graph({ data }: { data: GraphData }) {
  const initGraph = useGraphStore((state) => state.initGraph);

  useEffect(() => {
    initGraph(data);
  }, [data, initGraph]);

  return (
    <div className="relative w-full h-screen">
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
      className="z-10 absolute bottom-0 left-0 bg-indigo-500 uppercase font-medium w-24 h-10"
      onClick={toggleMode}
    >
      {mode}
    </button>
  );
};

const m = new THREE.Matrix4(); // reusable matrix

const GraphNodes = () => {
  const boxesRef = useGraphStore((state) => state.nodesRef);
  const linesRef = useGraphStore((state) => state.edgesRef);

  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const hoverId = useGraphStore((state) => state.nodeHoverId);

  const mode = useGraphStore((state) => state.mode);
  const setMode = useGraphStore((state) => state.setMode);

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
  const a = useMemo(() => Object.assign({}, startPositions), [startPositions]);
  const b = useMemo(() => Object.assign({}, endPositions), [endPositions]);

  const [spring, api] = useSpring(
    {
      from: mode === "tree" ? a : b,
      to: mode === "tree" ? b : a,
      config: config.stiff,
      onStart: () => {
        console.log("start");
      },
      onChange: (result) => {
        if (!boxesRef.current || !linesRef.current) return;

        const length = endPositions.length;
        const positions: { [id: string]: Vector3Array } = result.value;

        for (let i = 0; i < length; i++) {
          const p = positions[i];
          const id = nodes[i].id;

          // mutates the vector to the updated position
          nodePositionVectorMap.current.get(id)?.set(p[0], p[1], p[2]);

          // updates the position matrix:
          boxesRef.current.getMatrixAt(i, m);
          m.setPosition(p[0], p[1], p[2]);
          boxesRef.current.setMatrixAt(i, m);
        }

        // tells three.js it needs to update its render
        boxesRef.current.instanceMatrix.needsUpdate = true;
        linesRef.current.geometry.setFromPoints(points.current);
      },
      onRest: () => {
        console.log("onRest");
      },
    },
    [mode]
  );

  useKeyboardDebug("s", () => {
    setMode(mode === "sphere" ? "tree" : "sphere");
  });

  return (
    <>
      <Boxes
        ref={boxesRef as Ref<THREE.InstancedMesh>}
        positions={startPositions}
        colors={colors}
        scales={scales}
        rotations={rotations}
      />
      <Lines ref={linesRef as Ref<THREE.LineSegments>} lines={initialLines} />
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
