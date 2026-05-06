import { randomBytes } from "node:crypto";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import z from "zod";

import { OtpService } from "~/services/otp.service";
import { fromDuration } from "~/utils/duration";
import { valkey } from "~/valkey";
import { authMiddleware } from "~/middlewares/auth.middleware";

const otpService = new OtpService();
const auth = new Hono();

const signinSchema = z.object({
  phone: z.string().min(10).max(15),
});

auth.post("/signin", zValidator("json", signinSchema), async (c) => {
  const { phone } = c.req.valid("json");

  try {
    await otpService.requestOtp(phone);
    return c.json({ message: "OTP sent successfully" }, 200);
  } catch (e) {
    return c.json({ error: "Failed to send OTP" }, 500);
  }
});

const verifySchema = z.object({
  phone: z.string(),
  code: z.string().length(6),
});

auth.post("/verify", zValidator("json", verifySchema), async (c) => {
  const { phone, code } = c.req.valid("json");

  const isValid = await otpService.verifyOtp(phone, code);

  if (!isValid) {
    return c.json({ error: "Invalid or expired code" }, 401);
  }

  //
  //  let user = await db.query.users.findFirst({ where: eq(users.phone, phone) });
  //  if (!user) {
  //    [user] = await db.insert(users).values({ phone }).returning();
  //  }

  const sessionToken = randomBytes(24).toString("base64url");
  const ttlSec = fromDuration("30d");

  await valkey.set(
    `session:${sessionToken}`,
    JSON.stringify({ userId: "user.id", phone }),
    "EX",
    ttlSec,
  );

  setCookie(c, "session_token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: ttlSec,
    path: "/",
  });

  return c.json({ message: "Authorized", userId: "user.id" }, 200);
});

auth.post("/logout", authMiddleware, async (c) => {
  const token = getCookie(c, "session_token");
  // if (token) await redis.del(`session:${token}`);

  deleteCookie(c, "session_token");

  return c.json({ message: "Logged out" }, 200);
});

export default auth;
