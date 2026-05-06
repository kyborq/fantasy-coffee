import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import z from "zod";
import { fromDuration } from "~/utils/duration";
import { tryParseJson } from "~/utils/json";
import type { AppEnv } from "~/types/hono-env";
import { valkey } from "~/valkey";

const storedSessionSchema = z.object({
  userId: z.number(),
  phone: z.string(),
});

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const token = getCookie(c, "session_token");
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const key = `session:${token}`;
  const raw = await valkey.get(key);
  if (!raw) {
    return c.json({ error: "Session expired or revoked" }, 401);
  }

  const rawJson = tryParseJson(raw);
  if (!rawJson.ok) {
    return c.json({ error: "Invalid session" }, 401);
  }

  const parsed = storedSessionSchema.safeParse(rawJson.value);
  if (!parsed.success) {
    return c.json({ error: "Invalid session" }, 401);
  }

  const { userId, phone } = parsed.data;
  const ttl = await valkey.ttl(key);
  const maxTtl = fromDuration("30d");

  if (ttl > 0 && ttl < maxTtl / 2) {
    await valkey.expire(key, maxTtl);
  }

  c.set("user", {
    id: userId,
    phone,
    sessionId: token,
  });

  await next();
});
