import { addMonths, endOfYear, format, parse } from "date-fns"

const MONTH_KEY_FORMAT = "yyyy-MM"

export function monthKeyToDate(monthKey: string): Date {
  return parse(monthKey, MONTH_KEY_FORMAT, new Date())
}

export function dateToMonthKey(date: Date): string {
  return format(date, MONTH_KEY_FORMAT)
}

export function getCurrentMonthKey(): string {
  return dateToMonthKey(new Date())
}

export function shiftMonthKey(monthKey: string, months: number): string {
  return dateToMonthKey(addMonths(monthKeyToDate(monthKey), months))
}

export function getYearEndMonthKey(monthKey: string): string {
  return dateToMonthKey(endOfYear(monthKeyToDate(monthKey)))
}

export function isMonthKeyAfter(a: string, b: string): boolean {
  return a > b
}

export function getMonthKeyRange(
  startMonthKey: string,
  endMonthKey: string
): string[] {
  const keys: string[] = []
  let current = startMonthKey
  while (!isMonthKeyAfter(current, endMonthKey)) {
    keys.push(current)
    current = shiftMonthKey(current, 1)
  }
  return keys
}
