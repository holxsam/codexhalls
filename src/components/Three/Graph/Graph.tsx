"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Lights } from "../Lights/Lights";
import { Helpers } from "../Helpers/Helpers";
import { useEffect } from "react";
import { GraphSceneAndControls } from "../GraphSceneAndControls/GraphSceneAndControls";
import {
  GraphData,
  useGraphStore,
  useOfflineGraphStore,
} from "@/store/GraphStore";

THREE.ColorManagement.enabled = true;

export function Graph({ data }: { data: GraphData }) {
  const enableGraph = useOfflineGraphStore((state) => state.enableGraph);

  useEffect(() => {
    const toggleMode = useGraphStore.getState().toggleMode;
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
    const initGraph = useGraphStore.getState().initGraph;
    initGraph(data);
  }, []);

  return (
    <div
      className="relative w-full h-screen-dvh"
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <Canvas
        frameloop={enableGraph ? "always" : "never"}
        className={enableGraph ? "opacity-100" : "opacity-0"}
      >
        <Lights />
        <GraphSceneAndControls />
        <Helpers
        // stats
        // axes
        // gizmo
        />
      </Canvas>
    </div>
  );
}
