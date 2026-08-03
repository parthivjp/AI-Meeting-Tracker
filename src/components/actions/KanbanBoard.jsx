import { GripVertical, AlertTriangle } from 'lucide-react';
import Card from '../common/Card';
import { PriorityBadge } from '../common/Badge';
import { ACTION_STATUSES, isOverdue } from '../../data/mockData';

const columns = ACTION_STATUSES;

export default function KanbanBoard({ actions, onStatusChange }) {
  const grouped = columns.reduce((acc, status) => {
    acc[status] = actions.filter((a) => a.status === status);
    return acc;
  }, {});

  const columnColors = {
    Open: 'border-t-blue-500',
    'In Progress': 'border-t-indigo-500',
    Blocked: 'border-t-red-500',
    Completed: 'border-t-emerald-500',
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {columns.map((status) => (
        <div key={status} className="flex flex-col">
          <div className={`rounded-t-lg border-t-4 ${columnColors[status]} bg-slate-100 dark:bg-slate-800/50 px-3 py-2`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{status}</h3>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                {grouped[status].length}
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-2 rounded-b-lg bg-slate-50 p-2 dark:bg-slate-900/50 min-h-[200px]">
            {grouped[status].map((action) => {
              const overdue = isOverdue(action.dueDate, action.status);
              return (
                <Card key={action.id} className={`!p-3 cursor-grab active:cursor-grabbing ${overdue ? 'ring-1 ring-red-200 dark:ring-red-800' : ''}`}>
                  <div className="flex items-start gap-2">
                    <GripVertical className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">{action.task}</p>
                      <p className="text-xs text-slate-500 mt-1">{action.owner}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <PriorityBadge priority={action.priority} />
                        <span className={`text-xs ${overdue ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                          {overdue && <AlertTriangle className="h-3 w-3 inline mr-0.5" />}
                          {action.dueDate}
                        </span>
                      </div>
                      {status !== 'Completed' && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {columns.filter((s) => s !== status).map((s) => (
                            <button
                              key={s}
                              onClick={() => onStatusChange?.(action, s)}
                              className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 hover:bg-primary-100 hover:text-primary-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-primary-900/40 dark:hover:text-primary-300 transition-colors"
                            >
                              → {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
            {!grouped[status].length && (
              <p className="text-center text-xs text-slate-400 py-8">No items</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
