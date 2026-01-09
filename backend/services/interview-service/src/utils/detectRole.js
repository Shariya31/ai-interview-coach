const detectRole = (skills) => {
  const frontend = ["react", "redux", "html", "css", "tailwind"];
  const backend = ["node", "express", "mongodb", "sql"];

  const hasFrontend = skills.some((s) => frontend.includes(s));
  const hasBackend = skills.some((s) => backend.includes(s));

  if (hasFrontend && hasBackend) return "Fullstack Developer";
  if (hasFrontend) return "Frontend Developer";
  if (hasBackend) return "Backend Developer";

  return "Software Developer";
};

export default detectRole;
