import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, LayoutGrid, List, Calendar, Pencil, Trash2 } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import MeetingCard from '../components/meetings/MeetingCard';
import { ConfirmModal } from '../components/common/Modal';
import { TypeBadge, StatusBadge } from '../components/common/Badge';
import { useMeetings } from '../context/MeetingContext';
import { useToast } from '../components/common/Toast';
import { MEETING_TYPES } from '../data/mockData';

export default function MeetingList() {
  const { meetings, deleteMeeting } = useMeetings();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    return meetings.filter((m) => {
      const matchSearch = !search.trim() ||
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.type.toLowerCase().includes(search.toLowerCase()) ||
        m.participants.some((p) => p.toLowerCase().includes(search.toLowerCase()));
      const matchType = typeFilter === 'All' || m.type === typeFilter;
      const matchFrom = !dateFrom || m.date >= dateFrom;
      const matchTo = !dateTo || m.date <= dateTo;
      return matchSearch && matchType && matchFrom && matchTo;
    });
  }, [meetings, search, typeFilter, dateFrom, dateTo]);

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMeeting(deleteTarget.id);
      addToast('Meeting deleted successfully', 'success');
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Meetings</h2>
          <p className="text-sm text-slate-500">{filtered.length} meeting{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/meetings/new">
          <Button icon={Plus}>Add Meeting</Button>
        </Link>
      </div>

      <Card className="!p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, type, or participant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            <option value="All">All Types</option>
            {MEETING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 ${viewMode === 'table' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center py-16 text-center">
            <Calendar className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No meetings found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              {meetings.length === 0
                ? 'Create your first meeting to start tracking transcripts and action items.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {meetings.length === 0 && (
              <Link to="/meetings/new" className="mt-4">
                <Button icon={Plus}>Create Meeting</Button>
              </Link>
            )}
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m) => (
            <MeetingCard
              key={m.id}
              meeting={m}
              onEdit={() => navigate(`/meetings/${m.id}`)}
              onDelete={() => setDeleteTarget(m)}
            />
          ))}
        </div>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-5 py-3 text-left font-medium text-slate-500">Title</th>
                  <th className="px-5 py-3 text-left font-medium text-slate-500">Date</th>
                  <th className="px-5 py-3 text-left font-medium text-slate-500">Type</th>
                  <th className="px-5 py-3 text-left font-medium text-slate-500">Actions</th>
                  <th className="px-5 py-3 text-left font-medium text-slate-500">Status</th>
                  <th className="px-5 py-3 text-right font-medium text-slate-500"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-5 py-3">
                      <Link to={`/meetings/${m.id}`} className="font-medium text-slate-900 dark:text-white hover:text-primary-600">
                        {m.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{m.date}</td>
                    <td className="px-5 py-3"><TypeBadge type={m.type} /></td>
                    <td className="px-5 py-3 text-slate-600">{m.actionItems?.length || 0}</td>
                    <td className="px-5 py-3"><StatusBadge status={m.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" icon={Pencil} onClick={() => navigate(`/meetings/${m.id}`)} />
                        <Button variant="ghost" size="sm" icon={Trash2} onClick={() => setDeleteTarget(m)} className="text-red-500" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Meeting"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
