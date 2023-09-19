import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useSpring, SpringConfig } from "@react-spring/three";
import { useGesture } from "@use-gesture/react";
import { ReactNode, RefObject, useEffect, useMemo, useRef } from "react";
import { Vector3Array } from "@/utils/types";
import { clamp } from "three/src/math/MathUtils.js";
import { useKeyboardDebug } from "@/hooks/useKeyboardDebug";
import { useGraphStore } from "@/store/GraphStore";

// we reuse these in our animation loop:
const xVector = new THREE.Vector3(1, 0, 0).normalize();
const yVector = new THREE.Vector3(0, 1, 0).normalize();
const quaternionX = new THREE.Quaternion();
const quaternionY = new THREE.Quaternion();
// const obj = new THREE.Object3D();
const o = new THREE.Object3D();

const vec = new THREE.Vector3(); // create once and reuse
const pos = new THREE.Vector3(); // create once and reuse

export type ControlsProps = {
  children?: ReactNode;
  global?: boolean;
  cursor?: boolean;
  position?: Vector3Array;
  rotation?: Vector3Array;
  scale?: number;
  config?: SpringConfig;
  enabled?: boolean;
  domElement?: HTMLElement;
  enableTouchControls?: boolean;
  showHelper?: boolean; // use this to get a good initial position/rotation for your data
  showAxes?: boolean;
  step?: number;
  minZoom?: number;
  maxZoom?: number;
};

export const Controls = ({
  children,
  enabled = true,
  global = true,
  domElement,
  cursor = false,
  position = [0, 0, 10],
  rotation = [0, 0, 0],
  scale = 1,
  config = { mass: 1, tension: 170, friction: 26 },
  enableTouchControls = true,
  showHelper = false,
  showAxes = false,
  step = 0.1,
  minZoom = 0.1,
  maxZoom = 10,
}: ControlsProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const explDomElement = domElement || gl.domElement;

  const setGraphPosition = useGraphStore((state) => state.setGraphPosition);

  // const { initialPosition, initialQuaternion, initialScale, o } =
  //   useMemo(() => {
  //     obj.position.set(...position);
  //     obj.rotation.set(...rotation);
  //     obj.scale.setScalar(scale);

  //     const [x, y, z, w] = obj.quaternion.toArray();

  //     return {
  //       initialQuaternion: [x, y, z, w],
  //       initialPosition: obj.position.toArray(),
  //       initialScale: scale,
  //       o: obj,
  //     };
  //   }, [position, rotation, scale]);

  // we only want to do this once (when the component first mounts)
  // so ignore the react-hooks/exhaustive-deps warning for 'rotation'
  useEffect(() => {
    // set the initial spatial features:
    const group = groupRef.current;
    group.position.copy(o.position);
    group.quaternion.copy(o.quaternion);
    group.scale.copy(o.scale);
  }, []);

  useEffect(() => {
    if (global && cursor && enabled) {
      explDomElement.style.cursor = "grab";
      gl.domElement.style.cursor = "";
      return () => {
        explDomElement.style.cursor = "default";
        gl.domElement.style.cursor = "default";
      };
    }
  }, [gl, global, cursor, explDomElement, enabled]);

  useEffect(() => {
    gl.domElement.style.touchAction = enableTouchControls ? "none" : "auto";
  }, [enableTouchControls, gl]);

  useKeyboardDebug("d", () => {
    const x = 350;
    const y = 200;

    vec.set(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1,
      0.5
    );

    console.log(vec.toArray());

    vec.unproject(camera);

    console.log(vec.toArray());

    vec.sub(camera.position).normalize();

    const distance = -camera.position.z / vec.z;

    pos.copy(camera.position).add(vec.multiplyScalar(distance));

    // o.position.set(pos.x, pos.y, 0);

    // anim.start({ position: o.position.toArray() });

    setGraphPosition([pos.x, pos.y, 0]);
  });

  useEffect(() => {
    console.log("UE: position");
    o.position.set(...position);
    anim.start({
      position: o.position.toArray(),
    });
  }, [position]);

  useEffect(() => {
    console.log("UE: rotation");
    o.rotation.set(...rotation);
    const [x, y, z, w] = o.quaternion.toArray();
    anim.start({
      quaternion: [x, y, z, w],
    });
  }, [rotation]);

  useEffect(() => {
    console.log("UE: scale");
    o.scale.setScalar(scale);
    anim.start({
      scale: o.scale.x,
    });
  }, [scale]);

  const [, anim] = useSpring(() => {
    console.log("usespring");
    return {
      quaternion: [0, 0, 0, 1],
      position: [0, 0, 0],
      scale: 1,
      config,
      onChange: (result) => {
        const scale = result.value.scale;
        const [px, py, pz] = result.value.position;
        const [x, y, z, w] = result.value.quaternion;

        groupRef.current.position.set(px, py, pz);
        groupRef.current.scale.setScalar(scale);
        groupRef.current.quaternion.set(x, y, z, w);
      },
    };
  });

  const bind = useGesture(
    {
      // enable: false,
      onWheel: ({ direction: [_, y], active, shiftKey }) => {
        // ZOOM:
        if (active && shiftKey) {
          const newZoom = o.scale.x - step * y;
          const zoom = clamp(newZoom, minZoom, maxZoom);
          o.scale.set(zoom, zoom, zoom);

          anim.start({
            scale: o.scale.x,
          });
        }
      },
      onHover: ({ last }) => {
        if (cursor && !global && enabled)
          explDomElement.style.cursor = last ? "auto" : "grab";
      },
      onDrag: ({
        movement: [mx, my],
        delta: [dx, dy],
        buttons,
        active,
        memo,
        first,
        cancel,
        touches,
        pinching,
        shiftKey,
        event,
        ...rest
      }) => {
        if (first) {
          memo = {
            group: {
              x: groupRef.current.position.x,
              y: groupRef.current.position.y,
              z: groupRef.current.position.z,
            },
          };
        }

        if (!active || !isPointerEvent(event)) return memo;

        const isTouch = event.pointerType === "touch";
        const primaryButton = buttons === 1; // usually the left click
        const secondaryButton = buttons === 2; // usually the right click
        const auxButton = buttons === 4; // usually the middle or scroll click
        const shiftClick = primaryButton && shiftKey;

        if (isTouch && !enableTouchControls) return memo;

        // PAN:
        if ((shiftClick && touches === 1) || secondaryButton || auxButton) {
          const ox = memo.group.x;
          const oy = memo.group.y;

          o.position.x = ox + mx / 10;
          o.position.y = oy - my / 10;

          anim.start({
            position: o.position.toArray(),
          });

          return memo;
        }

        // ROTATE:
        if (primaryButton && !shiftKey && !pinching) {
          // We use quaternions to rotate as opposed to euler angles.
          // ex: groupRef.current.rotation.x += dy // eular angle bad; causes gimble lock
          // Explanation/inspiration for the solution: https://www.youtube.com/watch?v=9dbt28PAzmo

          // 'o' is temporary object
          // we apply all the quaternions to it to get the correct rotation
          quaternionX.setFromAxisAngle(xVector, dy / 250);
          o.applyQuaternion(quaternionX);

          quaternionY.setFromAxisAngle(yVector, dx / 250);
          o.applyQuaternion(quaternionY);

          // then we animate the values with useSpring's imperative api
          anim.start({
            quaternion: o.quaternion.toArray(),
          });
        }
        return memo;
      },
      onPinch: ({
        da: [d, a], // [d,a] absolute [d]istance and [a]ngle of the two pointers
        origin: [cpx, cpy], // coordinates of the center between the two touch event
        offset: [scale], // [scale, angle] offsets (starts withs scale=1)
        active,
        first,
        memo,
        wheeling,
        touches,
        event,
        cancel,
        ...rest
      }) => {
        if (first) {
          memo = {
            group: {
              x: groupRef.current.position.x,
              y: groupRef.current.position.y,
              z: groupRef.current.position.z,
            },
            cpx,
            cpy,
            d,
            a,
          };
        }

        // if (!isPointerEvent(event)) return memo;
        // const isTouch = event.pointerType === "touch";
        // if (isTouch && !enableMobileControls) return memo;

        if (enableTouchControls && active && touches === 2) {
          const ox = memo.group.x;
          const oy = memo.group.y;

          const dcpx = cpx - memo.cpx;
          const dcpy = cpy - memo.cpy;

          const zoom = clamp(scale, minZoom, maxZoom);

          o.position.x = ox + dcpx / 5; // pan x
          o.position.y = oy - dcpy / 5; // pan y
          o.scale.set(zoom, zoom, zoom);

          anim.start({
            position: o.position.toArray(),
            scale: o.scale.x,
          });
        }

        return memo;
      },
    },
    {
      enabled,
      target: global ? explDomElement : undefined,
      drag: {
        pointer: { buttons: [1, 2, 4] }, // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
      },
    }
  );

  return (
    // @ts-ignore: this is an issue with react-three-fiber type definitions
    <group ref={groupRef} {...bind?.()}>
      {children}
      {showAxes && <axesHelper args={[60]} />}
      {showHelper && <SpatialHelper objectRef={groupRef} />}
    </group>
  );
};

const isPointerEvent = (
  event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent
): event is PointerEvent => {
  return event.type.includes("pointer");
};

const SpatialHelper = ({
  objectRef,
}: {
  objectRef: RefObject<THREE.Group>;
}) => {
  const ref = useRef<HTMLPreElement>(null!);

  useEffect(() => {
    // rendering outside of react because idk how to render pure html inside react-three-fiber
    const container = document.createElement("div");
    container.className =
      "fixed bottom-0 right-0 text-sm w-56 pointer-events-none";

    const pre = document.createElement("pre");
    ref.current = pre;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "copy";
    btn.className =
      "absolute right-0 bottom-0 m-px px-3 py-1 bg-zinc-400 text-zinc-700 uppercase font-bold text-sm rounded-md pointer-events-auto ";
    btn.onclick = () => {
      navigator.clipboard.writeText(pre.textContent ?? "");
    };

    container.appendChild(pre);
    container.appendChild(btn);
    document.body.appendChild(container);

    return () => {
      document.body.removeChild(container);
    };
  }, []);

  useFrame(() => {
    if (!objectRef.current || !ref.current) return;
    const [px, py, pz] = objectRef.current.position;
    const [rx, ry, rz] = objectRef.current.rotation;
    const scale = objectRef.current.scale.x;

    const data = { position: [px, py, pz], rotation: [rx, ry, rz], scale };

    ref.current.textContent = JSON.stringify(data, null, 2);
  });

  return <></>;
};
