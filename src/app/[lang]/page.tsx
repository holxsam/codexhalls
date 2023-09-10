import Graph from "@/components/Graph/Graph";
import { HeroSection } from "@/components/HeroSection/HeroSection";
import { getDictionary } from "@/utils/get-dictionary";
import { LParam } from "./layout";
import { genRandomTree, getRandomIntInclusive } from "@/utils/utils";
import { GEdge, GNode, GraphData } from "@/store/GraphStore";
import * as d3 from "d3-force";

const fetchGraphDataWithSimulation = async (): Promise<GraphData> => {
  const data = genRandomTree(50, 200);

  // If you start with a defined position, the simulation gets messed up.
  // Even x: 0, y: 0, z: 0 will mess up the simulation.
  // So we'll delete x, y, z and the simulation will add it back in for us:
  data.nodes.forEach((node) => {
    // @ts-ignore
    delete node.x;
    // @ts-ignore
    delete node.y;
    // @ts-ignore
    delete node.z;
  });

  // d3 simulation does things inplace but we don't want our edges to get modified:
  const copyOfEdges: GEdge[] = JSON.parse(JSON.stringify(data.edges));

  // simulate forces to layout (determine the positions of each node) the graph:
  // this is where x and y gets added back in:
  d3.forceSimulation(data.nodes)
    .force(
      "edge",
      d3
        .forceLink<GNode, GEdge>(copyOfEdges)
        .id((d) => d.id)
        .distance(1)
        .strength(0.5)
    )
    .force("charge", d3.forceManyBody().strength(-800).distanceMax(100))
    .force("center", d3.forceCenter().strength(0.1))
    .alphaMin(0.001)
    .tick(300);

  // d3-force only simulates in 2 dimensions (x, y)
  // there is d3-force-3d but I didn't like how it simulated the z-position
  // so we'll do it ourself using simple randomness:
  data.nodes = data.nodes.map((node) => ({
    ...node,
    z: getRandomIntInclusive(-50, 50),
  }));

  return data;
};

export default async function Home({ params }: { params: LParam }) {
  const t = await getDictionary(params.lang);
  const graphData = await fetchGraphDataWithSimulation();
  return (
    <div className="isolate flex flex-col gap-28 pb-32">
      <HeroSection dictionary={t} graphData={graphData} />
    </div>
  );
}
