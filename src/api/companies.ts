import { apiFetch } from './client';
import type { Company } from '@/data/mockData';

export type CompanySort = 'name' | 'tasks' | 'overdue';

export interface CompanyRequestPayload {
    status?: string;
    responsibleId?: string;
    sort?: CompanySort;
}

export async function fetchCompanies(payload: CompanyRequestPayload) {
    return apiFetch<Company[]>('/companies/list', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}