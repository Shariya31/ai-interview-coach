const provider = process.env.AI_PROVIDER || "mock";
console.log("AI_PROVIDER:", provider);

let impl;

switch (provider) {
  case "groq":
    impl = await import("./aiProvider.groq.js");
    break;
  case "openai":
    impl = await import("./aiProvider.openai.js");
    break;
  default:
    impl = await import("./aiProvider.mock.js");
}

export default impl.default || impl;
