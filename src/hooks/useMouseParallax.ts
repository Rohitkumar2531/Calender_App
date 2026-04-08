import { useState, useEffect } from "react";

interface ParallaxOffset {
  x: number;
  y: number;
}

export function useMouseParallax() {
  const [parallaxOffset, setParallaxOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Get window dimensions
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate normalized mouse position (-1 to 1)
      const normalizedX = (event.clientX / windowWidth) * 2 - 1;
      const normalizedY = (event.clientY / windowHeight) * 2 - 1;

      // Calculate parallax offset (subtle effect)
      // Background will move slower (multiply by smaller value)
      // Calendar will move faster (multiply by larger value)
      setParallaxOffset({
        x: normalizedX * 20, // Range: -20px to 20px
        y: normalizedY * 20, // Range: -20px to 20px
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return parallaxOffset;
}
