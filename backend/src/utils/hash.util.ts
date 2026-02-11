import crypto from "crypto";

export const sha256Hex = (buffer: Buffer) =>
  crypto.createHash("sha256").update(buffer).digest("hex");
