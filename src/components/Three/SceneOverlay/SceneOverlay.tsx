import { ReactNode } from "react";

export const SceneOverlay = ({ children }: { children: ReactNode }) => {
  return (
    <div className="z-10 absolute bottom-0 flex gap-2 m-2 pointer-events-none [&>*]:pointer-events-auto">
      {children}
    </div>
  );
};
