import { useState, useCallback, useEffect } from "react";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type NoteType = "date" | "memo";

export interface NoteEntry {
  id: string;
  text: string;
  type: NoteType;
  rangeStart: string; // YYYY-MM-DD
  rangeEnd: string;
  monthKey: string; // YYYY-MM for memo notes
  createdAt: string;
}

const NOTES_KEY = "wall-calendar-notes";

function loadNotes(): NoteEntry[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: NoteEntry[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function toMonthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function useCalendar() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [notes, setNotes] = useState<NoteEntry[]>(loadNotes);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const goToPrevMonth = useCallback(() => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleDateClick = useCallback((date: Date) => {
    setRange((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: date, end: null };
      }
      if (date < prev.start) {
        return { start: date, end: prev.start };
      }
      return { start: prev.start, end: date };
    });
  }, []);

  const clearRange = useCallback(() => {
    setRange({ start: null, end: null });
  }, []);

  const addDateNote = useCallback(
    (text: string) => {
      if (!range.start) return;
      const entry: NoteEntry = {
        id: crypto.randomUUID(),
        text,
        type: "date",
        rangeStart: toDateKey(range.start),
        rangeEnd: toDateKey(range.end || range.start),
        monthKey: toMonthKey(range.start),
        createdAt: new Date().toISOString(),
      };
      setNotes((prev) => [entry, ...prev]);
    },
    [range]
  );

  const addMemo = useCallback(
    (text: string, month: Date) => {
      const entry: NoteEntry = {
        id: crypto.randomUUID(),
        text,
        type: "memo",
        rangeStart: "",
        rangeEnd: "",
        monthKey: toMonthKey(month),
        createdAt: new Date().toISOString(),
      };
      setNotes((prev) => [entry, ...prev]);
    },
    []
  );

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const datesWithNotes = new Set<string>();
  notes
    .filter((n) => n.type === "date")
    .forEach((n) => {
      const [sy, sm, sd] = n.rangeStart.split("-").map(Number);
      const [ey, em, ed] = n.rangeEnd.split("-").map(Number);
      const start = new Date(sy, sm - 1, sd);
      const end = new Date(ey, em - 1, ed);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        datesWithNotes.add(toDateKey(new Date(d)));
      }
    });

  return {
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
  };
}
