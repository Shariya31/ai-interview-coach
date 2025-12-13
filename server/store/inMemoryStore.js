import { v4 as uuidv4 } from "uuid";

const SESSIONS = {};

/**
 * createSession({ role, skills, mode })
 */
function createSession({ role, skills, mode }) {
  const id = uuidv4();
  const session = {
    id,
    role,
    skills,
    mode,
    createdAt: Date.now(),
    questions: [],
    answers: [], // { questionId, answerText, timestamp }
    review: null,
  };
  SESSIONS[id] = session;
  return session;
}

function getSession(id) {
  return SESSIONS[id] || null;
}

function addAnswer(sessionId, answer) {
  const session = getSession(sessionId);
  if (!session) throw new Error("Session not found");
  session.answers.push(answer);
  return answer;
}

/**
 * Accept an array of answers in one call.
 * answers: [{ questionId, answerText, timestamp? }]
 */
function submitAnswers(sessionId, answers = []) {
  const session = getSession(sessionId);
  if (!session) throw new Error("Session not found");

  const now = Date.now();
  const normalized = (answers || []).map((a) => ({
    questionId: a.questionId,
    answerText: a.answerText,
    timestamp: a.timestamp || now,
  }));

  // Option: dedupe by questionId (replace existing)
  for (const ans of normalized) {
    const existingIndex = session.answers.findIndex((x) => x.questionId === ans.questionId);
    if (existingIndex >= 0) {
      session.answers[existingIndex] = ans;
    } else {
      session.answers.push(ans);
    }
  }
  return session.answers;
}

export default { createSession, getSession, addAnswer, submitAnswers };
