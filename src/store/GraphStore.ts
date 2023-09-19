import { Vector3Array } from "@/utils/types";
import { RefObject, createRef } from "react";
import { InstancedMesh, LineSegments } from "three";
import { create } from "zustand";

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

export type NodeConnections = {
  sources: string[]; // string of node id's
  targets: string[]; // string of node id's
};

export type NodeConnectionsMap = {
  [nodeId: string]: NodeConnections;
};

export type InstanceToNodeIdMap = { [instanceId: number]: string };
export type NodeToInstanceIdMap = { [nodeId: string]: number };

export type GraphState = {
  nodes: GNode[];
  edges: GEdge[];

  nodesRef: RefObject<InstancedMesh>;
  edgesRef: RefObject<LineSegments>;

  nodeHoverId: string;
  nodeDragId: string;
  cameraChanging: boolean;
  animating: boolean;
  mode: "sphere" | "tree" | "tree2d";
  touchControls: boolean;
  fullscreen: boolean;

  minimizedPosition: [x: number, y: number];

  // useful data structures based of the nodes and edges:
  connections: NodeConnectionsMap;
  instanceIdToNodeId: InstanceToNodeIdMap;
  nodeIdToInstanceId: NodeToInstanceIdMap;

  // threejs
  graphPosition: Vector3Array;
  graphScale: number;
};

export type GraphAction = {
  initGraph: (graphData: GraphData) => void;
  setNodeHoverId: (id: string) => void;
  setNodeDragId: (id: string) => void;
  setCameraChanging: (value: boolean) => void;
  setAnimating: (value: boolean) => void;
  setMode: (value: GraphState["mode"]) => void;
  toggleMode: () => void;
  setTouchControls: (value: boolean) => void;
  toggleTouchControls: () => void;
  setFullscreen: (value: boolean) => void;
  toggleFullscreen: () => void;

  setMinimizedPosition: (pos: [x: number, y: number]) => void;

  setGraphPosition: (pos: Vector3Array) => void;
  setGraphScale: (scale: number) => void;
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
  animating: false,
  mode: "sphere",
  touchControls: true, // needs to be false in production by default
  fullscreen: true,

  minimizedPosition: [0, 0],

  connections: {},
  instanceIdToNodeId: {},
  nodeIdToInstanceId: {},

  graphPosition: [0, -60, 0],
  graphScale: 1.3,

  // actions:
  initGraph: (data) => {
    const instanceIdToNodeId: InstanceToNodeIdMap = {};
    const nodeIdToInstanceId: NodeToInstanceIdMap = {};
    const connections: NodeConnectionsMap = {};

    data.nodes.forEach((node, iID) => {
      instanceIdToNodeId[iID] = node.id;
      nodeIdToInstanceId[node.id] = iID;
      connections[node.id] = {
        sources: data.edges
          .filter((edge) => node.id === edge.source)
          .map((edge) => edge.target),
        targets: data.edges
          .filter((edge) => node.id === edge.target)
          .map((edge) => edge.source),
      };
    });

    set(() => ({
      nodes: data.nodes,
      edges: data.edges,
      connections,
      instanceIdToNodeId,
      nodeIdToInstanceId,
    }));
  },
  setNodeHoverId: (id) => set(() => ({ nodeHoverId: id })),
  setNodeDragId: (id) => set(() => ({ nodeDragId: id })),
  setCameraChanging: (value) => set(() => ({ cameraChanging: value })),
  setAnimating: (value) => set(() => ({ animating: value })),
  setMode: (mode) => set(() => ({ mode })),
  toggleMode: () =>
    set(({ mode }) => ({ mode: mode === "sphere" ? "tree" : "sphere" })),
  setTouchControls: (v) => set(() => ({ touchControls: v })),
  toggleTouchControls: () =>
    set((state) => ({ touchControls: !state.touchControls })),
  setFullscreen: (value) => set(() => ({ fullscreen: value })),
  toggleFullscreen: () => set((state) => ({ fullscreen: !state.fullscreen })),
  setMinimizedPosition: (pos) => set(() => ({ minimizedPosition: pos })),
  setGraphPosition: (pos) => set(() => ({ graphPosition: pos })),
  setGraphScale: (scale) => set(() => ({ graphScale: scale })),
}));

export type OfflineGraphState = {
  enableGraph: boolean;
};

export type OfflineGraphAction = {
  setEnableGraph: (value: boolean) => void;
  toggleEnableGraph: () => void;
};

export const useOfflineGraphStore = create<
  OfflineGraphState & OfflineGraphAction
>()((set) => ({
  enableGraph: false,
  setEnableGraph: (value: boolean) => set((state) => ({ enableGraph: value })),
  toggleEnableGraph: () =>
    set(({ enableGraph }) => ({ enableGraph: !enableGraph })),
}));
