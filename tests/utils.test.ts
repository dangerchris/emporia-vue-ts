import { describe, expect, test } from "bun:test";
import { formatDateToUtc, parseApiDate, nowUtc } from "../src/utils/date";
import { exponentialBackoff, sleep } from "../src/utils/retry";

describe("Date utilities", () => {
  test("formatDateToUtc formats correctly", () => {
    const date = new Date("2023-12-01T15:30:45.123Z");
    const formatted = formatDateToUtc(date);
    expect(formatted).toBe("2023-12-01T15:30:45Z");
  });

  test("parseApiDate parses correctly", () => {
    const dateStr = "2023-12-01T15:30:45Z";
    const parsed = parseApiDate(dateStr);
    expect(parsed.getUTCFullYear()).toBe(2023);
    expect(parsed.getUTCMonth()).toBe(11); // December is month 11
    expect(parsed.getUTCDate()).toBe(1);
    expect(parsed.getUTCHours()).toBe(15);
    expect(parsed.getUTCMinutes()).toBe(30);
  });

  test("nowUtc returns valid ISO string", () => {
    const now = nowUtc();
    expect(now).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });
});

describe("Retry utilities", () => {
  test("sleep waits for specified duration", async () => {
    const start = Date.now();
    await sleep(50);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(45);
    expect(elapsed).toBeLessThan(100);
  });

  test("exponentialBackoff succeeds on first try", async () => {
    let attempts = 0;
    const result = await exponentialBackoff(async () => {
      attempts++;
      return "success";
    });

    expect(result).toBe("success");
    expect(attempts).toBe(1);
  });

  test("exponentialBackoff retries on failure", async () => {
    let attempts = 0;
    const result = await exponentialBackoff(
      async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error("Temporary failure");
        }
        return "success";
      },
      { maxAttempts: 5, initialDelay: 10, maxDelay: 50 }
    );

    expect(result).toBe("success");
    expect(attempts).toBe(3);
  });

  test("exponentialBackoff throws after max attempts", async () => {
    let attempts = 0;

    await expect(
      exponentialBackoff(
        async () => {
          attempts++;
          throw new Error("Persistent failure");
        },
        { maxAttempts: 3, initialDelay: 10 }
      )
    ).rejects.toThrow("Persistent failure");

    expect(attempts).toBe(3);
  });

  test("exponentialBackoff respects shouldRetry", async () => {
    let attempts = 0;

    await expect(
      exponentialBackoff(
        async () => {
          attempts++;
          throw new Error("Do not retry");
        },
        {
          maxAttempts: 5,
          initialDelay: 10,
          shouldRetry: () => false,
        }
      )
    ).rejects.toThrow("Do not retry");

    expect(attempts).toBe(1);
  });
});
