export function formatDate(iso: string | undefined | null): string {
  if (!iso) return "—";
  // Backend returns naive ISO timestamps; treat them as UTC.
  const hasZone = /[zZ]|[+-]\d\d:?\d\d$/.test(iso);
  const d = new Date(hasZone ? iso : `${iso}Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function parseDate(iso: string): number {
  const hasZone = /[zZ]|[+-]\d\d:?\d\d$/.test(iso);
  return new Date(hasZone ? iso : `${iso}Z`).getTime();
}


/** Turn any report list item (string or object) into readable text. */
export function itemToText(item: unknown): string {
  if (item == null) return "";

  if (typeof item === "string") return item;
  if (typeof item === "number" || typeof item === "boolean") {
    return String(item);
  }

  if (typeof item === "object" && !Array.isArray(item)) {
    const o = item as Record<string, unknown>;

    // Prefer fields that contain the actual report text.
    for (const key of [
      "text",
      "claim",
      "finding",
      "statement",
      "limitation",
      "content",
      "title",
      "summary",
      "description",
      "reason",
    ]) {
      const value = o[key];

      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }

    // Support objects that contain a nested message.
    for (const key of ["details", "detail", "message"]) {
      const value = o[key];

      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }

    // Avoid displaying "[object Object]" or raw JSON in the report.
    return "";
  }

  return "";
}


export function isUrl(s: string): boolean {
  return /^https?:\/\/\S+$/i.test(s.trim());
}

export function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}
