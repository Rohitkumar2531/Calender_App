import { useMemo } from "react";
import { toDateKey } from "./useCalendar";

export interface Holiday {
  name: string;
  date: string; // YYYY-MM-DD
}

// Common US public holidays (fixed + computed)
function getHolidaysForYear(year: number): Holiday[] {
  const holidays: Holiday[] = [
    { name: "New Year's Day", date: `${year}-01-01` },
    { name: "Valentine's Day", date: `${year}-02-14` },
    { name: "Independence Day", date: `${year}-07-04` },
    { name: "Halloween", date: `${year}-10-31` },
    { name: "Veterans Day", date: `${year}-11-11` },
    { name: "Christmas", date: `${year}-12-25` },
    { name: "New Year's Eve", date: `${year}-12-31` },
  ];

  // MLK Day: 3rd Monday of January
  holidays.push({ name: "MLK Day", date: nthWeekday(year, 0, 1, 3) });
  // Presidents' Day: 3rd Monday of February
  holidays.push({ name: "Presidents' Day", date: nthWeekday(year, 1, 1, 3) });
  // Memorial Day: last Monday of May
  holidays.push({ name: "Memorial Day", date: lastWeekday(year, 4, 1) });
  // Labor Day: 1st Monday of September
  holidays.push({ name: "Labor Day", date: nthWeekday(year, 8, 1, 1) });
  // Columbus Day: 2nd Monday of October
  holidays.push({ name: "Columbus Day", date: nthWeekday(year, 9, 1, 2) });
  // Thanksgiving: 4th Thursday of November
  holidays.push({ name: "Thanksgiving", date: nthWeekday(year, 10, 4, 4) });

  // Easter (Computus algorithm)
  const easter = computeEaster(year);
  holidays.push({ name: "Easter", date: toDateKey(easter) });

  // Mother's Day: 2nd Sunday of May
  holidays.push({ name: "Mother's Day", date: nthWeekday(year, 4, 0, 2) });
  // Father's Day: 3rd Sunday of June
  holidays.push({ name: "Father's Day", date: nthWeekday(year, 5, 0, 3) });

  return holidays;
}

function nthWeekday(year: number, month: number, weekday: number, n: number): string {
  let count = 0;
  for (let d = 1; d <= 31; d++) {
    const date = new Date(year, month, d);
    if (date.getMonth() !== month) break;
    if (date.getDay() === weekday) {
      count++;
      if (count === n) return toDateKey(date);
    }
  }
  return `${year}-${String(month + 1).padStart(2, "0")}-01`;
}

function lastWeekday(year: number, month: number, weekday: number): string {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = daysInMonth; d >= 1; d--) {
    const date = new Date(year, month, d);
    if (date.getDay() === weekday) return toDateKey(date);
  }
  return `${year}-${String(month + 1).padStart(2, "0")}-01`;
}

function computeEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export function useHolidays(currentMonth: Date) {
  return useMemo(() => {
    const year = currentMonth.getFullYear();
    const holidays = getHolidaysForYear(year);
    const map = new Map<string, string>();
    holidays.forEach((h) => map.set(h.date, h.name));
    return map;
  }, [currentMonth.getFullYear()]);
}
