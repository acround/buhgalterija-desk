import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Task } from '@/data/mockData';
import { StatusBadge, PriorityBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { MoreHorizontal, MessageSquare, ExternalLink, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TasksTableProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function TasksTable({ tasks, onTaskClick }: TasksTableProps) {
  const { t } = useLanguage();
  const { canAssignTasks } = useAuth();
  const navigate = useNavigate();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const toggleTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const toggleAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((t) => t.id));
    }
  };

  const isOverdue = (task: Task) => {
    return task.status === 'overdue' || new Date(task.dueDate) < new Date();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTaskTypeLabel = (type: Task['type']) => {
    const labels: Record<Task['type'], string> = {
      vat: t('taskTypeVat'),
      payroll: t('taskTypePayroll'),
      annual_report: t('taskTypeAnnualReport'),
      reconciliation: t('taskTypeReconciliation'),
      other: t('taskTypeOther'),
    };
    return labels[type];
  };

  return (
    <div className="space-y-4">
      {/* Bulk actions */}
      {selectedTasks.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
          <span className="text-sm font-medium">
            {t('selectedTasks')}: {selectedTasks.length}
          </span>
          <Button variant="outline" size="sm">
            {t('changeStatus')}
          </Button>
          {canAssignTasks && (
            <Button variant="outline" size="sm">
              {t('assignAccountant')}
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50 sticky top-0">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedTasks.length === tasks.length && tasks.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className="w-20">{t('taskId')}</TableHead>
              <TableHead>{t('companyName')}</TableHead>
              <TableHead>{t('taskType')}</TableHead>
              <TableHead>{t('period')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('priority')}</TableHead>
              <TableHead>{t('dueDate')}</TableHead>
              <TableHead>{t('assignedTo')}</TableHead>
              <TableHead>{t('lastUpdate')}</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                className={cn(
                  'cursor-pointer hover:bg-secondary/50 transition-colors',
                  isOverdue(task) && task.status !== 'done' && 'bg-destructive/5',
                  selectedTasks.includes(task.id) && 'bg-primary/5'
                )}
                onClick={() => {
                  if (onTaskClick) {
                    onTaskClick(task);
                  } else {
                    navigate(`/tasks/${task.id}`);
                  }
                }}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedTasks.includes(task.id)}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs">{task.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{task.companyName}</p>
                    <p className="text-xs text-muted-foreground">{task.companyPib}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{getTaskTypeLabel(task.type)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{task.period}</TableCell>
                <TableCell>
                  <StatusBadge status={task.status} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell>
                  <div className={cn(
                    'flex items-center gap-1 text-sm',
                    isOverdue(task) && task.status !== 'done' && 'text-destructive font-medium'
                  )}>
                    {isOverdue(task) && task.status !== 'done' && (
                      <AlertCircle className="h-3.5 w-3.5" />
                    )}
                    {formatDate(task.dueDate)}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{task.assignedAccountantName}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDateTime(task.lastUpdate)}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    {task.commentsCount > 0 && (
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {task.commentsCount}
                      </span>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/tasks/${task.id}`)}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {t('view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem>{t('changeStatus')}</DropdownMenuItem>
                        {canAssignTasks && (
                          <DropdownMenuItem>{t('assignAccountant')}</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
