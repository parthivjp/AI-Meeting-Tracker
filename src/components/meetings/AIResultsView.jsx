import { Loader2, CheckCircle2, Circle } from 'lucide-react';
import Modal from '../common/Modal';
import { useMeetings } from '../../context/MeetingContext';

export default function AIResultsView({ isOpen, onClose }) {
  const { processing, processingStep, processingSteps } = useMeetings();

  if (!isOpen && !processing) return null;

  return (
    <Modal isOpen={isOpen || processing} onClose={processing ? undefined : onClose} title="AI Processing" size="md">
      <div className="flex flex-col items-center py-6">
        <div className="relative mb-6">
          <Loader2 className="h-16 w-16 animate-spin text-primary-600" />
        </div>
        <p className="text-base font-medium text-slate-900 dark:text-white mb-6">
          Analyzing your meeting transcript...
        </p>
        <div className="w-full space-y-3">
          {processingSteps.map((step, i) => {
            const done = i < processingStep;
            const active = i === processingStep;
            return (
              <div key={step} className="flex items-center gap-3">
                {done ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                ) : active ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary-600 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600 shrink-0" />
                )}
                <span className={`text-sm ${done ? 'text-emerald-600 dark:text-emerald-400' : active ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
