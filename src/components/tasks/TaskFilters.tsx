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
import { accountants, companies } from '@/data/mockData';

interface TaskFiltersProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onAccountantChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
}

export function TaskFilters({
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onAccountantChange,
  onCompanyChange,
}: TaskFiltersProps) {
  const { t } = useLanguage();
  const [showFilters, setShowFilters] = useState(true);

  const activeAccountants = accountants.filter(a => a.role === 'accountant' && a.status === 'active');

  return (
    <div className="space-y-4">
      {/* Top row: Search + Add button */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`${t('search')} ${t('tasks').toLowerCase()}...`}
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t('addTask')}
        </Button>
      </div>

      {/* Filter row */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-secondary/50 rounded-lg animate-fade-in">
          <Select onValueChange={onStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="new">{t('taskStatusNew')}</SelectItem>
              <SelectItem value="in_progress">{t('taskStatusInProgress')}</SelectItem>
              <SelectItem value="waiting">{t('taskStatusWaiting')}</SelectItem>
              <SelectItem value="done">{t('taskStatusDone')}</SelectItem>
              <SelectItem value="overdue">{t('taskStatusOverdue')}</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={onPriorityChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t('priority')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="high">{t('priorityHigh')}</SelectItem>
              <SelectItem value="normal">{t('priorityNormal')}</SelectItem>
              <SelectItem value="low">{t('priorityLow')}</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={onAccountantChange}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t('assignedTo')} />
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

          <Select onValueChange={onCompanyChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('companyName')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
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
        </div>
      )}
    </div>
  );
}
