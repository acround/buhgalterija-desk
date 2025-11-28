import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { companies, tasks, documents } from '@/data/mockData';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TasksTable } from '@/components/tasks/TasksTable';
import { DocumentsTable } from '@/components/documents/DocumentsTable';
import {
  ArrowLeft,
  Building2,
  MapPin,
  User,
  Mail,
  Phone,
  Edit,
  ListTodo,
  FileText,
  MessageSquare,
  Users,
} from 'lucide-react';

export default function CompanyProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const company = companies.find(c => c.id === id);
  
  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('noData')}</p>
        <Button variant="link" onClick={() => navigate('/companies')}>
          {t('companies')}
        </Button>
      </div>
    );
  }

  const companyTasks = tasks.filter(t => t.companyId === id);
  const companyDocs = documents.filter(d => d.companyId === id);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate('/companies')} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        {t('companies')}
      </Button>

      {/* Header */}
      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-heading font-bold">{company.name}</h1>
                <StatusBadge status={company.status} type="company" />
              </div>
              <p className="text-muted-foreground mt-1">{t('pib')}: {company.pib}</p>
            </div>
          </div>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            {t('edit')}
          </Button>
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{company.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{company.contactPerson}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{company.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{company.phone}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <Building2 className="h-4 w-4" />
            {t('overview')}
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <ListTodo className="h-4 w-4" />
            {t('tasks')} ({companyTasks.length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            {t('documents')} ({companyDocs.length})
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            {t('notes')}
          </TabsTrigger>
          <TabsTrigger value="contacts" className="gap-2">
            <Users className="h-4 w-4" />
            {t('contacts')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-medium text-muted-foreground text-sm">{t('sector')}</h3>
              <p className="mt-1 font-semibold">{company.sector}</p>
            </div>
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-medium text-muted-foreground text-sm">{t('assignedAccountant')}</h3>
              <p className="mt-1 font-semibold">{company.assignedAccountantName}</p>
            </div>
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-medium text-muted-foreground text-sm">{t('openTasks')}</h3>
              <p className="mt-1 font-semibold">
                {company.openTasks}
                {company.overdueTasks > 0 && (
                  <span className="text-destructive ml-2">({company.overdueTasks} {t('overdue').toLowerCase()})</span>
                )}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <TasksTable tasks={companyTasks} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsTable documents={companyDocs} />
        </TabsContent>

        <TabsContent value="notes">
          <div className="bg-card rounded-xl border p-6 text-center text-muted-foreground">
            Внутренние заметки по компании
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <div className="bg-card rounded-xl border p-6">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{company.contactPerson}</p>
                <p className="text-sm text-muted-foreground">Основной контакт</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm">{company.email}</p>
                <p className="text-sm text-muted-foreground">{company.phone}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
