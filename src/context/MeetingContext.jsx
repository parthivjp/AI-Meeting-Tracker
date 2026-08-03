import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
  getMeetings as apiGetMeetings,
  getMeetingById as apiGetMeetingById,
  createMeeting as apiCreateMeeting,
  updateMeeting as apiUpdateMeeting,
  deleteMeeting as apiDeleteMeeting,
  getActionItems as apiGetActionItems,
  createActionItem as apiCreateActionItem,
  updateActionItem as apiUpdateActionItem,
} from '../services/api';

const MeetingContext = createContext(null);

function normalizeMeeting(meeting) {
  const summaryData = meeting.summary || {};
  const summary =
    typeof summaryData === 'string'
      ? {
          purpose: summaryData,
          discussionPoints: meeting.discussionPoints || [],
          outcomes: meeting.outcomes || [],
          concerns: meeting.concerns || [],
          nextSteps: meeting.nextSteps || [],
        }
      : {
          purpose: summaryData.purpose || meeting.purpose || '',
          discussionPoints: summaryData.discussionPoints || meeting.discussionPoints || [],
          outcomes: summaryData.outcomes || meeting.outcomes || [],
          concerns: summaryData.concerns || meeting.concerns || [],
          nextSteps: summaryData.nextSteps || meeting.nextSteps || [],
        };

  const decisions = Array.isArray(meeting.decisions)
    ? meeting.decisions
    : Array.isArray(meeting.keyDecisions)
    ? meeting.keyDecisions.map((item) => ({
        title: typeof item === 'string' ? item : item.title || item.name || '',
        description: typeof item === 'string' ? '' : item.description || item.detail || '',
        category: typeof item === 'string' ? 'General' : item.category || 'General',
      }))
    : [];

  return {
    ...meeting,
    id: meeting.id || meeting._id,
    status: meeting.status || 'processed',
    participants: meeting.participants || [],
    summary,
    decisions,
  };
}

export function MeetingProvider({ children }) {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const loadData = useCallback(async () => {
    if (!user) {
      setMeetings([]);
      setActionItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [meetingsRes, actionItemsRes] = await Promise.all([
        apiGetMeetings(),
        apiGetActionItems(),
      ]);
      setMeetings(meetingsRes || []);
      setActionItems(actionItemsRes || []);
    } catch (error) {
      console.error('Failed to load meetings or action items', error.message || error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const enrichedMeetings = useMemo(
    () =>
      meetings.map((meeting) => ({
        ...normalizeMeeting(meeting),
        actionItems: actionItems.filter((item) => item.meetingId === meeting.id),
      })),
    [meetings, actionItems]
  );

  const getMeetings = useCallback(() => enrichedMeetings, [enrichedMeetings]);

  const getMeeting = useCallback(
    (id) => enrichedMeetings.find((meeting) => meeting.id === id),
    [enrichedMeetings]
  );

  const loadMeeting = useCallback(async (id) => {
    try {
      const data = await apiGetMeetingById(id);
      const serverMeeting = {
        ...normalizeMeeting(data.meeting),
        actionItems: data.actionItems || [],
      };

      setMeetings((current) => {
        const exists = current.some((meeting) => meeting.id === id);
        if (exists) {
          return current.map((meeting) => (meeting.id === id ? serverMeeting : meeting));
        }
        return [serverMeeting, ...current];
      });

      setActionItems((current) => [
        ...current.filter((item) => item.meetingId !== id),
        ...(data.actionItems || []),
      ]);

      return serverMeeting;
    } catch (error) {
      console.error('Failed to load meeting', error.message || error);
      throw error;
    }
  }, []);

  const createMeeting = useCallback(async (body) => {
    setProcessing(true);
    setProcessingStep(0);
    const interval = setInterval(() => {
      setProcessingStep((prev) => Math.min(prev + 1, 4));
    }, 200);

    try {
      const { meeting, actionItems: newItems } = await apiCreateMeeting(body);
      const enriched = {
        ...normalizeMeeting(meeting),
        actionItems: newItems || [],
      };

      setMeetings((current) => [enriched, ...current]);
      setActionItems((current) => [...(newItems || []), ...current]);

      return enriched;
    } finally {
      clearInterval(interval);
      setProcessing(false);
      setProcessingStep(0);
    }
  }, []);

  const updateMeeting = useCallback(async (id, updates) => {
    const updatedMeeting = await apiUpdateMeeting(id, updates);
    setMeetings((current) =>
      current.map((meeting) =>
        meeting.id === id
          ? {
              ...meeting,
              ...updatedMeeting,
              participants: updatedMeeting.participants || meeting.participants || [],
              status: updatedMeeting.status || meeting.status,
            }
          : meeting
      )
    );
    return updatedMeeting;
  }, []);

  const deleteMeeting = useCallback(async (id) => {
    await apiDeleteMeeting(id);
    setMeetings((current) => current.filter((meeting) => meeting.id !== id));
    setActionItems((current) => current.filter((item) => item.meetingId !== id));
  }, []);

  const addActionItem = useCallback(async (meetingId, actionData) => {
    const created = await apiCreateActionItem({ meetingId, ...actionData });
    setActionItems((current) => [created, ...current]);
    setMeetings((current) =>
      current.map((meeting) =>
        meeting.id === meetingId
          ? { ...meeting, actionItems: [...(meeting.actionItems || []), created] }
          : meeting
      )
    );
    return created;
  }, []);

  const updateActionItem = useCallback(async (meetingId, actionId, updates) => {
    const updated = await apiUpdateActionItem(actionId, updates);
    setActionItems((current) => current.map((item) => (item.id === actionId ? updated : item)));
    setMeetings((current) =>
      current.map((meeting) =>
        meeting.id === meetingId
          ? {
              ...meeting,
              actionItems: (meeting.actionItems || []).map((item) =>
                item.id === actionId ? updated : item
              ),
            }
          : meeting
      )
    );
    return updated;
  }, []);

  const allActionItems = useMemo(() => actionItems, [actionItems]);

  const processingSteps = [
    'Connecting to AI engine...',
    'Analyzing transcript...',
    'Extracting insights...',
    'Creating action items...',
    'Finalizing notes...',
  ];

  return (
    <MeetingContext.Provider
      value={{
        meetings: enrichedMeetings,
        loading,
        setLoading,
        processing,
        processingStep,
        processingSteps,
        getMeetings,
        getMeeting,
        loadMeeting,
        createMeeting,
        updateMeeting,
        deleteMeeting,
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
