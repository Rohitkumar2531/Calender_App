import { useMemo } from "react";
import { motion } from "framer-motion";
import { useCalendar, toDateKey } from "@/hooks/useCalendar";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { useHolidays } from "@/hooks/useHolidays";
import { WallHook } from "@/components/calendar/WallHook";
import { CalendarPage } from "@/components/calendar/CalendarPage";
import { PageFlipper, usePageFlip } from "@/components/calendar/PageFlipper";
import { ThemeToggle } from "@/components/calendar/ThemeToggle";
import { SpaceBackground } from "@/components/SpaceBackground";

const Index = () => {
  const {
    currentMonth,
    range,
    notes,
    datesWithNotes,
    goToPrevMonth,
    goToNextMonth,
    handleDateClick,
    clearRange,
    addDateNote,
    addMemo,
    deleteNote,
  } = useCalendar();

  const parallaxOffset = useMouseParallax();
  const { playPaperFlipSound } = useSoundEffect();
  const holidays = useHolidays(currentMonth);
  const { isFlipping, direction, triggerFlip, onFlipComplete } = usePageFlip();

  const handlePrev = () => {
    playPaperFlipSound();
    triggerFlip(-1, goToPrevMonth);
  };

  const handleNext = () => {
    playPaperFlipSound();
    triggerFlip(1, goToNextMonth);
  };

  const targetMonth = useMemo(() => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + direction);
    return d;
  }, [currentMonth, direction]);

  const backMonth = isFlipping ? targetMonth : currentMonth;

  const sharedProps = {
    range,
    notes,
    datesWithNotes,
    holidays,
    onPrev: handlePrev,
    onNext: handleNext,
    onDateClick: handleDateClick,
    onAddDateNote: addDateNote,
    onAddMemo: addMemo,
    onDeleteNote: deleteNote,
    onClearRange: clearRange,
  };

  return (
    <>
      {/* Background with slower parallax - moves 50% of mouse movement */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <SpaceBackground
          parallaxX={parallaxOffset.x * 0.5}
          parallaxY={parallaxOffset.y * 0.5}
        />
      </div>

      {/* Main content with faster parallax - moves 120% of mouse movement */}
      <motion.div
        animate={{
          x: parallaxOffset.x * 1.2,
          y: parallaxOffset.y * 1.2,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 30,
          mass: 1,
        }}
        className="min-h-screen bg-gradient-to-b from-black/5 to-black/10 dark:from-black/0 dark:to-black/0 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8 md:p-12 transition-colors duration-300 relative z-10"
        style={{
          boxShadow: "inset 0 0 60px rgba(100, 200, 255, 0.05)",
        }}
      >
        <ThemeToggle />
        <div className="w-full max-w-[520px] flex flex-col items-center" style={{ transform: "scale(0.87)", transformOrigin: "top center" }}>
          <WallHook />

          <div
            className="w-full shadow-cal animate-swing origin-top relative"
            style={{
              borderRadius: "0.125rem",
              boxShadow:
                "0 0 40px rgba(100, 200, 255, 0.1), 0 0 60px rgba(100, 200, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            }}
          >
            <PageFlipper
              isFlipping={isFlipping}
              direction={direction}
              onFlipComplete={onFlipComplete}
              frontContent={
                <CalendarPage
                  {...sharedProps}
                  currentMonth={currentMonth}
                  isFlipping={isFlipping}
                />
              }
              backContent={
                <CalendarPage
                  {...sharedProps}
                  currentMonth={backMonth}
                  interactive={false}
                  isFlipping={isFlipping}
                />
              }
            />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Index;
