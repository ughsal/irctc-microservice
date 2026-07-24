import type { Request } from "express";

export function getDeviceFingerprint(req: Request): string {
  const userAgent = req.get("user-agent") ?? "unknown";
  const acceptLanguage = req.get("accept-language") ?? "unknown";
  const ipAddress = req.ip ?? req.socket.remoteAddress ?? "unknown";

  return `${userAgent}:${acceptLanguage}:${ipAddress}`;
}
