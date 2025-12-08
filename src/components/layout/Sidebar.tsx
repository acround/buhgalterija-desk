import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Building2,
  ListTodo,
  FileText,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface NavItem {
  icon: React.ElementType;
  labelKey: 'dashboard' | 'companies' | 'tasks' | 'documents' | 'settings' | 'users';
  path: string;
  roles?: ('director' | 'administrator' | 'accountant')[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, labelKey: 'dashboard', path: '/' },
  { icon: Building2, labelKey: 'companies', path: '/companies' },
  { icon: ListTodo, labelKey: 'tasks', path: '/tasks' },
  { icon: FileText, labelKey: 'documents', path: '/documents' },
  { icon: Users, labelKey: 'users', path: '/users', roles: ['administrator'] },
  { icon: Settings, labelKey: 'settings', path: '/settings', roles: ['administrator', 'director'] },
];

export function Sidebar() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    if (!user?.role) return false;
    const role = user.role as 'director' | 'administrator' | 'accountant';
    return item.roles.includes(role);
  });

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-sidebar-border',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <span className="font-heading font-semibold text-sidebar-foreground">
              BUHGALTERIJA
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">B</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3 mt-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{t(item.labelKey)}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'absolute bottom-4 text-sidebar-foreground hover:bg-sidebar-accent',
          collapsed ? 'left-1/2 -translate-x-1/2' : 'right-3'
        )}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </aside>
  );
}

export function useSidebarWidth() {
  // This hook can be expanded to read actual sidebar state
  return { collapsed: false, width: 256 };
}
