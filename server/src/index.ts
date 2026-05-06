import { Hono } from "hono";

import auth from "./routes/auth.routes";

const app = new Hono();

app.route("/auth", auth);

app.get("/health", (c) => {
  return c.json({ ok: true, timestamp: Date.now() });
});

export default app;
