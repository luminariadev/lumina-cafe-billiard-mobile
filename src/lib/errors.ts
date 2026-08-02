export class ApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

/** Normalize any thrown value into a user-friendly message. */
export function friendlyError(err: unknown, fallback = "Terjadi kesalahan"): string {
  if (err instanceof ApiError) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message || fallback;
  }
  if (typeof err === "string") {
    return err;
  }
  return fallback;
}