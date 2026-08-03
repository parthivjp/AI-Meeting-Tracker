const colors = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
};

const typeColors = {
  'Client Meeting': 'primary',
  'Sales Meeting': 'success',
  'Project Meeting': 'info',
  'Internal Meeting': 'default',
  'Requirement Discussion': 'warning',
  'Retrospective': 'danger',
  'Other': 'default',
};

const priorityColors = {
  Low: 'default',
  Medium: 'warning',
  High: 'danger',
};

const statusColors = {
  Open: 'info',
  'In Progress': 'primary',
  Blocked: 'danger',
  Completed: 'success',
  processed: 'success',
  draft: 'default',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function TypeBadge({ type }) {
  return <Badge variant={typeColors[type] || 'default'}>{type}</Badge>;
}

export function PriorityBadge({ priority }) {
  return <Badge variant={priorityColors[priority] || 'default'}>{priority}</Badge>;
}

export function StatusBadge({ status }) {
  return <Badge variant={statusColors[status] || 'default'}>{status}</Badge>;
}
