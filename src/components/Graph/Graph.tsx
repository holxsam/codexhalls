"use client";

import * as THREE from "three";
import {
  useMemo,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  forwardRef,
  createRef,
  Ref,
} from "react";
import { OrthographicCamera } from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bounds,
  GizmoHelper,
  GizmoViewport,
  Line,
  OrbitControls,
  PerspectiveCamera,
  Stats,
  TrackballControls,
  useHelper,
} from "@react-three/drei";
import { DragControls } from "three/addons/controls/DragControls.js";
import { GEdge, GNode, GraphData, useGraphStore } from "@/store/GraphStore";
import { GraphNode } from "./GraphNode";
import { GraphEdge } from "./GraphEdge";
import { useKeyboardDebug } from "@/hooks/useKeyboardDebug";
import { a, config, useSprings } from "@react-spring/three";
import { Vector3Array } from "@/utils/types";
import { getRandomIntInclusive, isRefObject } from "@/utils/utils";
import { clamp } from "three/src/math/MathUtils.js";

const DISTANCE_FROM_ORIGIN = 500;

const cameraSpherical = new THREE.Spherical(DISTANCE_FROM_ORIGIN / 4, 0, 0);
const cameraPosition = new THREE.Vector3().setFromSpherical(cameraSpherical);

export default function Graph({ data }: { data: GraphData }) {
  const initGraph = useGraphStore((state) => state.initGraph);

  useEffect(() => {
    initGraph(data);
  }, [data, initGraph]);

  return (
    <div className="w-full h-[80vh]">
      <Canvas camera={{ position: cameraPosition }}>
        <Lights />
        <Scene />
        <Controls />
        <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
        <Stats />
        {/* <axesHelper args={[500]} /> */}
      </Canvas>
    </div>
  );
}

const sphere = new THREE.Spherical();

const Lights = () => {
  const controls = useThree((state) => state.controls);
  const camera = useThree((state) => state.camera);
  const pointLightRef = useRef<THREE.PointLight>(null!);
  // useHelper(pointLightRef, THREE.PointLightHelper); // to visualize the point light

  useLayoutEffect(() => {
    const moveLightToCamera = () => {
      const { phi, theta } = sphere.setFromVector3(camera.position); // convert camera position to spherical coordinates

      // positions the main light source on a point along the line between the camera position and the origin (0,0,0)
      // this ensures that the light source is always directly in front or behind the camera
      pointLightRef.current.position.setFromSphericalCoords(
        DISTANCE_FROM_ORIGIN,
        phi,
        theta
      );
    };

    moveLightToCamera();
    controls?.addEventListener("change", moveLightToCamera);

    return () => {
      controls?.removeEventListener("change", moveLightToCamera);
    };
  }, [controls, camera]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight
        ref={pointLightRef}
        position={[100, 100, 0]}
        color="white"
        intensity={800}
        distance={2000}
        decay={1}
      />
    </>
  );
};

const useDragControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

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
    //   // enabled={!isDragging}
    //   onStart={(e) => {
    //     setCameraChanging(true);
    //   }}
    //   onEnd={() => {
    //     setCameraChanging(false);
    //   }}
    // />
    <OrbitControls
      makeDefault
      autoRotate
      autoRotateSpeed={0.5}
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
  // const nodes = useGraphStore((state) => state.nodes);
  // const edges = useGraphStore((state) => state.edges);
  // const dragId = useGraphStore((state) => state.nodeDragId);
  // const hoverId = useGraphStore((state) => state.nodeHoverId);
  // const anim = useGraphStore((state) => state.nodesSpringAnimation);

  // const positions = useMemo(() => {
  //   let ps: { [id: string]: Vector3Array } = {};
  //   nodes.forEach((nodes) => (ps[nodes.id] = nodes.position));
  //   return ps;
  // }, [nodes]);

  // const edgesAttachedToNodeDragged = useMemo(() => {
  //   if (dragId === "") return []; // empty string means no object is getting dragged; just return to save performance
  //   const node = nodes.find((node) => node.id === dragId);
  //   return node ? node.connections : [];
  // }, [nodes, dragId]);

  // const edgesAttachedToNodeHovered = useMemo(() => {
  //   if (hoverId === "") return []; // empty string means no object is getting dragged; just return to save performance
  //   const node = nodes.find((node) => node.id === hoverId);
  //   return node ? node.connections : [];
  // }, [nodes, hoverId]);

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

const rColor = () => getRandomIntInclusive(0, 255);

const Lines = forwardRef<THREE.LineSegments, {}>(function Lines({}, ref) {
  // const ref = useRef<THREE.LineSegments>(null!);
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);

  const positions = useMemo(() => {
    let ps: { [id: string]: Vector3Array } = {};
    nodes.forEach((nodes) => (ps[nodes.id] = nodes.position));
    return ps;
  }, [nodes]);

  const lines = useMemo(() => {
    const lines = edges.flatMap((edge) => {
      const start = positions[edge.source];
      const end = positions[edge.target];
      return [start, end];
    });
    return lines;
  }, [positions, nodes]);

  const LINES = useMemo(() => new Float32Array(lines.flat()), [lines]);

  // const points = useRef(lines.map((v) => new THREE.Vector3(v[0], v[1], v[2])));

  const colors = useMemo(() => {
    const colors = edges
      .flatMap(() => {
        const color: Vector3Array = [rColor(), rColor(), rColor()];
        return [color, color];
      })
      .flat();
    return new Uint8Array(colors); // MUST USE Uint8Array or colors won't work
  }, [edges]);

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

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={LINES}
          count={LINES.length / 3}
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
      <lineBasicMaterial vertexColors opacity={0.2} transparent />
    </lineSegments>
  );
});

const o = new THREE.Object3D(); // reusable object3D
const c = new THREE.Color(); // reusable color
const prevC = new THREE.Color(); // reusable color for previous color only

const rPosition = () => getRandomIntInclusive(-200, 200);
const getInitialPosition = (i: number) => {
  return [rPosition(), rPosition(), rPosition()] as Vector3Array;
};

type BoxesProps = {
  maxLength?: number;
  positions: Vector3Array[];
  scales: Vector3Array[];
  rotations: Vector3Array[];
  colors: Vector3Array[];
};

const Boxes = forwardRef<THREE.InstancedMesh, BoxesProps>(function Boxes(
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
      // const p = positions[i];
      const p = getInitialPosition(i);
      const s = scales[i];
      const r = rotations[i];

      o.position.set(p[0], p[1], p[2]);
      // o.position.set(0, 0, 0);
      o.scale.set(s[0], s[1], s[2]);
      o.rotation.set(r[0], r[1], r[2]);

      o.updateMatrix();

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

        if (!isRefObject(ref) || !ref.current) return;
        const id = e.instanceId;
        if (id !== undefined) {
          ref.current.getColorAt(id, prevC);
          // ref.current.setColorAt(id, c.setHex(0xff0000));
          ref.current.setColorAt(id, prevC.clone().addScalar(0.3));
          if (ref.current.instanceColor)
            ref.current.instanceColor.needsUpdate = true;
        }
      }}
      onPointerOut={(e) => {
        if (!isRefObject(ref) || !ref.current) return;
        const id = e.instanceId;
        if (id !== undefined) {
          ref.current.setColorAt(id, prevC);
          if (ref.current.instanceColor)
            ref.current.instanceColor.needsUpdate = true;
        }
      }}
    >
      <boxGeometry args={size}>
        <instancedBufferAttribute
          attach="attributes-color"
          // args={[colors, 3, true]}
          array={COLORS}
          count={COLORS.length / 3}
          itemSize={3}
          normalized
        />
      </boxGeometry>
      <meshStandardMaterial />
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

const cz = new THREE.Color();
const hexToArray = (color: string) => cz.set(color).toArray() as Vector3Array;

const GraphNodes = () => {
  const boxesRef = useRef<THREE.InstancedMesh>();
  const linesRef = useRef<THREE.LineSegments>();

  const nodes = useGraphStore((state) => state.nodes);
  const hoverId = useGraphStore((state) => state.nodeHoverId);

  // Boxes state:
  const positions = useMemo(() => nodes.map((node) => node.position), [nodes]);
  const scales = useMemo(() => nodes.map((node) => node.scale), [nodes]);
  const rotations = useMemo(() => nodes.map((node) => node.rotation), [nodes]);
  const colors = useMemo(
    () => nodes.map((node) => hexToArray(node.color)),
    [nodes]
  );
  const length = positions.length;

  // Lines state:
  const points = useRef(
    [...Array(length * 2)].map(() => new THREE.Vector3(0, 0, 0))
  );

  const [springs, api] = useSprings(
    length,
    (i) => {
      return {
        from: { position: getInitialPosition(i) },
        to: {
          position: positions[i],
        },
        // config: { mass: 10, tension: 200, friction: 50 },
        config: config.wobbly,
        onStart: () => {
          console.log("start");
        },
        onChange: (result, ctrl, item) => {
          const p: Vector3Array = result.value.position;
          if (boxesRef.current) {
            o.position.set(p[0], p[1], p[2]);
            o.updateMatrix();
            boxesRef.current.setMatrixAt(i, o.matrix);
            boxesRef.current.instanceMatrix.needsUpdate = true;
          }

          points.current.forEach((v, i) => {
            v.set(i, i, i);
          });

          // if (isRefObject(ref) && ref.current)
          //   ref.current.geometry.setFromPoints(points.current);
        },
        onRest: (result, ctrl, item) => {
          console.log("onRest");
          console.log();
          // spreadAnimationDone.current = true;
        },
      };
    },
    [positions]
  );

  return (
    <>
      <Boxes
        ref={boxesRef as Ref<THREE.InstancedMesh>}
        positions={positions}
        colors={colors}
        scales={scales}
        rotations={rotations}
      />
      <Lines ref={linesRef as Ref<THREE.LineSegments>} />
    </>
  );

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
      {/* <GraphEdges /> */}
      {/* <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1]}></sphereGeometry>
        <meshStandardMaterial color="red" />
      </mesh> */}
    </>
  );
}
