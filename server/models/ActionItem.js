const mongoose = require('mongoose');

const actionItemSchema = new mongoose.Schema(
  {
    meetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meeting',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    task: { type: String, required: true },
    owner: { type: String, default: 'Unassigned' },
    dueDate: { type: String, default: 'Not specified' },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Blocked', 'Completed'],
      default: 'Open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActionItem', actionItemSchema);
