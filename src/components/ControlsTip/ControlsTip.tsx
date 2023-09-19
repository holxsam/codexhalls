import { IconHandMove, IconHandTwoFingers } from "@tabler/icons-react";
import { ReactNode } from "react";

export function ControlsTip() {
  return (
    <div className="flex justify-between pointer-events-auto">
      <DesktopControlTips />
      <TouchControlTips />
    </div>
  );
}

export function DesktopControlTips() {
  return (
    <div className="hidden sm:flex gap-4 px-2 text-sm text-zinc-700 ">
      <span className="flex gap-1 items-center">
        <PrimaryMouseButton />
        <span className="capitalize text-sm font-bold">rotate</span>
      </span>
      <span className="flex gap-1 items-center">
        <SecondaryMouseButton />
        <span className="capitalize text-sm font-bold">pan</span>
      </span>
      <span className="flex gap-1 items-center">
        <span className="flex gap-px">
          <ShiftKey />
          <AuxilaryMouseButton />
        </span>
        <span className="capitalize text-sm font-bold">zoom</span>
      </span>
    </div>
  );
}

export function TouchControlTips() {
  return (
    <div className="flex sm:hidden gap-4 px-2 text-sm text-zinc-700">
      <span className="flex gap-1 items-center">
        <IconHandMove />
        <span className="capitalize text-sm font-bold">rotate</span>
      </span>
      <span className="flex gap-1 items-center">
        <IconHandTwoFingers />
        <span className="capitalize text-sm font-bold">pan+zoom</span>
      </span>
    </div>
  );
}

export function MouseContainer({ children }: { children?: ReactNode }) {
  return (
    <span className="overflow-hidden relative h-4 w-[13px]zzz w-3 rounded-[5px] shadow-[inset_0_0_0_2px] shadow-current">
      {children}
    </span>
  );
}

export function PrimaryMouseButton() {
  return (
    <MouseContainer>
      <span className="flex w-1/2 h-1/2 bg-current animate-pulsezzz" />
    </MouseContainer>
  );
}

export function SecondaryMouseButton() {
  return (
    <MouseContainer>
      <span className="flex w-1/2 h-1/2 bg-current animate-pulsezzz absolute right-0" />
    </MouseContainer>
  );
}

export function AuxilaryMouseButton() {
  return (
    <MouseContainer>
      <span className="flex w-[2px] h-1 bg-current animate-pulsezzz absolute top-[4px] left-[calc(50%-1px)]" />
    </MouseContainer>
  );
}

export function ShiftKey() {
  return (
    <span className="relative grid place-items-center h-4 w-[44px] rounded-[5px] bg-current">
      <span className="text-xs font-bold font-mono uppercase text-zinc-900">
        shift
      </span>
    </span>
  );
}
