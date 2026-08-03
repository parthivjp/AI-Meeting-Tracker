import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  initialMeetings,
  generateId,
  simulateAIProcessing,
  getAllActionItems,
} from '../data/mockData';

const MeetingContext = createContext(null);

export function MeetingProvider({ children }) {
  const [meetings, setMeetings] = useState(() => {
    const saved = localStorage.getItem('meetai_meetings');
    return saved ? JSON.parse(saved) : initialMeetings;
  });
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const persist = useCallback((updated) => {
    setMeetings(updated);
    localStorage.setItem('meetai_meetings', JSON.stringify(updated));
  }, []);

  const getMeetings = useCallback(() => meetings, [meetings]);

  const getMeeting = useCallback(
    (id) => meetings.find((m) => m.id === id),
    [meetings]
  );

  const createMeeting = useCallback(
    (data) => {
      const meeting = {
        id: generateId('m'),
        ...data,
        status: data.status || 'draft',
        createdAt: new Date().toISOString().split('T')[0],
        summary: data.summary || null,
        decisions: data.decisions || [],
        actionItems: data.actionItems || [],
      };
      persist([meeting, ...meetings]);
      return meeting;
    },
    [meetings, persist]
  );

  const updateMeeting = useCallback(
    (id, updates) => {
      const updated = meetings.map((m) => (m.id === id ? { ...m, ...updates } : m));
      persist(updated);
      return updated.find((m) => m.id === id);
    },
    [meetings, persist]
  );

  const deleteMeeting = useCallback(
    (id) => {
      persist(meetings.filter((m) => m.id !== id));
    },
    [meetings, persist]
  );

  const processAI = useCallback(
    async (meetingId) => {
      const meeting = meetings.find((m) => m.id === meetingId);
      if (!meeting) return null;

      setProcessing(true);
      setProcessingStep(0);

      const steps = [
        'Parsing transcript...',
        'Extracting key decisions...',
        'Identifying action items...',
        'Assigning action item owners...',
        'Generating executive summary...',
      ];

      for (let i = 0; i < steps.length; i++) {
        setProcessingStep(i);
        await new Promise((r) => setTimeout(r, 600));
      }

      const aiResults = simulateAIProcessing(meeting.transcript || '', meeting);
      const updated = updateMeeting(meetingId, {
        status: 'processed',
        summary: aiResults.summary,
        decisions: aiResults.decisions,
        actionItems: aiResults.actionItems.map((a) => ({
          ...a,
          meetingId,
          meetingTitle: meeting.title,
        })),
      });

      setProcessing(false);
      setProcessingStep(0);
      return updated;
    },
    [meetings, updateMeeting]
  );

  const updateActionItem = useCallback(
    (meetingId, actionId, updates) => {
      const meeting = meetings.find((m) => m.id === meetingId);
      if (!meeting) return;

      const actionItems = meeting.actionItems.map((a) =>
        a.id === actionId ? { ...a, ...updates } : a
      );
      updateMeeting(meetingId, { actionItems });
    },
    [meetings, updateMeeting]
  );

  const addActionItem = useCallback(
    (meetingId, actionData) => {
      const meeting = meetings.find((m) => m.id === meetingId);
      if (!meeting) return;

      const newAction = {
        id: generateId('a'),
        status: 'Open',
        priority: 'Medium',
        ...actionData,
        meetingId,
        meetingTitle: meeting.title,
      };
      updateMeeting(meetingId, {
        actionItems: [...(meeting.actionItems || []), newAction],
      });
      return newAction;
    },
    [meetings, updateMeeting]
  );

  const allActionItems = useMemo(() => getAllActionItems(meetings), [meetings]);

  const processingSteps = [
    'Parsing transcript...',
    'Extracting key decisions...',
    'Identifying action items...',
    'Assigning action item owners...',
    'Generating executive summary...',
  ];

  return (
    <MeetingContext.Provider
      value={{
        meetings,
        loading,
        setLoading,
        processing,
        processingStep,
        processingSteps,
        getMeetings,
        getMeeting,
        createMeeting,
        updateMeeting,
        deleteMeeting,
        processAI,
        updateActionItem,
        addActionItem,
        allActionItems,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

export function useMeetings() {
  const ctx = useContext(MeetingContext);
  if (!ctx) throw new Error('useMeetings must be used within MeetingProvider');
  return ctx;
}
