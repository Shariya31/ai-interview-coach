import axios from "axios";
import fs from "fs";

export const generateSpeech = async (text, filePath) => {
  const res = await axios.post(
    "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
    { text },
    {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
    }
  );

  fs.writeFileSync(filePath, res.data);
};
