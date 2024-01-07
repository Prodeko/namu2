import { useState } from "react";

import { useSpring } from "@react-spring/web";

/**
 * Used to create a slide-in animation for a container
 *
 * @returns
 * containerAnimation - The animation for the container
 * overlayAnimation - The animation for the overlay
 * open - Whether the container is open or not
 * setOpen - Function to set the open state
 */
export const useSlideinAnimation = () => {
  const [open, setOpen] = useState<boolean>(false);
  const containerAnimation = useSpring({
    transform: open ? "translateY(0)" : "translateY(100%)",
  });
  const overlayAnimation = useSpring({
    opacity: open ? 1 : 0,
  });
  const toggleContainer = () => setOpen(!open);

  return {
    containerAnimation,
    overlayAnimation,
    open,
    setOpen,
    toggleContainer,
  };
};
