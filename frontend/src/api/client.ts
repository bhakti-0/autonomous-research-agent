const DEFAULT_BASE = "http://127.0.0.1:8000/api/v1";

export const API_BASE_URL: string = (
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) || DEFAULT_BASE
).replace(/\/+$/, "");

export class ApiError extends Error {
  status: number | null;
  constructor(message: string, status: number | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function friendlyMessage(status: number, detail?: string): string {
  if (status === 404) return "We couldn't find that research. It may have been removed.";
  if (status === 422) return detail || "The request was invalid. Please check your input.";
  if (status >= 500) return "The research server ran into a problem. Please try again shortly.";
  return detail || `The server responded with an unexpected error (${status}).`;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", Accept: "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError(
      "Can't reach the research server. Make sure the backend is running and reachable.",
      null,
    );
  }

  if (!res.ok) {
    let detail: string | undefined;
    try {
      const body = (await res.json()) as { detail?: unknown };
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
      /* ignore non-JSON body */
    }
    throw new ApiError(friendlyMessage(res.status, detail), res.status);
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError("The server returned a response we couldn't read.", res.status);
  }
}

export function toFriendlyMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  return "Something went wrong. Please try again.";
}
