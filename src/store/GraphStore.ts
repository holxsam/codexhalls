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

export type NodeConnections = {
  sources: string[]; // string of node id's
  targets: string[]; // string of node id's
};

export type NodeConnectionsMap = {
  [id: string]: NodeConnections;
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
  mode: "sphere" | "tree";

  // useful data structures based of the nodes and edges:
  connections: NodeConnectionsMap;
  instanceIdToNodeId: InstanceToNodeIdMap;
  nodeIdToInstanceId: NodeToInstanceIdMap;
};

export type GraphAction = {
  initGraph: (graphData: GraphData) => void;
  setNodeHoverId: (id: string) => void;
  setNodeDragId: (id: string) => void;
  setCameraChanging: (value: boolean) => void;
  setAnimating: (value: boolean) => void;
  setMode: (value: GraphState["mode"]) => void;
  toggleMode: () => void;
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

  connections: {},
  instanceIdToNodeId: {},
  nodeIdToInstanceId: {},

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
}));
