import { create } from "zustand";

export type DebugState = {
  data: {};
};

export type DebugAction = {
  setData: (data: {}) => void;
};

export const useDebugStore = create<DebugState & DebugAction>()((set) => ({
  data: {},
  setData: (data) => set((state) => ({ data: { ...state.data, ...data } })),
}));

export type VisualDebugProps = {};

export const VisualDebug = ({}: VisualDebugProps) => {
  const data = useDebugStore((state) => state.data);
  return (
    <pre className="pointer-events-none">{JSON.stringify(data, null, 2)}</pre>
  );
};
