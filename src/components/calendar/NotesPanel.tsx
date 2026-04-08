import { useState } from "react";
import { Trash2, CalendarDays, FileText, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { DateRange, NoteEntry } from "@/hooks/useCalendar";
import { toDateKey, toMonthKey } from "@/hooks/useCalendar";
import { cn } from "@/lib/utils";

interface NotesPanelProps {
  range: DateRange;
  notes: NoteEntry[];
  currentMonth: Date;
  onAddDateNote: (text: string) => void;
  onAddMemo: (text: string, month: Date) => void;
  onDeleteNote: (id: string) => void;
  onClearRange: () => void;
}

function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatRange(start: string, end: string) {
  const s = parseLocalDate(start);
  const e = parseLocalDate(end);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (start === end) return fmt(s);
  return `${fmt(s)} – ${fmt(e)}`;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Tab = "date" | "memo";

export function NotesPanel({
  range,
  notes,
  currentMonth,
  onAddDateNote,
  onAddMemo,
  onDeleteNote,
  onClearRange,
}: NotesPanelProps) {
  const [text, setText] = useState("");
  const [tab, setTab] = useState<Tab>("date");

  const monthKey = toMonthKey(currentMonth);
  const monthLabel = `${MONTHS[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (tab === "date") {
      if (!range.start) return;
      onAddDateNote(text.trim());
    } else {
      onAddMemo(text.trim(), currentMonth);
    }
    setText("");
  };

  const rangeLabel = range.start
    ? formatRange(toDateKey(range.start), toDateKey(range.end || range.start))
    : null;

  // Filter notes for the current month view
  const filteredNotes = notes.filter((n) => {
    if (n.type === "memo") return n.monthKey === monthKey;
    // For date notes, check if the range overlaps with current month
    return n.monthKey === monthKey || n.rangeStart.startsWith(monthKey) || n.rangeEnd.startsWith(monthKey);
  });

  const dateNotes = filteredNotes.filter((n) => n.type === "date");
  const memoNotes = filteredNotes.filter((n) => n.type === "memo");
  const displayNotes = tab === "date" ? dateNotes : memoNotes;

  const canSubmit = tab === "memo" ? !!text.trim() : !!text.trim() && !!range.start;

  return (
    <div className="flex flex-col h-full">
      <p className="text-xs font-display font-semibold text-muted-foreground tracking-widest uppercase mb-2">
        Notes
      </p>

      {/* Tabs */}
      <div className="flex rounded-md border border-border mb-3 overflow-hidden">
        <motion.button
          onClick={() => setTab("date")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-display font-medium tracking-wider uppercase transition-all",
            tab === "date" ? "bg-primary text-primary-foreground shadow-[0_0_8px_rgba(100,200,255,0.3)]" : "bg-card text-muted-foreground hover:bg-muted hover:shadow-[0_0_8px_rgba(100,200,255,0.2)]"
          )}
        >
          <CalendarDays className="w-3 h-3" />
          Date
        </motion.button>
        <motion.button
          onClick={() => setTab("memo")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-display font-medium tracking-wider uppercase transition-all",
            tab === "memo" ? "bg-primary text-primary-foreground shadow-[0_0_8px_rgba(100,200,255,0.3)]" : "bg-card text-muted-foreground hover:bg-muted hover:shadow-[0_0_8px_rgba(100,200,255,0.2)]"
          )}
        >
          <FileText className="w-3 h-3" />
          Memo
        </motion.button>
      </div>

      {/* Context info */}
      <AnimatePresence mode="wait">
        {tab === "date" && rangeLabel && (
          <motion.div
            key="date-context"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between text-xs text-primary font-medium mb-2"
          >
            <span>📅 {rangeLabel}</span>
            <motion.button
              onClick={onClearRange}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-0.5 rounded hover:bg-muted hover:shadow-[0_0_8px_rgba(100,150,255,0.3)] transition-all"
              aria-label="Clear selection"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </motion.button>
          </motion.div>
        )}
        {tab === "memo" && (
          <motion.p
            key="memo-context"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="text-[10px] text-muted-foreground mb-2"
          >
            📝 Memo for {monthLabel}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="mb-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            tab === "memo"
              ? "Write a memo for this month…"
              : range.start
              ? "Write a note for this date…"
              : "Select a date first…"
          }
          disabled={tab === "date" && !range.start}
          className="w-full rounded-md border border-border bg-cal-paper px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring resize-none h-20 disabled:opacity-40 leading-7"
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 27px, hsl(var(--border)) 27px, hsl(var(--border)) 28px)",
            backgroundPositionY: "7px",
          }}
        />
        <motion.button
          type="submit"
          disabled={!canSubmit}
          whileHover={canSubmit ? { scale: 1.02 } : undefined}
          whileTap={canSubmit ? { scale: 0.98 } : undefined}
          className="mt-1.5 w-full rounded-md bg-primary text-primary-foreground py-2 text-xs font-display font-medium tracking-wider uppercase hover:shadow-[0_0_12px_rgba(100,200,255,0.4)] transition-all disabled:opacity-30"
        >
          Save {tab === "memo" ? "Memo" : "Note"}
        </motion.button>
      </form>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-1.5">
        {displayNotes.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-muted-foreground text-center py-4"
          >
            {tab === "memo" ? "No memos for this month" : "No date notes yet"}
          </motion.p>
        ) : (
          <AnimatePresence mode="popLayout">
            {displayNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.95 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="group flex items-start gap-2 rounded-md border border-border bg-cal-paper p-2 transition-shadow hover:shadow-cal-sm"
              >
                <div className="flex-1 min-w-0">
                  {note.type === "date" && (
                    <p className="text-[10px] font-medium text-primary mb-0.5">
                      {formatRange(note.rangeStart, note.rangeEnd)}
                    </p>
                  )}
                  {note.type === "memo" && (
                    <p className="text-[10px] font-medium text-accent-foreground mb-0.5">
                      📝 Memo
                    </p>
                  )}
                  <p className="text-xs text-card-foreground whitespace-pre-wrap break-words">
                    {note.text}
                  </p>
                </div>
                <motion.button
                  onClick={() => onDeleteNote(note.id)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/10 hover:shadow-[0_0_8px_rgba(255,100,100,0.3)] transition-all"
                  aria-label="Delete note"
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
