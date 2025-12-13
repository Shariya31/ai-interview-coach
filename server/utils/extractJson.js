export function extractJson(raw) {
  if (!raw || typeof raw !== "string") {
    throw new Error("Invalid LLM response");
  }

  // Remove markdown code fences
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Find first JSON object or array
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  const firstBracket = cleaned.indexOf("[");
  const lastBracket = cleaned.lastIndexOf("]");

  let jsonString = null;

  // Prefer object {}
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    jsonString = cleaned.slice(firstBrace, lastBrace + 1);
  }
  // Fallback to array []
  else if (
    firstBracket !== -1 &&
    lastBracket !== -1 &&
    lastBracket > firstBracket
  ) {
    jsonString = cleaned.slice(firstBracket, lastBracket + 1);
  }

  if (!jsonString) {
    throw new Error("No JSON found in LLM response");
  }

  return jsonString;
}
