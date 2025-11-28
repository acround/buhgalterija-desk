import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, FileText, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Reports() {
  const { t } = useLanguage();

  const reportTypes = [
    {
      icon: BarChart3,
      title: 'Отчёт по задачам',
      description: 'Статистика выполнения задач по периодам и бухгалтерам',
    },
    {
      icon: FileText,
      title: 'Отчёт по документам',
      description: 'Загруженные документы по компаниям и периодам',
    },
    {
      icon: TrendingUp,
      title: 'Отчёт по эффективности',
      description: 'Анализ производительности команды',
    },
    {
      icon: Calendar,
      title: 'Отчёт по срокам',
      description: 'Анализ соблюдения сроков и просрочек',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          {t('reports')}
        </h1>
        <p className="text-muted-foreground mt-1">
          Аналитика и отчёты
        </p>
      </div>

      {/* Coming soon notice */}
      <div className="bg-info/10 border border-info/20 rounded-lg p-4 text-center">
        <p className="text-info font-medium">
          Раздел отчётов находится в разработке
        </p>
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.title} className="opacity-60">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{report.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{report.description}</CardDescription>
                <Button variant="outline" size="sm" className="mt-4" disabled>
                  Скоро
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
