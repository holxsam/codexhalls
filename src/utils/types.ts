export interface HasId {
  id: string;
}

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type Vector3Array = [x: number, y: number, z: number];
