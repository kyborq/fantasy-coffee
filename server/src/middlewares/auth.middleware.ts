import { createMiddleware } from "hono/factory";
// import { redis } from "~/redis";

export const authMiddleware = createMiddleware(async (c, next) => {
  // const token = c.req.cookie("session_token");
  // if (!token) return c.json({ error: "Unauthorized" }, 401);

  // const key = `session:${token}`;
  // const raw = await redis.get(key);
  // if (!raw) return c.json({ error: "Session expired or revoked" }, 401);

  // const session = JSON.parse(raw);
  // const ttl = await redis.ttl(key);
  // const maxTtl = 30 * 24 * 60 * 60; // 30 дней в секундах

  // // Sliding expiration: продлеваем, если осталось < 50% времени
  // if (ttl > 0 && ttl < maxTtl / 2) {
  //   await redis.expire(key, maxTtl);
  // }

  // c.set("userId", session.userId);
  // c.set("phone", session.phone);
  // c.set("sessionId", token);

  await next();
});
