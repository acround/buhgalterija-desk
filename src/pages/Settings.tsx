import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, Calendar, Clock, Bell, Shield } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Settings() {
  const { t } = useLanguage();
  const { isAdmin, isDirector } = useAuth();

  // Only administrators and directors can access this page
  if (!isAdmin && !isDirector) {
    return <Navigate to="/" replace />;
  }

  const settingsSections = [
    {
      icon: Calendar,
      title: t('taxPeriods'),
      description: 'Настройка налоговых периодов и сроков подачи',
    },
    {
      icon: Clock,
      title: t('defaultDeadlines'),
      description: 'Сроки по умолчанию для различных типов задач',
    },
    {
      icon: Bell,
      title: t('notificationTemplates'),
      description: 'Шаблоны уведомлений для email и SMS',
    },
    {
      icon: Shield,
      title: 'Безопасность',
      description: 'Настройки безопасности и доступа',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-primary" />
          {t('systemSettings')}
        </h1>
        <p className="text-muted-foreground mt-1">
          Управление настройками системы
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{section.description}</CardDescription>
                <Button variant="outline" size="sm" className="mt-4">
                  Настроить
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
