/**
 * Formats a Date to UTC ISO string format expected by the API.
 * Example: "2023-12-01T00:00:00Z"
 */
export function formatDateToUtc(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

/**
 * Parses an ISO date string from the API into a Date object.
 */
export function parseApiDate(dateStr: string): Date {
  return new Date(dateStr);
}

/**
 * Gets the current time as a UTC ISO string.
 */
export function nowUtc(): string {
  return formatDateToUtc(new Date());
}
