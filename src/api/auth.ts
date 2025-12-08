import { apiFetch } from './client';

export type LoginRequest = { username: string; password: string };
export type AuthUser = {
    id: number | string;
    username?: string;
    email?: string;
    role?: string;
    avatar?: string;
};
export type LoginResponse = { token: string; user: AuthUser };

export function login(payload: LoginRequest) {
    return apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export type RegisterRequest = { username: string; password: string; email?: string; name?: string };
export type RegisterResponse = LoginResponse;

export function register(payload: RegisterRequest) {
    return apiFetch<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}
