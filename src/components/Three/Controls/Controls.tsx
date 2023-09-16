import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useSpring, SpringConfig } from "@react-spring/three";
import { useGesture } from "@use-gesture/react";
import { ReactNode, useMemo, useEffect, useRef } from "react";

const xVector = new THREE.Vector3(1, 0, 0).normalize();
const yVector = new THREE.Vector3(0, 1, 0).normalize();
const quaternionX = new THREE.Quaternion();
const quaternionY = new THREE.Quaternion();
// const o = new THREE.Object3D();

export type ControlsProps = {
  global?: boolean;
  cursor?: boolean;
  zoom?: number;
  rotation?: [number, number, number];
  config?: SpringConfig;
  enabled?: boolean;
  children?: ReactNode;
  domElement?: HTMLElement;
  enableZoom?: boolean;
  enableMobileControls?: boolean;
};

export const Controls = ({
  enabled = true,
  global = true,
  domElement,
  cursor = false,
  children,
  rotation = [0, 0, 0],
  zoom = 1,
  config = { mass: 1, tension: 170, friction: 26 },
  enableZoom = true,
  enableMobileControls = true,
}: ControlsProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const explDomElement = domElement || gl.domElement;
  const o = useMemo(() => new THREE.Object3D(), [groupRef]);

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

  const [spring, api] = useSpring(() => ({
    quaternion: [0, 0, 0, 1],
    config,
  }));

  const isPointerEvent = (
    event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent
  ): event is PointerEvent => {
    return event.type.includes("pointer");
  };

  useEffect(() => {
    gl.domElement.style.touchAction = enableMobileControls ? "none" : "auto";
  }, [enableMobileControls, gl]);

  const bind = useGesture(
    {
      onWheel: ({ direction: [_, y], active, shiftKey }) => {
        // ZOOM:
        if (active && shiftKey) {
          camera.position.z += y * 10;
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
            },
          };
        }

        if (!active || !isPointerEvent(event)) return memo;

        const isTouch = event.pointerType === "touch";
        const primaryButton = buttons === 1; // usually the left click
        const secondaryButton = buttons === 2; // usually the right click
        const auxButton = buttons === 4; // usually the middle or scroll click
        const shiftClick = primaryButton && shiftKey;

        if (isTouch && !enableMobileControls) return memo;

        // PAN:
        if ((shiftClick && touches === 1) || secondaryButton || auxButton) {
          const ox = memo.group.x;
          const oy = memo.group.y;

          groupRef.current.position.x = ox + mx / 10;
          groupRef.current.position.y = oy - my / 10;

          return memo;
        }

        // ROTATE:
        if (primaryButton && !shiftKey && !pinching) {
          // We use quaternions to rotate as opposed to euler angles.
          // ex: groupRef.current.rotation.x += dy // eular angle bad; causes gimble lock
          // Explanation/inspiration for the solution: https://www.youtube.com/watch?v=9dbt28PAzmo
          quaternionX.setFromAxisAngle(xVector, dy / 250);
          o.applyQuaternion(quaternionX);

          quaternionY.setFromAxisAngle(yVector, dx / 250);
          o.applyQuaternion(quaternionY);

          // 'o' is temporary object
          // we apply all the quaternions to it to get the correct rotation
          // then we animate the values with useSpring's imperative api
          api.start({
            quaternion: o.quaternion.toArray(),
            onChange: (result) => {
              const [x, y, z, w] = result.value.quaternion;
              groupRef.current.quaternion.set(x, y, z, w); // this is where the values are applied
            },
            config,
          });
        }
        return memo;
      },
      onPinch: ({
        da: [d, a], // [d,a] absolute [d]istance and [a]ngle of the two pointers
        origin: [cpx, cpy], // coordinates of the center between the two touch event
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
            },
            camera: { z: camera.position.z },
            cpx,
            cpy,
            d,
            a,
          };
        }

        if (!isPointerEvent(event)) return memo;

        // const isTouch = event.pointerType === "touch";
        // if (isTouch && !enableMobileControls) return memo;

        if (enableMobileControls && active && touches === 2) {
          const ox = memo.group.x;
          const oy = memo.group.y;

          const dcpx = cpx - memo.cpx;
          const dcpy = cpy - memo.cpy;

          // PAN:
          groupRef.current.position.x = ox + dcpx / 5;
          groupRef.current.position.y = oy - dcpy / 5;

          // ZOOM:
          const dd = d - memo.d;
          camera.position.z = memo.camera.z - dd / 5;
        }

        return memo;
      },
    },
    {
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
    </group>
  );
};
