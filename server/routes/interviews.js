// server/routes/interviews.js
import express from "express";
import store from "../store/persistentStore.js";
import ai from "../services/aiProvider.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { role = "fullstack", skills = [], mode = "text" } = req.body || {};
    const session = store.createSession({ role, skills, mode });

    // Generate questions using selected provider
    const questions = await ai.generateQuestions({ role, skills, count: 5 });
    session.questions = questions;
    // save questions
    await store.submitAnswers(session.id, []); // no-op to ensure write; not strictly needed
    // Persist questions in session
    // because persistentStore createSession returned a session object reference inside db
    session.questions = questions;
    // write via saveReview or submitAnswers triggers db.write already; but to be safe:
    // (persist changes)
    // lowdb writes when we call submitAnswers or saveReview, so do a small write:
    // Let's just use saveReview with null to write the session:
    await store.saveReview(session.id, session.review);
    res.status(201).json({ sessionId: session.id, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create session" });
  }
});

router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const session = store.getSession(id);
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json({ session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch session" });
  }
});

router.post("/:id/answer", (req, res) => {
  try {
    const { id } = req.params;
    const { questionId, answerText } = req.body || {};
    const session = store.getSession(id);
    if (!session) return res.status(404).json({ error: "Session not found" });

    store.addAnswer(id, { questionId, answerText, timestamp: Date.now() });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save answer" });
  }
});

router.post("/:id/submit", async (req, res) => {
  try {
    const { id } = req.params;
    const { answers = [] } = req.body || {};
    const session = store.getSession(id);
    if (!session) return res.status(404).json({ error: "Session not found" });

    store.submitAnswers(id, answers);

    // ask AI provider to review and persist review
    const review = await ai.reviewSession(session);
    store.saveReview(id, review);

    res.json({ ok: true, review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit answers and generate review" });
  }
});

router.post("/:id/review", async (req, res) => {
  try {
    const { id } = req.params;
    const session = store.getSession(id);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const review = await ai.reviewSession(session);
    store.saveReview(id, review);
    res.json({ review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate review" });
  }
});

export default router;
