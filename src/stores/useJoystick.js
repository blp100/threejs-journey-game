import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export default create(
  subscribeWithSelector((set) => {
    return {
      jump: false,
      pressJump: () => set({ jump: true }),
      releaseJump: () => set({ jump: false }),
      // Joystick cursor
      cursor: { x: 0, y: 0 },
      setCursorPosition: (position) =>
        set({ cursor: { x: position.x, y: position.y } }),
    };
  })
);
