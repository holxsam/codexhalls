"use client";

import * as THREE from "three";
import { useMemo, useRef, useState, useEffect } from "react";
import { OrthographicCamera } from "three";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Bounds,
  GizmoHelper,
  GizmoViewport,
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

  return (
    // !anim &&
    edges.map((edge) => {
      const connectedToDraggedNode = edgesAttachedToNodeDragged.includes(
        edge.id
      );
      const connectedToHoveredNode = edgesAttachedToNodeHovered.includes(
        edge.id
      );

      return (
        <GraphEdge
          key={edge.id}
          id={edge.id}
          edgeAnimation={connectedToHoveredNode || connectedToDraggedNode}
          isDragging={connectedToDraggedNode}
          isHovering={connectedToHoveredNode}
          startRef={edge.sourceRef}
          endRef={edge.targetRef}
          curvation={0}
          forceUpdatePosition={anim}
          // forceUpdatePosition={false}
        />
      );
    })
  );
};

const GraphNodes = () => {
  const nodes = useGraphStore((state) => state.nodes);
  const hoverId = useGraphStore((state) => state.nodeHoverId);

  // const [springs, set] = useSprings(nodes.length, (i) => ({
  //   from: { position: [0, 0, 0] },
  //   position: [nodes[i].x, nodes[i].y, nodes[i].z],
  //   config: { mass: 20, tension: 150, friction: 50 },
  // }));

  // springs[0].position

  return nodes.map((node) => {
    return (
      <GraphNode
        key={node.id}
        id={node.id}
        ref={node.ref}
        position={node.position}
        color={node.color}
        radius={node.val}
        isHover={hoverId === node.id}
      />
    );
  });
};

function Scene() {
  return (
    <>
      <GraphNodes />
      <GraphEdges />
    </>
  );
}
