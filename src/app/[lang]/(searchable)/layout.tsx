import stableData from "@/test-data/stable-data.json";
import forceLayout from "ngraph.forcelayout";
import createGraph from "ngraph.graph";
import largeGraphData from "@/test-data/large-graph-data.json";
import { getDictionary } from "@/utils/get-dictionary";
import { LParam } from "../layout";
import {
  cn,
  generateRandomGraph,
  getFibonocciSphere,
  getFibonocciSphereRadiusFromDistance,
  getRandomColorFromSet,
} from "@/utils/utils";
import { GEdge, GNode, GraphData } from "@/store/GraphStore";
import { ReactNode, cache } from "react";
import { Graph } from "@/components/Three/Graph/Graph";
import { Sidebar } from "@/components/Sidebar/Sidebar";

export default async function SearchLayout({
  params,
  children,
}: {
  params: LParam;
  children: ReactNode;
}) {
  const t = await getDictionary(params.lang);
  const graphData = await fetchGraphDataWithSimulation();

  return (
    <>
      <section className="-z-10 fixed top-0 left-0 flex flex-col w-full">
        <Graph data={graphData} />
      </section>
      <div className="flex flex-col sm:flex-row sm:gap-8 w-full pack-content pointer-events-none">
        <Sidebar />
        {children}
      </div>
    </>
  );
}

const fetchGraphDataWithSimulation = cache(async (): Promise<GraphData> => {
  // large data to test for performance:
  // const data = getLargeData();

  // random data to test the force layout:
  const data = generateRandomGraph(200, 2);

  // stable data to test the force layout:
  // const data = stableData as GraphData;

  simulateForces(data);
  getSpherePositions(data);

  return data;
});

const physicsSettings3d = {
  // timeStep: 0.5,
  dimensions: 3,
  // gravity: -12,
  // theta: 0.8,
  // springLength: 10,
  // springCoefficient: 0.8,
  // dragCoefficient: 0.9,
};

const physicsSettings2d = {
  // timeStep: 0.5,
  dimensions: 2,
  // gravity: -12,
  // theta: 0.8,
  // springLength: 10,
  // springCoefficient: 0.8,
  // dragCoefficient: 0.9,
};

const simulateForces = (data: GraphData) => {
  // create a graph and populate it with data:
  const g = createGraph<GNode, GEdge>();
  data.nodes.forEach((node) => g.addNode(node.id));
  data.edges.forEach((edge) => g.addLink(edge.source, edge.target));

  // use force simulation to generate positions of each node:
  const layout3d = forceLayout(g, physicsSettings3d);

  // must iterate the simulation to get a good layout:
  for (let i = 0; i < 500; i++) {
    if (layout3d.step()) break; // break out early if simulation is stable
  }

  // use force simulation to generate positions of each node:
  const layout2d = forceLayout(g, physicsSettings2d);

  // must iterate the simulation to get a good layout:
  for (let i = 0; i < 500; i++) {
    if (layout2d.step()) break; // break out early if simulation is stable
  }

  // store the new positions of the nodes generated by the force layout
  data.nodes.forEach((node) => {
    const p3d = layout3d.getNodePosition(node.id);
    const p2d = layout2d.getNodePosition(node.id);
    node.tree3dPosition = [p3d.x, p3d.y, p3d.z ?? 0];
    node.tree2dPosition = [p2d.x, p2d.y, 0];
  });
};

const getSpherePositions = (data: GraphData) => {
  const length = data.nodes.length;
  const radius = getFibonocciSphereRadiusFromDistance(length, 15);

  // const startPositions =
  //   data.nodes.map((_, i) => getFibonocciSphere(i, data.nodes.length, radius));

  data.nodes.forEach((node, i) => {
    node.spherePosition = getFibonocciSphere(i, length, radius);
  });
};

const getLargeData = (): GraphData => ({
  nodes: largeGraphData.nodes.map((node) => ({
    ...node,
    color: getRandomColorFromSet(),
    spherePosition: [0, 0, 0],
    tree2dPosition: [0, 0, 0],
    tree3dPosition: [0, 0, 0],
    position: [0, 0, 0],
    scale: [2, 2, 2],
    rotation: [0, 0, 0],
    data: { description: node.description },
  })),
  edges: largeGraphData.links.map((edge, i) => ({
    ...edge,
    id: `${i}`,
    color: getRandomColorFromSet(),
  })),
});
