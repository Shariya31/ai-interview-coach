export const cleanQuestion = (text) => {
  if (!text) return "";

  // Remove markdown headings
  if (
    text.toLowerCase().includes("expected outcome") ||
    text.toLowerCase().includes("question ")
  ) {
    return null;
  }

  return text.replace(/\*\*/g, "").trim();
};
