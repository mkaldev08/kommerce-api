import { appendFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? error.message;
  }

  return String(error);
}

function resolveDatabasePathFromEnv(): string | null {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || !databaseUrl.startsWith("file:")) {
    return null;
  }

  let filePath = databaseUrl.slice("file:".length);

  if (/^\/\/[A-Za-z]:\//.test(filePath)) {
    filePath = filePath.slice(2);
  }

  if (/^\/\/[\/][A-Za-z]:\//.test(filePath)) {
    filePath = filePath.slice(3);
  }

  return decodeURIComponent(filePath);
}

function getRuntimeLogsDir(): string {
  const databasePath = resolveDatabasePathFromEnv();

  if (databasePath) {
    return join(dirname(databasePath), "logs");
  }

  return join(process.cwd(), "logs");
}

export function getRuntimeErrorLogPath(): string {
  return join(getRuntimeLogsDir(), "backend-errors.log");
}

export async function writeRuntimeErrorLog(
  source: string,
  error: unknown,
  context?: Record<string, unknown>,
): Promise<void> {
  try {
    const logPath = getRuntimeErrorLogPath();
    await mkdir(dirname(logPath), { recursive: true });

    const entry = {
      timestamp: new Date().toISOString(),
      source,
      message: getErrorMessage(error),
      context: context ?? null,
    };

    await appendFile(logPath, `${JSON.stringify(entry)}\n`, "utf8");
  } catch {
    // Avoid crashing the API process when logging fails.
  }
}
