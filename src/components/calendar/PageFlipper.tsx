import { useState, useCallback, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

interface PageFlipperProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  isFlipping: boolean;
  direction: number;
  onFlipComplete: () => void;
}

export function PageFlipper({
  frontContent,
  backContent,
  isFlipping,
  direction,
  onFlipComplete,
}: PageFlipperProps) {
  const controls = useAnimation();
  const shadowControls = useAnimation();
  const lightControls = useAnimation();
  const dropShadowControls = useAnimation();
  const bendControls = useAnimation();
  const flipRef = useRef(false);

  if (isFlipping && !flipRef.current) {
    flipRef.current = true;
    const targetAngle = direction > 0 ? -360 : 360;
    const dur = 1.0; // 1 second for realistic paper flip

    // Main rotation with smooth ease-in-out
    controls
      .start({
        rotateX: targetAngle,
        transition: {
          duration: dur,
          ease: "easeInOut", // Smooth, natural paper-like motion
        },
      })
      .then(() => {
        controls.set({ rotateX: 0 });
        flipRef.current = false;
        onFlipComplete();
      });

    // Paper bend/curve effect - minimal skew to avoid tangential distortion
    bendControls.start({
      skewX: [0, direction > 0 ? -2 : 2, 0],
      transition: { 
        duration: dur, 
        ease: "easeInOut",
        times: [0, 0.5, 1]
      },
    });

    // Enhanced shadow with fold effect - adds delay for realism
    shadowControls.start({
      opacity: [0, 0.75, 0],
      transition: { 
        duration: dur, 
        ease: "easeInOut",
        delay: 0.05
      },
    });

    // Lighting effect with more pronounced dimming - slight delay
    lightControls.start({
      opacity: [0, 0.45, 0],
      transition: { 
        duration: dur, 
        ease: "easeInOut",
        delay: 0.08
      },
    });

    // Drop shadow grows and contracts smoothly - delayed for depth
    dropShadowControls.start({
      opacity: [0, 0.65, 0],
      scaleX: [0.7, 1.3, 0.7],
      scaleY: [0.8, 1.0, 0.8],
      transition: { 
        duration: dur, 
        ease: "easeInOut",
        delay: 0.1
      },
    });
  }

  return (
    <div
      className="relative w-full"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        animate={controls}
        className="relative w-full"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "top center",
        }}
      >
        <motion.div
          animate={bendControls}
          className="relative w-full"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "center",
          }}
        >
          {/* Front face */}
          <div
            className="relative w-full"
            style={{ backfaceVisibility: "hidden" }}
          >
            {frontContent}
          </div>

          {/* Back face */}
          <div
            className="absolute inset-0 w-full"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateX(180deg)",
            }}
          >
            {backContent}
          </div>
        </motion.div>

        {/* Front gradient shadow - sharper at fold */}
        <motion.div
          animate={shadowControls}
          initial={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none rounded-sm z-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 30%, transparent 60%)",
          }}
        />

        {/* Deep dimming overlay for lighting effect */}
        <motion.div
          animate={lightControls}
          initial={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none rounded-sm z-10"
          style={{
            background: "rgba(0,0,0,1)",
          }}
        />
      </motion.div>

      {/* Enhanced drop shadow - shows page lift */}
      <motion.div
        animate={dropShadowControls}
        initial={{ opacity: 0, scaleX: 0.7 }}
        className="absolute -bottom-4 left-[5%] right-[5%] h-8 rounded-[50%] z-[-1]"
        style={{
          background:
            "radial-gradient(ellipse 100% 40%, hsla(0,0%,0%,0.4) 0%, transparent 75%)",
          filter: "blur(10px)",
        }}
      />
    </div>
  );
}

export function usePageFlip() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState(1);
  const callbackRef = useRef<(() => void) | null>(null);

  const triggerFlip = useCallback(
    (dir: number, callback: () => void) => {
      if (isFlipping) return;
      setDirection(dir);
      setIsFlipping(true);
      callbackRef.current = callback;
    },
    [isFlipping]
  );

  const onFlipComplete = useCallback(() => {
    setIsFlipping(false);
    callbackRef.current?.();
    callbackRef.current = null;
  }, []);

  return { isFlipping, direction, triggerFlip, onFlipComplete };
}
