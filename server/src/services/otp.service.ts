import { generateCode } from "~/utils/code";
import { fromDuration } from "~/utils/duration";
import { valkey } from "~/valkey";

export class OtpService {
  async requestOtp(phone: string): Promise<void> {
    const code = generateCode();
    const expires = fromDuration("5m");

    await valkey.set(phone, code, "EX", expires);

    // SEND SOMEWHERE THAT CODE
    console.log(`${phone}:`, code);
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const saved = await valkey.get(phone);
    if (!saved || saved !== code) return false;

    await valkey.del(phone);
    return true;
  }
}
