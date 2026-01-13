import { useRef } from "react";

export const useSpeechRecognition = (onResult) => {
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("🎙️ Listening... speak now");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") {
        console.warn("No speech detected");
        return;
      }
      if (event.error === "not-allowed") {
        alert("Mic permission denied");
        return;
      }
      console.error("Speech error:", event);
    };

    recognition.onend = () => {
      console.log("🛑 Speech recognition ended");
    };

    recognition.start();
  };

  return { startListening };
};
