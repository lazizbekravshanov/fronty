export type ClassValue = string | false | null | undefined | Record<string, boolean | undefined>;

/** Join class names, skipping falsy values. `{ active: true }` adds "active". */
export function cx(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const v of values) {
    if (!v) continue;
    if (typeof v === "string") out.push(v);
    else for (const [name, on] of Object.entries(v)) if (on) out.push(name);
  }
  return out.join(" ");
}
