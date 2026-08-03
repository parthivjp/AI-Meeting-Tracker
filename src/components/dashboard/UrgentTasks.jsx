import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';
import { PriorityBadge } from '../common/Badge';
import { useMeetings } from '../../context/MeetingContext';
import { useToast } from '../common/Toast';
import { isOverdue } from '../../data/mockData';

export default function UrgentTasks({ actions }) {
  const { updateActionItem } = useMeetings();
  const { addToast } = useToast();

  if (!actions.length) {
    return (
      <Card>
        <div className="flex flex-col items-center py-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-300 dark:text-emerald-700 mb-3" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">All caught up!</p>
          <p className="text-xs text-slate-400 mt-1">No urgent action items</p>
        </div>
      </Card>
    );
  }

  const toggleStatus = (action) => {
    const newStatus = action.status === 'Completed' ? 'Open' : 'Completed';
    updateActionItem(action.meetingId, action.id, { status: newStatus });
    addToast(`Task marked as ${newStatus}`, 'success');
  };

  return (
    <Card padding={false}>
      <div className="divide-y divide-slate-100 dark:divide-slate-700">
        {actions.map((action) => (
          <div key={action.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <button
              onClick={() => toggleStatus(action)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors
                ${action.status === 'Completed'
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-slate-300 dark:border-slate-600 hover:border-primary-500'
                }`}
            >
              {action.status === 'Completed' && <CheckCircle2 className="h-3 w-3" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${action.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                {action.task}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500">{action.owner}</span>
                <PriorityBadge priority={action.priority} />
                {isOverdue(action.dueDate, action.status) && (
                  <span className="inline-flex items-center gap-0.5 text-xs text-red-500">
                    <AlertTriangle className="h-3 w-3" /> Overdue
                  </span>
                )}
              </div>
            </div>
            <span className={`text-xs shrink-0 ${isOverdue(action.dueDate, action.status) ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
              {action.dueDate}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
