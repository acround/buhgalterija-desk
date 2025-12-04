import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { login, LoginRequest, LoginResponse } from '@/api/auth';
import { setAccessToken } from '@/api/client';

export function useLogin(options?: UseMutationOptions<LoginResponse, Error, LoginRequest>) {
    const userOnSuccess = options?.onSuccess;

    return useMutation<LoginResponse, Error, LoginRequest>({
        ...options,
        mutationFn: login,
        onSuccess: (data, variables, context) => {
            setAccessToken(data.token);
            userOnSuccess?.(data, variables, context);
        },
    });
}