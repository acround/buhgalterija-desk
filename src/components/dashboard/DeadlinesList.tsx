import { useLanguage } from '@/contexts/LanguageContext';
import { Task } from '@/data/mockData';
import { StatusBadge, PriorityBadge } from '@/components/ui/status-badge';
import { Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeadlinesListProps {
  tasks: Task[];
}

export function DeadlinesList({ tasks }: DeadlinesListProps) {
  const { t } = useLanguage();

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDueDate = (dateStr: string) => {
    const days = getDaysUntil(dateStr);
    if (days < 0) return { text: `${Math.abs(days)} ${t('daysOverdue')}`, isOverdue: true };
    if (days === 0) return { text: t('today'), isOverdue: false };
    if (days === 1) return { text: 'Завтра', isOverdue: false };
    return { text: `${days} ${t('daysLeft')}`, isOverdue: false };
  };

  return (
    <div className="bg-card rounded-xl border p-5">
      <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        {t('upcomingDeadlines')}
      </h3>
      <div className="space-y-3">
        {tasks.map((task) => {
          const dueInfo = formatDueDate(task.dueDate);
          return (
            <div
              key={task.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-secondary/50 cursor-pointer',
                dueInfo.isOverdue && 'border-destructive/30 bg-destructive/5'
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{task.id}</span>
                  <PriorityBadge priority={task.priority} />
                </div>
                <p className="font-medium text-sm mt-1 truncate">{task.companyName}</p>
                <p className="text-xs text-muted-foreground truncate">{task.description}</p>
              </div>
              <div className="text-right ml-3 flex-shrink-0">
                <p className={cn(
                  'text-sm font-medium flex items-center gap-1 justify-end',
                  dueInfo.isOverdue ? 'text-destructive' : 'text-foreground'
                )}>
                  {dueInfo.isOverdue && <AlertCircle className="h-3.5 w-3.5" />}
                  {dueInfo.text}
                </p>
                <StatusBadge status={task.status} className="mt-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
