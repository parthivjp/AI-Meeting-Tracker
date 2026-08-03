import { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { ACTION_PRIORITIES } from '../../data/mockData';

export default function ActionItemModal({ isOpen, onClose, onSubmit, meetings }) {
  const [form, setForm] = useState({
    task: '',
    owner: '',
    dueDate: '',
    priority: 'Medium',
    meetingId: meetings[0]?.id || '',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.task.trim()) newErrors.task = 'Task is required';
    if (!form.owner.trim()) newErrors.owner = 'Owner is required';
    if (!form.dueDate) newErrors.dueDate = 'Due date is required';
    if (!form.meetingId) newErrors.meetingId = 'Meeting is required';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    onSubmit(form);
    setForm({ task: '', owner: '', dueDate: '', priority: 'Medium', meetingId: meetings[0]?.id || '' });
    setErrors({});
    onClose();
  };

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Action Item"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Task</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Description"
          value={form.task}
          onChange={(e) => update('task', e.target.value)}
          error={errors.task}
          required
          placeholder="Describe the action item..."
        />
        <Input
          label="Owner"
          value={form.owner}
          onChange={(e) => update('owner', e.target.value)}
          error={errors.owner}
          required
          placeholder="Assign to..."
        />
        <Input
          label="Due Date"
          type="date"
          value={form.dueDate}
          onChange={(e) => update('dueDate', e.target.value)}
          error={errors.dueDate}
          required
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => update('priority', e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            {ACTION_PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Meeting</label>
          <select
            value={form.meetingId}
            onChange={(e) => update('meetingId', e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            {meetings.map((m) => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>
          {errors.meetingId && <p className="mt-1 text-xs text-red-500">{errors.meetingId}</p>}
        </div>
      </form>
    </Modal>
  );
}
