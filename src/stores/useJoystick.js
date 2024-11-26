import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export default create(
  subscribeWithSelector((set) => {
    return {
      jump: false,
      pressJump: () => set({ jump: true }),
      releaseJump: () => set({ jump: false }),
    };
  })
);
