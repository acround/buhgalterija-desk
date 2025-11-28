import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { TasksTable } from '@/components/tasks/TasksTable';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { tasks } from '@/data/mockData';

export default function Tasks() {
  const { t } = useLanguage();
  const { user, isAccountant } = useAuth();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [accountantFilter, setAccountantFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');

  // For accountant, only show their assigned tasks
  const baseTasks = isAccountant && user
    ? tasks.filter(t => t.assignedAccountantId === user.id)
    : tasks;

  const filteredTasks = useMemo(() => {
    let result = baseTasks;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(t =>
        t.id.toLowerCase().includes(searchLower) ||
        t.companyName.toLowerCase().includes(searchLower) ||
        t.companyPib.includes(search) ||
        t.description?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(t => t.priority === priorityFilter);
    }

    // Accountant filter (for director/admin)
    if (accountantFilter !== 'all') {
      result = result.filter(t => t.assignedAccountantId === accountantFilter);
    }

    // Company filter
    if (companyFilter !== 'all') {
      result = result.filter(t => t.companyId === companyFilter);
    }

    // Sort by due date, overdue first
    return result.sort((a, b) => {
      // Overdue first
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      if (a.status !== 'overdue' && b.status === 'overdue') return 1;
      // Then by due date
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [baseTasks, search, statusFilter, priorityFilter, accountantFilter, companyFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold">{t('tasks')}</h1>
        <p className="text-muted-foreground mt-1">
          {filteredTasks.length} {t('tasks').toLowerCase()}
        </p>
      </div>

      {/* Filters */}
      <TaskFilters
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onAccountantChange={setAccountantFilter}
        onCompanyChange={setCompanyFilter}
      />

      {/* Tasks Table */}
      {filteredTasks.length > 0 ? (
        <TasksTable tasks={filteredTasks} />
      ) : (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          {t('noData')}
        </div>
      )}
    </div>
  );
}
