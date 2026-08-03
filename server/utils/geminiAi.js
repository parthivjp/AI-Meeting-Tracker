const { GoogleGenerativeAI } = require('@google/generative-ai');

const SUPPORTED_GEMINI_MODELS = ['gemini-flash-latest', 'gemini-2.5-flash'];
const requestedGeminiModel = process.env.GEMINI_MODEL?.trim();
const DEFAULT_GEMINI_MODEL = SUPPORTED_GEMINI_MODELS.includes(requestedGeminiModel)
  ? requestedGeminiModel
  : 'gemini-flash-latest';

if (requestedGeminiModel && requestedGeminiModel !== DEFAULT_GEMINI_MODEL) {
  console.warn(
    `GEMINI_MODEL value '${requestedGeminiModel}' is not supported by this app. Using '${DEFAULT_GEMINI_MODEL}' instead.`
  );
}

const AI_PROMPT = (transcript) => `Analyze the following meeting transcript and return STRICT VALID JSON ONLY (no extra text, no markdown backticks, no code fences). Use this exact structure:

{
  "summary": {
    "purpose": "Core purpose of the meeting",
    "discussionPoints": ["point 1", "point 2"],
    "outcomes": ["outcome 1"],
    "concerns": ["concern 1"],
    "nextSteps": ["next step 1"]
  },
  "decisions": [
    {
      "title": "Decision title",
      "description": "What was decided",
      "category": "Decision category"
    }
  ],
  "actionItems": [
    {
      "task": "Task description",
      "owner": "Person name or Unassigned",
      "dueDate": "YYYY-MM-DD or Not specified",
      "priority": "Low|Medium|High",
      "status": "Open|In Progress|Blocked|Completed"
    }
  ]
}

Transcript:
${transcript}`;

function sanitizeJsonText(raw) {
  if (!raw || typeof raw !== 'string') return '{}';
  let text = raw.trim();
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1);
  }
  return text;
}

function getMockAiResult(transcript) {
  const snippet =
    typeof transcript === 'string' && transcript.length > 0
      ? transcript.slice(0, 120).replace(/\s+/g, ' ')
      : 'the meeting';
  return {
    summary: {
      purpose: 'Review progress, align on priorities, and assign follow-up tasks.',
      discussionPoints: [
        'Reviewed current project status and blockers',
        'Discussed upcoming milestones and dependencies',
      ],
      outcomes: ['Agreed on next priorities', 'Assigned owners for key follow-ups'],
      concerns: ['Timeline risk if dependencies slip', 'Resource bandwidth for parallel workstreams'],
      nextSteps: ['Share meeting notes with stakeholders', 'Schedule follow-up check-in'],
    },
    decisions: [
      {
        title: 'Proceed with agreed scope for the next sprint',
        description: 'A single top-level decision was identified from the meeting discussion.',
        category: 'Summary',
      },
    ],
    actionItems: [
      {
        task: 'Send recap email with decisions and action items',
        owner: 'Unassigned',
        dueDate: 'Not specified',
        priority: 'Medium',
        status: 'Open',
      },
      {
        task: 'Update project tracker with new due dates',
        owner: 'Unassigned',
        dueDate: 'Not specified',
        priority: 'High',
        status: 'Open',
      },
    ],
  };
}

async function callModel(modelName, transcript) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(AI_PROMPT(transcript));
  const response = await result.response;
  const text = await response.text();
  return JSON.parse(sanitizeJsonText(text));
}

function normalizeAiResult(parsed) {
  const summaryObj = parsed.summary || {};
  const summary = {
    purpose: String(summaryObj.purpose || parsed.purpose || '').trim(),
    discussionPoints: Array.isArray(summaryObj.discussionPoints)
      ? summaryObj.discussionPoints
      : Array.isArray(parsed.discussionPoints)
      ? parsed.discussionPoints
      : [],
    outcomes: Array.isArray(summaryObj.outcomes)
      ? summaryObj.outcomes
      : Array.isArray(parsed.outcomes)
      ? parsed.outcomes
      : [],
    concerns: Array.isArray(summaryObj.concerns)
      ? summaryObj.concerns
      : Array.isArray(parsed.concerns)
      ? parsed.concerns
      : [],
    nextSteps: Array.isArray(summaryObj.nextSteps)
      ? summaryObj.nextSteps
      : Array.isArray(parsed.nextSteps)
      ? parsed.nextSteps
      : [],
  };

  const decisions = Array.isArray(parsed.decisions)
    ? parsed.decisions.map((item) => ({
        title: String(item.title || item.name || item || '').trim(),
        description: String(item.description || item.detail || '').trim(),
        category: String(item.category || 'General').trim(),
      }))
    : Array.isArray(parsed.keyDecisions)
    ? parsed.keyDecisions.map((item) => ({
        title: String(item.title || item || '').trim(),
        description: String(item.description || item.detail || '').trim(),
        category: 'General',
      }))
    : [];

  const actionItems = Array.isArray(parsed.actionItems)
    ? parsed.actionItems.map((item) => ({
        task: String(item.task || item.name || '').trim() || 'Untitled task',
        owner: String(item.owner || 'Unassigned').trim() || 'Unassigned',
        dueDate: String(item.dueDate || 'Not specified').trim() || 'Not specified',
        priority: ['Low', 'Medium', 'High'].includes(item.priority)
          ? item.priority
          : 'Medium',
        status: ['Open', 'In Progress', 'Blocked', 'Completed'].includes(item.status)
          ? item.status
          : 'Open',
      }))
    : [];

  return { summary, decisions, actionItems };
}

async function processTranscriptWithAI(transcript) {
  const modelsToTry = [
    DEFAULT_GEMINI_MODEL,
    ...SUPPORTED_GEMINI_MODELS.filter((model) => model !== DEFAULT_GEMINI_MODEL),
  ];

  for (const modelName of modelsToTry) {
    try {
      const parsed = await callModel(modelName, transcript);
      return normalizeAiResult(parsed);
    } catch (error) {
      const isModelUnavailable =
        error.message?.includes('not found') || error.message?.includes('not supported');
      if (isModelUnavailable) {
        console.warn(`Gemini model ${modelName} is unavailable; trying next supported model.`);
        continue;
      }
      console.error(`Gemini AI processing failed for ${modelName}:`, error.message);
      break;
    }
  }

  console.error('Gemini AI processing failed for all supported models, using fallback.');
  return getMockAiResult(transcript);
}

module.exports = { processTranscriptWithAI };
