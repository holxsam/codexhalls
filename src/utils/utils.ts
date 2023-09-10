import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import num2fraction from "num2fraction";
import { Vector3 } from "@react-three/fiber";
import { GraphData } from "@/store/GraphStore";

export interface HasId {
  id: string;
}

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const genRandomTree = (n = 300, range = 50): GraphData => {
  const r = getRandomIntInclusive;

  return {
    nodes: [...Array(n).keys()].map((i) => ({
      id: `${i}`,
      val: r(5, 10),
      color: getRandomColor(),
      selected: false,
      x: 0,
      y: 0,
      z: 0,
    })),
    edges: [...Array(n).keys()]
      .filter((i) => i)
      .map((i) => ({
        id: `${i}`,
        source: `${i}`,
        target: `${Math.round(Math.random() * (i - 1))}`,
        color: "white",
        selected: false,
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
