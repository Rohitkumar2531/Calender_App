import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
}

export function CalendarHeader({ currentMonth, onPrev, onNext, disabled = false }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-1 pb-3">
      <motion.button
        onClick={onPrev}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.1 } : undefined}
        whileTap={!disabled ? { scale: 0.9 } : undefined}
        className={cn(
          "p-1.5 rounded-md transition-colors relative",
          disabled && "opacity-40 pointer-events-none",
          !disabled && "hover:shadow-[0_0_12px_rgba(100,200,255,0.4)]"
        )}
        aria-label="Previous month"
      >
        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
      </motion.button>
      <motion.span
        key={`${currentMonth.getMonth()}-${currentMonth.getFullYear()}`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.3 }}
        className="text-xs font-display font-medium text-muted-foreground tracking-widest uppercase"
      >
        {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
      </motion.span>
      <motion.button
        onClick={onNext}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.1 } : undefined}
        whileTap={!disabled ? { scale: 0.9 } : undefined}
        className={cn(
          "p-1.5 rounded-md transition-colors relative",
          disabled && "opacity-40 pointer-events-none",
          !disabled && "hover:shadow-[0_0_12px_rgba(100,200,255,0.4)]"
        )}
        aria-label="Next month"
      >
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </motion.button>
    </div>
  );
}
