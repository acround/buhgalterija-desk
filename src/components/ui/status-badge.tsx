import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

type TaskStatus = 'new' | 'in_progress' | 'waiting' | 'done' | 'overdue';
type CompanyStatus = 'active' | 'onboarding' | 'paused' | 'inactive';
type DocumentStatus = 'uploaded' | 'checked' | 'needs_revision';
type Priority = 'low' | 'normal' | 'high';

interface StatusBadgeProps {
  status: TaskStatus | CompanyStatus | DocumentStatus;
  type?: 'task' | 'company' | 'document';
  className?: string;
}

const taskStatusStyles: Record<TaskStatus, string> = {
  new: 'bg-info/10 text-info border-info/20',
  in_progress: 'bg-warning/10 text-warning border-warning/20',
  waiting: 'bg-purple-100 text-purple-700 border-purple-200',
  done: 'bg-success/10 text-success border-success/20',
  overdue: 'bg-destructive/10 text-destructive border-destructive/20',
};

const companyStatusStyles: Record<CompanyStatus, string> = {
  active: 'bg-success/10 text-success border-success/20',
  onboarding: 'bg-info/10 text-info border-info/20',
  paused: 'bg-warning/10 text-warning border-warning/20',
  inactive: 'bg-muted text-muted-foreground border-border',
};

const documentStatusStyles: Record<DocumentStatus, string> = {
  uploaded: 'bg-info/10 text-info border-info/20',
  checked: 'bg-success/10 text-success border-success/20',
  needs_revision: 'bg-warning/10 text-warning border-warning/20',
};

export function StatusBadge({ status, type = 'task', className }: StatusBadgeProps) {
  const { t } = useLanguage();

  const getStatusStyle = () => {
    if (type === 'company') return companyStatusStyles[status as CompanyStatus];
    if (type === 'document') return documentStatusStyles[status as DocumentStatus];
    return taskStatusStyles[status as TaskStatus];
  };

  const getStatusLabel = () => {
    if (type === 'company') {
      const labels: Record<CompanyStatus, string> = {
        active: t('statusActive'),
        onboarding: t('statusOnboarding'),
        paused: t('statusPaused'),
        inactive: t('statusInactive'),
      };
      return labels[status as CompanyStatus];
    }
    if (type === 'document') {
      const labels: Record<DocumentStatus, string> = {
        uploaded: t('docStatusUploaded'),
        checked: t('docStatusChecked'),
        needs_revision: t('docStatusNeedsRevision'),
      };
      return labels[status as DocumentStatus];
    }
    const labels: Record<TaskStatus, string> = {
      new: t('taskStatusNew'),
      in_progress: t('taskStatusInProgress'),
      waiting: t('taskStatusWaiting'),
      done: t('taskStatusDone'),
      overdue: t('taskStatusOverdue'),
    };
    return labels[status as TaskStatus];
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border',
        getStatusStyle(),
        className
      )}
    >
      {getStatusLabel()}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const priorityStyles: Record<Priority, string> = {
  low: 'text-muted-foreground',
  normal: 'text-info',
  high: 'text-destructive',
};

const priorityIcons: Record<Priority, string> = {
  low: '↓',
  normal: '●',
  high: '↑',
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const { t } = useLanguage();

  const labels: Record<Priority, string> = {
    low: t('priorityLow'),
    normal: t('priorityNormal'),
    high: t('priorityHigh'),
  };

  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium', priorityStyles[priority], className)}>
      <span>{priorityIcons[priority]}</span>
      {labels[priority]}
    </span>
  );
}
