import { useEffect, useState } from "react";

const useMobileDetect = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 810);

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouchDevice);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

export default useMobileDetect;
