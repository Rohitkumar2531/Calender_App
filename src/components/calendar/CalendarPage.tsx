import { HeroImage } from "./HeroImage";
import { SpiralBinding } from "./SpiralBinding";
import { CalendarGrid } from "./CalendarGrid";
import { NotesPanel } from "./NotesPanel";
import { motion } from "framer-motion";
import type { DateRange, NoteEntry } from "@/hooks/useCalendar";

interface CalendarPageProps {
  currentMonth: Date;
  range: DateRange;
  notes: NoteEntry[];
  datesWithNotes: Set<string>;
  holidays: Map<string, string>;
  onPrev: () => void;
  onNext: () => void;
  onDateClick: (date: Date) => void;
  onAddDateNote: (text: string) => void;
  onAddMemo: (text: string, month: Date) => void;
  onDeleteNote: (id: string) => void;
  onClearRange: () => void;
  isFlipping?: boolean;
  interactive?: boolean;
}

export function CalendarPage({
  currentMonth,
  range,
  notes,
  datesWithNotes,
  holidays,
  onPrev,
  onNext,
  onDateClick,
  onAddDateNote,
  onAddMemo,
  onDeleteNote,
  onClearRange,
  isFlipping = false,
  interactive = true,
}: CalendarPageProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.008 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="w-full"
      style={{ transformOrigin: "center center" }}
    >
      <div
        className="w-full bg-card rounded-sm overflow-hidden relative"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(100, 200, 255, 0.08)",
        }}
      >
      {/* Light reflection at top edge */}
      <div
        className="absolute top-0 left-0 right-0 h-12 pointer-events-none z-[2] rounded-sm"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%)",
        }}
      ></div>

      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] rounded-sm mix-blend-multiply opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />
      {/* Subtle edge vignette for worn paper feel */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] rounded-sm"
        style={{
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.04), inset 0 0 15px rgba(0,0,0,0.02)',
        }}
      />
      <HeroImage currentMonth={currentMonth} />
      <SpiralBinding count={18} />
      <div className="flex flex-col sm:flex-row">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full sm:w-[170px] border-r border-border p-3 sm:p-4 order-2 sm:order-1"
        >
          {interactive ? (
            <NotesPanel
              range={range}
              notes={notes}
              currentMonth={currentMonth}
              onAddDateNote={onAddDateNote}
              onAddMemo={onAddMemo}
              onDeleteNote={onDeleteNote}
              onClearRange={onClearRange}
            />
          ) : (
            <div className="text-xs text-muted-foreground font-display tracking-widest uppercase">Notes</div>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex-1 p-3 sm:p-4 order-1 sm:order-2"
        >
          <CalendarGrid
            currentMonth={currentMonth}
            range={interactive ? range : { start: null, end: null }}
            datesWithNotes={datesWithNotes}
            holidays={holidays}
            onPrev={onPrev}
            onNext={onNext}
            onDateClick={interactive ? onDateClick : () => {}}
            isFlipping={isFlipping}
          />
        </motion.div>
      </div>
      </div>
    </motion.div>
  );
}
