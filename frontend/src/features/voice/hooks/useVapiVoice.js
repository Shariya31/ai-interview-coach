import { useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";

export const useVapiVoice = ({ onTranscript }) => {
  const vapiRef = useRef(null);

  useEffect(() => {
    vapiRef.current = new Vapi(
      import.meta.env.VITE_VAPI_PUBLIC_KEY
    );

    vapiRef.current.on("transcript", (data) => {
      if (data?.text && onTranscript) {
        onTranscript(data.text);
      }
    });

    vapiRef.current.on("error", (err) => {
      console.error("❌ Vapi error:", err);
    });

    return () => {
      vapiRef.current?.stop();
    };
  }, []);

  const startRecording = async () => {
    await vapiRef.current.start(
      import.meta.env.VITE_VAPI_ASSISTANT_ID
    );
  };

  const stopRecording = async () => {
    await vapiRef.current.stop();
  };

  return {
    startRecording,
    stopRecording,
  };
};
