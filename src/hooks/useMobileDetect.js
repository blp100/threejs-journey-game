import { useEffect, useState } from "react";

const useMobileDetect = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 810);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 810);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

export default useMobileDetect;
