import { useMemo, useState, useCallback } from "react";
import { DayCell } from "./DayCell";
import { CalendarHeader } from "./CalendarHeader";
import { toDateKey, type DateRange } from "@/hooks/useCalendar";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

interface CalendarGridProps {
  currentMonth: Date;
  range: DateRange;
  datesWithNotes: Set<string>;
  holidays: Map<string, string>;
  onPrev: () => void;
  onNext: () => void;
  onDateClick: (date: Date) => void;
  isFlipping?: boolean;
}

export function CalendarGrid({
  currentMonth,
  range,
  datesWithNotes,
  holidays,
  onPrev,
  onNext,
  onDateClick,
  isFlipping = false,
}: CalendarGridProps) {
  const today = new Date();
  const todayKey = toDateKey(today);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [currentMonth]);

  const isInRange = (date: Date) => {
    if (!range.start || !range.end) return false;
    return date > range.start && date < range.end;
  };

  const isStart = (date: Date) =>
    range.start ? toDateKey(date) === toDateKey(range.start) : false;

  const isEnd = (date: Date) =>
    range.end ? toDateKey(date) === toDateKey(range.end) : false;

  // Preview: when user has selected start but not end, show hover preview
  const isInHoverRange = useCallback(
    (date: Date) => {
      if (!range.start || range.end || !hoveredDate) return false;
      const lo = range.start < hoveredDate ? range.start : hoveredDate;
      const hi = range.start < hoveredDate ? hoveredDate : range.start;
      return date > lo && date < hi;
    },
    [range, hoveredDate]
  );

  const isHoveredEndpoint = useCallback(
    (date: Date) => {
      if (!hoveredDate) return false;
      return toDateKey(date) === toDateKey(hoveredDate);
    },
    [hoveredDate]
  );

  // Is the range a single date (start selected, no end)?
  const isSingleSelect = !!(range.start && !range.end);

  const handleMouseLeaveGrid = useCallback(() => setHoveredDate(null), []);

  return (
    <div onMouseLeave={handleMouseLeaveGrid}>
      <CalendarHeader currentMonth={currentMonth} onPrev={onPrev} onNext={onNext} disabled={isFlipping} />

      {/* Range info bar */}
      {range.start && (
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground px-1 pb-2 font-display">
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
            {toDateKey(range.start)}
          </span>
          {range.end && (
            <>
              <span className="text-border">→</span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                {toDateKey(range.end)}
              </span>
              <span className="ml-auto text-primary font-medium">
                {Math.round((range.end.getTime() - range.start.getTime()) / 86400000) + 1} days
              </span>
            </>
          )}
          {!range.end && (
            <span className="ml-auto text-muted-foreground/60 italic">click another date for range</span>
          )}
        </div>
      )}

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAYS.map((wd, i) => (
          <div
            key={wd}
            className={`text-center text-[11px] font-display font-semibold tracking-wider py-2 ${
              i >= 5 ? "text-cal-weekend" : "text-muted-foreground"
            }`}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {days.map((date, idx) => {
          const rowStart = idx % 7 === 0;
          if (!date)
            return (
              <div
                key={`empty-${idx}`}
                className={`h-10 sm:h-11 ${rowStart ? "border-t border-border" : ""}`}
              />
            );

          const dayOfWeek = date.getDay();
          const weekend = dayOfWeek === 0 || dayOfWeek === 6;
          const key = toDateKey(date);

          return (
            <div key={key} className={rowStart ? "border-t border-border" : ""}>
              <DayCell
                day={date.getDate()}
                date={date}
                isToday={key === todayKey}
                isWeekend={weekend}
                isStart={isStart(date)}
                isEnd={isEnd(date)}
                isInRange={isInRange(date)}
                isSingleSelect={isSingleSelect && isStart(date)}
                hasNote={datesWithNotes.has(key)}
                isCurrentMonth={true}
                isHovered={isHoveredEndpoint(date) && range.start !== null && !range.end}
                isInHoverRange={isInHoverRange(date)}
                holidayName={holidays.get(key)}
                onClick={() => onDateClick(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => {}}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
