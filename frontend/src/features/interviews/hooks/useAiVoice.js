import axios from "axios";
import { API_BASE_URL } from "../../../shared/utils/api";

export const useAiVoice = () => {
  const speak = async (text) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/voice/speak`,
        { text }
      );

      const audioUrl = `http://localhost:8000${res.data.audioUrl}`;

      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      console.error("❌ AI voice failed", err);
    }
  };

  return { speak };
};
