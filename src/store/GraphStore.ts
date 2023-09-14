import { Vector3Array } from "@/utils/types";
import { isRefObject } from "@/utils/utils";
import { MutableRefObject, RefObject, createRef } from "react";
import { InstancedMesh, LineSegments, Matrix4, Object3D } from "three";
import { create } from "zustand";

const o = new Object3D(); // reusable object3D
const m = new Matrix4(); // reusable matrix

export type GNode = {
  id: string;
  color: string;
  position: Vector3Array;
  scale: Vector3Array;
  rotation: Vector3Array;
};

export type GEdge = {
  id: string;
  source: string;
  target: string;
  color: string;
};

export type GraphData = {
  nodes: GNode[];
  edges: GEdge[];
};

type Connection = {
  sources: string[];
  targets: string[];
};

export type GraphNodeWithRef = GNode & {
  ref: RefObject<THREE.Mesh>;
  connections: Connection;
};

export type GraphEdgeWithRef = GEdge & {
  sourceRef: RefObject<THREE.Mesh> | null;
  targetRef: RefObject<THREE.Mesh> | null;
};

export type GraphState = {
  nodes: GNode[];
  edges: GEdge[];

  nodesRef: RefObject<InstancedMesh>;
  edgesRef: RefObject<LineSegments>;

  nodeHoverId: string;
  nodeDragId: string;
  cameraChanging: boolean;
  nodesSpringAnimation: boolean;
  mode: "sphere" | "tree";
  animating: boolean;
};

export type GraphAction = {
  initGraph: (graphData: GraphData) => void;
  setNodeHoverId: (id: string) => void;
  setNodeDragId: (id: string) => void;
  setCameraChanging: (value: boolean) => void;
  setNodesSpringAnimation: (value: boolean) => void;
  setMode: (value: GraphState["mode"]) => void;
  toggleMode: () => void;
  setAnimating: (value: boolean) => void;
};

export const useGraphStore = create<GraphState & GraphAction>()((set) => ({
  // state:
  nodes: [] as GNode[],
  edges: [] as GEdge[],

  nodesRef: createRef<InstancedMesh>(),
  edgesRef: createRef<LineSegments>(),

  nodeHoverId: "",
  nodeDragId: "",
  cameraChanging: false,
  nodesSpringAnimation: true,
  mode: "sphere",
  animating: false,

  // actions:
  initGraph: (data) => {
    // const nodes: GraphNodeWithRef[] = data.nodes.map((node) => ({
    //   ...node,
    //   ref: createRef<THREE.Mesh>(),
    //   // connections: data.edges
    //   //   .filter((edge) => node.id === edge.source || node.id === edge.target)
    //   //   .map((edge) => edge.id),
    //   connections: {
    //     sources: data.edges
    //       .filter((edge) => node.id === edge.source)
    //       .map((edge) => edge.target),
    //     targets: data.edges
    //       .filter((edge) => node.id === edge.target)
    //       .map((edge) => edge.source),
    //   },
    // }));

    // const edges: GraphEdgeWithRef[] = data.edges.map((edge) => {
    //   const source = nodes.find((node) => node.id === edge.source);
    //   const target = nodes.find((node) => node.id === edge.target);

    //   return {
    //     ...edge,
    //     sourceRef: source ? source.ref : null,
    //     targetRef: target ? target.ref : null,
    //   };
    // });

    set((state) => ({ nodes: data.nodes, edges: data.edges }));
  },
  setNodeHoverId: (id) => set((state) => ({ nodeHoverId: id })),
  setNodeDragId: (id) => set((state) => ({ nodeDragId: id })),
  setCameraChanging: (value) => {
    set((state) => ({ cameraChanging: value }));
  },
  setNodesSpringAnimation: (value) =>
    set((state) => ({ nodesSpringAnimation: value })),

  setMode: (mode) => set((state) => ({ mode })),
  toggleMode: () =>
    set(({ mode }) => ({ mode: mode === "sphere" ? "tree" : "sphere" })),
  // setAnimating: (value) => set((state) => ({ animating: value })),
  setAnimating: (value) =>
    set((state) => {
      return { animating: value };
    }),
}));
