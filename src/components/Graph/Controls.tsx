import { useGraphStore } from "@/store/GraphStore";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useState } from "react";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";

export const Controls = () => {
  useDragControls();
  const isDragging = useGraphStore((state) => state.nodeDragId !== "");
  const setCameraChanging = useGraphStore((state) => state.setCameraChanging);

  return (
    <OrbitControls
      makeDefault
      // autoRotate
      // autoRotateSpeed={0.5}
      enabled={!isDragging}
      onStart={(e) => {
        setCameraChanging(true);
      }}
      onEnd={() => {
        setCameraChanging(false);
      }}
    />
  );
};

const useDragControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  const nodes = useGraphStore((state) => state.nodes);
  const setDrag = useGraphStore((state) => state.setNodeDragId);

  const [dragControls, setDragControls] = useState(
    () => new DragControls([], camera, domElement)
  );

  // useEffect(() => {
  //   type MeshObject = (typeof nodes)[number]["ref"]["current"];

  //   const objects = nodes
  //     .map((node) => node.ref.current)
  //     .filter((node): node is NonNullable<MeshObject> => node !== null);

  //   setDragControls(new DragControls(objects, camera, domElement));
  // }, [nodes, camera, domElement]);

  // useEffect(() => {
  //   dragControls.addEventListener("dragstart", function (event) {
  //     const targetObj = event.object as THREE.Mesh;
  //     const node = nodes.find(
  //       (node) => node.ref.current?.uuid === targetObj.uuid
  //     );
  //     setDrag(node ? node.id : "");
  //     // event.object.material.emissive.set(0xaaaaaa);
  //   });

  //   dragControls.addEventListener("dragend", function (event) {
  //     setDrag("");
  //     // event.object.material.emissive.set(0x000000);
  //   });

  //   return () => {
  //     dragControls.deactivate(); // removes listeners
  //     dragControls.dispose(); // clean up
  //   };
  // }, [dragControls, nodes, setDrag]);
};
