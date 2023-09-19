import { MinimizeTarget } from "../MinimizeTarget/MinimizeTarget";
import { Searchbar } from "../Searchbar/Searchbar";
import { ControlsTip } from "../ControlsTip/ControlsTip";
import {
  TouchControlsToggle,
  GraphModeToggle,
  FullscreenToggle,
} from "../ControlsTip/GraphToggles";
import { WikiNavItem, WikiSidebarNav } from "../WikiSidebarNav/WikiSidebarNav";
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
    <aside
      className={cn(
        "sticky top-[64px] h-min sm:h-[calc(100vh-64px)] min-w-[300px] pt-4 flex flex-col gap-8"
        // "border border-green-500"
      )}
    >
      <div className="flex flex-col">
        <div className="flex pointer-events-auto justify-between">
          <TouchControlsToggle />
          <GraphModeToggle />
          <FullscreenToggle />
        </div>
        <MinimizeTarget />
      </div>
      <nav
        className={cn(
          "relative flex flex-col gap-4 pointer-events-auto "
          // "border border-blue-500"
        )}
      >
        {/* <Searchbar /> */}
        <WikiSidebarNav links={links} />
      </nav>
    </aside>
  );
}
{
  /* <nav className="border-l-2 border-white/[15%]">
        <ul className="[&>*]:pointer-events-auto flex flex-col gap-4 text-white/20 text-base">
          <li className="">
            <Link href="#" className="pl-4 ">
              Wayfinders
            </Link>
          </li>
          <li className="">
            <Link href="#" className="pl-4 ">
              Weapons
            </Link>
          </li>
          <li className="">
            <Link href="#" className="pl-4 ">
              Items
            </Link>
          </li>
        </ul>
      </nav> */
}
