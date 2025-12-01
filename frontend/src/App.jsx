// frontend/src/App.jsx
import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function Home({ onStart }) {
  const [skills, setSkills] = useState('');
  const [experience, setExp] = useState(1);
  const [loading, setLoading] = useState(false);

  async function startInterview() {
    setLoading(true);
    try {
      const body = { domain: 'frontend', skills: skills.split(',').map(s=>s.trim()).filter(Boolean), experienceYears: Number(experience) };
      const resp = await fetch(`${API_BASE}/api/interviews/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await resp.json();
      onStart(data.sessionId, data.questions);
    } catch (err) {
      console.error(err);
      alert('Failed to start interview. Is backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">AI Interview Coach — Frontend (Mock)</h1>

      <label className="block mb-2 font-medium">Skills (comma separated)</label>
      <input className="w-full p-2 border rounded mb-3" value={skills} onChange={e=>setSkills(e.target.value)} placeholder="React, Redux, Tailwind" />

      <label className="block mb-2 font-medium">Years experience</label>
      <input type="number" min="0" className="w-24 p-2 border rounded mb-4" value={experience} onChange={e=>setExp(e.target.value)} />

      <div className="flex gap-2">
        <button onClick={startInterview} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? 'Starting...' : 'Start Interview'}
        </button>
      </div>
    </div>
  );
}

function Interview({ sessionId, questions, onFinish }) {
  // index for current question
  const [index, setIndex] = useState(0);
  // local map of answers: { questionId: answerText }
  const [answersMap, setAnswersMap] = useState({});
  // temporary answer text for editing current question
  const currentAnswer = answersMap[questions[index].id] || '';
  const [editingText, setEditingText] = useState(currentAnswer);
  const [saving, setSaving] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [report, setReport] = useState(null);

  const q = questions[index];

  // Save locally and move next (does not call backend)
  function saveAndNext() {
    setSaving(true);
    setAnswersMap(prev => ({ ...prev, [q.id]: (editingText || '').trim() }));
    setEditingText(''); // clear editor for next
    setSaving(false);
    if (index < questions.length - 1) setIndex(i => i + 1);
  }

  function saveAndPrev() {
    setAnswersMap(prev => ({ ...prev, [q.id]: (editingText || '').trim() }));
    setEditingText('');
    if (index > 0) setIndex(i => i - 1);
  }

  // When moving to a different question, load its saved answer into editor
  function goToQuestion(i) {
    setIndex(i);
    setEditingText(answersMap[questions[i].id] || '');
  }

  // Finish: submit all saved answers to backend, then call finish endpoint to get report
  async function finishInterview() {
    // ensure all answers saved locally (save current editor)
    const finalizedAnswers = { ...answersMap, [q.id]: (editingText || '').trim() };
    setAnswersMap(finalizedAnswers);

    // Basic validation: require at least one answer (you can adjust)
    const answeredCount = Object.values(finalizedAnswers).filter(Boolean).length;
    if (answeredCount === 0) {
      if (!confirm('You have not answered any questions. Finish anyway?')) return;
    }

    setFinishing(true);
    try {
      // POST each saved answer to /answer to store it in backend sessions
      for (const question of questions) {
        const answerText = finalizedAnswers[question.id] || '';
        await fetch(`${API_BASE}/api/interviews/${sessionId}/answer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId: question.id, answerText })
        });
      }

      // Now request aggregated final report
      const resp = await fetch(`${API_BASE}/api/interviews/${sessionId}/finish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const finalReport = await resp.json();
      setReport(finalReport);
    } catch (err) {
      console.error(err);
      alert('Failed to finish interview. Check backend.');
    } finally {
      setFinishing(false);
    }
  }

  // If a report is present, show it
  if (report) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold">Interview Report</h2>
        <p className="mt-2 text-sm text-gray-600">{report.overallSummary}</p>

        <div className="mt-4">
          <h3 className="text-lg font-medium">Averages (per question)</h3>
          <div className="mt-2 text-sm">
            <div><strong>Correctness:</strong> {report.averages.correctness}</div>
            <div><strong>Depth:</strong> {report.averages.depth}</div>
            <div><strong>Clarity:</strong> {report.averages.clarity}</div>
            <div><strong>Use of examples:</strong> {report.averages.use_of_examples}</div>
            <div><strong>Avg score:</strong> {report.averages.total} / 20</div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {report.perQuestion.map((p) => (
            <div key={p.questionId} className="p-3 border rounded bg-gray-50">
              <div className="font-medium">{p.questionText}</div>
              <div className="mt-2 text-sm text-gray-700"><strong>Your answer:</strong> {p.answerText || <span className="text-gray-400">No answer provided</span>}</div>
              <div className="mt-2 text-sm">
                <strong>Score:</strong> {p.feedback.total} / 20
                <div className="mt-1 text-xs text-gray-600">correctness {p.feedback.correctness}, depth {p.feedback.depth}, clarity {p.feedback.clarity}, examples {p.feedback.use_of_examples}</div>
              </div>
              <div className="mt-2 text-sm">
                <strong>Improvements:</strong>
                <ul className="list-disc ml-5">
                  {p.feedback.improvements.map((it, idx) => <li key={idx}>{it}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <button onClick={() => onFinish()} className="px-4 py-2 bg-blue-600 text-white rounded">Back to Home</button>
        </div>
      </div>
    );
  }

  // Regular interview UI (no report yet)
  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-lg font-medium">Question {index + 1} / {questions.length}</h2>

      <div className="mt-4 p-3 border rounded bg-gray-50">
        <p className="text-base">{q.text}</p>
        <p className="text-sm text-gray-500 mt-2">{q.difficulty} • {q.type}</p>
      </div>

      <textarea
        className="w-full mt-4 p-2 border rounded"
        rows={7}
        value={editingText}
        onChange={(e) => setEditingText(e.target.value)}
        placeholder="Type your answer..."
      />

      <div className="flex gap-2 mt-3">
        <button onClick={saveAndNext} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded">
          {saving ? 'Saving...' : (index < questions.length - 1 ? 'Save & Next' : 'Save')}
        </button>

        <button onClick={saveAndPrev} className="px-3 py-2 border rounded" disabled={index === 0}>Prev</button>

        <button onClick={() => {
          // go to question list (example: open question picker)
          const choice = prompt(`Go to question number (1 - ${questions.length})`);
          const num = Number(choice);
          if (num >= 1 && num <= questions.length) goToQuestion(num - 1);
        }} className="px-3 py-2 border rounded">Jump</button>

        <div className="ml-auto flex items-center gap-2">
          <div className="text-sm text-gray-600">Answered: {Object.values(answersMap).filter(Boolean).length}</div>
          <button onClick={finishInterview} disabled={finishing} className="px-4 py-2 bg-indigo-600 text-white rounded">
            {finishing ? 'Finishing...' : 'Finish and Get Feedback'}
          </button>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <div><strong>Tip:</strong> Use Save & Next to store answers locally. You can edit answers before finishing.</div>
      </div>

      <div className="mt-6">
        <h4 className="font-medium">Quick navigation</h4>
        <div className="flex gap-2 flex-wrap mt-2">
          {questions.map((qq, i) => (
            <button key={qq.id} onClick={() => { goToQuestion(i); }} className={`px-2 py-1 border rounded text-sm ${i === index ? 'bg-gray-200' : ''}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);

  function start(id, qs) {
    setSession(id);
    setQuestions(qs);
  }

  function finish() {
    setSession(null);
    setQuestions([]);
  }

  return (
    <div className="min-h-screen p-6">
      {!session ? <Home onStart={start} /> : <Interview sessionId={session} questions={questions} onFinish={finish} />}
    </div>
  );
}
