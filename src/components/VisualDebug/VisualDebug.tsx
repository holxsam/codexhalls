import { create } from "zustand";

export type DebugState = {
  data: unknown;
};

export type DebugAction = {
  setData: (data: unknown) => void;
};

export const useDebugStore = create<DebugState & DebugAction>()((set) => ({
  data: [],
  setData: (data) => set((state) => ({ data })),
}));

export type VisualDebugProps = {};

export const VisualDebug = ({}: VisualDebugProps) => {
  const data = useDebugStore((state) => state.data);

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
