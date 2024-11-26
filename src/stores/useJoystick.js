import { create } from "zustand";

export default create((set)=>{
  return {
    jump: false,
    pressJump: () => set({ jump: true }),
    releaseJump: () => set({ jump: false }),
  };
})