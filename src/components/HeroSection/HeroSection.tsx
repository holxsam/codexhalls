import { Dictionary } from "@/app/[lang]/layout";
import { HeroGraph } from "./HeroGraph";

export const HeroSection = ({ dictionary }: { dictionary: Dictionary }) => {
  return (
    <section className="-z-10 relative flex flex-col min-h-[calc(100vh-64px)]">
      <HeroGraph />
      {/* <HeroContent dictionary={dictionary} /> */}
      {/* <OwnerMessage dictionary={dictionary} /> */}
    </section>
  );
};
