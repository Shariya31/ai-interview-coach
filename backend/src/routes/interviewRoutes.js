// backend/src/routes/interviewRoutes.js
import express from 'express';
const router = express.Router();

// Very small in-memory session store for Phase 1
const sessions = {}; // { sessionId: { id, domain, skills, experienceYears, questions, answers } }

// Sample frontend questions (8)
const sampleQuestions = [
  { id: 'q1', text: 'Explain the Virtual DOM in React and why it improves performance.', difficulty: 'easy', type: 'conceptual' },
  { id: 'q2', text: 'Controlled vs uncontrolled components — differences and when to use each.', difficulty: 'easy', type: 'conceptual' },
  { id: 'q3', text: 'Explain useEffect — dependency array and common pitfalls.', difficulty: 'easy', type: 'conceptual' },
  { id: 'q4', text: 'How does React reconcile changes?', difficulty: 'medium', type: 'conceptual' },
  { id: 'q5', text: 'List techniques to optimize list rendering in React.', difficulty: 'medium', type: 'tooling' },
  { id: 'q6', text: 'Write a debounce function in JS (explain what it does).', difficulty: 'medium', type: 'coding' },
  { id: 'q7', text: 'How would you architect a large React app for scaling and code-splitting?', difficulty: 'hard', type: 'architecture' },
  { id: 'q8', text: 'Explain event delegation and React synthetic events.', difficulty: 'hard', type: 'conceptual' },
];

// POST /api/interviews/generate
// body: { domain, skills: [], experienceYears }
router.post('/generate', (req, res) => {
  const { domain = 'frontend', skills = [], experienceYears = 0 } = req.body || {};
  const sessionId = `s_${Math.random().toString(36).slice(2,9)}`;
  const questions = sampleQuestions; // Phase1: static set
  sessions[sessionId] = { id: sessionId, domain, skills, experienceYears, questions, answers: [] };
  res.json({ sessionId, questions });
});

// POST /api/interviews/:id/answer
// body: { questionId, answerText }
// Phase 1 behaviour change: store the answer, do NOT return feedback yet
router.post('/:id/answer', (req, res) => {
  const { id } = req.params;
  const { questionId, answerText = '' } = req.body || {};
  const session = sessions[id];
  if (!session) return res.status(404).json({ error: 'Session not found' });

  // store the answer (no feedback yet)
  const entry = { questionId, answerText, createdAt: new Date().toISOString() };
  session.answers.push(entry);

  res.json({ ok: true, message: 'Answer received' });
});

// POST /api/interviews/:id/finish
// compute mock feedback for all submitted answers and return aggregated report
router.post('/:id/finish', (req, res) => {
  const { id } = req.params;
  const session = sessions[id];
  if (!session) return res.status(404).json({ error: 'Session not found' });

  // Build feedback per question using a simple heuristic based on answer length and examples
  const perQuestionFeedback = session.questions.map((q) => {
    const ansObj = session.answers.find(a => a.questionId === q.id) || { answerText: '' };
    const answerText = (ansObj.answerText || '').trim();
    const len = answerText.length;

    const correctness = Math.min(5, Math.floor(len / 60)); // 0..5
    const depth = Math.min(5, Math.floor(len / 70));
    const clarity = Math.min(5, Math.ceil(len / 80));
    const use_of_examples = (answerText.includes('`') || answerText.includes('function') || answerText.includes('=>')) ? 5 : Math.min(5, Math.floor(len / 100));
    const total = correctness + depth + clarity + use_of_examples; // max 20

    return {
      questionId: q.id,
      questionText: q.text,
      answerText,
      feedback: {
        correctness,
        depth,
        clarity,
        use_of_examples,
        total,
        summary: 'Mock feedback (Phase 1): heuristic-based. Will be replaced with LLM evaluation in Phase 2.',
        improvements: [
          'Add a concise code example (if relevant).',
          'Mention trade-offs or edge-cases.',
          'Structure answer: short intro → details → example → conclusion.'
        ],
        model_answer: 'A model answer would explain the concept, show a short code example, and mention common pitfalls.'
      }
    };
  });

  // Aggregate totals
  const totals = perQuestionFeedback.reduce((acc, item) => {
    acc.correctness += item.feedback.correctness;
    acc.depth += item.feedback.depth;
    acc.clarity += item.feedback.clarity;
    acc.use_of_examples += item.feedback.use_of_examples;
    acc.total += item.feedback.total;
    return acc;
  }, { correctness: 0, depth: 0, clarity: 0, use_of_examples: 0, total: 0 });

  const questionsCount = session.questions.length;
  // average per-question (round)
  const average = {
    correctness: Math.round(totals.correctness / questionsCount),
    depth: Math.round(totals.depth / questionsCount),
    clarity: Math.round(totals.clarity / questionsCount),
    use_of_examples: Math.round(totals.use_of_examples / questionsCount),
    total: Math.round(totals.total / questionsCount), // avg out of 20
  };

  const finalReport = {
    sessionId: session.id,
    domain: session.domain,
    skills: session.skills,
    experienceYears: session.experienceYears,
    perQuestion: perQuestionFeedback,
    averages: average,
    overallSummary: `Mock overall score (avg per question): ${average.total} / 20. Use the per-question feedback for specifics.`
  };

  // optional: mark session finished (you can inspect sessions later)
  session.finishedAt = new Date().toISOString();
  session.report = finalReport;

  res.json(finalReport);
});

// GET /api/interviews/:id -> return session (including answers if any)
router.get('/:id', (req, res) => {
  const session = sessions[req.params.id];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

export default router;
