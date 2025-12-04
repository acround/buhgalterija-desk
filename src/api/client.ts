const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const ACCESS_TOKEN_KEY = 'accessToken';

export function getAccessToken(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
}

export function setAccessToken(token: string) {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
}

export function clearAccessToken() {
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getAccessToken();
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${API_BASE_URL}${path}`, {
        credentials: 'include',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...authHeader,
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export { API_BASE_URL };