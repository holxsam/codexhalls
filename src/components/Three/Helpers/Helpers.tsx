import { GizmoHelper, GizmoViewport, Stats } from "@react-three/drei";

type HelperProps = {
  gizmo?: boolean;
  stats?: boolean;
  axes?: boolean;
};

export const Helpers = ({
  gizmo = false,
  stats = false,
  axes = false,
}: HelperProps) => {
  return (
    <>
      {gizmo && (
        <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
      )}
      {stats && <Stats />}
      {axes && <axesHelper args={[500]} />}
    </>
  );
};
