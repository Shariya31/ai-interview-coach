// server/services/aiProvider.openai.js

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"; // change as needed
if (!OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set. aiProvider.openai will fail if called.");
}

// helper to call chat completions
async function openaiChat(messages, maxTokens = 700) {
  if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");
  const payload = {
    model: MODEL,
    messages,
    max_tokens: maxTokens,
    temperature: 0.2,
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${txt}`);
  }

  const data = await res.json();
  // extract assistant text concatenation
  const content = data.choices?.map(c => c.message?.content).join("\n") || "";
  return content.trim();
}

/**
 * generateQuestions({ role, skills, count })
 * Returns array: [{ id: "q-1", text: "..." }, ...]
 */
export async function generateQuestions({ role = "fullstack", skills = [], count = 5 }) {
  const skillsStr = (skills || []).join(", ") || "general";
  const system = `You are an expert technical interviewer. Produce exactly ${count} concise interview questions for a candidate. Respond in JSON: an array of objects with "id" and "text". Use domain-appropriate, practical questions. The user role: "${role}" and skills: "${skillsStr}". Keep each question short (one sentence).`;
  const messages = [{ role: "system", content: system }];

  const raw = await openaiChat(messages, 600);

  // Try to parse JSON out of the response. Fall back to heuristic split.
  try {
    const parsed = JSON.parse(raw);
    // normalize to {id, text}
    return parsed.slice(0, count).map((q, i) => ({
      id: q.id || `q-${i+1}`,
      text: q.text || String(q).slice(0, 800),
    }));
  } catch {
    // fallback: split by newline
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const qlines = lines.slice(0, count);
    return qlines.map((t, i) => ({ id: `q-${i+1}`, text: t }));
  }
}

/**
 * reviewSession(session)
 * session: { id, role, skills, questions[], answers: [{questionId, answerText}], ...}
 * Returns { summary, score, improvements: [] }
 */
export async function reviewSession(session) {
  const qAndAnswers = (session.questions || []).map((q) => {
    const ans = (session.answers || []).find(a => a.questionId === q.id);
    return { question: q.text, answer: ans?.answerText || "" };
  });

  const system = `You are a helpful technical interviewer assistant who must evaluate candidate responses. Provide:
1) a short numeric score (0-100),
2) a brief summary (2-3 sentences),
3) 3 practical, prioritized improvements (array).
Return the result strictly as JSON: { "score": number, "summary": "string", "improvements": ["...", "...", "..."] }.
Be objective and concise.`;

  const userMsg = `Role: ${session.role}. Skills: ${(session.skills || []).join(", ") || "general"}.
Evaluate the following question/answer pairs:\n\n${qAndAnswers.map((qa, i) => `${i+1}. Q: ${qa.question}\nA: ${qa.answer}`).join("\n\n")}`;

  const messages = [
    { role: "system", content: system },
    { role: "user", content: userMsg }
  ];

  const raw = await openaiChat(messages, 1000);
  try {
    const parsed = JSON.parse(raw);
    // ensure shape
    return {
      score: parsed.score ?? null,
      summary: parsed.summary ?? String(parsed).slice(0, 500),
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 10) : [],
    };
  } catch (err) {
    // fallback: return a simple mock-like structure
    return {
      score: 60,
      summary: raw.slice(0, 500),
      improvements: ["Be more specific with examples", "Include metrics and trade-offs", "Discuss alternatives"],
    };
  }
}

export default { generateQuestions, reviewSession };
