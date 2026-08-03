const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    type: {
      type: String,
      enum: [
        'Client Meeting',
        'Sales Meeting',
        'Project Meeting',
        'Internal Meeting',
        'Requirement Discussion',
        'Retrospective',
        'Other',
      ],
      default: 'Internal Meeting',
    },
    participants: [{ type: String }],
    transcript: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'processed'],
      default: 'processed',
    },
    summary: {
      purpose: { type: String, default: '' },
      discussionPoints: [{ type: String, default: [] }],
      outcomes: [{ type: String, default: [] }],
      concerns: [{ type: String, default: [] }],
      nextSteps: [{ type: String, default: [] }],
    },
    decisions: [
      {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        category: { type: String, default: 'General' },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Meeting', meetingSchema);
