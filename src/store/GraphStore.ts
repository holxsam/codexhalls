import { Vector3Array } from "@/utils/types";
import { RefObject, createRef } from "react";
import { create } from "zustand";

export type GNode = {
  id: string;
  val: number;
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
  nodeHoverId: string;
  nodeDragId: string;
  cameraChanging: boolean;
  nodesSpringAnimation: boolean;
};

export type GraphAction = {
  initGraph: (graphData: GraphData) => void;
  setNodeHoverId: (id: string) => void;
  setNodeDragId: (id: string) => void;
  setCameraChanging: (value: boolean) => void;
  setNodesSpringAnimation: (value: boolean) => void;
};

export const useGraphStore = create<GraphState & GraphAction>()((set) => ({
  // state:
  // nodes: [] as GraphNodeWithRef[],
  // edges: [] as GraphEdgeWithRef[],
  nodes: [] as GNode[],
  edges: [] as GEdge[],
  nodeHoverId: "",
  nodeDragId: "",
  cameraChanging: false,
  nodesSpringAnimation: true,

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
}));
