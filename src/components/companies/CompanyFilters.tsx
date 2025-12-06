import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { accountants } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

interface CompanyFiltersProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAccountantChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSendRequest: () => void;
  isRequesting?: boolean;
}

export function CompanyFilters({
  onSearchChange,
  onStatusChange,
  onAccountantChange,
  onSortChange,
  onSendRequest,
  isRequesting,
}: CompanyFiltersProps) {
  const { t } = useLanguage();
  const { canManageCompanies } = useAuth();
  const [showFilters, setShowFilters] = useState(false);

  const activeAccountants = accountants.filter(a => a.role === 'accountant' && a.status === 'active');

  return (
    <div className="space-y-4">
      {/* Top row: Search + Add button */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`${t('search')} ${t('companies').toLowerCase()}...`}
            className="pl-10"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'bg-secondary' : ''}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          {t('filters')}
        </Button>
        {canManageCompanies && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t('addCompany')}
          </Button>
        )}
      </div>

      {/* Filter row */}
      {showFilters && (
        <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg animate-fade-in">
          <Select onValueChange={onStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="active">{t('statusActive')}</SelectItem>
              <SelectItem value="onboarding">{t('statusOnboarding')}</SelectItem>
              <SelectItem value="paused">{t('statusPaused')}</SelectItem>
              <SelectItem value="inactive">{t('statusInactive')}</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={onAccountantChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('assignedAccountant')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              {activeAccountants.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={onSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">По названию</SelectItem>
              <SelectItem value="tasks">По количеству задач</SelectItem>
              <SelectItem value="overdue">По просрочке</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(false)}
            className="ml-auto"
          >
            <X className="h-4 w-4 mr-1" />
            {t('clearFilters')}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onSendRequest}
            disabled={isRequesting}
          >
            {isRequesting ? t('loading') : 'Отправить в бэк'}
          </Button>
        </div>
      )}
    </div>
  );
}
