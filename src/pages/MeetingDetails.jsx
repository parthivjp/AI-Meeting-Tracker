import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import TranscriptTabs from '../components/meetings/TranscriptTabs';
import { ConfirmModal } from '../components/common/Modal';
import { TypeBadge, StatusBadge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Toast';
import { useMeetings } from '../context/MeetingContext';
import { useToast } from '../components/common/Toast';

export default function MeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMeeting, deleteMeeting } = useMeetings();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const meeting = getMeeting(id);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (!loading && !meeting) {
      addToast('Failed to load meeting', 'error');
      navigate('/meetings');
    }
  }, [loading, meeting, navigate, addToast]);

  const handleDelete = () => {
    deleteMeeting(id);
    addToast('Meeting deleted successfully', 'success');
    navigate('/meetings');
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!meeting) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{meeting.title}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 text-sm text-slate-500">
              <Calendar className="h-4 w-4" /> {meeting.date}
            </span>
            <TypeBadge type={meeting.type} />
            <StatusBadge status={meeting.status} />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {meeting.participants.map((p) => (
              <span key={p} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" icon={Pencil} onClick={() => navigate('/meetings/new')}>Edit</Button>
          <Button variant="danger" icon={Trash2} onClick={() => setShowDelete(true)}>Delete</Button>
        </div>
      </div>

      <Card>
        <TranscriptTabs meeting={meeting} />
      </Card>

      <ConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Meeting"
        message={`Are you sure you want to delete "${meeting.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
