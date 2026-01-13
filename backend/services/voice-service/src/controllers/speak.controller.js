import path from "path";
import { v4 as uuid } from "uuid";
import { generateSpeech } from "../clients/ttsClients.js";

export const speakText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const filename = `${uuid()}.mp3`;
    const filePath = path.join("/tmp", filename);

    await generateSpeech(text, filePath);

    res.json({
      audioUrl: `/voice/audio/${filename}`,
    });
  } catch (err) {
    console.error("❌ TTS failed:", err.message);
    res.status(500).json({ message: "Failed to generate speech" });
  }
};
