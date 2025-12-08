import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Eye, FileText, FileSpreadsheet, File, Calendar, Building2, User, Clock, MessageSquare, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { documents, companies } from '@/data/mockData';
import { Separator } from '@/components/ui/separator';

export default function DocumentView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const document = documents.find(d => d.id === id);
  const company = document ? companies.find(c => c.id === document.companyId) : null;

  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Документ не найден</h2>
        <Button variant="outline" onClick={() => navigate('/documents')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Вернуться к документам
        </Button>
      </div>
    );
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FileText className="h-12 w-12 text-destructive" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-12 w-12 text-green-600" />;
      default:
        return <File className="h-12 w-12 text-muted-foreground" />;
    }
  };

  const getDocTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      invoice: 'Счёт-фактура',
      bank_statement: 'Банковская выписка',
      payroll: 'Расчётная ведомость',
      contract: 'Договор',
      tax_return: 'Налоговая декларация',
      other: 'Другое',
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/documents')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-heading font-semibold text-foreground">
            Просмотр документа
          </h1>
          <p className="text-sm text-muted-foreground">{document.fileName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Скачать
          </Button>
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Открыть
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Информация о документе</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Preview Area */}
            <div className="flex items-center justify-center h-64 bg-muted rounded-lg border border-dashed border-border">
              <div className="text-center space-y-2">
                {getFileIcon(document.fileName)}
                <p className="text-sm font-medium">{document.fileName}</p>
                <p className="text-xs text-muted-foreground">{document.size}</p>
              </div>
            </div>

            <Separator />

            {/* Document Details */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Тип документа</p>
                <Badge variant="secondary">{getDocTypeLabel(document.type)}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Статус</p>
                <StatusBadge status={document.status} type="document" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Период</p>
                <p className="text-sm font-medium">{document.period}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Размер файла</p>
                <p className="text-sm font-medium">{document.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Company Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Компания
              </CardTitle>
            </CardHeader>
            <CardContent>
              <button
                onClick={() => navigate(`/companies/${document.companyId}`)}
                className="text-left hover:underline"
              >
                <p className="font-medium text-primary">{document.companyName}</p>
              </button>
              {company && (
                <p className="text-sm text-muted-foreground mt-1">ПИБ: {company.pib}</p>
              )}
            </CardContent>
          </Card>

          {/* Upload Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Загрузка
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{document.uploadedByName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date(document.uploadDate).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Edit className="mr-2 h-4 w-4" />
                Изменить статус
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Добавить комментарий
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
