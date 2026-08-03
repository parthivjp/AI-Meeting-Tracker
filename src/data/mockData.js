const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};
const daysFromNow = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

export const MEETING_TYPES = [
  'Client Meeting',
  'Sales Meeting',
  'Project Meeting',
  'Internal Meeting',
  'Requirement Discussion',
  'Retrospective',
  'Other',
];

export const ACTION_STATUSES = ['Open', 'In Progress', 'Blocked', 'Completed'];
export const ACTION_PRIORITIES = ['Low', 'Medium', 'High'];

export const MOCK_USERS = [
  { id: 'u1', name: 'Sarah Chen', email: 'sarah@meetai.com', avatar: 'SC' },
  { id: 'u2', name: 'Marcus Johnson', email: 'marcus@meetai.com', avatar: 'MJ' },
  { id: 'u3', name: 'Emily Rodriguez', email: 'emily@meetai.com', avatar: 'ER' },
  { id: 'u4', name: 'David Kim', email: 'david@meetai.com', avatar: 'DK' },
];

export const initialMeetings = [
  {
    id: 'm1',
    title: 'Q3 Product Roadmap Review',
    date: daysAgo(2),
    type: 'Project Meeting',
    participants: ['Sarah Chen', 'Marcus Johnson', 'Emily Rodriguez', 'David Kim'],
    status: 'processed',
    summary: {
      purpose: 'Review and finalize the Q3 product roadmap, align on priorities, and assign ownership for key initiatives.',
      discussionPoints: [
        'Mobile app v2.0 launch timeline pushed to September due to API dependency',
        'AI transcript feature received positive beta feedback from 12 enterprise clients',
        'Need to prioritize action item tracking over calendar integration for Q3',
        'Budget allocation for additional ML engineers discussed',
      ],
      outcomes: [
        'Approved Q3 roadmap with 4 major features',
        'Agreed to hire 2 additional ML engineers',
        'Mobile v2.0 launch date set for September 15',
      ],
      concerns: [
        'API team bandwidth may delay mobile launch',
        'Competitor launched similar AI feature last week',
        'Customer churn risk if action tracking delayed beyond Q3',
      ],
      nextSteps: [
        'Sarah to finalize feature specs by end of week',
        'Marcus to begin ML engineer hiring process',
        'Emily to update project timeline in Jira',
      ],
    },
    decisions: [
      { id: 'd1', title: 'Technology Stack', description: 'Continue with React + Node.js for frontend; evaluate Python for ML pipeline', category: 'Technology' },
      { id: 'd2', title: 'Launch Timeline', description: 'Mobile v2.0 launch moved to September 15, 2026', category: 'Timeline' },
      { id: 'd3', title: 'Scope Change', description: 'Defer calendar integration to Q4; prioritize action item tracker', category: 'Scope' },
      { id: 'd4', title: 'Resource Allocation', description: 'Approve budget for 2 ML engineer hires', category: 'Budget' },
    ],
    actionItems: [
      { id: 'a1', task: 'Finalize Q3 feature specifications document', owner: 'Sarah Chen', dueDate: daysFromNow(3), priority: 'High', status: 'In Progress', meetingId: 'm1', meetingTitle: 'Q3 Product Roadmap Review' },
      { id: 'a2', task: 'Post ML engineer job listings on LinkedIn and Indeed', owner: 'Marcus Johnson', dueDate: daysFromNow(5), priority: 'High', status: 'Open', meetingId: 'm1', meetingTitle: 'Q3 Product Roadmap Review' },
      { id: 'a3', task: 'Update Jira project timeline with new launch dates', owner: 'Emily Rodriguez', dueDate: daysAgo(1), priority: 'Medium', status: 'Open', meetingId: 'm1', meetingTitle: 'Q3 Product Roadmap Review' },
      { id: 'a4', task: 'Prepare competitive analysis report on AI features', owner: 'David Kim', dueDate: daysFromNow(7), priority: 'Medium', status: 'Open', meetingId: 'm1', meetingTitle: 'Q3 Product Roadmap Review' },
    ],
    transcript: `Meeting: Q3 Product Roadmap Review
Date: ${daysAgo(2)}
Participants: Sarah Chen, Marcus Johnson, Emily Rodriguez, David Kim

Sarah Chen: Good morning everyone. Let's dive into our Q3 roadmap review. I've prepared the feature priority matrix based on last month's customer feedback.

Marcus Johnson: Thanks Sarah. Before we start, I want to flag that our API team is at capacity. The mobile v2.0 launch might need to shift.

Emily Rodriguez: The beta feedback on our AI transcript feature has been overwhelmingly positive. Twelve enterprise clients rated it 4.5+ stars.

David Kim: We should discuss the competitive landscape. A major competitor launched a similar AI meeting feature last week.

Sarah Chen: Given the API constraints, I propose we prioritize the action item tracker over calendar integration for Q3. The beta users specifically requested better task tracking.

Marcus Johnson: Agreed. I'll start the hiring process for two ML engineers to support the AI pipeline scaling.

Emily Rodriguez: I'll update the Jira timeline today. Can we confirm September 15 for mobile v2.0?

Sarah Chen: Yes, let's lock in September 15. David, can you prepare a competitive analysis by next week?

David Kim: Will do. I'll have the report ready by Friday next week.

Marcus Johnson: One concern — if we delay action tracking beyond Q3, we risk losing the enterprise clients who signed up for the beta.

Sarah Chen: Understood. Action items are our top priority. Let's adjourn and reconvene next week for progress updates.`,
    createdAt: daysAgo(2),
  },
  {
    id: 'm2',
    title: 'Acme Corp — Enterprise Demo',
    date: daysAgo(5),
    type: 'Sales Meeting',
    participants: ['Sarah Chen', 'Marcus Johnson', 'John Smith (Acme)'],
    status: 'processed',
    summary: {
      purpose: 'Demonstrate MeetAI platform capabilities to Acme Corp enterprise team and discuss integration requirements.',
      discussionPoints: [
        'Demonstrated AI transcript processing and action item extraction',
        'Acme requires SSO integration with Okta',
        'Need for custom reporting dashboard highlighted',
        'Pricing discussion for 500-seat enterprise license',
      ],
      outcomes: [
        'Acme expressed strong interest in 500-seat license',
        'Technical POC scheduled for next month',
        'Custom SLA requirements documented',
      ],
      concerns: [
        'Okta SSO integration not yet available',
        'Acme needs GDPR compliance documentation',
      ],
      nextSteps: [
        'Send enterprise pricing proposal',
        'Schedule technical POC with Acme IT team',
        'Prepare GDPR compliance documentation',
      ],
    },
    decisions: [
      { id: 'd5', title: 'POC Timeline', description: 'Technical proof-of-concept scheduled for 3 weeks from today', category: 'Timeline' },
      { id: 'd6', title: 'License Size', description: 'Initial discussion centered on 500-seat enterprise license', category: 'Commercial' },
    ],
    actionItems: [
      { id: 'a5', task: 'Send enterprise pricing proposal to John Smith', owner: 'Marcus Johnson', dueDate: daysAgo(3), priority: 'High', status: 'Completed', meetingId: 'm2', meetingTitle: 'Acme Corp — Enterprise Demo' },
      { id: 'a6', task: 'Schedule Okta SSO integration POC with Acme IT', owner: 'Sarah Chen', dueDate: daysFromNow(2), priority: 'High', status: 'In Progress', meetingId: 'm2', meetingTitle: 'Acme Corp — Enterprise Demo' },
      { id: 'a7', task: 'Prepare GDPR compliance documentation package', owner: 'Emily Rodriguez', dueDate: daysFromNow(10), priority: 'Medium', status: 'Open', meetingId: 'm2', meetingTitle: 'Acme Corp — Enterprise Demo' },
    ],
    transcript: `Meeting: Acme Corp Enterprise Demo
Date: ${daysAgo(5)}
Participants: Sarah Chen, Marcus Johnson, John Smith (Acme Corp)

Marcus Johnson: Welcome John. Today we'll walk through our AI-powered meeting platform and how it can transform Acme's meeting workflows.

John Smith: We're currently using manual note-taking across 500 employees. The action item tracking is our biggest pain point.

Sarah Chen: Let me demonstrate our AI processing pipeline. I'll paste a sample transcript and show real-time extraction...

[Demo of transcript processing and action item extraction]

John Smith: Impressive. We need Okta SSO integration though. That's non-negotiable for our security team.

Marcus Johnson: SSO is on our Q3 roadmap. We can include it in a custom enterprise SLA.

John Smith: What about GDPR compliance? We have EU teams that need data residency options.

Sarah Chen: We have GDPR documentation ready. Emily will send the full compliance package.

Marcus Johnson: For a 500-seat license, I'll prepare a custom pricing proposal by end of week.

John Smith: Let's schedule a technical POC with our IT team. I'm very interested in moving forward.`,
    createdAt: daysAgo(5),
  },
  {
    id: 'm3',
    title: 'Sprint 24 Retrospective',
    date: daysAgo(7),
    type: 'Retrospective',
    participants: ['Emily Rodriguez', 'David Kim', 'Sarah Chen'],
    status: 'processed',
    summary: {
      purpose: 'Reflect on Sprint 24 performance, identify improvements, and plan action items for Sprint 25.',
      discussionPoints: [
        'Successfully shipped dark mode and improved dashboard UX',
        'Test coverage dropped to 72% — below 80% target',
        'Deployment pipeline had 2 incidents due to missing rollback scripts',
        'Team morale high despite tight deadline pressure',
      ],
      outcomes: [
        'Agreed to mandatory code review for all PRs',
        'Test coverage gate set at 80% for Sprint 25',
        'Rollback automation to be prioritized',
      ],
      concerns: [
        'Burnout risk if sprint velocity maintained at current pace',
        'Knowledge silos forming around AI pipeline code',
      ],
      nextSteps: [
        'Implement test coverage CI gate',
        'Create rollback runbook and automate',
        'Schedule pair programming sessions for AI module',
      ],
    },
    decisions: [
      { id: 'd7', title: 'Code Review Policy', description: 'All PRs require minimum 1 approval before merge', category: 'Process' },
      { id: 'd8', title: 'Quality Gate', description: '80% test coverage required for Sprint 25 merges', category: 'Quality' },
    ],
    actionItems: [
      { id: 'a8', task: 'Implement 80% test coverage CI gate in GitHub Actions', owner: 'David Kim', dueDate: daysAgo(2), priority: 'High', status: 'Blocked', meetingId: 'm3', meetingTitle: 'Sprint 24 Retrospective' },
      { id: 'a9', task: 'Write and automate deployment rollback runbook', owner: 'Emily Rodriguez', dueDate: daysFromNow(4), priority: 'High', status: 'Open', meetingId: 'm3', meetingTitle: 'Sprint 24 Retrospective' },
      { id: 'a10', task: 'Schedule weekly pair programming for AI pipeline module', owner: 'Sarah Chen', dueDate: daysFromNow(1), priority: 'Low', status: 'Completed', meetingId: 'm3', meetingTitle: 'Sprint 24 Retrospective' },
    ],
    transcript: `Meeting: Sprint 24 Retrospective
Date: ${daysAgo(7)}
Participants: Emily Rodriguez, David Kim, Sarah Chen

Emily Rodriguez: Let's start with what went well. We shipped dark mode and the new dashboard — great work team!

David Kim: The UX improvements got positive feedback in our internal Slack. However, test coverage dropped to 72%.

Sarah Chen: We had two deployment incidents because we lacked automated rollback scripts. That's a process gap we need to fix.

Emily Rodriguez: I propose mandatory code review for all PRs going forward. No exceptions.

David Kim: Agreed. I'll implement an 80% test coverage gate in our CI pipeline for Sprint 25.

Sarah Chen: We should also do pair programming on the AI module. Knowledge silos are forming and that's risky.

Emily Rodriguez: I'll write the rollback runbook this week and automate what we can.

David Kim: One concern — if we maintain this velocity, burnout is a real risk. We might need to adjust Sprint 25 capacity.

Sarah Chen: Good point. Let's discuss capacity planning in our next planning session.`,
    createdAt: daysAgo(7),
  },
  {
    id: 'm4',
    title: 'Mobile App UX Requirements',
    date: daysAgo(1),
    type: 'Requirement Discussion',
    participants: ['Sarah Chen', 'Emily Rodriguez'],
    status: 'processed',
    summary: {
      purpose: 'Define UX requirements and user flows for the mobile app v2.0 release.',
      discussionPoints: [
        'Offline transcript sync capability required',
        'Push notifications for overdue action items',
        'Biometric authentication for enterprise security',
        'Simplified 3-tab navigation: Home, Meetings, Actions',
      ],
      outcomes: [
        'UX wireframes approved for 3-tab navigation',
        'Offline sync scoped for MVP; full sync in v2.1',
        'Push notifications included in v2.0 scope',
      ],
      concerns: [
        'Offline sync adds significant complexity to MVP timeline',
      ],
      nextSteps: [
        'Emily to create high-fidelity mockups in Figma',
        'Sarah to review technical feasibility of offline sync',
      ],
    },
    decisions: [
      { id: 'd9', title: 'Navigation Pattern', description: '3-tab navigation: Home, Meetings, Actions', category: 'UX' },
      { id: 'd10', title: 'Offline Scope', description: 'Basic offline transcript viewing in v2.0; full sync deferred to v2.1', category: 'Scope' },
    ],
    actionItems: [
      { id: 'a11', task: 'Create high-fidelity Figma mockups for mobile v2.0', owner: 'Emily Rodriguez', dueDate: daysFromNow(6), priority: 'Medium', status: 'In Progress', meetingId: 'm4', meetingTitle: 'Mobile App UX Requirements' },
      { id: 'a12', task: 'Technical feasibility assessment for offline transcript sync', owner: 'Sarah Chen', dueDate: daysFromNow(3), priority: 'High', status: 'Open', meetingId: 'm4', meetingTitle: 'Mobile App UX Requirements' },
    ],
    transcript: `Meeting: Mobile App UX Requirements
Date: ${daysAgo(1)}
Participants: Sarah Chen, Emily Rodriguez

Sarah Chen: Let's define the UX requirements for mobile v2.0. What's the minimum viable experience?

Emily Rodriguez: I'm thinking a clean 3-tab layout: Home, Meetings, and Actions. Users should see their urgent tasks immediately on the home screen.

Sarah Chen: Enterprise clients want biometric auth and push notifications for overdue items. Both should be in v2.0.

Emily Rodriguez: Offline transcript viewing is frequently requested. Can we scope basic offline for MVP?

Sarah Chen: Basic offline viewing yes, but full sync should wait for v2.1. It adds too much complexity for September.

Emily Rodriguez: I'll start the Figma mockups this week. Can you assess offline sync feasibility?

Sarah Chen: I'll have a technical assessment ready by Thursday.`,
    createdAt: daysAgo(1),
  },
];

export const DEMO_CREDENTIALS = {
  email: 'sarah@meetai.com',
  password: 'demo1234',
};

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function getAllActionItems(meetings) {
  return meetings.flatMap((m) =>
    (m.actionItems || []).map((a) => ({
      ...a,
      meetingId: m.id,
      meetingTitle: m.title,
    }))
  );
}

export function isOverdue(dueDate, status) {
  if (status === 'Completed') return false;
  return new Date(dueDate) < new Date(today.toISOString().split('T')[0]);
}

export function getDashboardStats(meetings) {
  const actions = getAllActionItems(meetings);
  const open = actions.filter((a) => a.status === 'Open' || a.status === 'In Progress' || a.status === 'Blocked');
  const completed = actions.filter((a) => a.status === 'Completed');
  const overdue = actions.filter((a) => isOverdue(a.dueDate, a.status));
  const recentMeetings = meetings.filter((m) => {
    const diff = (today - new Date(m.date)) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });

  return {
    totalMeetings: meetings.length,
    totalActions: actions.length,
    openActions: open.length,
    completedActions: completed.length,
    overdueActions: overdue.length,
    recentMeetingsCount: recentMeetings.length,
  };
}

export function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function simulateAIProcessing(transcript, meetingData) {
  const plainText = stripHtml(transcript);
  const words = plainText.split(/\s+/).filter(Boolean).length;
  const actionCount = Math.min(Math.max(Math.floor(words / 80), 2), 6);
  const owners = meetingData.participants.slice(0, 4);

  const sampleTasks = [
    'Follow up on discussed action items',
    'Send meeting summary to all participants',
    'Update project timeline based on decisions',
    'Schedule follow-up meeting',
    'Prepare documentation for agreed changes',
    'Review and assign open tasks',
  ];

  const actionItems = Array.from({ length: actionCount }, (_, i) => ({
    id: generateId('a'),
    task: sampleTasks[i % sampleTasks.length],
    owner: owners[i % owners.length],
    dueDate: daysFromNow(3 + i * 2),
    priority: ['Low', 'Medium', 'High'][i % 3],
    status: 'Open',
  }));

  return {
    summary: {
      purpose: `AI-generated summary for "${meetingData.title}". The meeting covered key topics discussed in the transcript with ${words} words analyzed.`,
      discussionPoints: [
        'Key topics extracted from the meeting transcript',
        'Participants discussed project priorities and timelines',
        'Several decisions were made regarding next steps',
        'Action items identified for follow-up',
      ],
      outcomes: [
        'Meeting objectives addressed during the session',
        'Clear next steps established for the team',
      ],
      concerns: [
        'Some items require further clarification in follow-up sessions',
      ],
      nextSteps: [
        'Review extracted action items and assign owners',
        'Schedule follow-up meeting if needed',
        'Distribute meeting summary to participants',
      ],
    },
    decisions: [
      { id: generateId('d'), title: 'Primary Decision', description: 'Key decision extracted from meeting discussion', category: 'General' },
      { id: generateId('d'), title: 'Timeline Agreement', description: 'Timeline and milestones discussed and agreed upon', category: 'Timeline' },
    ],
    actionItems: actionItems.map((a) => ({
      ...a,
      meetingId: meetingData.id,
      meetingTitle: meetingData.title,
    })),
  };
}
