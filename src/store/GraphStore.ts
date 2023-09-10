import { RefObject, createRef } from "react";
import { create } from "zustand";

export type GNode = {
  id: string;
  val: number;
  color: string;
  selected: boolean;
  x: number;
  y: number;
  z: number;
};

export type GEdge = {
  id: string;
  source: string;
  target: string;
  color: string;
  selected: boolean;
};

export type GraphData = {
  nodes: GNode[];
  edges: GEdge[];
};

export type GraphNodeWithRef = GNode & {
  ref: RefObject<THREE.Mesh>;
  connections: string[];
};

export type GraphEdgeWithRef = GEdge & {
  sourceRef: RefObject<THREE.Mesh> | null;
  targetRef: RefObject<THREE.Mesh> | null;
};

export type GraphState = {
  nodes: GraphNodeWithRef[];
  edges: GraphEdgeWithRef[];
  nodeHoverId: string;
  nodeDragId: string;
  cameraChanging: boolean;
};

export type GraphAction = {
  initGraph: (graphData: GraphData) => void;
  setNodeHoverId: (id: string) => void;
  setNodeDragId: (id: string) => void;
  setCameraChanging: (value: boolean) => void;
};

export const useGraphStore = create<GraphState & GraphAction>()((set) => ({
  nodes: [],
  edges: [],
  nodeHoverId: "",
  nodeDragId: "",
  cameraChanging: false,
  initGraph: (data) => {
    const nodes: GraphNodeWithRef[] = data.nodes.map((node) => ({
      ...node,
      ref: createRef<THREE.Mesh>(),
      connections: data.edges
        .filter((edge) => node.id === edge.source || node.id === edge.target)
        .map((edge) => edge.id),
    }));

    const edges: GraphEdgeWithRef[] = data.edges.map((edge) => {
      const source = nodes.find((node) => node.id === edge.source);
      const target = nodes.find((node) => node.id === edge.target);

      return {
        ...edge,
        sourceRef: source ? source.ref : null,
        targetRef: target ? target.ref : null,
      };
    });

    set((state) => ({ nodes, edges }));
  },
  setNodeHoverId: (id) => set((state) => ({ nodeHoverId: id })),
  setNodeDragId: (id) => set((state) => ({ nodeDragId: id })),
  setCameraChanging: (value) => {
    set((state) => ({ cameraChanging: value }));
  },
}));
