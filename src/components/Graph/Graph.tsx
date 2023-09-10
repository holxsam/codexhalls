"use client";

import * as THREE from "three";
import { useMemo, useRef, useState, useEffect } from "react";
import { OrthographicCamera } from "three";
import { Canvas, useThree } from "@react-three/fiber";
import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  Stats,
} from "@react-three/drei";
import { DragControls } from "three/addons/controls/DragControls.js";
import { GraphData, useGraphStore } from "@/store/GraphStore";
import { GraphNode } from "./GraphNode";
import { GraphEdge } from "./GraphEdge";

const cameraProps = {
  left: -1000,
  right: 1000,
  top: 1000,
  bottom: -1000,
  near: -1000,
  far: 1000,
};

export default function Graph({ data }: { data: GraphData }) {
  const { left, right, top, bottom, near, far } = cameraProps;
  const initGraph = useGraphStore((state) => state.initGraph);

  useEffect(() => {
    initGraph(data);
  }, [data, initGraph]);

  return (
    <div className="w-full h-[80vh]">
      <Canvas
        orthographic
        camera={{
          position: [0, 0, 500],
          left,
          right,
          top,
          bottom,
          near,
          far,
          zoom: 5,
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

function Light() {
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
}

function useDragControls() {
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
}

function Controls() {
  useDragControls();
  const isDragging = useGraphStore((state) => state.nodeDragId !== "");
  const setCameraChanging = useGraphStore((state) => state.setCameraChanging);

  return (
    <OrbitControls
      makeDefault
      enabled={!isDragging}
      onStart={(e) => {
        setCameraChanging(true);
      }}
      onEnd={() => {
        setCameraChanging(false);
      }}
    />
  );
}

function GraphEdges() {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const dragId = useGraphStore((state) => state.nodeDragId);
  const hoverId = useGraphStore((state) => state.nodeHoverId);

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
    <>
      {edges.map((edge) => {
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
            curvation={8}
          />
        );
      })}
    </>
  );
}

function GraphNodes() {
  const nodes = useGraphStore((state) => state.nodes);
  const hoverId = useGraphStore((state) => state.nodeHoverId);

  return (
    <>
      {nodes.map((node) => {
        return (
          <GraphNode
            key={node.id}
            id={node.id}
            ref={node.ref}
            x={node.x}
            y={node.y}
            z={node.z}
            color={node.color}
            radius={node.val}
            isHover={hoverId === node.id}
          />
        );
      })}
    </>
  );
}

function Scene() {
  return (
    <>
      <GraphNodes />
      <GraphEdges />
    </>
  );
}

function CameraHelper() {
  const { left, right, top, bottom, near, far } = cameraProps;
  const camera = new OrthographicCamera(left, right, top, bottom, near, far);
  return (
    <group position={[0, 0, 0]}>
      <cameraHelper args={[camera]} />
    </group>
  );
}
