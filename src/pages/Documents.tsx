import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentsTable } from '@/components/documents/DocumentsTable';
import { DocumentFilters } from '@/components/documents/DocumentFilters';
import { documents, companies } from '@/data/mockData';

export default function Documents() {
  const { t } = useLanguage();
  const { user, isAccountant } = useAuth();
  
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // For accountant, only show documents from their assigned companies
  const assignedCompanyIds = isAccountant && user
    ? companies.filter(c => c.assignedAccountantId === user.id).map(c => c.id)
    : null;

  const baseDocs = assignedCompanyIds
    ? documents.filter(d => assignedCompanyIds.includes(d.companyId))
    : documents;

  const filteredDocs = useMemo(() => {
    let result = baseDocs;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(d =>
        d.fileName.toLowerCase().includes(searchLower) ||
        d.companyName.toLowerCase().includes(searchLower)
      );
    }

    // Company filter
    if (companyFilter !== 'all') {
      result = result.filter(d => d.companyId === companyFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(d => d.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(d => d.status === statusFilter);
    }

    // Sort by upload date (newest first)
    return result.sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
  }, [baseDocs, search, companyFilter, typeFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold">{t('documents')}</h1>
        <p className="text-muted-foreground mt-1">
          {filteredDocs.length} {t('documents').toLowerCase()}
        </p>
      </div>

      {/* Filters */}
      <DocumentFilters
        onSearchChange={setSearch}
        onCompanyChange={setCompanyFilter}
        onTypeChange={setTypeFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Documents Table */}
      {filteredDocs.length > 0 ? (
        <DocumentsTable documents={filteredDocs} />
      ) : (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          {t('noData')}
        </div>
      )}
    </div>
  );
}
