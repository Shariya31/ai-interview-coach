const SKILL_KEYWORDS = [
  "javascript",
  "typescript",
  "react",
  "redux",
  "node",
  "express",
  "mongodb",
  "docker",
  "aws",
  "html",
  "css",
  "tailwind",
  "sql",
  "python",
  "java",
];

const extractSkills = (text) => {
  const lower = text.toLowerCase();
  const found = new Set();

  SKILL_KEYWORDS.forEach((skill) => {
    if (lower.includes(skill)) {
      found.add(skill);
    }
  });

  return Array.from(found);
};

export default extractSkills;
