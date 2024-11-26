import { useEffect, useRef, useState } from "react";
import JumpButton from "./JumpButton";
import useJoystick from "./stores/useJoystick";

export default function Joystick() {
  const active = useRef(false);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [currentCenter, setCurrentCenter] = useState({ x: 0, y: 0 });
  const joystick = useRef();
  const cursor = useRef();
  const limit = useRef();
  const identifier = useRef();
  const cursorPosition = useJoystick((state) => state.cursor);
  const setCursorPosition = useJoystick((state) => state.setCursorPosition);

  const touchStart = (event) => {
    event.preventDefault();

    const touch = event.changedTouches[0];

    if (touch) {
      active.current = true;

      identifier.current = touch.identifier;

      setCurrentCenter({ x: touch.clientX, y: touch.clientY });
      limit.current.style.opacity = 0.5;
    }
  };

  const touchmove = (event) => {
    event.preventDefault();

    const touches = [...event.changedTouches];
    const touch = touches.find(
      (_touch) => _touch.identifier === identifier.current
    );

    if (touch) {
      setCurrentCenter({ x: touch.clientX, y: touch.clientY });
    }
  };

  const touchend = (event) => {
    const touches = [...event.changedTouches];
    const touch = touches.find(
      (_touch) => _touch.identifier === identifier.current
    );

    if (touch) {
      active.current = false;

      limit.current.style.opacity = 0.5;

      setCurrentCenter({ x: center.x, y: center.y });
    }
  };

  // Calculate the joystick center
  useEffect(() => {
    const boundings = joystick.current?.getBoundingClientRect();

    if (boundings)
      setCenter({
        x: boundings.left + boundings.width * 0.5,
        y: boundings.top + boundings.height * 0.5,
      });
  }, [joystick.current]);

  useEffect(() => {
    // Add touch events to the entire screen while the user is actively touching.
    // These events persist until the user stops touching the screen.
    if (active.current) {
      document.addEventListener("touchend", touchend);
      document.addEventListener("touchmove", touchmove);
    }
    return () => {
      document.removeEventListener("touchend", touchend);
      document.removeEventListener("touchmove", touchmove);
    };
  }, [active.current]);

  useEffect(() => {
    const originalAngel = -Math.atan2(
      currentCenter.y - center.y,
      currentCenter.x - center.x
    );

    const distance = Math.hypot(
      currentCenter.y - center.y,
      currentCenter.x - center.x
    );

    let radius = distance;

    if (radius > 22) {
      radius = 22 + Math.log(distance - 22) * 5;
    }

    if (radius > 49) {
      radius = 49;
    }
    setCursorPosition({
      x: Math.sin(originalAngel + Math.PI * 0.5) * radius,
      y: Math.cos(originalAngel + Math.PI * 0.5) * radius,
    });
  }, [currentCenter]);

  return (
    <>
      <div
        ref={joystick}
        className="element"
        style={{
          userSelect: "none",
          position: "fixed",
          bottom: "0.625rem",
          left: "0.625rem",
          width: "10.5rem",
          height: "10.5rem",
          borderRadius: "50%",
          transition: "opacity 0.3s 0.0s",
          willChange: "opacity",
          opacity: 1,
          zIndex: 1,
        }}
        onTouchStart={touchStart}
      >
        <div
          className="cursor"
          ref={cursor}
          style={{
            position: "absolute",
            top: "calc(50% - 2rem)",
            left: "calc(50% - 2rem)",
            width: "4rem",
            height: "4rem",
            border: "2px solid #ffffff",
            borderRadius: "50%",
            boxSizing: "border-box",
            pointerEvents: "none",
            willChange: "transform",
            transform: `translateX(${cursorPosition.x}px) translateY(${cursorPosition.y}px)`,
          }}
        />
        <div
          className="limit"
          ref={limit}
          style={{
            position: "absolute",
            top: "calc(50% - 5rem)",
            left: "calc(50% - 5rem)",
            width: "10rem",
            height: "10rem",
            border: "2px solid #ffffff",
            borderRadius: "50%",
            opacity: 0.25,
            pointerEvents: "none",
            boxSizing: "border-box",
          }}
        />
      </div>
      <JumpButton />
    </>
  );
}
