const buildQuestionPrompt = ({ role, skills, resumeText }) => {
    return `
You are conducting a technical interview.

Candidate Role: ${role}
Primary Skills: ${skills.join(", ")}

Based on the resume below, generate 5 technical interview questions.
Questions should:
- Be role-specific
- Increase in difficulty
- Test real-world understanding
- Avoid generic theory

Resume:
${resumeText.slice(0, 2000)}
`;
};

export default buildQuestionPrompt;
