import Link from "next/link";
import { MinimizeTarget } from "../MinimizeTarget/MinimizeTarget";
import { SearchBar } from "../SearchBar/SearchBar";
import { ControlsTip } from "../ControlsTip/ControlsTip";
import {
  TouchControlsToggle,
  GraphModeToggle,
  FullscreenToggle,
} from "../ControlsTip/GraphToggles";

export function Sidebar() {
  return (
    <aside className="sticky top-[64px] h-min sm:h-[calc(100vh-64px)] min-w-[300px] pt-4 borderzzzborder-red-500 flex flex-col gap-8">
      <div className="flex flex-col">
        <div className="flex pointer-events-auto justify-between borderzzborder-red-500">
          <TouchControlsToggle />
          <GraphModeToggle />
          <FullscreenToggle />
        </div>
        <MinimizeTarget />
      </div>
      <SearchBar />
      <nav className="border-l-2 border-white/[15%]">
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
      </nav>
    </aside>
  );
}
