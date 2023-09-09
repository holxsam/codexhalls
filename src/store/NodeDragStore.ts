import { create } from "zustand";

export type NodeDragState = {
  isDragging: boolean;
  dragObjectId: string;
};

export type NodeDragAction = {
  updateNodeDrag: (isDragging: boolean, id: string) => void;
};

export const useNodeDragStore = create<NodeDragState & NodeDragAction>()(
  (set) => ({
    isDragging: false,
    dragObjectId: "",
    updateNodeDrag: (isDragging, id) =>
      set((state) => ({ isDragging, dragObjectId: id })),
  })
);
