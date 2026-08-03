import { Link } from 'react-router-dom';
import { Calendar, Users, ListChecks, Pencil, Trash2 } from 'lucide-react';
import Card from '../common/Card';
import { TypeBadge, StatusBadge } from '../common/Badge';
import Button from '../common/Button';

export default function MeetingCard({ meeting, onEdit, onDelete }) {
  const summarySnippet = meeting.summary?.purpose?.slice(0, 120) || 'No summary available yet';

  return (
    <Card hover className="flex flex-col h-full">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <Link to={`/meetings/${meeting.id}`} className="text-base font-semibold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
            {meeting.title}
          </Link>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="h-3 w-3" />
            {meeting.date}
          </div>
        </div>
        <TypeBadge type={meeting.type} />
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 flex-1">
        {summarySnippet}{summarySnippet.length >= 120 ? '...' : ''}
      </p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Users className="h-3.5 w-3.5" />
            <div className="flex -space-x-1.5">
              {meeting.participants.slice(0, 3).map((p) => (
                <div key={p} className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-700 ring-2 ring-white dark:bg-primary-900/50 dark:text-primary-300 dark:ring-slate-800" title={p}>
                  {p.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
              ))}
              {meeting.participants.length > 3 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-medium text-slate-600 ring-2 ring-white dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-800">
                  +{meeting.participants.length - 3}
                </div>
              )}
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <ListChecks className="h-3.5 w-3.5" />
            {meeting.actionItems?.length || 0}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <StatusBadge status={meeting.status} />
          <Button variant="ghost" size="sm" icon={Pencil} onClick={() => onEdit?.(meeting)} />
          <Button variant="ghost" size="sm" icon={Trash2} onClick={() => onDelete?.(meeting)} className="text-red-500 hover:text-red-600" />
        </div>
      </div>
    </Card>
  );
}
