const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const ARABIC_DECIMAL = "٫"; // Arabic decimal separator (U+066B)

const WEEKDAYS_AR = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

/** Formats a non-negative integer using Eastern Arabic numerals. */
export function toArabicDigits(value: number): string {
  return String(Math.round(value)).replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}

/** Formats a decimal with the given precision using Arabic digits + separator. */
export function toArabicDecimal(value: number, fractionDigits = 1): string {
  const fixed = value.toFixed(fractionDigits);
  return fixed
    .replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)])
    .replace(".", ARABIC_DECIMAL);
}

/** e.g. 4.8 → "٤٫٨ م"، 214 → "٢١٤ م" (millions, Arabic). */
export function formatMillions(value: number): string {
  const isWhole = Number.isInteger(value);
  return `${isWhole ? toArabicDigits(value) : toArabicDecimal(value)} م`;
}

/** e.g. 18400 → "١٨٫٤ ألف"، 326 → "٣٢٦"، 0 → "—". */
export function formatCompactCount(value: number): string {
  if (value <= 0) return "—";
  if (value < 1000) return toArabicDigits(value);
  return `${toArabicDecimal(value / 1000)} ألف`;
}

/** e.g. 240 → "٢٤٠ م²". */
export function formatArea(sqm: number): string {
  return `${toArabicDigits(sqm)} م²`;
}

/** e.g. 2.7 → "٢٫٧٪". */
export function formatPercent(value: number): string {
  const s = Number.isInteger(value) ? toArabicDigits(value) : toArabicDecimal(value);
  return `${s}٪`;
}

/** e.g. 204 → "٣:٢٤" (mm:ss / m:ss). */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${toArabicDigits(minutes)}:${toArabicDigits(seconds).padStart(2, "٠")}`;
}

/** e.g. "0551234567" → "٠٥٥ ١٢٣ ٤٥٦٧". */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const grouped =
    digits.length === 10
      ? `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
      : digits;
  return grouped.replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}

/** Reverses formatPhone()'s grouping/Arabic-digit display back to plain Latin digits for storage. */
export function normalizePhoneDigits(value: string): string {
  return value.replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d))).replace(/\D/g, "");
}

/** Relative Arabic time, e.g. "قبل ٥ دقائق"، "أمس"، "قبل يومين"، "الاثنين". */
export function formatRelativeArabic(date: Date, now: Date = new Date()): string {
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "الآن";
  if (minutes < 60) return withUnit(minutes, "دقيقة", "دقيقتين", "دقائق", "دقيقة");
  if (hours < 24) return withUnit(hours, "ساعة", "ساعتين", "ساعات", "ساعة");
  if (days === 1) return "أمس";
  if (days === 2) return "قبل يومين";
  if (days <= 6) return `قبل ${toArabicDigits(days)} أيام`;
  return WEEKDAYS_AR[date.getDay()];
}

/**
 * Timestamp for chat/inbox: clock time today ("٢:١٤ م")، "أمس"، else weekday.
 */
export function formatMessageTimestamp(date: Date, now: Date = new Date()): string {
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);

  if (dayDiff <= 0) return formatClockArabic(date);
  if (dayDiff === 1) return "أمس";
  if (dayDiff <= 6) return WEEKDAYS_AR[date.getDay()];
  return `${toArabicDigits(date.getDate())}/${toArabicDigits(date.getMonth() + 1)}`;
}

/** e.g. 14:14 → "٢:١٤ م"، 11:40 → "١١:٤٠ ص". */
export function formatClockArabic(date: Date): string {
  const h24 = date.getHours();
  const meridiem = h24 < 12 ? "ص" : "م";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const minutes = toArabicDigits(date.getMinutes()).padStart(2, "٠");
  return `${toArabicDigits(h12)}:${minutes} ${meridiem}`;
}

/** Signed-percent delta string, e.g. 12 → "▲ ١٢٪"، -3 → "▼ ٣٪". */
export function formatDelta(value: number): string {
  const arrow = value >= 0 ? "▲" : "▼";
  const magnitude = Math.abs(value);
  const s = Number.isInteger(magnitude)
    ? toArabicDigits(magnitude)
    : toArabicDecimal(magnitude);
  return `${arrow} ${s}٪`;
}

/** First grapheme of a name, for avatar fallbacks. */
export function initialOf(name: string): string {
  return Array.from(name.trim())[0] ?? "؟";
}

/** Deterministic pine/clay tone from a string (stable per contact). */
export function toneFromString(value: string): "pine" | "clay" {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash + value.charCodeAt(i)) % 2;
  }
  return hash === 0 ? "pine" : "clay";
}

function withUnit(
  n: number,
  one: string,
  two: string,
  few: string,
  many: string,
): string {
  if (n === 1) return `قبل ${one}`;
  if (n === 2) return `قبل ${two}`;
  if (n <= 10) return `قبل ${toArabicDigits(n)} ${few}`;
  return `قبل ${toArabicDigits(n)} ${many}`;
}
