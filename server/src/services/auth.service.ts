import { randomBytes } from "node:crypto";

import { db, schema } from "~/db";
import { OtpService } from "~/services/otp.service";
import { fromDuration } from "~/utils/duration";
import { valkey } from "~/valkey";

export type VerifySessionResult =
  | { ok: false; cause: "invalid_otp" }
  | { ok: false; cause: "user_not_created" }
  | {
      ok: true;
      userId: number;
      sessionToken: string;
      ttlSec: number;
    };

export class AuthService {
  private readonly otpService = new OtpService();

  async signin(phone: string): Promise<void> {
    await this.otpService.requestOtp(phone);
  }

  async verify(phone: string, code: string): Promise<VerifySessionResult> {
    const isValid = await this.otpService.verifyOtp(phone, code);
    if (!isValid) {
      return { ok: false, cause: "invalid_otp" };
    }

    const [user] = await db
      .insert(schema.users)
      .values({ phone })
      .onConflictDoUpdate({
        target: schema.users.phone,
        set: { phone },
      })
      .returning();

    if (!user) {
      return { ok: false, cause: "user_not_created" };
    }

    const sessionToken = randomBytes(24).toString("base64url");
    const ttlSec = fromDuration("30d");

    await valkey.set(
      `session:${sessionToken}`,
      JSON.stringify({ userId: user.id, phone }),
      "EX",
      ttlSec,
    );

    return {
      ok: true,
      userId: user.id,
      sessionToken,
      ttlSec,
    };
  }

  async logout(sessionToken: string | undefined): Promise<void> {
    if (sessionToken) {
      await valkey.del(`session:${sessionToken}`);
    }
  }
}
