import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, ListChecks, CircleDot, CheckCircle2, AlertTriangle, Clock,
  Plus, Upload,
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentMeetings from '../components/dashboard/RecentMeetings';
import UrgentTasks from '../components/dashboard/UrgentTasks';
import Button from '../components/common/Button';
import { Skeleton } from '../components/common/Toast';
import { useMeetings } from '../context/MeetingContext';
import { getDashboardStats, isOverdue } from '../data/mockData';

export default function Dashboard() {
  const { meetings, allActionItems } = useMeetings();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = getDashboardStats(meetings);
  const recentMeetings = [...meetings].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const urgentActions = allActionItems
    .filter((a) => a.status !== 'Completed' && (isOverdue(a.dueDate, a.status) || a.priority === 'High'))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Meetings" value={stats.totalMeetings} icon={Calendar} color="blue" trend={12} />
        <StatCard title="Total Action Items" value={stats.totalActions} icon={ListChecks} color="indigo" trend={8} />
        <StatCard title="Open Action Items" value={stats.openActions} icon={CircleDot} color="amber" />
        <StatCard title="Completed Action Items" value={stats.completedActions} icon={CheckCircle2} color="emerald" trend={15} />
        <StatCard title="Overdue Action Items" value={stats.overdueActions} icon={AlertTriangle} color="red" alert />
        <StatCard title="Recent Meetings" value={stats.recentMeetingsCount} icon={Clock} color="purple" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/meetings/new">
          <Button icon={Plus} size="lg">Create New Meeting</Button>
        </Link>
        <Link to="/meetings/new">
          <Button variant="outline" icon={Upload} size="lg">Upload Transcript</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Meetings</h2>
          <RecentMeetings meetings={recentMeetings} />
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Urgent Action Items</h2>
          <UrgentTasks actions={urgentActions} />
        </div>
      </div>
    </div>
  );
}
