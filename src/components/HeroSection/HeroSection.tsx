import { Dictionary } from "@/app/[lang]/layout";
import { GraphData } from "@/store/GraphStore";
import Graph from "../Three/Graph/Graph";

export const HeroSection = ({
  dictionary,
  graphData,
}: {
  dictionary: Dictionary;
  graphData: GraphData;
}) => {
  return (
    <section className="-z-10 relative flex flex-col">
      <Graph data={graphData} />
      {/* <HeroContent dictionary={dictionary} /> */}
      {/* <OwnerMessage dictionary={dictionary} /> */}
    </section>
  );
};
