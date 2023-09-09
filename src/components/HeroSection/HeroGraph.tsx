import Graph from "../Graph/Graph";

export const HeroGraph = () => {
  return (
    <div id="hero-section-bg" className="-z-10 absolute inset-0 -top-16">
      <div className="absolute inset-x-0 top-0 overflow-hidden">
        <Graph />
      </div>
    </div>
  );
};
