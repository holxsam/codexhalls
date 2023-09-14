import num2fraction from "num2fraction";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GraphData } from "@/store/GraphStore";
import { Ref, RefObject } from "react";
import { HasId, Vector3Array } from "./types";
import { Color, Vector3 } from "three";
import { ANGLE_INCREMENT } from "./constants";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const generateRandomGraph = (n = 300, scale = 2): GraphData => {
  return {
    nodes: [...Array(n).keys()].map((i) => ({
      id: `${i}`,
      color: getRandomColorFromSet(),
      position: [0, 0, 0],
      scale: [scale, scale, scale],
      rotation: [0, 0, 0],
    })),
    edges: [...Array(n).keys()]
      .filter((i) => i)
      .map((i) => ({
        id: `${i}`,
        source: `${i}`,
        target: `${Math.round(Math.random() * (i - 1))}`,
        color: "white",
      })),
  };
};

export const getRandomColor = () => {
  const hex = "0123456789abcdef";

  const color = [...Array(6).keys()]
    .map(() => hex.at(getRandomIntInclusive(0, hex.length)) ?? "9")
    .join("");

  return `#${color}`;
};

export const getRandomColorFromSet = (
  colors = ["#10b981", "#0ea5e9", "#f43f5e", "#eab308", "#a855f7"]
  // colors = ["#eab308", "#a855f7"]
) => colors[Math.floor(Math.random() * colors.length)];

export const getRandomIntInclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
};

export const clamp = (num: number, min: number, max: number) =>
  Math.max(min, Math.min(num, max));

export const prettyNumber = (num: number) =>
  num.toFixed(2).replace(/[.,]00$/, "");

/**
 * Turns an array of item objects with type T into
 * an object with key value (k, v) pairs of (id, T)
 * @param arr an array of objects with atleast an "id" key
 * @returns an object with id strings as its keys and the item object as the values
 */
export const arrayToObject = <T extends HasId>(arr: T[]) => {
  const objects: { [id: string]: T } = {};
  arr.forEach((item) => {
    objects[item.id] = item;
  });

  return objects;
};

export const mapToArray = <T>(map: { [id: string]: T }) =>
  Object.entries(map).map(([id, item]) => item);

export const roundIntToNearestMultiple = (num: number, multiple: number) =>
  Math.round(num / multiple) * multiple;

export const round10 = (num: number) => Math.round(num * 10) / 10;
export const round100 = (num: number) => Math.round(num * 100) / 100;

export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const mergeProps = <T>(oldValue: T, newValue: Partial<T>): T => {
  const a = deepCopy(oldValue);
  const b = deepCopy(newValue);
  return { ...a, ...b };
};

export const zeroPad = (num: number, zeroes: number) =>
  String(num).padStart(zeroes, "0");

export const prettyFraction = (num: string | number) => {
  const fraction = num2fraction(num).split("/");
  const numerator = fraction[0].trim();
  const denominator = fraction[1] ? fraction[1].trim() : "1";

  return denominator === "1" ? numerator : `${numerator}/${denominator}`;
};

export const calcMidpoint = (
  a: THREE.Vector3,
  b: THREE.Vector3
): [number, number, number] => [
  (a.x + b.x) / 2,
  (a.y + b.y) / 2,
  (a.z + b.z) / 2,
];

export const getMidpointOffset = (
  a: THREE.Vector3,
  b: THREE.Vector3,
  curve: number
): [number, number, number] => {
  const m = calcMidpoint(a, b);
  return [m[0] + curve, m[1] + curve, m[2] + curve];
};

export const isRefObject = <T>(ref: Ref<T>): ref is RefObject<T> => {
  return ref !== null && typeof ref !== "function";
};

const vectorTemp = new Vector3();
export const getFibonocciSphere = (
  i: number,
  numOfPoints: number,
  radius = 1
): Vector3Array => {
  i = i + 1;
  const t = i / numOfPoints;
  const angle1 = Math.acos(1 - 2 * t);
  const angle2 = ANGLE_INCREMENT * i;

  const x = radius * Math.sin(angle1) * Math.cos(angle2);
  const y = radius * Math.sin(angle1) * Math.sin(angle2);
  const z = radius * Math.cos(angle1);

  return [x, y, z];
};

export const getDistanceBetweenFibonocciPoints = (
  numOfPoints: number,
  radius: number
) => {
  const a = getFibonocciSphere(0, numOfPoints, radius);
  const b = getFibonocciSphere(1, numOfPoints, radius);

  const distance = vectorTemp
    .set(a[0], a[1], a[2])
    .distanceTo(vectorTemp.clone().set(b[0], b[1], b[2]));

  return distance;
};

export const getFibonocciSphereRadiusFromDistance = (
  numOfPoints: number,
  distanceBetweenPoints: number
) => {
  let radius = 1;
  let distance = 0;
  while (distance < distanceBetweenPoints) {
    distance = getDistanceBetweenFibonocciPoints(numOfPoints, radius);
    radius++;
  }

  return radius;
};

const tempColor = new Color();
export const hexToArray = (color: string) =>
  tempColor.set(color).toArray() as Vector3Array;
