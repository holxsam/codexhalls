import { Dictionary } from "@/app/[lang]/layout";
import { HeroGraph } from "./HeroGraph";
import { GraphData } from "@/store/GraphStore";

export const HeroSection = ({
  dictionary,
  graphData,
}: {
  dictionary: Dictionary;
  graphData: GraphData;
}) => {
  return (
    <section className="-z-10 relative flex flex-col min-h-[calc(100vh-64px)]">
      <HeroGraph data={graphData} />
      {/* <HeroContent dictionary={dictionary} /> */}
      {/* <OwnerMessage dictionary={dictionary} /> */}
    </section>
  );
};
