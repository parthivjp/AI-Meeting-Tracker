const mongoose = require('mongoose');
const Meeting = require('../models/Meeting');
const ActionItem = require('../models/ActionItem');
const { processTranscriptWithAI } = require('../utils/geminiAi');

const formatMeeting = (meeting) => {
  const doc = meeting.toObject ? meeting.toObject() : meeting;
  return {
    ...doc,
    id: doc._id?.toString() || doc.id,
    userId: doc.userId?.toString(),
    _id: undefined,
  };
};

const formatActionItem = (item, meetingTitle) => {
  const doc = item.toObject ? item.toObject() : item;
  const meetingRef = doc.meetingId;
  const title =
    meetingTitle ||
    (meetingRef && typeof meetingRef === 'object' ? meetingRef.title : undefined);

  return {
    ...doc,
    id: doc._id?.toString() || doc.id,
    meetingId:
      meetingRef && typeof meetingRef === 'object'
        ? meetingRef._id?.toString()
        : doc.meetingId?.toString?.() || doc.meetingId,
    meetingTitle: title,
    userId: doc.userId?.toString(),
    _id: undefined,
    meetingIdPopulated: undefined,
  };
};

exports.getMeetings = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = { userId: req.user.id };

    if (search && String(search).trim()) {
      const term = String(search).trim();
      filter.$or = [
        { title: { $regex: term, $options: 'i' } },
        { transcript: { $regex: term, $options: 'i' } },
        { purpose: { $regex: term, $options: 'i' } },
        { summary: { $regex: term, $options: 'i' } },
      ];
    }

    const meetings = await Meeting.find(filter).sort({ date: -1 });
    res.json(meetings.map(formatMeeting));
  } catch (error) {
    next(error);
  }
};

exports.getMeetingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid meeting id' });
    }

    const meeting = await Meeting.findOne({ _id: id, userId: req.user.id });
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const actionItems = await ActionItem.find({ meetingId: meeting._id, userId: req.user.id });
    res.json({
      meeting: formatMeeting(meeting),
      actionItems: actionItems.map((a) => formatActionItem(a, meeting.title)),
    });
  } catch (error) {
    next(error);
  }
};

exports.createMeeting = async (req, res, next) => {
  try {
    const { title, date, type, participants, transcript } = req.body;

    if (!title || !date || !transcript) {
      return res.status(400).json({
        message: 'Title, date, and transcript are required',
      });
    }

    const aiResult = await processTranscriptWithAI(transcript);

    const meeting = await Meeting.create({
      userId: req.user.id,
      title,
      date,
      type,
      participants: participants || [],
      transcript,
      status: 'processed',
      summary: aiResult.summary,
      decisions: aiResult.decisions,
      purpose: aiResult.summary?.purpose || '',
    });

    const actionDocs = [];
    for (const item of aiResult.actionItems || []) {
      const priority = ['Low', 'Medium', 'High'].includes(item.priority)
        ? item.priority
        : 'Medium';
      const created = await ActionItem.create({
        meetingId: meeting._id,
        userId: req.user.id,
        task: item.task || 'Untitled task',
        owner: item.owner || 'Unassigned',
        dueDate: item.dueDate || 'Not specified',
        priority,
      });
      actionDocs.push(created);
    }

    res.status(201).json({
      meeting: formatMeeting(meeting),
      actionItems: actionDocs.map((a) => formatActionItem(a, meeting.title)),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid meeting id' });
    }

    const allowed = [
      'title',
      'date',
      'type',
      'participants',
      'transcript',
      'status',
      'purpose',
      'summary',
      'decisions',
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const meeting = await Meeting.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    res.json(formatMeeting(meeting));
  } catch (error) {
    next(error);
  }
};

exports.deleteMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid meeting id' });
    }

    const meeting = await Meeting.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    await ActionItem.deleteMany({ meetingId: meeting._id, userId: req.user.id });
    res.json({ message: 'Meeting and associated action items deleted' });
  } catch (error) {
    next(error);
  }
};
