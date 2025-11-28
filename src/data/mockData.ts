// Mock data for demonstration

export interface Company {
  id: string;
  name: string;
  pib: string;
  city: string;
  sector: string;
  assignedAccountantId: string;
  assignedAccountantName: string;
  status: 'active' | 'onboarding' | 'paused' | 'inactive';
  openTasks: number;
  overdueTasks: number;
  contactPerson: string;
  email: string;
  phone: string;
}

export interface Task {
  id: string;
  companyId: string;
  companyName: string;
  companyPib: string;
  period: string;
  type: 'vat' | 'payroll' | 'annual_report' | 'reconciliation' | 'other';
  status: 'new' | 'in_progress' | 'waiting' | 'done' | 'overdue';
  priority: 'low' | 'normal' | 'high';
  dueDate: string;
  assignedAccountantId: string;
  assignedAccountantName: string;
  lastUpdate: string;
  commentsCount: number;
  description?: string;
}

export interface Document {
  id: string;
  fileName: string;
  companyId: string;
  companyName: string;
  type: 'invoice' | 'bank_statement' | 'payroll' | 'contract' | 'tax_return' | 'other';
  period: string;
  status: 'uploaded' | 'checked' | 'needs_revision';
  uploadedById: string;
  uploadedByName: string;
  uploadDate: string;
  size: string;
}

export interface AccountantUser {
  id: string;
  name: string;
  email: string;
  role: 'director' | 'administrator' | 'accountant';
  status: 'active' | 'blocked';
  assignedCompanies: number;
  activeTasks: number;
}

// Mock Accountants
export const accountants: AccountantUser[] = [
  { id: '1', name: 'Анна Петрова', email: 'anna@buhgalterija.rs', role: 'director', status: 'active', assignedCompanies: 0, activeTasks: 0 },
  { id: '2', name: 'Марина Иванова', email: 'marina@buhgalterija.rs', role: 'accountant', status: 'active', assignedCompanies: 8, activeTasks: 15 },
  { id: '3', name: 'Ольга Сидорова', email: 'olga@buhgalterija.rs', role: 'accountant', status: 'active', assignedCompanies: 6, activeTasks: 12 },
  { id: '4', name: 'Елена Козлова', email: 'elena@buhgalterija.rs', role: 'accountant', status: 'active', assignedCompanies: 7, activeTasks: 18 },
  { id: '5', name: 'Ирина Новикова', email: 'irina@buhgalterija.rs', role: 'administrator', status: 'active', assignedCompanies: 0, activeTasks: 5 },
  { id: '6', name: 'Наталья Волкова', email: 'natalia@buhgalterija.rs', role: 'accountant', status: 'blocked', assignedCompanies: 0, activeTasks: 0 },
];

// Mock Companies
export const companies: Company[] = [
  {
    id: '1',
    name: 'TechStart DOO',
    pib: '112345678',
    city: 'Белград',
    sector: 'IT услуги',
    assignedAccountantId: '2',
    assignedAccountantName: 'Марина Иванова',
    status: 'active',
    openTasks: 3,
    overdueTasks: 1,
    contactPerson: 'Иван Петров',
    email: 'ivan@techstart.rs',
    phone: '+381 11 123 4567',
  },
  {
    id: '2',
    name: 'Global Trade SRB',
    pib: '223456789',
    city: 'Нови Сад',
    sector: 'Импорт/Экспорт',
    assignedAccountantId: '3',
    assignedAccountantName: 'Ольга Сидорова',
    status: 'active',
    openTasks: 5,
    overdueTasks: 0,
    contactPerson: 'Мария Йованович',
    email: 'maria@globaltrade.rs',
    phone: '+381 21 456 7890',
  },
  {
    id: '3',
    name: 'Restoran Balkan',
    pib: '334567890',
    city: 'Белград',
    sector: 'Ресторанный бизнес',
    assignedAccountantId: '2',
    assignedAccountantName: 'Марина Иванова',
    status: 'active',
    openTasks: 2,
    overdueTasks: 2,
    contactPerson: 'Драган Николич',
    email: 'dragan@balkan.rs',
    phone: '+381 11 234 5678',
  },
  {
    id: '4',
    name: 'MediCare Plus',
    pib: '445678901',
    city: 'Ниш',
    sector: 'Медицинские услуги',
    assignedAccountantId: '4',
    assignedAccountantName: 'Елена Козлова',
    status: 'onboarding',
    openTasks: 4,
    overdueTasks: 0,
    contactPerson: 'Анна Стоянович',
    email: 'anna@medicare.rs',
    phone: '+381 18 345 6789',
  },
  {
    id: '5',
    name: 'BuildPro Construccije',
    pib: '556789012',
    city: 'Белград',
    sector: 'Строительство',
    assignedAccountantId: '3',
    assignedAccountantName: 'Ольга Сидорова',
    status: 'active',
    openTasks: 6,
    overdueTasks: 1,
    contactPerson: 'Милош Павлович',
    email: 'milos@buildpro.rs',
    phone: '+381 11 456 7891',
  },
  {
    id: '6',
    name: 'EcoFarm Srbija',
    pib: '667890123',
    city: 'Суботица',
    sector: 'Сельское хозяйство',
    assignedAccountantId: '4',
    assignedAccountantName: 'Елена Козлова',
    status: 'paused',
    openTasks: 0,
    overdueTasks: 0,
    contactPerson: 'Петар Джордевич',
    email: 'petar@ecofarm.rs',
    phone: '+381 24 567 8901',
  },
];

// Mock Tasks
export const tasks: Task[] = [
  {
    id: 'T-001',
    companyId: '1',
    companyName: 'TechStart DOO',
    companyPib: '112345678',
    period: 'Ноябрь 2024',
    type: 'vat',
    status: 'overdue',
    priority: 'high',
    dueDate: '2024-11-25',
    assignedAccountantId: '2',
    assignedAccountantName: 'Марина Иванова',
    lastUpdate: '2024-11-26T10:30:00',
    commentsCount: 3,
    description: 'Подготовить и подать декларацию по НДС за ноябрь 2024',
  },
  {
    id: 'T-002',
    companyId: '2',
    companyName: 'Global Trade SRB',
    companyPib: '223456789',
    period: 'Ноябрь 2024',
    type: 'payroll',
    status: 'in_progress',
    priority: 'normal',
    dueDate: '2024-12-05',
    assignedAccountantId: '3',
    assignedAccountantName: 'Ольга Сидорова',
    lastUpdate: '2024-11-27T14:15:00',
    commentsCount: 1,
    description: 'Расчёт заработной платы за ноябрь 2024',
  },
  {
    id: 'T-003',
    companyId: '3',
    companyName: 'Restoran Balkan',
    companyPib: '334567890',
    period: 'Ноябрь 2024',
    type: 'vat',
    status: 'waiting',
    priority: 'high',
    dueDate: '2024-12-01',
    assignedAccountantId: '2',
    assignedAccountantName: 'Марина Иванова',
    lastUpdate: '2024-11-25T09:00:00',
    commentsCount: 5,
    description: 'Ожидание банковских выписок от клиента',
  },
  {
    id: 'T-004',
    companyId: '4',
    companyName: 'MediCare Plus',
    companyPib: '445678901',
    period: 'Q4 2024',
    type: 'reconciliation',
    status: 'new',
    priority: 'low',
    dueDate: '2024-12-15',
    assignedAccountantId: '4',
    assignedAccountantName: 'Елена Козлова',
    lastUpdate: '2024-11-20T11:00:00',
    commentsCount: 0,
    description: 'Квартальная сверка расчётов с поставщиками',
  },
  {
    id: 'T-005',
    companyId: '5',
    companyName: 'BuildPro Construccije',
    companyPib: '556789012',
    period: '2024',
    type: 'annual_report',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2024-12-31',
    assignedAccountantId: '3',
    assignedAccountantName: 'Ольга Сидорова',
    lastUpdate: '2024-11-28T08:45:00',
    commentsCount: 2,
    description: 'Подготовка годового финансового отчёта',
  },
  {
    id: 'T-006',
    companyId: '1',
    companyName: 'TechStart DOO',
    companyPib: '112345678',
    period: 'Декабрь 2024',
    type: 'payroll',
    status: 'new',
    priority: 'normal',
    dueDate: '2024-12-28',
    assignedAccountantId: '2',
    assignedAccountantName: 'Марина Иванова',
    lastUpdate: '2024-11-28T09:00:00',
    commentsCount: 0,
    description: 'Расчёт заработной платы за декабрь 2024',
  },
  {
    id: 'T-007',
    companyId: '3',
    companyName: 'Restoran Balkan',
    companyPib: '334567890',
    period: 'Октябрь 2024',
    type: 'vat',
    status: 'overdue',
    priority: 'high',
    dueDate: '2024-11-15',
    assignedAccountantId: '2',
    assignedAccountantName: 'Марина Иванова',
    lastUpdate: '2024-11-20T16:30:00',
    commentsCount: 7,
    description: 'Просроченная декларация - требуется срочное внимание',
  },
  {
    id: 'T-008',
    companyId: '2',
    companyName: 'Global Trade SRB',
    companyPib: '223456789',
    period: 'Ноябрь 2024',
    type: 'reconciliation',
    status: 'done',
    priority: 'normal',
    dueDate: '2024-11-25',
    assignedAccountantId: '3',
    assignedAccountantName: 'Ольга Сидорова',
    lastUpdate: '2024-11-24T17:00:00',
    commentsCount: 2,
    description: 'Сверка с таможней завершена',
  },
];

// Mock Documents
export const documents: Document[] = [
  {
    id: 'D-001',
    fileName: 'TechStart_Invoice_Nov2024_001.pdf',
    companyId: '1',
    companyName: 'TechStart DOO',
    type: 'invoice',
    period: 'Ноябрь 2024',
    status: 'checked',
    uploadedById: '2',
    uploadedByName: 'Марина Иванова',
    uploadDate: '2024-11-20',
    size: '245 KB',
  },
  {
    id: 'D-002',
    fileName: 'GlobalTrade_BankStatement_Nov2024.pdf',
    companyId: '2',
    companyName: 'Global Trade SRB',
    type: 'bank_statement',
    period: 'Ноябрь 2024',
    status: 'uploaded',
    uploadedById: '3',
    uploadedByName: 'Ольга Сидорова',
    uploadDate: '2024-11-27',
    size: '1.2 MB',
  },
  {
    id: 'D-003',
    fileName: 'Balkan_Payroll_Oct2024.xlsx',
    companyId: '3',
    companyName: 'Restoran Balkan',
    type: 'payroll',
    period: 'Октябрь 2024',
    status: 'needs_revision',
    uploadedById: '2',
    uploadedByName: 'Марина Иванова',
    uploadDate: '2024-11-15',
    size: '89 KB',
  },
  {
    id: 'D-004',
    fileName: 'MediCare_Contract_2024.pdf',
    companyId: '4',
    companyName: 'MediCare Plus',
    type: 'contract',
    period: '2024',
    status: 'checked',
    uploadedById: '5',
    uploadedByName: 'Ирина Новикова',
    uploadDate: '2024-11-10',
    size: '567 KB',
  },
  {
    id: 'D-005',
    fileName: 'BuildPro_TaxReturn_Q3_2024.pdf',
    companyId: '5',
    companyName: 'BuildPro Construccije',
    type: 'tax_return',
    period: 'Q3 2024',
    status: 'checked',
    uploadedById: '3',
    uploadedByName: 'Ольга Сидорова',
    uploadDate: '2024-10-28',
    size: '432 KB',
  },
];

// Dashboard statistics
export const dashboardStats = {
  totalClients: companies.length,
  activeTasks: tasks.filter(t => t.status !== 'done').length,
  overdueTasks: tasks.filter(t => t.status === 'overdue').length,
  pendingDocuments: documents.filter(d => d.status === 'uploaded').length,
};

export const tasksByAccountant = accountants
  .filter(a => a.role === 'accountant' && a.status === 'active')
  .map(a => ({
    name: a.name,
    tasks: tasks.filter(t => t.assignedAccountantId === a.id && t.status !== 'done').length,
    overdue: tasks.filter(t => t.assignedAccountantId === a.id && t.status === 'overdue').length,
  }));

export const upcomingDeadlines = tasks
  .filter(t => t.status !== 'done')
  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  .slice(0, 5);
