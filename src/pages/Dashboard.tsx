import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { DeadlinesList } from '@/components/dashboard/DeadlinesList';
import { AccountantWorkload } from '@/components/dashboard/AccountantWorkload';
import { dashboardStats, tasksByAccountant, upcomingDeadlines, tasks } from '@/data/mockData';
import { Building2, ListTodo, AlertCircle, FileText, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  const { user, isDirector, isAccountant } = useAuth();

  // For accountant, filter to only their tasks
  const relevantTasks = isAccountant && user
    ? tasks.filter(task => task.assignedAccountantId === user.id)
    : tasks;

  const accountantStats = isAccountant ? {
    totalClients: 8, // Mock for accountant view
    activeTasks: relevantTasks.filter(t => t.status !== 'done').length,
    overdueTasks: relevantTasks.filter(t => t.status === 'overdue').length,
    pendingDocuments: 3, // Mock
  } : dashboardStats;

  const accountantDeadlines = isAccountant
    ? relevantTasks.filter(t => t.status !== 'done').sort((a, b) => 
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      ).slice(0, 5)
    : upcomingDeadlines;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold">
          {t('welcomeBack')}, {user?.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">{t('overview')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('totalClients')}
          value={accountantStats.totalClients}
          icon={Building2}
          variant="default"
        />
        <StatCard
          title={t('activeTasks')}
          value={accountantStats.activeTasks}
          icon={ListTodo}
          variant="default"
        />
        <StatCard
          title={t('overdueTasks')}
          value={accountantStats.overdueTasks}
          icon={AlertCircle}
          variant={accountantStats.overdueTasks > 0 ? 'danger' : 'default'}
        />
        <StatCard
          title={t('pendingDocuments')}
          value={accountantStats.pendingDocuments}
          icon={FileText}
          variant={accountantStats.pendingDocuments > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <DeadlinesList tasks={accountantDeadlines} />

        {/* Workload Distribution - Director only */}
        {isDirector ? (
          <AccountantWorkload data={tasksByAccountant} />
        ) : (
          <div className="bg-card rounded-xl border p-5">
            <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t('recentActivity')}
            </h3>
            <div className="space-y-3">
              {[
                { action: 'Задача выполнена', target: 'НДС декларация - Global Trade SRB', time: '2ч назад' },
                { action: 'Документ загружен', target: 'Банковская выписка - TechStart DOO', time: '4ч назад' },
                { action: 'Комментарий добавлен', target: 'T-003 - Restoran Balkan', time: '5ч назад' },
                { action: 'Статус изменён', target: 'T-005 - BuildPro', time: 'Вчера' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.target}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
