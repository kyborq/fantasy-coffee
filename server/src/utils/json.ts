export function tryParseJson<T = unknown>(
  text: string,
): { ok: true; value: T } | { ok: false } {
  try {
    return { ok: true, value: JSON.parse(text) as T };
  } catch {
    return { ok: false };
  }
}
