import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, X, Sparkles } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import AIResultsView from '../components/meetings/AIResultsView';
import { useMeetings } from '../context/MeetingContext';
import { useToast } from '../components/common/Toast';
import { MEETING_TYPES } from '../data/mockData';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['.txt', '.doc', '.docx', '.pdf'];

export default function MeetingCreate() {
  const navigate = useNavigate();
  const { createMeeting, processAI, processing } = useMeetings();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Project Meeting',
    participants: [],
    transcript: '',
  });
  const [participantInput, setParticipantInput] = useState('');
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('paste');
  const [file, setFile] = useState(null);
  const [showAI, setShowAI] = useState(false);

  const addParticipant = () => {
    const name = participantInput.trim();
    if (name && !form.participants.includes(name)) {
      setForm({ ...form, participants: [...form.participants, name] });
      setParticipantInput('');
    }
  };

  const removeParticipant = (name) => {
    setForm({ ...form, participants: form.participants.filter((p) => p !== name) });
  };

  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    const dropped = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (!dropped) return;

    const ext = '.' + dropped.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      addToast('Invalid file type. Accepted: .txt, .doc, .docx, .pdf', 'error');
      return;
    }
    if (dropped.size > MAX_FILE_SIZE) {
      addToast('File too large. Maximum size is 5MB', 'error');
      return;
    }

    setFile(dropped);
    if (ext === '.txt') {
      const reader = new FileReader();
      reader.onload = (ev) => setForm((f) => ({ ...f, transcript: ev.target.result }));
      reader.readAsText(dropped);
    } else {
      setForm((f) => ({ ...f, transcript: `[Uploaded file: ${dropped.name}]\n\nFile content would be extracted here in production.` }));
    }
  }, [addToast]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Meeting title is required';
    if (!form.transcript.trim() && !file) errs.transcript = 'Please provide a transcript';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProcess = async () => {
    if (!validate()) return;

    const meeting = createMeeting({
      ...form,
      status: 'draft',
    });

    setShowAI(true);
    try {
      await processAI(meeting.id);
      addToast('Meeting processed successfully!', 'success');
      setShowAI(false);
      navigate(`/meetings/${meeting.id}`);
    } catch {
      addToast('Failed to process transcript', 'error');
      setShowAI(false);
    }
  };

  const charCount = form.transcript.replace(/<[^>]*>/g, '').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Meeting</h2>
        <p className="text-sm text-slate-500">Add meeting details and transcript for AI processing</p>
      </div>

      <Card>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Basic Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Meeting Title"
            value={form.title}
            onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: undefined }); }}
            error={errors.title}
            required
            placeholder="Q3 Product Roadmap Review"
            containerClassName="sm:col-span-2"
          />
          <Input
            label="Meeting Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Meeting Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              {MEETING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Participants</label>
            <div className="flex gap-2">
              <input
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
                placeholder="Add participant and press Enter"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
              <Button variant="secondary" onClick={addParticipant} type="button">Add</Button>
            </div>
            {form.participants.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.participants.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                    {p}
                    <button onClick={() => removeParticipant(p)} className="hover:text-primary-900"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Transcript Input</h3>

        <div className="flex gap-1 mb-4 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors
              ${activeTab === 'paste' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500'}`}
          >
            <FileText className="h-4 w-4" /> Paste Text
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors
              ${activeTab === 'upload' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500'}`}
          >
            <Upload className="h-4 w-4" /> File Upload
          </button>
        </div>

        {activeTab === 'paste' ? (
          <div>
            <div className="quill-editor rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
              <ReactQuill
                theme="snow"
                value={form.transcript}
                onChange={(val) => { setForm({ ...form, transcript: val }); setErrors({ ...errors, transcript: undefined }); }}
                placeholder="Paste your meeting transcript here..."
              />
            </div>
            <p className="mt-2 text-xs text-slate-400 text-right">{charCount.toLocaleString()} characters</p>
            {errors.transcript && <p className="mt-1 text-xs text-red-500">{errors.transcript}</p>}
          </div>
        ) : (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-12 dark:border-slate-600 dark:bg-slate-800/50 transition-colors hover:border-primary-400"
          >
            <Upload className="h-10 w-10 text-slate-400 mb-3" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Drag & drop your transcript file</p>
            <p className="text-xs text-slate-500 mt-1">Supports .txt, .doc, .docx, .pdf (max 5MB)</p>
            <label className="mt-4">
              <input type="file" accept=".txt,.doc,.docx,.pdf" onChange={handleFileDrop} className="hidden" />
              <span className="cursor-pointer rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
                Browse Files
              </span>
            </label>
            {file && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm dark:bg-slate-700">
                <FileText className="h-4 w-4 text-primary-600" />
                <span className="text-sm text-slate-700 dark:text-slate-300">{file.name}</span>
                <button onClick={() => { setFile(null); setForm({ ...form, transcript: '' }); }} className="text-slate-400 hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {errors.transcript && <p className="mt-2 text-xs text-red-500">{errors.transcript}</p>}
          </div>
        )}
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={() => navigate('/meetings')}>Cancel</Button>
        <Button icon={Sparkles} onClick={handleProcess} loading={processing} size="lg">
          Process with AI
        </Button>
      </div>

      <AIResultsView isOpen={showAI} onClose={() => setShowAI(false)} />
    </div>
  );
}
