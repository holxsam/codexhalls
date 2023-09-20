import * as THREE from "three";
import {
  DISTANCE_FROM_ORIGIN,
  INITIAL_CAMERA_FAR,
  INITIAL_CAMERA_FOV,
  INITIAL_CAMERA_NEAR,
  INITIAL_CAMERA_POSITION,
} from "@/utils/constants";
import { PerspectiveCamera, useHelper } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { Spherical } from "three";

const tempSphere = new Spherical();

export const Lights = () => {
  const controls = useThree((state) => state.controls);
  const camera = useThree((state) => state.camera);
  const pointLightRef = useRef<THREE.PointLight>(null!);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  // useHelper(pointLightRef, THREE.PointLightHelper); // to visualize the point light

  useLayoutEffect(() => {
    const moveLightToCamera = () => {
      const { phi, theta } = tempSphere.setFromVector3(camera.position); // convert camera position to spherical coordinates

      // positions the main light source on a point along the line between the camera position and the origin (0,0,0)
      // this ensures that the light source is always directly in front or behind the camera
      pointLightRef.current.position.setFromSphericalCoords(
        DISTANCE_FROM_ORIGIN,
        phi,
        theta
      );
    };

    moveLightToCamera();
    controls?.addEventListener("change", moveLightToCamera);

    return () => {
      controls?.removeEventListener("change", moveLightToCamera);
    };
  }, [controls, camera]);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        ref={cameraRef}
        near={INITIAL_CAMERA_NEAR}
        far={INITIAL_CAMERA_FAR}
        fov={INITIAL_CAMERA_FOV}
        position={INITIAL_CAMERA_POSITION}
      />
      <ambientLight intensity={0.4} />
      <pointLight
        ref={pointLightRef}
        position={[100, 100, 0]}
        color="white"
        intensity={800}
        distance={2000}
        decay={1}
      />
    </>
  );
};
