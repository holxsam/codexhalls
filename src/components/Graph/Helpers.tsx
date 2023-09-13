import { GizmoHelper, GizmoViewport, Stats } from "@react-three/drei";

export const Helpers = () => {
  return (
    <>
      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport labelColor="white" axisHeadScale={1} />
      </GizmoHelper>
      <Stats />
      {/* <axesHelper args={[500]} /> */}
    </>
  );
};
