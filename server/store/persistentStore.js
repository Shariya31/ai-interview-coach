// server/store/persistentStore.js
import { join } from "path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { v4 as uuidv4 } from "uuid";

const file = join(process.cwd(), "server-data.json");
const adapter = new JSONFile(file);

// NOTE: lowdb requires a default data argument in constructor.
// Provide the default shape so Low doesn't throw "missing default data".
const defaultData = { sessions: [] };

const db = new Low(adapter, defaultData);

// initialize/read file (creates file with defaultData if missing)
await db.read();
// ensure db.data exists (in case read returned null)
db.data = db.data || defaultData;
await db.write();

function createSession({ role, skills, mode }) {
  const id = uuidv4();
  const session = {
    id,
    role,
    skills,
    mode,
    createdAt: Date.now(),
    questions: [],
    answers: [],
    review: null,
  };
  db.data.sessions.push(session);
  db.write();
  return session;
}

function getSession(id) {
  return db.data.sessions.find((s) => s.id === id) || null;
}

function addAnswer(sessionId, answer) {
  const session = getSession(sessionId);
  if (!session) throw new Error("Session not found");
  session.answers.push(answer);
  db.write();
  return answer;
}

function submitAnswers(sessionId, answers = []) {
  const session = getSession(sessionId);
  if (!session) throw new Error("Session not found");

  const now = Date.now();
  for (const a of answers) {
    const normalized = {
      questionId: a.questionId,
      answerText: a.answerText,
      timestamp: a.timestamp || now,
    };
    const existingIndex = session.answers.findIndex((x) => x.questionId === normalized.questionId);
    if (existingIndex >= 0) session.answers[existingIndex] = normalized;
    else session.answers.push(normalized);
  }
  db.write();
  return session.answers;
}

function saveReview(sessionId, review) {
  const session = getSession(sessionId);
  if (!session) throw new Error("Session not found");
  session.review = review;
  db.write();
  return session.review;
}

export default { createSession, getSession, addAnswer, submitAnswers, saveReview };
