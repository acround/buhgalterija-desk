import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { CompanyCard } from '@/components/companies/CompanyCard';
import { CompanyFilters } from '@/components/companies/CompanyFilters';
import { companies } from '@/data/mockData';

export default function Companies() {
  const { t } = useLanguage();
  const { user, isAccountant } = useAuth();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [accountantFilter, setAccountantFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // For accountant, only show their assigned companies
  const baseCompanies = isAccountant && user
    ? companies.filter(c => c.assignedAccountantId === user.id)
    : companies;

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

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'tasks') return b.openTasks - a.openTasks;
      if (sortBy === 'overdue') return b.overdueTasks - a.overdueTasks;
      return 0;
    });

    return result;
  }, [baseCompanies, search, statusFilter, accountantFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold">{t('companies')}</h1>
        <p className="text-muted-foreground mt-1">
          {filteredCompanies.length} {t('companies').toLowerCase()}
        </p>
      </div>

      {/* Filters */}
      <CompanyFilters
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onAccountantChange={setAccountantFilter}
        onSortChange={setSortBy}
      />

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
