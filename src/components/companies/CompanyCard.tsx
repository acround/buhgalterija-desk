import { useLanguage } from '@/contexts/LanguageContext';
import { Company } from '@/data/mockData';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, User, ListTodo, FileText, AlertCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-xl border hover:shadow-lg transition-all duration-200 overflow-hidden group">
      {/* Header */}
      <div className="p-4 border-b bg-secondary/30">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-base truncate group-hover:text-primary transition-colors">
              {company.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('pib')}: {company.pib}
            </p>
          </div>
          <StatusBadge status={company.status} type="company" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Info rows */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{company.city}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{company.sector}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{company.assignedAccountantName}</span>
          </div>
        </div>

        {/* Tasks indicators */}
        <div className="flex items-center gap-4 pt-2 border-t">
          <div className="flex items-center gap-1.5">
            <ListTodo className="h-4 w-4 text-info" />
            <span className="text-sm font-medium">{company.openTasks}</span>
            <span className="text-xs text-muted-foreground">{t('openTasks')}</span>
          </div>
          {company.overdueTasks > 0 && (
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">{company.overdueTasks}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={() => navigate(`/companies/${company.id}`)}
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
          {t('openProfile')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/tasks?company=${company.id}`)}
        >
          <ListTodo className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/documents?company=${company.id}`)}
        >
          <FileText className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
