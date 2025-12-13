export async function generateQuestions({ role = "fullstack", skills = [], count = 5 }) {
  const base = [
    "Tell me about a challenging project you worked on and your role.",
    "How do you approach debugging a production issue?",
    "Explain a core concept in your primary domain.",
  ];
  const skillQs = (skills || []).slice(0, 3).map(s => `What's your experience with ${s}?`);
  const raw = [...base, ...skillQs].slice(0, count);
  return raw.map((text, i) => ({ id: `q-${i+1}`, text }));
}

export async function reviewSession(session) {
  const answersCount = (session.answers || []).length;
  const score = Math.min(100, answersCount * 15);
  return {
    summary: `Mock review: answered ${answersCount} of ${session.questions.length} questions.`,
    score,
    improvements: ["Be more specific with examples", "Mention trade-offs", "Demonstrate end-to-end thinking"],
  };
}

export default { generateQuestions, reviewSession };
