"use client";

import * as THREE from "three";
import { useMemo, useRef, useState, useEffect, useLayoutEffect } from "react";
import { OrthographicCamera } from "three";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Bounds,
  GizmoHelper,
  GizmoViewport,
  Line,
  OrbitControls,
  Stats,
  TrackballControls,
} from "@react-three/drei";
import { DragControls } from "three/addons/controls/DragControls.js";
import { GEdge, GNode, GraphData, useGraphStore } from "@/store/GraphStore";
import { GraphNode } from "./GraphNode";
import { GraphEdge } from "./GraphEdge";

// import forceLayout from "ngraph.forcelayout";
// import createGraph from "ngraph.graph";
// import blocksData from "@/utils/blocks.json";
// import { genRandomTree } from "@/utils/utils";
import { useKeyboardDebug } from "@/hooks/useKeyboardDebug";
import { useSprings } from "@react-spring/three";
import { Vector3Array } from "@/utils/types";
import niceColors from "nice-color-palettes";
import { getRandomIntInclusive } from "@/utils/utils";

export default function Graph({ data }: { data: GraphData }) {
  const initGraph = useGraphStore((state) => state.initGraph);

  useEffect(() => {
    initGraph(data);
  }, [data, initGraph]);

  return (
    <div className="w-full h-[80vh]">
      <Canvas
        camera={{
          // position: [42.61371039976526, -162.6671791946718, -392.8451526438312],
          position: [9.14655412722793, -34.91468227642872, -84.31979798444671],
        }}
        className=""
      >
        <Light />
        <Scene />
        <Controls />

        <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
        <Stats />
      </Canvas>
    </div>
  );
}

const Light = () => {
  const pointLightRef = useRef<THREE.HemisphereLight>(null!);
  // const R = 1000;
  // useHelper(pointLightRef, THREE.HemisphereLightHelper, 10);
  // const { intensity, x, y, z, color } = useControls({
  //   intensity: { value: 5, min: 0, max: 10000 },
  //   x: { value: 0, min: -R, max: R },
  //   y: { value: 0, min: -R, max: R },
  //   z: { value: 0, min: -R, max: R },
  //   color: "#ff0000",
  // });

  return (
    <>
      <hemisphereLight ref={pointLightRef} args={["#ffffff", "#000000", 2]} />
      <ambientLight intensity={0.5} />
    </>
  );
};

const useDragControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  useKeyboardDebug({
    keyboardKey: "d",
    func: () => {
      const { x, y, z } = camera.position;
      console.log(JSON.stringify([x, y, z]));
    },
  });

  const nodes = useGraphStore((state) => state.nodes);
  const setDrag = useGraphStore((state) => state.setNodeDragId);

  const [dragControls, setDragControls] = useState(
    () => new DragControls([], camera, domElement)
  );

  useEffect(() => {
    type MeshObject = (typeof nodes)[number]["ref"]["current"];

    const objects = nodes
      .map((node) => node.ref.current)
      .filter((node): node is NonNullable<MeshObject> => node !== null);

    setDragControls(new DragControls(objects, camera, domElement));
  }, [nodes, camera, domElement]);

  useEffect(() => {
    dragControls.addEventListener("dragstart", function (event) {
      const targetObj = event.object as THREE.Mesh;
      const node = nodes.find(
        (node) => node.ref.current?.uuid === targetObj.uuid
      );
      setDrag(node ? node.id : "");
      // event.object.material.emissive.set(0xaaaaaa);
    });

    dragControls.addEventListener("dragend", function (event) {
      setDrag("");
      // event.object.material.emissive.set(0x000000);
    });

    return () => {
      dragControls.deactivate(); // removes listeners
      dragControls.dispose(); // clean up
    };
  }, [dragControls, nodes, setDrag]);
};

const Controls = () => {
  useDragControls();
  const isDragging = useGraphStore((state) => state.nodeDragId !== "");
  const setCameraChanging = useGraphStore((state) => state.setCameraChanging);

  return (
    // <TrackballControls
    //   makeDefault
    //   // autoRotate
    //   // autoRotateSpeed={0.5}

    //   rotateSpeed={10}
    //   enabled={!isDragging}
    //   onStart={(e) => {
    //     setCameraChanging(true);
    //   }}
    //   onEnd={() => {
    //     setCameraChanging(false);
    //   }}
    // />
    <OrbitControls
      makeDefault
      // autoRotate
      // autoRotateSpeed={0.5}
      enabled={!isDragging}
      onStart={(e) => {
        setCameraChanging(true);
      }}
      onEnd={() => {
        setCameraChanging(false);
      }}
    />
  );
};

const GraphEdges = () => {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const dragId = useGraphStore((state) => state.nodeDragId);
  const hoverId = useGraphStore((state) => state.nodeHoverId);
  const anim = useGraphStore((state) => state.nodesSpringAnimation);

  const positions = useMemo(() => {
    let ps: { [id: string]: Vector3Array } = {};
    nodes.forEach((nodes) => (ps[nodes.id] = nodes.position));
    return ps;
  }, [nodes]);

  const edgesAttachedToNodeDragged = useMemo(() => {
    if (dragId === "") return []; // empty string means no object is getting dragged; just return to save performance
    const node = nodes.find((node) => node.id === dragId);
    return node ? node.connections : [];
  }, [nodes, dragId]);

  const edgesAttachedToNodeHovered = useMemo(() => {
    if (hoverId === "") return []; // empty string means no object is getting dragged; just return to save performance
    const node = nodes.find((node) => node.id === hoverId);
    return node ? node.connections : [];
  }, [nodes, hoverId]);

  return <Lines />;
  // return (
  //   // !anim &&
  //   edges.map((edge) => {
  //     const connectedToDraggedNode = edgesAttachedToNodeDragged.includes(
  //       edge.id
  //     );
  //     const connectedToHoveredNode = edgesAttachedToNodeHovered.includes(
  //       edge.id
  //     );

  //     const start = positions[edge.source];
  //     const end = positions[edge.target];

  //     return (
  //       <GraphEdge
  //         key={edge.id}
  //         id={edge.id}
  //         edgeAnimation={connectedToHoveredNode || connectedToDraggedNode}
  //         isDragging={connectedToDraggedNode}
  //         isHovering={connectedToHoveredNode}
  //         startRef={edge.sourceRef}
  //         endRef={edge.targetRef}
  //         start={start}
  //         end={end}
  //         curvation={0}
  //         // forceUpdatePosition={anim}
  //         forceUpdatePosition={false}
  //       />
  //     );
  //   })
  // );
};

const r = () => getRandomIntInclusive(0, 255);

const pp = new Float32Array([0, 0, 0, 10, 10, 10, 20, 20, 20, 30, 30, 30]);
const cc = new Float32Array([255, 0, 0, 255, 0, 0, 0, 0, 255, 0, 0, 255]);

const Lines = ({}) => {
  const ref = useRef<THREE.LineSegments>(null!);
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);

  const positions = useMemo(() => {
    let ps: { [id: string]: Vector3Array } = {};
    nodes.forEach((nodes) => (ps[nodes.id] = nodes.position));
    return ps;
  }, [nodes]);

  const lines = useMemo(() => {
    const lines = edges
      .flatMap((edge) => {
        const start = positions[edge.source];
        const end = positions[edge.target];
        return [start, end];
      })
      .flat();
    return new Float32Array(lines);
  }, [positions, nodes]);

  const colors = useMemo(() => {
    const colors = edges
      .flatMap(() => {
        const color: Vector3Array = [r(), r(), r()];
        return [color, color];
      })
      .flat();
    return new Uint8Array(colors); // MUST USE Uint8Array or colors won't work
  }, [edges]);

  // console.log(colors.length, lines.length);
  const { scene } = useThree();

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

  useKeyboardDebug({
    keyboardKey: "f",
    func: () => {
      console.log(ref.current.geometry.attributes);
    },
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={lines}
          count={lines.length / 3}
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
      <lineBasicMaterial vertexColors />
    </lineSegments>
  );

  // return (
  // <Line points={lines} segments vertexColors={...colors} lineWidth={1}></Line>

  // <lineSegments>
  //   <bufferGeometry>
  //     <bufferAttribute attach="attributes-position" args={[lines, 3]} />
  //     <bufferAttribute attach="attributes-colors" args={[colors, 3]} />
  //   </bufferGeometry>
  //   <lineBasicMaterial color="black" vertexColors />
  // </lineSegments>
  // <lineSegments>
  //   <bufferGeometry args={lines}></bufferGeometry>
  //   <lineBasicMaterial></lineBasicMaterial>
  // </lineSegments>
  // );

  // function init() {
  //   // container = document.getElementById("container");

  //   // //

  //   // camera = new THREE.PerspectiveCamera(
  //   //   27,
  //   //   window.innerWidth / window.innerHeight,
  //   //   1,
  //   //   4000
  //   // );
  //   // camera.position.z = 2750;

  //   // scene = new THREE.Scene();

  //   // clock = new THREE.Clock();

  //   const segments =

  //   const geometry = new THREE.BufferGeometry();
  //   const material = new THREE.LineBasicMaterial({ vertexColors: true });

  //   const positions = [];
  //   const colors = [];

  //   for (let i = 0; i < segments; i++) {
  //     const x = Math.random() * r - r / 2;
  //     const y = Math.random() * r - r / 2;
  //     const z = Math.random() * r - r / 2;

  //     // positions

  //     positions.push(x, y, z);

  //     // colors

  //     colors.push(x / r + 0.5);
  //     colors.push(y / r + 0.5);
  //     colors.push(z / r + 0.5);
  //   }

  //   geometry.setAttribute(
  //     "position",
  //     new THREE.Float32BufferAttribute(positions, 3)
  //   );
  //   geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  //   generateMorphTargets(geometry);

  //   geometry.computeBoundingSphere();

  //   line = new THREE.Line(geometry, material);
  //   scene.add(line);

  //   //

  //   renderer = new THREE.WebGLRenderer();
  //   renderer.setPixelRatio(window.devicePixelRatio);
  //   renderer.setSize(window.innerWidth, window.innerHeight);

  //   container.appendChild(renderer.domElement);

  //   //

  //   stats = new Stats();
  //   container.appendChild(stats.dom);

  //   //

  //   window.addEventListener("resize", onWindowResize);
  // }

  // function onWindowResize() {
  //   camera.aspect = window.innerWidth / window.innerHeight;
  //   camera.updateProjectionMatrix();

  //   renderer.setSize(window.innerWidth, window.innerHeight);
  // }

  // //

  // function animate() {
  //   requestAnimationFrame(animate);

  //   render();
  //   stats.update();
  // }

  // function render() {
  //   const delta = clock.getDelta();
  //   const time = clock.getElapsedTime();

  //   line.rotation.x = time * 0.25;
  //   line.rotation.y = time * 0.5;

  //   t += delta * 0.5;
  //   line.morphTargetInfluences[0] = Math.abs(Math.sin(t));

  //   renderer.render(scene, camera);
  // }

  // function generateMorphTargets(geometry) {
  //   const data = [];

  //   for (let i = 0; i < segments; i++) {
  //     const x = Math.random() * r - r / 2;
  //     const y = Math.random() * r - r / 2;
  //     const z = Math.random() * r - r / 2;

  //     data.push(x, y, z);
  //   }

  //   const morphTarget = new THREE.Float32BufferAttribute(data, 3);
  //   morphTarget.name = "target1";

  //   geometry.morphAttributes.position = [morphTarget];
  // }
};

const o = new THREE.Object3D();
const c = new THREE.Color();

const Boxes = ({
  length = 100000,
  size = [1, 1, 1],
  positions,
}: {
  length?: number;
  size?: Vector3Array;
  positions: Vector3Array[];
}) => {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const outlines = useRef();
  const colors = useMemo(
    () =>
      new Float32Array(
        Array.from({ length }, () =>
          c.set(niceColors[17][Math.floor(Math.random() * 5)]).toArray()
        ).flat()
      ),
    [length]
  );
  useLayoutEffect(() => {
    let i = 0;
    const root = Math.round(Math.pow(length, 1 / 3));
    const halfRoot = root / 2;
    // for (let x = 0; x < root; x++)
    //   for (let y = 0; y < root; y++)
    //     for (let z = 0; z < root; z++) {
    //       const id = i++;
    //       o.rotation.set(Math.random(), Math.random(), Math.random());
    //       o.position.set(
    //         halfRoot - x + Math.random(),
    //         halfRoot - y + Math.random(),
    //         halfRoot - z + Math.random()
    //       );
    //       o.updateMatrix();
    //       ref.current.setMatrixAt(id, o.matrix);
    //     }

    positions.forEach((p, i) => {
      o.position.set(p[0], p[1], p[2]);
      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);
    });

    ref.current.instanceMatrix.needsUpdate = true;
    // Re-use geometry + instance matrix
    // outlines.current.geometry = ref.current.geometry;
    // outlines.current.instanceMatrix = ref.current.instanceMatrix;
  }, [length]);
  return (
    <group>
      <instancedMesh ref={ref} args={[undefined, undefined, length]}>
        <boxGeometry args={size}>
          <instancedBufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </boxGeometry>
        <meshLambertMaterial vertexColors toneMapped={false} />
      </instancedMesh>
      {/* <instancedMesh ref={outlines} args={[null, null, length]}>
        <meshEdgesMaterial
          transparent
          polygonOffset
          polygonOffsetFactor={-10}
          size={size}
          color="black"
          thickness={0.001}
          smoothness={0.005}
        />
      </instancedMesh> */}
    </group>
  );
};

const GraphNodes = () => {
  const nodes = useGraphStore((state) => state.nodes);
  const hoverId = useGraphStore((state) => state.nodeHoverId);

  const positions = useMemo(() => nodes.map((node) => node.position), [nodes]);

  // const [springs, set] = useSprings(nodes.length, (i) => ({
  //   from: { position: [0, 0, 0] },
  //   position: [nodes[i].x, nodes[i].y, nodes[i].z],
  //   config: { mass: 20, tension: 150, friction: 50 },
  // }));

  return <Boxes positions={positions} />;

  // return nodes.map((node) => {
  //   return (
  //     <GraphNode
  //       key={node.id}
  //       id={node.id}
  //       ref={node.ref}
  //       position={node.position}
  //       color={node.color}
  //       radius={node.val}
  //       isHover={hoverId === node.id}
  //     />
  //   );
  // });
};

function Scene() {
  return (
    <>
      <GraphNodes />
      <GraphEdges />
    </>
  );
}
