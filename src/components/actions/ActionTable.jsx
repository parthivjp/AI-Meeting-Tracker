import { AlertTriangle } from 'lucide-react';
import { PriorityBadge } from '../common/Badge';
import { ACTION_STATUSES, isOverdue } from '../../data/mockData';

export default function ActionTable({ actions, onStatusChange, onOwnerChange, sortField, sortDir, onSort }) {
  if (!actions.length) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <AlertTriangle className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
        <p className="text-sm font-medium text-slate-500">No action items match your filters</p>
        <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  const SortHeader = ({ field, children }) => (
    <th
      className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none"
      onClick={() => onSort?.(field)}
    >
      {children} {sortField === field && (sortDir === 'asc' ? '↑' : '↓')}
    </th>
  );

  const owners = [...new Set(actions.map((a) => a.owner))];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <SortHeader field="task">Task</SortHeader>
            <th className="px-4 py-3 text-left font-medium text-slate-500 hidden sm:table-cell">Meeting</th>
            <SortHeader field="owner">Owner</SortHeader>
            <SortHeader field="dueDate">Due Date</SortHeader>
            <SortHeader field="priority">Priority</SortHeader>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action) => {
            const overdue = isOverdue(action.dueDate, action.status);
            return (
              <tr
                key={action.id}
                className={`border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors
                  ${overdue ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900 dark:text-white">{action.task}</p>
                  {overdue && (
                    <span className="inline-flex items-center gap-0.5 text-xs text-red-500 mt-0.5">
                      <AlertTriangle className="h-3 w-3" /> Overdue
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400 hidden sm:table-cell truncate max-w-[150px]">
                  {action.meetingTitle}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={action.owner}
                    onChange={(e) => onOwnerChange?.(action, e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  >
                    {owners.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </td>
                <td className={`px-4 py-3 ${overdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                  {action.dueDate}
                </td>
                <td className="px-4 py-3"><PriorityBadge priority={action.priority} /></td>
                <td className="px-4 py-3">
                  <select
                    value={action.status}
                    onChange={(e) => onStatusChange?.(action, e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  >
                    {ACTION_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
