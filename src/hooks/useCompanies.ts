import { useMutation } from '@tanstack/react-query';
import { fetchCompanies } from '@/api/companies';

export function useCompanies() {
    return useMutation({
        mutationKey: ['companies:fetch'],
        mutationFn: fetchCompanies,
    });
}