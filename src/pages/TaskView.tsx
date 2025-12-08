import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { tasks, companies, documents } from '@/data/mockData';
import { StatusBadge, PriorityBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Building2,
  Calendar,
  User,
  Clock,
  MessageSquare,
  FileText,
  Edit,
  CheckCircle,
  AlertCircle,
  Send,
} from 'lucide-react';

export default function TaskView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const task = tasks.find((t) => t.id === id);
  const company = task ? companies.find((c) => c.id === task.companyId) : null;
  const relatedDocs = task
    ? documents.filter((d) => d.companyId === task.companyId && d.period === task.period)
    : [];

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t('taskNotFound')}</h2>
        <Button variant="outline" onClick={() => navigate('/tasks')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('backToTasks')}
        </Button>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTaskTypeLabel = (type: typeof task.type) => {
    const labels: Record<typeof task.type, string> = {
      vat: t('taskTypeVat'),
      payroll: t('taskTypePayroll'),
      annual_report: t('taskTypeAnnualReport'),
      reconciliation: t('taskTypeReconciliation'),
      other: t('taskTypeOther'),
    };
    return labels[type];
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/tasks')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{task.id}</h1>
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
            <p className="text-muted-foreground">{getTaskTypeLabel(task.type)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            {t('edit')}
          </Button>
          {task.status !== 'done' && (
            <Button>
              <CheckCircle className="h-4 w-4 mr-2" />
              {t('markComplete')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Task Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('taskDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{t('description')}</h4>
                <p className="text-sm">{task.description || t('noDescription')}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary rounded-lg">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('period')}</p>
                    <p className="text-sm font-medium">{task.period}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isOverdue ? 'bg-destructive/10' : 'bg-secondary'}`}>
                    <Clock className={`h-4 w-4 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('dueDate')}</p>
                    <p className={`text-sm font-medium ${isOverdue ? 'text-destructive' : ''}`}>
                      {formatDate(task.dueDate)}
                      {isOverdue && <span className="ml-2 text-xs">({t('overdue')})</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary rounded-lg">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('assignedTo')}</p>
                    <p className="text-sm font-medium">{task.assignedAccountantName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary rounded-lg">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('lastUpdate')}</p>
                    <p className="text-sm font-medium">{formatDateTime(task.lastUpdate)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t('linkedDocuments')}</CardTitle>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                {t('addDocument')}
              </Button>
            </CardHeader>
            <CardContent>
              {relatedDocs.length > 0 ? (
                <div className="space-y-2">
                  {relatedDocs.map((doc) => (
                    <Link
                      key={doc.id}
                      to={`/documents/${doc.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.fileName}</p>
                          <p className="text-xs text-muted-foreground">{doc.size}</p>
                        </div>
                      </div>
                      <StatusBadge status={doc.status} />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {t('noLinkedDocuments')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {t('comments')} ({task.commentsCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {task.commentsCount > 0 ? (
                <div className="space-y-4">
                  {/* Mock comments */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      МИ
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{task.assignedAccountantName}</span>
                        <span className="text-xs text-muted-foreground">2 дня назад</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ожидаю документы от клиента для завершения задачи.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('noComments')}
                </p>
              )}

              <Separator className="my-4" />

              {/* Add comment */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('addComment')}
                  className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          {company && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {t('companyInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  to={`/companies/${company.id}`}
                  className="text-lg font-semibold text-primary hover:underline"
                >
                  {company.name}
                </Link>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('pib')}:</span>
                    <span className="font-mono">{company.pib}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('city')}:</span>
                    <span>{company.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('sector')}:</span>
                    <span>{company.sector}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1">
                  <p className="text-sm font-medium">{company.contactPerson}</p>
                  <p className="text-xs text-muted-foreground">{company.email}</p>
                  <p className="text-xs text-muted-foreground">{company.phone}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('activity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="text-sm">{t('taskCreated')}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(task.lastUpdate)}
                    </p>
                  </div>
                </div>
                {task.status === 'in_progress' && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <div>
                      <p className="text-sm">{t('statusChangedToInProgress')}</p>
                      <p className="text-xs text-muted-foreground">1 день назад</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
