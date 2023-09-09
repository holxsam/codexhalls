import { cn } from "@/utils/utils";

export const LogoWithText = ({ className }: { className?: string }) => {
  return (
    <div className="flex gap-2 items-center">
      <Logo />
      <div className={cn("text-lg uppercase leading-[19px]", className)}>
        <span className="font-thin text-white">Codex</span>
        <span className="font-extrabold text-white">Halls</span>
      </div>
    </div>
  );
};

export const Logo = () => {
  return (
    <span className="inline-flex flex-col gap-px w-5 h-min">
      <div className="h-[3px] w-full bg-white"></div>
      <div className="h-[3px] w-2/3 bg-white"></div>
      <div className="h-[3px] w-1/3 bg-white"></div>
      <div className="h-[3px] w-2/3 bg-white"></div>
      <div className="h-[3px] w-full bg-white"></div>
    </span>
  );
};
