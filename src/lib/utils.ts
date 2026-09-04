/** Minimal class-name joiner — no runtime dependency needed for this project. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

/** "2026-07-28" -> "28 Jul 2026". Deterministic, so server and client agree. */
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatDate(iso: string): string {
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const year = parts[0];
  const monthIndex = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  const month = MONTHS[monthIndex] ?? parts[1];
  return `${day} ${month} ${year}`;
}

/** "Revit 2022" … "Revit 2026" -> "Revit 2022–2026" for compact badges. */
export function summariseCompatibility(values: string[]): string {
  if (values.length === 0) return "—";
  if (values.length === 1) return values[0];
  return `${values[0]} – ${values[values.length - 1]}`;
}

export function pluralise(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
