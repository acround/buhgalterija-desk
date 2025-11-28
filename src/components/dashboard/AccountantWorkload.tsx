import { useLanguage } from '@/contexts/LanguageContext';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccountantWorkloadData {
  name: string;
  tasks: number;
  overdue: number;
}

interface AccountantWorkloadProps {
  data: AccountantWorkloadData[];
}

export function AccountantWorkload({ data }: AccountantWorkloadProps) {
  const { t } = useLanguage();

  const maxTasks = Math.max(...data.map(d => d.tasks), 1);

  return (
    <div className="bg-card rounded-xl border p-5">
      <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        {t('workloadDistribution')}
      </h3>
      <div className="space-y-4">
        {data.map((accountant) => (
          <div key={accountant.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium truncate pr-2">{accountant.name}</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm text-muted-foreground">{accountant.tasks}</span>
                {accountant.overdue > 0 && (
                  <span className="text-xs text-destructive font-medium">
                    ({accountant.overdue} !)
                  </span>
                )}
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  accountant.overdue > 0 ? 'bg-destructive' : 'bg-primary'
                )}
                style={{ width: `${(accountant.tasks / maxTasks) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
