/**
 * Formats a Date to UTC ISO string format expected by the API.
 * Example: "2023-12-01T00:00:00Z"
 */
export declare function formatDateToUtc(date: Date): string;
/**
 * Parses an ISO date string from the API into a Date object.
 */
export declare function parseApiDate(dateStr: string): Date;
/**
 * Gets the current time as a UTC ISO string.
 */
export declare function nowUtc(): string;
//# sourceMappingURL=date.d.ts.map