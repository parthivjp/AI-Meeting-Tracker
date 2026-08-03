import { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, Plus, AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ActionTable from '../components/actions/ActionTable';
import KanbanBoard from '../components/actions/KanbanBoard';
import ActionItemModal from '../components/actions/ActionItemModal';
import { useMeetings } from '../context/MeetingContext';
import { useToast } from '../components/common/Toast';
import { ACTION_STATUSES, ACTION_PRIORITIES, isOverdue } from '../data/mockData';

export default function ActionTracker() {
  const { meetings, allActionItems, updateActionItem, addActionItem } = useMeetings();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortField, setSortField] = useState('dueDate');
  const [sortDir, setSortDir] = useState('asc');

  const owners = useMemo(() => [...new Set(allActionItems.map((a) => a.owner))], [allActionItems]);

  const filtered = useMemo(() => {
    let items = allActionItems.filter((a) => {
      const matchSearch = !search.trim() ||
        a.task.toLowerCase().includes(search.toLowerCase()) ||
        a.owner.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || a.priority === priorityFilter;
      const matchOwner = ownerFilter === 'All' || a.owner === ownerFilter;
      const matchOverdue = !overdueOnly || isOverdue(a.dueDate, a.status);
      return matchSearch && matchStatus && matchPriority && matchOwner && matchOverdue;
    });

    items.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'dueDate') {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return items;
  }, [allActionItems, search, statusFilter, priorityFilter, ownerFilter, overdueOnly, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleStatusChange = (action, status) => {
    updateActionItem(action.meetingId, action.id, { status });
    addToast('Task status updated', 'success');
  };

  const handleOwnerChange = (action, owner) => {
    updateActionItem(action.meetingId, action.id, { owner });
    addToast('Task owner updated', 'success');
  };

  const handleAddAction = (form) => {
    addActionItem(form.meetingId, {
      task: form.task,
      owner: form.owner,
      dueDate: form.dueDate,
      priority: form.priority,
    });
    addToast('Action item added successfully', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Action Item Tracker</h2>
          <p className="text-sm text-slate-500">{filtered.length} action item{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>Add Action Item</Button>
      </div>

      <Card className="!p-4">
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by task or owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white">
            <option value="All">All Statuses</option>
            {ACTION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white">
            <option value="All">All Priorities</option>
            {ACTION_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white">
            <option value="All">All Owners</option>
            {owners.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <Button
            variant={overdueOnly ? 'danger' : 'outline'}
            icon={AlertTriangle}
            onClick={() => setOverdueOnly(!overdueOnly)}
          >
            {overdueOnly ? 'Showing Overdue' : 'Show Overdue Only'}
          </Button>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
            <button onClick={() => setViewMode('table')} className={`p-2 ${viewMode === 'table' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' : 'text-slate-500'}`}>
              <List className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode('kanban')} className={`p-2 ${viewMode === 'kanban' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' : 'text-slate-500'}`}>
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      <Card padding={viewMode === 'kanban' ? false : false}>
        {viewMode === 'table' ? (
          <ActionTable
            actions={filtered}
            onStatusChange={handleStatusChange}
            onOwnerChange={handleOwnerChange}
            sortField={sortField}
            sortDir={sortDir}
            onSort={handleSort}
          />
        ) : (
          <div className="p-4">
            <KanbanBoard actions={filtered} onStatusChange={handleStatusChange} />
          </div>
        )}
      </Card>

      <ActionItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddAction}
        meetings={meetings}
      />
    </div>
  );
}
