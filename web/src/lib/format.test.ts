import { describe, expect, it } from "vitest";
import {
  toArabicDigits,
  toArabicDecimal,
  formatMillions,
  formatCompactCount,
  formatArea,
  formatPercent,
  formatDuration,
  formatPhone,
  normalizePhoneDigits,
  formatRelativeArabic,
  formatMessageTimestamp,
  formatClockArabic,
  formatDelta,
  initialOf,
  toneFromString,
} from "./format";

// Mirrors the internal WEEKDAYS_AR array in format.ts (not exported) — lets
// the 7-day-and-later branches be tested without depending on real-world
// calendar facts.
const WEEKDAY_LABELS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

describe("toArabicDigits", () => {
  it("maps every Latin digit to its Eastern Arabic form", () => {
    expect(toArabicDigits(1234567890)).toBe("١٢٣٤٥٦٧٨٩٠");
  });

  it("rounds non-integer input", () => {
    expect(toArabicDigits(4.6)).toBe("٥");
  });

  it("formats zero", () => {
    expect(toArabicDigits(0)).toBe("٠");
  });
});

describe("toArabicDecimal", () => {
  it("formats with the default one fraction digit and Arabic decimal separator", () => {
    expect(toArabicDecimal(4.8)).toBe("٤٫٨");
  });

  it("respects a custom fraction-digit count", () => {
    expect(toArabicDecimal(4.856, 2)).toBe("٤٫٨٦");
  });
});

describe("formatMillions", () => {
  it("uses whole-number formatting for integer values", () => {
    expect(formatMillions(214)).toBe("٢١٤ م");
  });

  it("uses decimal formatting for fractional values", () => {
    expect(formatMillions(4.8)).toBe("٤٫٨ م");
  });
});

describe("formatCompactCount", () => {
  it("returns an em dash for zero or negative", () => {
    expect(formatCompactCount(0)).toBe("—");
    expect(formatCompactCount(-5)).toBe("—");
  });

  it("returns plain Arabic digits under 1000", () => {
    expect(formatCompactCount(326)).toBe("٣٢٦");
  });

  it("compacts thousands with an ألف suffix", () => {
    expect(formatCompactCount(18400)).toBe("١٨٫٤ ألف");
  });
});

describe("formatArea", () => {
  it("appends the م² unit", () => {
    expect(formatArea(240)).toBe("٢٤٠ م²");
  });
});

describe("formatPercent", () => {
  it("formats an integer percent without decimals", () => {
    expect(formatPercent(12)).toBe("١٢٪");
  });

  it("formats a fractional percent with decimals", () => {
    expect(formatPercent(2.7)).toBe("٢٫٧٪");
  });
});

describe("formatDuration", () => {
  it("formats seconds as zero-padded mm:ss", () => {
    expect(formatDuration(204)).toBe("٣:٢٤");
  });

  it("pads single-digit seconds", () => {
    expect(formatDuration(65)).toBe("١:٠٥");
  });
});

describe("formatPhone / normalizePhoneDigits round-trip", () => {
  it("groups a 10-digit number and converts to Arabic digits", () => {
    expect(formatPhone("0551234567")).toBe("٠٥٥ ١٢٣ ٤٥٦٧");
  });

  it("leaves non-10-digit input ungrouped but still Arabic-digit", () => {
    expect(formatPhone("123")).toBe("١٢٣");
  });

  it("normalizePhoneDigits reverses formatPhone back to plain Latin digits", () => {
    const raw = "0551234567";
    expect(normalizePhoneDigits(formatPhone(raw))).toBe(raw);
  });

  it("normalizePhoneDigits strips non-digit characters", () => {
    expect(normalizePhoneDigits("٠٥٥ ١٢٣ ٤٥٦٧")).toBe("0551234567");
  });
});

describe("formatRelativeArabic", () => {
  const now = new Date(2026, 0, 15, 12, 0, 0);

  it("returns الآن for less than a minute ago", () => {
    expect(formatRelativeArabic(now, now)).toBe("الآن");
  });

  it.each([
    [1, "قبل دقيقة"],
    [2, "قبل دقيقتين"],
    [5, "قبل ٥ دقائق"],
    [10, "قبل ١٠ دقائق"],
    [15, "قبل ١٥ دقيقة"],
  ])("minutes=%i -> %s", (minutesAgo, expected) => {
    const date = new Date(now.getTime() - minutesAgo * 60_000);
    expect(formatRelativeArabic(date, now)).toBe(expected);
  });

  it.each([
    [1, "قبل ساعة"],
    [2, "قبل ساعتين"],
    [5, "قبل ٥ ساعات"],
    [15, "قبل ١٥ ساعة"],
  ])("hours=%i -> %s", (hoursAgo, expected) => {
    const date = new Date(now.getTime() - hoursAgo * 3_600_000);
    expect(formatRelativeArabic(date, now)).toBe(expected);
  });

  it("returns أمس for exactly one day ago", () => {
    const date = new Date(now.getTime() - 24 * 3_600_000);
    expect(formatRelativeArabic(date, now)).toBe("أمس");
  });

  it("returns قبل يومين for exactly two days ago", () => {
    const date = new Date(now.getTime() - 48 * 3_600_000);
    expect(formatRelativeArabic(date, now)).toBe("قبل يومين");
  });

  it.each([3, 6])("returns a day count for %i days ago", (daysAgo) => {
    const date = new Date(now.getTime() - daysAgo * 24 * 3_600_000);
    expect(formatRelativeArabic(date, now)).toBe(`قبل ${toArabicDigits(daysAgo)} أيام`);
  });

  it("falls back to the weekday name at 7+ days ago", () => {
    const date = new Date(now.getTime() - 7 * 24 * 3_600_000);
    expect(formatRelativeArabic(date, now)).toBe(WEEKDAY_LABELS[date.getDay()]);
  });
});

describe("formatMessageTimestamp", () => {
  const now = new Date(2026, 0, 15, 18, 0, 0);

  it("shows the clock time for the same day", () => {
    const date = new Date(2026, 0, 15, 14, 30, 0);
    expect(formatMessageTimestamp(date, now)).toBe(formatClockArabic(date));
  });

  it("shows أمس for exactly one day before", () => {
    const date = new Date(2026, 0, 14, 9, 0, 0);
    expect(formatMessageTimestamp(date, now)).toBe("أمس");
  });

  it("shows the weekday name between 2 and 6 days before", () => {
    const date = new Date(2026, 0, 10, 9, 0, 0); // 5 days before
    expect(formatMessageTimestamp(date, now)).toBe(WEEKDAY_LABELS[date.getDay()]);
  });

  it("shows a day/month date for 7+ days before", () => {
    const date = new Date(2026, 0, 1, 9, 0, 0); // 14 days before
    expect(formatMessageTimestamp(date, now)).toBe(
      `${toArabicDigits(date.getDate())}/${toArabicDigits(date.getMonth() + 1)}`,
    );
  });
});

describe("formatClockArabic", () => {
  it("formats an afternoon time as م with Arabic digits", () => {
    expect(formatClockArabic(new Date(2026, 0, 1, 14, 14))).toBe("٢:١٤ م");
  });

  it("formats a morning time as ص", () => {
    expect(formatClockArabic(new Date(2026, 0, 1, 11, 40))).toBe("١١:٤٠ ص");
  });

  it("formats midnight as ١٢ ص", () => {
    expect(formatClockArabic(new Date(2026, 0, 1, 0, 5))).toBe("١٢:٠٥ ص");
  });

  it("formats noon as ١٢ م", () => {
    expect(formatClockArabic(new Date(2026, 0, 1, 12, 0))).toBe("١٢:٠٠ م");
  });
});

describe("formatDelta", () => {
  it("shows an up arrow for non-negative values", () => {
    expect(formatDelta(12)).toBe("▲ ١٢٪");
  });

  it("shows a down arrow for negative values, using the magnitude", () => {
    expect(formatDelta(-3)).toBe("▼ ٣٪");
  });

  it("shows a down arrow for fractional negative values", () => {
    expect(formatDelta(-2.5)).toBe("▼ ٢٫٥٪");
  });
});

describe("initialOf", () => {
  it("returns the first grapheme of a trimmed name", () => {
    expect(initialOf("  محمد القحطاني")).toBe("م");
  });

  it("falls back to ؟ for an empty string", () => {
    expect(initialOf("   ")).toBe("؟");
  });
});

describe("toneFromString", () => {
  it("is deterministic for the same input", () => {
    expect(toneFromString("سلمان الراجحي")).toBe(toneFromString("سلمان الراجحي"));
  });

  it("only ever returns pine or clay", () => {
    expect(["pine", "clay"]).toContain(toneFromString("أي نص"));
  });
});
