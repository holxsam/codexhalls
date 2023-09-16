"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { GraphData, useGraphStore } from "@/store/GraphStore";
import { Lights } from "../Lights/Lights";
import { Helpers } from "../Helpers/Helpers";
import { DISTANCE_FROM_ORIGIN } from "@/utils/constants";
import { motion, useScroll } from "framer-motion";
import { useEffect } from "react";
import { VisualDebug } from "../../VisualDebug/VisualDebug";
import { GraphSceneAndControls } from "../GraphSceneAndControls/GraphSceneAndControls";
import { SceneOverlay } from "../SceneOverlay/SceneOverlay";

THREE.ColorManagement.enabled = true;

const cameraPosition = new THREE.Vector3().setFromSphericalCoords(
  DISTANCE_FROM_ORIGIN / 4,
  Math.PI / 2,
  0
);

export default function Graph({ data }: { data: GraphData }) {
  const initGraph = useGraphStore((state) => state.initGraph);

  const { scrollY } = useScroll({});

  useEffect(() => {
    initGraph(data);
  }, [data, initGraph]);

  return (
    <motion.div
      style={{
        y: scrollY,
      }}
      className="relative w-full h-screen-dvh"
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <SceneOverlay>
        <ModeButton />
        <MobileControlsButton />
        <VisualDebug />
      </SceneOverlay>
      <Canvas camera={{ position: cameraPosition }}>
        <Lights />
        <GraphSceneAndControls />
        <Helpers
        // stats
        // axes
        // gizmo
        />
      </Canvas>
    </motion.div>
  );
}

const ModeButton = () => {
  const toggleMode = useGraphStore((state) => state.toggleMode);
  const mode = useGraphStore((state) => state.mode);

  return (
    <button
      type="button"
      className="rounded-md bg-indigo-500 uppercase font-medium w-24 h-10"
      onClick={toggleMode}
    >
      {mode}
    </button>
  );
};

const MobileControlsButton = () => {
  const enableMobile = useGraphStore((state) => state.enableMobileControls);
  const setMobile = useGraphStore((state) => state.setEnableMobileControls);

  const toggleTouchControls = () => setMobile(!enableMobile);

  return (
    <button
      type="button"
      className="rounded-md bg-indigo-500 uppercase font-medium w-24 h-10"
      onPointerDown={toggleTouchControls}
    >
      {enableMobile ? "touch" : "normal"}
    </button>
  );
};
