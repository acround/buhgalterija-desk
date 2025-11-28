import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { UsersTable } from '@/components/users/UsersTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { accountants } from '@/data/mockData';
import { Search, Plus, Users as UsersIcon } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Users() {
  const { t } = useLanguage();
  const { canManageUsers } = useAuth();

  // Only administrators can access this page
  if (!canManageUsers) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <UsersIcon className="h-6 w-6 text-primary" />
            {t('userManagement')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {accountants.length} {t('users').toLowerCase()}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t('createUser')}
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={`${t('search')} ${t('users').toLowerCase()}...`}
          className="pl-10"
        />
      </div>

      {/* Users Table */}
      <UsersTable users={accountants} />
    </div>
  );
}
