export type FetchJsonSuccess<T> = {
  ok: true;
  data: T;
};

export type FetchJsonError = {
  ok: false;
  status: number;
  message: string;
};

export type FetchJsonResult<T> = FetchJsonSuccess<T> | FetchJsonError;

export async function fetchJSON<T>(url: string, options?: RequestInit): Promise<FetchJsonResult<T>> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      ...options,
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        (body && typeof body === "object" && "error" in body && typeof body.error === "string" && body.error) ||
        (body && typeof body === "object" && "message" in body && typeof body.message === "string" && body.message) ||
        response.statusText ||
        "Request failed";

      return {
        ok: false,
        status: response.status,
        message,
      };
    }

    return {
      ok: true,
      data: body as T,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Network error",
    };
  }
}
