import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Document } from '@/data/mockData';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Download, Eye, FileText, FileSpreadsheet, File } from 'lucide-react';

interface DocumentsTableProps {
  documents: Document[];
}

export function DocumentsTable({ documents }: DocumentsTableProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const getDocTypeLabel = (type: Document['type']) => {
    const labels: Record<Document['type'], string> = {
      invoice: t('docTypeInvoice'),
      bank_statement: t('docTypeBankStatement'),
      payroll: t('docTypePayroll'),
      contract: t('docTypeContract'),
      tax_return: t('docTypeTaxReturn'),
      other: t('docTypeOther'),
    };
    return labels[type];
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return <FileText className="h-4 w-4 text-destructive" />;
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))
      return <FileSpreadsheet className="h-4 w-4 text-success" />;
    return <File className="h-4 w-4 text-muted-foreground" />;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/50">
          <TableRow>
            <TableHead>{t('fileName')}</TableHead>
            <TableHead>{t('companyName')}</TableHead>
            <TableHead>{t('documentType')}</TableHead>
            <TableHead>{t('period')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead>{t('uploadedBy')}</TableHead>
            <TableHead>{t('uploadDate')}</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow 
              key={doc.id} 
              className="hover:bg-secondary/30 transition-colors cursor-pointer"
              onClick={() => navigate(`/documents/${doc.id}`)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  {getFileIcon(doc.fileName)}
                  <div>
                    <p className="font-medium text-sm truncate max-w-[200px]">{doc.fileName}</p>
                    <p className="text-xs text-muted-foreground">{doc.size}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm">{doc.companyName}</TableCell>
              <TableCell className="text-sm">{getDocTypeLabel(doc.type)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{doc.period}</TableCell>
              <TableCell>
                <StatusBadge status={doc.status} type="document" />
              </TableCell>
              <TableCell className="text-sm">{doc.uploadedByName}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(doc.uploadDate)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/documents/${doc.id}`); }}>
                      <Eye className="h-4 w-4 mr-2" />
                      {t('view')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Download className="h-4 w-4 mr-2" />
                      {t('download')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
