import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { CompanyCard } from '@/components/companies/CompanyCard';
import { CompanyFilters } from '@/components/companies/CompanyFilters';
import { companies as mockCompanies, type Company } from '@/data/mockData';
import { useCompanies } from '@/hooks/useCompanies';
import type { CompanyRequestPayload } from '@/api/companies';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function Companies() {
  const { t } = useLanguage();
  const { user, isAccountant } = useAuth();

  const [remoteCompanies, setRemoteCompanies] = useState<Company[] | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [accountantFilter, setAccountantFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const { mutate: requestCompanies, isPending, error } = useCompanies();

  const baseCompanies = (remoteCompanies ?? mockCompanies).filter((company) => {
    if (isAccountant && user) {
      return company.assignedAccountantId === user.id;
    }
    return true;
  });

  const onSendRequest = () => {
    const payload: CompanyRequestPayload = {
      status: statusFilter !== 'all' ? statusFilter : undefined,
      responsibleId: accountantFilter !== 'all' ? accountantFilter : undefined,
      sort: sortBy as CompanyRequestPayload['sort'],
    };

    requestCompanies(payload, {
      onSuccess: setRemoteCompanies,
    });
  };

  useEffect(() => {
    // initial fetch to hydrate with backend data
    onSendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCompanies = useMemo(() => {
    let result = baseCompanies;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        c.pib.includes(search) ||
        c.city.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }

    // Accountant filter (for director/admin)
    if (accountantFilter !== 'all') {
      result = result.filter(c => c.assignedAccountantId === accountantFilter);
    }

    if (!remoteCompanies) {
      // Only sort locally while working with моковыми данными
      result = [...result].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'tasks') return b.openTasks - a.openTasks;
        if (sortBy === 'overdue') return b.overdueTasks - a.overdueTasks;
        return 0;
      });
    }

    return result;
  }, [baseCompanies, search, statusFilter, accountantFilter, sortBy, remoteCompanies]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold">{t('companies')}</h1>
        <p className="text-muted-foreground mt-1">
          {filteredCompanies.length} {t('companies').toLowerCase()}
        </p>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Не удалось загрузить компании</AlertTitle>
          <AlertDescription>
            {error.message || 'Проверьте, доступен ли бэкэнд и корректен ли путь /companies/list.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <CompanyFilters
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onAccountantChange={setAccountantFilter}
        onSortChange={setSortBy}
        onSendRequest={onSendRequest}
        isRequesting={isPending}
      />


      <div className="flex justify-end">
        <Button
          variant="secondary"
          onClick={onSendRequest}
          disabled={isPending}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {isPending ? t('loading') : t('refresh')}
        </Button>
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          {t('noData')}
        </div>
      )}
    </div>
  );
}
