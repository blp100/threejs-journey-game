import useJoystick from "./stores/useJoystick";

export default function JumpButton() {
  const jump = useJoystick((state) => state.jump);
  const pressJump = useJoystick((state) => state.pressJump);
  const releaseJump = useJoystick((state) => state.releaseJump);
  
  return (
    <button
      className="jump"
      type="button"
      style={{
        position: "fixed",
        bottom: "3.625rem",
        right: "1.625rem",
        width: "4rem",
        height: "4rem",
        border: "2px solid #ffffff40",
        borderRadius: "0.75rem",
        boxSizing: "border-box",
        backgroundColor: "#ffffff00",
        zIndex: 1,
      }}
      onContextMenu={(event)=>{event.preventDefault();}}
      onTouchStart={pressJump}
      onTouchEnd={releaseJump}
    >
      <svg
        style={{ color: "#ffffff", opacity: 1, boxSizing: "border-box" }}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m18 9-6-6-6 6" />
        <path d="M12 3v14" />
        <path d="M5 21h14" />
      </svg>
    </button>
  );
}
