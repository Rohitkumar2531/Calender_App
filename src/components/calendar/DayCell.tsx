import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DayCellProps {
  day: number | null;
  date: Date | null;
  isToday: boolean;
  isWeekend: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isSingleSelect: boolean;
  hasNote: boolean;
  isCurrentMonth: boolean;
  isHovered: boolean;
  isInHoverRange: boolean;
  holidayName?: string;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function DayCell({
  day,
  isToday,
  isWeekend,
  isStart,
  isEnd,
  isInRange,
  isSingleSelect,
  hasNote,
  isCurrentMonth,
  isHovered,
  isInHoverRange,
  holidayName,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: DayCellProps) {
  if (day === null) {
    return <div className="h-10 sm:h-11" />;
  }

  const isEndpoint = isStart || isEnd;
  const isHoliday = !!holidayName;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "relative h-10 sm:h-11 flex items-center justify-center group",
        isInRange && "bg-cal-range",
        isStart && !isSingleSelect && "bg-gradient-to-r from-transparent via-transparent to-cal-range [background-size:200%_100%] [background-position:50%_0]",
        isEnd && "bg-gradient-to-l from-transparent via-transparent to-cal-range [background-size:200%_100%] [background-position:50%_0]",
        isInHoverRange && !isInRange && !isEndpoint && "bg-cal-range/40",
      )}
    >
      <motion.button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        whileHover={isCurrentMonth ? { scale: 1.1 } : undefined}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative z-10 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-sm rounded-full transition-all duration-150",
          !isCurrentMonth && "opacity-25",
          isCurrentMonth && !isEndpoint && !isInRange && !isInHoverRange && "hover:bg-muted hover:shadow-[0_0_10px_rgba(100,200,255,0.3)]",
          isWeekend && !isEndpoint && "text-cal-weekend font-semibold",
          isInRange && !isEndpoint && "text-cal-range-foreground font-medium",
          isStart && "bg-primary text-primary-foreground font-bold shadow-md hover:shadow-[0_0_12px_rgba(100,200,255,0.5)]",
          isEnd && !isSingleSelect && "bg-primary text-primary-foreground font-bold shadow-md hover:shadow-[0_0_12px_rgba(100,200,255,0.5)]",
          isSingleSelect && isStart && "bg-primary text-primary-foreground font-bold shadow-md ring-2 ring-primary/30 ring-offset-2 ring-offset-card hover:shadow-[0_0_12px_rgba(100,200,255,0.5)]",
          isToday && !isEndpoint && "ring-2 ring-primary ring-offset-1 ring-offset-card font-bold hover:shadow-[0_0_10px_rgba(100,200,255,0.4)]",
          isHovered && !isEndpoint && "bg-primary/20 text-primary font-semibold",
          // Holiday styling
          isHoliday && !isEndpoint && "text-cal-holiday font-semibold",
        )}
        aria-label={`Day ${day}${holidayName ? ` — ${holidayName}` : ""}`}
      >
        {day}
      </motion.button>
      {/* Holiday indicator */}
      {isHoliday && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className={cn(
            "absolute top-0 right-0.5 w-1.5 h-1.5 rounded-full z-20 animate-pulse-glow",
            isEndpoint ? "bg-primary-foreground" : "bg-cal-holiday"
          )}
        />
      )}
      {/* Holiday tooltip */}
      {isHoliday && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          whileHover={{ opacity: 1 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded bg-card text-foreground text-[10px] font-display whitespace-nowrap shadow-cal-sm border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30"
        >
          {holidayName}
        </motion.div>
      )}
      {/* Note indicator dot */}
      {hasNote && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring" }}
          className={cn(
            "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full z-20 animate-pulse-glow",
            isEndpoint ? "bg-primary-foreground" : "bg-cal-note-dot"
          )}
        />
      )}
    </motion.div>
  );
}
