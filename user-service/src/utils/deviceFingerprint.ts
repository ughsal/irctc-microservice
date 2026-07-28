import type { Request } from "express";
import crypto from "crypto";
export function getDeviceFingerprint(req: Request): string {
  const userAgent = req.get("user-agent") ?? "";
  const accept = req.get("accept") ?? "";
  const ipAddress = req.ip ?? req.socket.remoteAddress ?? "";

  const raw = `${userAgent}:${accept}:${ipAddress}`;
  return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 16); // short device id
}
