import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { companies } from '@/data/mockData';
import { DocumentUpload } from './DocumentUpload';

interface DocumentFiltersProps {
  onSearchChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function DocumentFilters({
  onSearchChange,
  onCompanyChange,
  onTypeChange,
  onStatusChange,
}: DocumentFiltersProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={`${t('search')} ${t('documents').toLowerCase()}...`}
          className="pl-10"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Select onValueChange={onCompanyChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder={t('companyName')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('all')}</SelectItem>
          {companies.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={onTypeChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder={t('documentType')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('all')}</SelectItem>
          <SelectItem value="invoice">{t('docTypeInvoice')}</SelectItem>
          <SelectItem value="bank_statement">{t('docTypeBankStatement')}</SelectItem>
          <SelectItem value="payroll">{t('docTypePayroll')}</SelectItem>
          <SelectItem value="contract">{t('docTypeContract')}</SelectItem>
          <SelectItem value="tax_return">{t('docTypeTaxReturn')}</SelectItem>
          <SelectItem value="other">{t('docTypeOther')}</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={onStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder={t('status')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('all')}</SelectItem>
          <SelectItem value="uploaded">{t('docStatusUploaded')}</SelectItem>
          <SelectItem value="checked">{t('docStatusChecked')}</SelectItem>
          <SelectItem value="needs_revision">{t('docStatusNeedsRevision')}</SelectItem>
        </SelectContent>
      </Select>

      <div className="ml-auto">
        <DocumentUpload />
      </div>
    </div>
  );
}
