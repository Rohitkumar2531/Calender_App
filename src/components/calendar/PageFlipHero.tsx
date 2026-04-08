import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeroImage } from "./HeroImage";

interface PageFlipHeroProps {
  currentMonth: Date;
  flipKey: string;
  direction: number; // 1 = next, -1 = prev
}

export function PageFlipHero({ currentMonth, flipKey, direction }: PageFlipHeroProps) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={flipKey}
          className="w-full origin-top"
          initial={{
            rotateX: direction > 0 ? -90 : 90,
            opacity: 0,
            filter: "blur(2px)",
            scaleY: 0.95,
          }}
          animate={{
            rotateX: 0,
            opacity: 1,
            filter: "blur(0px)",
            scaleY: 1,
          }}
          exit={{
            rotateX: direction > 0 ? 90 : -90,
            opacity: 0,
            filter: "blur(3px)",
            scaleY: 0.92,
            boxShadow: "0 -20px 40px -10px rgba(0,0,0,0.3)",
          }}
          transition={{
            duration: 1.0,
            ease: "easeInOut",
            opacity: { duration: 0.5 },
          }}
          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
        >
          <HeroImage currentMonth={currentMonth} />
          {/* Page edge shadow during flip */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%)",
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function usePageFlip() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState(1);

  const triggerFlip = useCallback(
    (dir: number, callback: () => void) => {
      if (isFlipping) return;
      setDirection(dir);
      setIsFlipping(true);
      callback();
      // Re-enable after animation
      setTimeout(() => setIsFlipping(false), 1050);
    },
    [isFlipping]
  );

  return { isFlipping, direction, triggerFlip };
}
