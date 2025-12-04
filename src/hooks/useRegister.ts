import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { register, RegisterRequest, RegisterResponse } from '@/api/auth';
import { setAccessToken } from '@/api/client';

export function useRegister(options?: UseMutationOptions<RegisterResponse, Error, RegisterRequest>) {
    const userOnSuccess = options?.onSuccess;

    return useMutation<RegisterResponse, Error, RegisterRequest>({
        ...options,
        mutationFn: register,
        onSuccess: (data, variables, context) => {
            if (data.token) {
                setAccessToken(data.token);
            }
            userOnSuccess?.(data, variables, context);
        },
    });
}