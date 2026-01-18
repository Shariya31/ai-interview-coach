import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_BASE_URL } from '../../../shared/utils/api'
import { useAudioRecorder } from "../../voice/hooks/useAudioRecorder";
import { useAiVoice } from "../hooks/useAiVoice";

const InterviewRunner = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);

  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef(null);
  const { speak } = useAiVoice();

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8000");

    socketRef.current.onopen = () =>
      console.log("🎙️ Voice socket connected");

    socketRef.current.onclose = () =>
      console.log("🎙️ Voice socket closed");

    socketRef.current.onerror = (e) =>
      console.error("🎙️ WS error", e);

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "TRANSCRIPTION") {
        console.log("📝 Transcribed text:", data.text);
        setAnswer(data.text);
      }
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const { startRecording, stopRecording } = useAudioRecorder(socketRef);

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const startInterview = async () => {
    setLoading(true);
    const res = await api.post(`/interviews/${id}/start`);
    setQuestion(res.data.currentQuestion);
    console.log('calling speak')
    speak(res.data.currentQuestion.question);
    setStarted(true);
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;

    setLoading(true);
    const res = await api.post(`/interviews/${id}/answer`, { answer });

    if (res?.data?.nextQuestion) {
      setQuestion(res.data.nextQuestion);
      console.log('calling speak')
      speak(res.data.nextQuestion.question);
      setAnswer("");
    } else {
      setCompleted(true);
    }

    setLoading(false);
  };


  if (completed) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold">
          Interview Completed
        </h2>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      {!started ? (
        <button
          onClick={startInterview}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Start Interview
        </button>
      ) : (
        <>
          <h2 className="text-lg font-semibold">
            {question?.question}
          </h2>

          <textarea
            className="w-full border p-2 rounded"
            rows={5}
            placeholder="Type your answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              onClick={startRecording}
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              🎤 Start Speaking
            </button>

            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              ⏹ Stop
            </button>
          </div>

          <button
            onClick={submitAnswer}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Submit Answer
          </button>
        </>
      )}
    </div>
  );
};

export default InterviewRunner;
