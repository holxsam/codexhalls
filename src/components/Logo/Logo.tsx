import { cn } from "@/utils/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("text-lg uppercase", className)}>
      <span className="font-light text-white">Codex</span>
      <span className="font-extrabold text-white">Halls</span>
    </div>
  );
};
