const cleanText = (text) => {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n+/g, "\n")
    .trim();
};

export default cleanText;
