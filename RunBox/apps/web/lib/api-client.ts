const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
const API_ROOT = base ? `${base}/api` : "/api";

async function handleResponse(response: Response) {
  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = text;
  }

  if (!response.ok) {
    const message = typeof data === "string" && data ? data : response.statusText;
    throw new Error(message || "Request failed");
  }

  return data;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_ROOT}${path}`, {
    cache: "no-store"
  });
  return handleResponse(response) as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_ROOT}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return handleResponse(response) as Promise<T>;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_ROOT}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return handleResponse(response) as Promise<T>;
}

export async function apiDelete(path: string): Promise<void> {
  const response = await fetch(`${API_ROOT}${path}`, {
    method: "DELETE"
  });
  await handleResponse(response);
}
