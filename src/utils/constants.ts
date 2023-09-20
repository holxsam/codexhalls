import { Vector3Array } from "./types";

export const DISTANCE_FROM_ORIGIN = 500;
export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
export const ANGLE_INCREMENT = 2 * Math.PI * GOLDEN_RATIO;

export const INITIAL_POSITION: Vector3Array = [0, -60, 0];
export const INITIAL_ROTATION: Vector3Array = [Math.PI / 4, Math.PI / 4, 0];
export const INITIAL_SCALE = 1.3;

export const INITIAL_CAMERA_POSITION: Vector3Array = [0, 0, 125];
export const INITIAL_CAMERA_FOV = 40;
export const INITIAL_CAMERA_NEAR = 0.1;
export const INITIAL_CAMERA_FAR = 1000;
