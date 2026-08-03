const mongoose = require('mongoose');
const ActionItem = require('../models/ActionItem');
const Meeting = require('../models/Meeting');

const formatActionItem = (item) => {
  const doc = item.toObject ? item.toObject() : item;
  const meetingRef = doc.meetingId;
  const meetingTitle =
    meetingRef && typeof meetingRef === 'object' ? meetingRef.title : undefined;
  const meetingId =
    meetingRef && typeof meetingRef === 'object'
      ? meetingRef._id?.toString()
      : doc.meetingId?.toString?.() || doc.meetingId;

  return {
    ...doc,
    id: doc._id?.toString() || doc.id,
    meetingId,
    meetingTitle,
    userId: doc.userId?.toString(),
    _id: undefined,
  };
};

const isOverdue = (dueDate, status) => {
  if (status === 'Completed') return false;
  if (!dueDate || dueDate === 'Not specified') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) return false;
  due.setHours(0, 0, 0, 0);
  return due < today;
};

const formatMeetingSummary = (meeting) => {
  const doc = meeting.toObject ? meeting.toObject() : meeting;
  return {
    id: doc._id?.toString(),
    title: doc.title,
    date: doc.date,
    type: doc.type,
    participants: doc.participants,
    purpose: doc.purpose,
    summary: doc.summary,
  };
};

exports.getActionItems = async (req, res, next) => {
  try {
    const { status, priority, owner, search } = req.query;
    const filter = { userId: req.user.id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (owner) filter.owner = { $regex: String(owner).trim(), $options: 'i' };
    if (search && String(search).trim()) {
      const term = String(search).trim();
      filter.$or = [
        { task: { $regex: term, $options: 'i' } },
        { owner: { $regex: term, $options: 'i' } },
      ];
    }

    const items = await ActionItem.find(filter)
      .populate('meetingId', 'title')
      .sort({ updatedAt: -1 });

    res.json(items.map(formatActionItem));
  } catch (error) {
    next(error);
  }
};

exports.createActionItem = async (req, res, next) => {
  try {
    const { meetingId, task, owner, dueDate, priority, status } = req.body;

    if (!meetingId || !task) {
      return res.status(400).json({ message: 'meetingId and task are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      return res.status(400).json({ message: 'Invalid meeting id' });
    }

    const meeting = await Meeting.findOne({ _id: meetingId, userId: req.user.id });
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const item = await ActionItem.create({
      meetingId,
      userId: req.user.id,
      task,
      owner: owner || 'Unassigned',
      dueDate: dueDate || 'Not specified',
      priority: priority || 'Medium',
      status: status || 'Open',
    });

    await item.populate('meetingId', 'title');
    res.status(201).json(formatActionItem(item));
  } catch (error) {
    next(error);
  }
};

exports.updateActionItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid action item id' });
    }

    const allowed = ['status', 'priority', 'owner', 'dueDate', 'task'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const item = await ActionItem.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updates,
      { new: true, runValidators: true }
    ).populate('meetingId', 'title');

    if (!item) {
      return res.status(404).json({ message: 'Action item not found' });
    }

    res.json(formatActionItem(item));
  } catch (error) {
    next(error);
  }
};

exports.deleteActionItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid action item id' });
    }

    const item = await ActionItem.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!item) {
      return res.status(404).json({ message: 'Action item not found' });
    }

    res.json({ message: 'Action item deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [totalMeetings, totalActionItems, actionItems, recentMeetings] = await Promise.all([
      Meeting.countDocuments({ userId }),
      ActionItem.countDocuments({ userId }),
      ActionItem.find({ userId }),
      Meeting.find({ userId }).sort({ date: -1 }).limit(5),
    ]);

    const openActionItems = actionItems.filter(
      (a) => a.status === 'Open' || a.status === 'In Progress' || a.status === 'Blocked'
    ).length;
    const completedActionItems = actionItems.filter((a) => a.status === 'Completed').length;
    const overdueActionItems = actionItems.filter((a) =>
      isOverdue(a.dueDate, a.status)
    ).length;

    res.json({
      totalMeetings,
      totalActionItems,
      openActionItems,
      completedActionItems,
      overdueActionItems,
      recentMeetings: recentMeetings.map(formatMeetingSummary),
    });
  } catch (error) {
    next(error);
  }
};
