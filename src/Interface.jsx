import { useEffect, useRef } from "react";
import { addEffect } from "@react-three/fiber";
import useGame from "./stores/useGame.js";
import Joystick from "./Joystick.jsx";
import Keyboard from "./Keyboard.jsx";
import useMobileDetect from "./hooks/useMobileDetect.js";

export default function Interface() {
  const isMobile = useMobileDetect();
  const time = useRef();

  const restart = useGame((state) => state.restart);
  const phase = useGame((state) => state.phase);

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState();

      let elapsedTime = 0;

      if (state.phase === "playing") {
        elapsedTime = Date.now() - state.startTime;
      } else if (state.phase === "ended") {
        elapsedTime = state.endTime - state.startTime;
      }

      elapsedTime /= 1000;
      elapsedTime = elapsedTime.toFixed(2);

      if (time.current) time.current.textContent = elapsedTime;
    });
    return () => {
      unsubscribeEffect();
    };
  }, []);

  return (
    <>
      <div className="interface">
        {/* Time */}
        <div ref={time} className="time">
          0.00
        </div>
        {/* Restart */}
        {phase === "ended" && (
          <div className="restart" onClick={restart}>
            RESTART
          </div>
        )}
        {/* Controls */}
        {!isMobile && <Keyboard />}
      </div>
      {isMobile && <Joystick />}
    </>
  );
}
