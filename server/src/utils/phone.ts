import z from "zod";

const E164_BODY = /^[1-9]\d{9,14}$/;

const SEP = /[\s\-\(\)\.\u00A0\u202f]/g;

export function normalizePhone(raw: string): string | null {
  const compact = raw.trim().replace(SEP, "");
  if (!compact) return null;

  if (compact.startsWith("+")) {
    const digits = compact.slice(1).replace(/\D/g, "");
    return E164_BODY.test(digits) ? `+${digits}` : null;
  }

  let digits = compact.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("00")) digits = digits.slice(2);

  if (digits.startsWith("8") && digits.length === 11) {
    digits = `7${digits.slice(1)}`;
  }

  if (digits.length === 10 && /^[1-9]\d{9}$/.test(digits)) {
    digits = `7${digits}`;
  }

  return E164_BODY.test(digits) ? `+${digits}` : null;
}

export const phoneSchema = z.string().transform((raw, ctx): string => {
  const normalized = normalizePhone(raw);
  if (normalized === null) {
    ctx.addIssue({
      code: "custom",
      message: "Invalid phone number",
    });
    return z.NEVER;
  }
  return normalized;
});
