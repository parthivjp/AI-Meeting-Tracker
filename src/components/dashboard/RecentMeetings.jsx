import { Link } from 'react-router-dom';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import { TypeBadge, StatusBadge } from '../common/Badge';

export default function RecentMeetings({ meetings }) {
  if (!meetings.length) {
    return (
      <Card>
        <div className="flex flex-col items-center py-8 text-center">
          <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No meetings yet</p>
          <p className="text-xs text-slate-400 mt-1">Create your first meeting to get started</p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding={false}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="px-5 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Meeting</th>
              <th className="px-5 py-3 text-left font-medium text-slate-500 dark:text-slate-400 hidden sm:table-cell">Date</th>
              <th className="px-5 py-3 text-left font-medium text-slate-500 dark:text-slate-400 hidden md:table-cell">Type</th>
              <th className="px-5 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Status</th>
              <th className="px-5 py-3 text-right font-medium text-slate-500 dark:text-slate-400"></th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((m) => (
              <tr key={m.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-5 py-3">
                  <p className="font-medium text-slate-900 dark:text-white">{m.title}</p>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400">
                    <Users className="h-3 w-3" />
                    {m.participants.length} participants
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-400 hidden sm:table-cell">{m.date}</td>
                <td className="px-5 py-3 hidden md:table-cell"><TypeBadge type={m.type} /></td>
                <td className="px-5 py-3"><StatusBadge status={m.status} /></td>
                <td className="px-5 py-3 text-right">
                  <Link to={`/meetings/${m.id}`} className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
