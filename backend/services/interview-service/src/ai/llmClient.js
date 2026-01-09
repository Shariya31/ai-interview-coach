// import axios from "axios";

// const llmClient = async (prompt) => {
//     try {
//         const response = await axios.post(
//             process.env.LLM_API_URL,
//             {
//                 model: process.env.LLM_MODEL,
//                 input: [
//                     {
//                         role: "system",
//                         content: "You are a professional technical interviewer."
//                     },
//                     {
//                         role: "user",
//                         content: prompt
//                     }
//                 ]
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.LLM_API_KEY}`,
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         return response.data.output_text;
//     } catch (error) {
//         if (err.response?.status === 429) {
//             throw new Error("LLM quota exceeded. Try again later.");
//         }
//         throw err;
//     }
// };

// export default llmClient;
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const llmClient = async (prompt) => {
    const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        messages: [
            {
                role: "system",
                content: "You are a professional technical interviewer.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7,
    });

    return completion.choices[0].message.content;
};

export default llmClient;
