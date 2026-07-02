import { auth } from "./firebase";

export async function apiFetch(url: string, options: RequestInit = {}) {
  const headers = (options.headers || {}) as Record<string, string>;
  const user = auth.currentUser;
  
  if (user) {
    const token = await user.getIdToken();
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return fetch(url, {
    ...options,
    headers
  });
}
