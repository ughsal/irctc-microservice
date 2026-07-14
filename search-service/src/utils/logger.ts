type LogLevel = "info" | "error" | "warn";

function write(level: LogLevel, message: string, error?: unknown): void {
  const prefix = `[${level.toUpperCase()}]`;

  if (error instanceof Error) {
    console[level](prefix, message, error.message);
    return;
  }

  console[level](prefix, message, error ?? "");
}

export const logger = {
  info: (message: string, error?: unknown) => write("info", message, error),
  warn: (message: string, error?: unknown) => write("warn", message, error),
  error: (message: string, error?: unknown) => write("error", message, error),
};

