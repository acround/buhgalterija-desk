import { useLanguage } from '@/contexts/LanguageContext';
import { AccountantUser } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { MoreHorizontal, Edit, Lock, Unlock, Building2, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UsersTableProps {
  users: AccountantUser[];
}

export function UsersTable({ users }: UsersTableProps) {
  const { t } = useLanguage();

  const getRoleLabel = (role: AccountantUser['role']) => {
    const labels: Record<AccountantUser['role'], string> = {
      director: t('director'),
      administrator: t('administrator'),
      accountant: t('accountant'),
    };
    return labels[role];
  };

  const getRoleBadgeVariant = (role: AccountantUser['role']) => {
    if (role === 'director') return 'default';
    if (role === 'administrator') return 'secondary';
    return 'outline';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/50">
          <TableRow>
            <TableHead>{t('userName')}</TableHead>
            <TableHead>{t('userEmail')}</TableHead>
            <TableHead>{t('userRole')}</TableHead>
            <TableHead>{t('userStatus')}</TableHead>
            <TableHead className="text-center">
              <Building2 className="h-4 w-4 inline" />
            </TableHead>
            <TableHead className="text-center">
              <ListTodo className="h-4 w-4 inline" />
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className={cn(
                'hover:bg-secondary/30 transition-colors',
                user.status === 'blocked' && 'opacity-60'
              )}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.status === 'active' ? 'default' : 'destructive'}
                  className={user.status === 'active' ? 'bg-success' : ''}
                >
                  {user.status === 'active' ? t('userActive') : t('userBlocked')}
                </Badge>
              </TableCell>
              <TableCell className="text-center text-sm">
                {user.assignedCompanies}
              </TableCell>
              <TableCell className="text-center text-sm">
                {user.activeTasks}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      {t('edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {user.status === 'active' ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          {t('blockUser')}
                        </>
                      ) : (
                        <>
                          <Unlock className="h-4 w-4 mr-2" />
                          {t('unblockUser')}
                        </>
                      )}
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
