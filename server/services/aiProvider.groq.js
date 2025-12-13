import Groq from "groq-sdk";
import { extractJson } from "../utils/extractJson";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

if (!GROQ_API_KEY) {
  console.warn("GROQ_API_KEY is not set. aiProvider.groq will fail if called.");
}

const groq = new Groq({ apiKey: GROQ_API_KEY });

function cleanJson(raw) {
  return raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

async function groqChat(messages, maxTokens = 700) {
  if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY not configured");

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.2,
    });

    return (
      completion.choices?.map((c) => c.message?.content).join("\n") || ""
    ).trim();
  } catch (err) {
    console.error("Groq API error:", err.message);
    throw new Error("AI provider failed");
  }
}

export async function generateQuestions({
  role = "fullstack",
  skills = [],
  count = 5,
}) {
  const system = `You are an expert technical interviewer.
Produce exactly ${count} concise interview questions.
Respond ONLY with valid JSON.
Do NOT include markdown, code fences, or explanations.
[{ "id": "q-1", "text": "..." }].
Role: "${role}".
Skills: "${skills.join(", ") || "general"}".
One sentence per question.`;

  const raw = await groqChat([{ role: "system", content: system }], 600);

  try {
    const parsed = JSON.parse(cleanJson(raw));
    return parsed.map((q, i) => ({
      id: q.id || `q-${i + 1}`,
      text: q.text,
    }));
  } catch {
    return raw
      .split(/\r?\n/)
      .filter(Boolean)
      .slice(0, count)
      .map((t, i) => ({
        id: `q-${i + 1}`,
        text: t,
      }));
  }
}

export async function reviewSession(session) {
  const raw = await groqChat(messages, 1000);

  try {
    const parsed = JSON.parse(extractJson(raw));
    return {
      score: parsed.score ?? null,
      summary: parsed.summary ?? "",
      improvements: Array.isArray(parsed.improvements)
        ? parsed.improvements
        : [],
    };
  } catch (err) {
    console.error("Failed to parse AI response:", raw);
    return {
      score: 60,
      summary: raw.slice(0, 500),
      improvements: [
        "Provide clearer examples",
        "Explain trade-offs",
        "Structure answers better",
      ],
    };
  }
}


export default { generateQuestions, reviewSession };
