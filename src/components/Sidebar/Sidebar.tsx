import { MinimizeTarget } from "../MinimizeTarget/MinimizeTarget";
import { Searchbar } from "../Searchbar/Searchbar";
import { ControlsTip } from "../ControlsTip/ControlsTips";
import {
  TouchControlsToggle,
  GraphModeToggle,
  FullscreenToggle,
} from "../ControlsTip/GraphToggles";
import { WikiNavItem, WikiSidebarNav } from "../WikiSidebarNav/WikiSidebarNav";
import { MobileWikiSidebarNav } from "../WikiSidebarNav/MobileWikiSidebarNav";
import { cn } from "@/utils/utils";

const links: WikiNavItem[] = [
  {
    name: "wayfinders",
    href: "/wayfinders",
    items: [
      { name: "Niss", href: "#" },
      { name: "Wingrave", href: "#" },
      { name: "Kyros", href: "#" },
      { name: "Senja", href: "#" },
      { name: "Silo", href: "#" },
      { name: "Venomiss", href: "#" },
    ],
  },
  {
    name: "weapons",
    href: "/weapons",
    items: [
      { name: "Nights Edge", href: "#" },
      { name: "Tempest", href: "#" },
      { name: "More", href: "#" },
      { name: "And", href: "#" },
      { name: "Even More", href: "#" },
      { name: "Stuff", href: "#" },
    ],
  },
  {
    name: "items",
    href: "#",
    items: [
      { name: "Echoes", href: "#" },
      { name: "Accessories", href: "#" },
      { name: "Materials", href: "#" },
      { name: "Materials2", href: "#" },
      { name: "Materials3", href: "#" },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="sticky top-[64px] h-min sm:h-[calc(100vh-64px)] sm:min-w-[300px] pt-4 flex flex-col gap-4">
      <div className="flex flex-col">
        <div className="pointer-events-auto flex justify-between">
          <GraphModeToggle />
          <div className="flex h-12 p-[2px]">
            <TouchControlsToggle />
            <FullscreenToggle />
          </div>
        </div>
        <MinimizeTarget />
      </div>
      <nav className="relative flex flex-col gap-2 pointer-events-auto">
        <Searchbar />
        {/* <ControlsTip /> */}
        <WikiSidebarNav links={links} />
        <MobileWikiSidebarNav links={links} />
      </nav>
    </aside>
  );
}
