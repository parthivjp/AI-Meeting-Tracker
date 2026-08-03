import { useState } from 'react';
import { FileText, Sparkles, ListChecks, ScrollText } from 'lucide-react';
import Card from '../common/Card';
import { PriorityBadge } from '../common/Badge';
import { useMeetings } from '../../context/MeetingContext';
import { useToast } from '../common/Toast';
import { ACTION_STATUSES } from '../../data/mockData';

const tabs = [
  { id: 'summary', label: 'AI Summary', icon: Sparkles },
  { id: 'decisions', label: 'Key Decisions', icon: FileText },
  { id: 'actions', label: 'Action Items', icon: ListChecks },
  { id: 'transcript', label: 'Transcript', icon: ScrollText },
];

export default function TranscriptTabs({ meeting }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [plainText, setPlainText] = useState(true);
  const { updateActionItem } = useMeetings();
  const { addToast } = useToast();

  const handleStatusChange = (actionId, status) => {
    updateActionItem(meeting.id, actionId, { status });
    addToast('Task status updated', 'success');
  };

  const copyTranscript = () => {
    navigator.clipboard.writeText(meeting.transcript || '');
    addToast('Transcript copied to clipboard', 'success');
  };

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-700 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
              ${activeTab === id
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'summary' && meeting.summary && (
        <div className="space-y-6 animate-fade-in">
          <Section title="Purpose of Meeting" content={meeting.summary.purpose} />
          <Section title="Important Discussion Points" list={meeting.summary.discussionPoints} />
          <Section title="Major Outcomes" list={meeting.summary.outcomes} />
          <Section title="Important Concerns / Risks" list={meeting.summary.concerns} alert />
          <Section title="Next Steps" list={meeting.summary.nextSteps} />
        </div>
      )}

      {activeTab === 'decisions' && (
        <div className="grid gap-4 sm:grid-cols-2 animate-fade-in">
          {(meeting.decisions || []).map((d) => (
            <Card key={d.id} hover>
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{d.category}</span>
              <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{d.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{d.description}</p>
            </Card>
          ))}
          {!meeting.decisions?.length && <EmptyTab message="No decisions extracted yet" />}
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="animate-fade-in">
          {(meeting.actionItems || []).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 text-left font-medium text-slate-500">Task</th>
                    <th className="py-3 text-left font-medium text-slate-500 hidden sm:table-cell">Owner</th>
                    <th className="py-3 text-left font-medium text-slate-500 hidden md:table-cell">Due Date</th>
                    <th className="py-3 text-left font-medium text-slate-500">Priority</th>
                    <th className="py-3 text-left font-medium text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {meeting.actionItems.map((a) => (
                    <tr key={a.id} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="py-3 font-medium text-slate-900 dark:text-white">{a.task}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400 hidden sm:table-cell">{a.owner}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400 hidden md:table-cell">{a.dueDate}</td>
                      <td className="py-3"><PriorityBadge priority={a.priority} /></td>
                      <td className="py-3">
                        <select
                          value={a.status}
                          onChange={(e) => handleStatusChange(a.id, e.target.value)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        >
                          {ACTION_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyTab message="No action items extracted yet" />
          )}
        </div>
      )}

      {activeTab === 'transcript' && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlainText(true)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${plainText ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                Plain Text
              </button>
              <button
                onClick={() => setPlainText(false)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${!plainText ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                Formatted
              </button>
            </div>
            <button
              onClick={copyTranscript}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
          <Card className="max-h-[500px] overflow-y-auto">
            {plainText ? (
              <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                {meeting.transcript || 'No transcript available'}
              </pre>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {(meeting.transcript || '').split('\n').map((line, i) => (
                  <p key={i} className="text-sm text-slate-700 dark:text-slate-300 mb-2">{line}</p>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

function Section({ title, content, list, alert = false }) {
  return (
    <div>
      <h3 className={`text-sm font-semibold mb-2 ${alert ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
        {title}
      </h3>
      {content && <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{content}</p>}
      {list && (
        <ul className="space-y-1.5">
          {list.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${alert ? 'bg-red-400' : 'bg-primary-400'}`} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyTab({ message }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-2" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
