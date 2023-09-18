"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { GraphData, useGraphStore } from "@/store/GraphStore";
import { Lights } from "../Lights/Lights";
import { Helpers } from "../Helpers/Helpers";
import { DISTANCE_FROM_ORIGIN } from "@/utils/constants";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect } from "react";
import { VisualDebug } from "../../VisualDebug/VisualDebug";
import { GraphSceneAndControls } from "../GraphSceneAndControls/GraphSceneAndControls";
import { SceneOverlay } from "../SceneOverlay/SceneOverlay";
import { memo } from "react";

THREE.ColorManagement.enabled = true;

const cameraPosition = new THREE.Vector3().setFromSphericalCoords(
  DISTANCE_FROM_ORIGIN / 4,
  Math.PI / 2,
  0
);

export function Graph({ data }: { data: GraphData }) {
  const initGraph = useGraphStore((state) => state.initGraph);
  const toggleMode = useGraphStore((state) => state.toggleMode);

  // const { scrollY } = useScroll({});
  // const { scrollY } = useScroll();
  // const y = useTransform(scrollY, [0, 600], ["0%", "50%"]);
  // const opacity = useTransform(scrollY, [0, 800], [1, 0]);

  useEffect(() => {
    const toggleGraphMode = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "g") {
        e.preventDefault();
        toggleMode();
      }
    };

    window.addEventListener("keydown", toggleGraphMode);

    return () => {
      window.removeEventListener("keydown", toggleGraphMode);
    };
  }, []);

  // MUSE LEAVE 'data' out of the dependency for now
  // We expect 'data' to not change between routes since it was fetched by the layout
  // and passed in to this component as a prop.
  // However, that is NOT the case, even tho its supposed to be cached by the layout.
  // Most likely a next 13 bug.
  useEffect(() => {
    initGraph(data);
  }, []);

  return (
    <motion.div
      // style={{
      //   y,
      //   opacity,
      // }}
      className="relative w-full h-screen-dvh"
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <SceneOverlay>
        <VisualDebug />
      </SceneOverlay>
      <Canvas camera={{ position: cameraPosition, fov: 40 }}>
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
