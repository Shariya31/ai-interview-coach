import { useAudioRecorder } from "./useAudioRecorder";
import { useVapiVoice } from "./useVapiVoice";

const VOICE_ENGINE = import.meta.env.VITE_VOICE_ENGINE;

export const useVoiceEngine = ({ socketRef, onTranscript }) => {
  if (VOICE_ENGINE === "vapi") {
    return useVapiVoice({ onTranscript });
  }

  return useAudioRecorder(socketRef);
};
