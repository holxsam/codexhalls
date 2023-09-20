import { IconList } from "@tabler/icons-react";
import { cn } from "@/utils/utils";

export const MobileWikiSidebarNavToggle = ({
  onClick,
}: {
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      title="Navigation Menu"
      className={cn(
        "grid sm:hidden",
        "z-10 relative outline-none appearance-none",
        "rounded-xl w-12 min-w-[48px] aspect-square place-items-center ring-current",
        "text-zinc-500 hover:text-zinc-200 focus-visible:text-zinc-200 bg-transparent"
      )}
      onClick={onClick}
    >
      <IconList />
    </button>
  );
};
