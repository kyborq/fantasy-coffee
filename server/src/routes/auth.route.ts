import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";

import type { AppEnv } from "~/types/hono-env";
import { authMiddleware } from "~/middlewares/auth.middleware";
import { AuthService } from "~/services/auth.service";
import { phoneSchema } from "~/utils/phone";

const authService = new AuthService();
const auth = new Hono<AppEnv>();

const signinSchema = z.object({
  phone: phoneSchema,
});

auth.post("/signin", zValidator("json", signinSchema), async (c) => {
  const { phone } = c.req.valid("json");

  try {
    await authService.signin(phone);
    return c.json({ message: "OTP sent successfully" }, 200);
  } catch {
    return c.json({ error: "Failed to send OTP" }, 500);
  }
});

const verifySchema = z.object({
  phone: phoneSchema,
  code: z.string().length(6),
});

auth.post("/verify", zValidator("json", verifySchema), async (c) => {
  const { phone, code } = c.req.valid("json");

  const result = await authService.verify(phone, code);

  if (!result.ok) {
    if (result.cause === "invalid_otp") {
      return c.json({ error: "Invalid or expired code" }, 401);
    }
    return c.json({ error: "Could not resolve user" }, 500);
  }

  setCookie(c, "session_token", result.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: result.ttlSec,
    path: "/",
  });

  return c.json({ message: "Authorized", userId: result.userId }, 200);
});

auth.post("/logout", authMiddleware, async (c) => {
  const token = getCookie(c, "session_token");
  await authService.logout(token);

  deleteCookie(c, "session_token");

  return c.json({ message: "Logged out" }, 200);
});

export default auth;
