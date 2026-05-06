import { Hono } from "hono";

import { authMiddleware } from "~/middlewares/auth.middleware";
import type { AppEnv } from "~/types/hono-env";

const user = new Hono<AppEnv>();

user.get("/current", authMiddleware, async (c) => {
  const user = c.get("user");

  return c.json({
    userId: user.id,
    phone: user.phone,
  });
});

export default user;
