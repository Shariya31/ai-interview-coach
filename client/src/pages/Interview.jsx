import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";

export default function Interview() {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialQuestions = location.state?.questions || [];

  const [questions, setQuestions] = useState(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      if (questions.length) return;
      if (!sessionId) return;
      try {
        const res = await fetch(`/api/interviews/${sessionId}`);
        if (!res.ok) return;
        const data = await res.json();
        setQuestions(data.session?.questions || []);
        // prefill answers if any
        const preAnswers = {};
        (data.session?.answers || []).forEach(a => {
          if (a.questionId) preAnswers[a.questionId] = a.answerText;
        });
        setAnswers(preAnswers);
      } catch (err) {
        console.error("Failed to fetch session", err);
      }
    }
    fetchSession();
  }, [sessionId, questions.length]);

  const currentQuestion = useMemo(() => questions[currentIndex] || null, [questions, currentIndex]);

  function handleChangeAnswer(text) {
    if (!currentQuestion) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: text }));
  }

  function goNext() {
    setCurrentIndex(i => Math.min(i + 1, questions.length - 1));
  }
  function goPrev() {
    setCurrentIndex(i => Math.max(0, i - 1));
  }

  // New: batch submit single request
  async function handleSubmitAll() {
    if (!sessionId) {
      return alert("Session ID missing. Start a new interview from Home.");
    }
    setLoading(true);
    try {
      // Build answers array
      const payloadAnswers = questions.map(q => ({
        questionId: q.id,
        answerText: (answers[q.id] || "").trim(),
      }));

      const res = await fetch(`/api/interviews/${sessionId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payloadAnswers }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to submit");
      }

      const data = await res.json();
      setReview(data.review);
    } catch (err) {
      console.error(err);
      alert("Failed to submit answers and get review. See console for details.");
    } finally {
      setLoading(false);
    }
  }

  function handleRestart() {
    navigate("/");
  }

  if (review) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Review & Recommendations</h2>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium">Score: {review.score ?? "N/A"}</h3>
          <p className="mt-2">{review.summary}</p>
          <ul className="mt-3 list-disc ml-5">
            {review.improvements?.map((imp, idx) => (
              <li key={idx}>{imp}</li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2">
            <button onClick={handleRestart} className="px-4 py-2 bg-gray-200 rounded">
              Back to Home
            </button>
            <button
              onClick={() => {
                setReview(null);
                setCurrentIndex(0);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Review Answers / Improve
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Interview session</h2>

      {questions.length === 0 ? (
        <div className="p-4 bg-yellow-50 rounded">No questions available for this session.</div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </div>

          <QuestionCard
            question={currentQuestion}
            answer={answers[currentQuestion?.id] || ""}
            onChange={handleChangeAnswer}
          />

          <div className="mt-4 flex items-center justify-between">
            <div>
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className={`px-3 py-2 rounded border ${currentIndex === 0 ? "text-gray-400 border-gray-200" : "bg-white"}`}
              >
                Prev
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500 mr-3">You can edit answers before submitting.</div>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={goNext}
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmitAll}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  {loading ? "Submitting..." : "Submit All & Get Review"}
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 bg-white p-3 rounded shadow">
            <div className="text-sm font-medium mb-2">Progress</div>
            <div className="flex gap-2 flex-wrap">
              {questions.map((q, i) => {
                const answered = !!(answers[q.id] && answers[q.id].trim().length);
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(i)}
                    className={`px-3 py-1 rounded text-sm border ${i === currentIndex ? "bg-indigo-100" : "bg-white"} ${answered ? "border-green-300" : "border-gray-200"}`}
                    title={answered ? "Answered" : "Unanswered"}
                  >
                    {i + 1}{answered ? " ✓" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
