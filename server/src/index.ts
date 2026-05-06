import { Hono } from "hono";

import type { AppEnv } from "~/types/hono-env";
import auth from "./routes/auth.route";
import user from "./routes/user.route";

const app = new Hono<AppEnv>();

app.route("/auth", auth);
app.route("/user", user);

app.get("/health", (c) => {
  return c.json({ ok: true, timestamp: Date.now() });
});

export default app;
