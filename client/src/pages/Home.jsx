import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [role, setRole] = useState("frontend");
  const [skills, setSkills] = useState("");
  const [mode, setMode] = useState("text");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleStart(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // build payload
      const payload = {
        role,
        skills: skills.split(",").map(s => s.trim()).filter(Boolean),
        mode,
      };

      const res = await fetch("http://localhost:4000/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create session");
      const data = await res.json();
      // navigate to interview page
      navigate(`/interview/${data.sessionId}`, { state: { questions: data.questions } });
    } catch (err) {
      console.error(err);
      alert("Failed to start session. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Start an interview</h2>

      <form onSubmit={handleStart} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="mt-1 block w-full rounded border p-2">
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="fullstack">Fullstack</option>
            <option value="devops">DevOps</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Skills (comma separated)</label>
          <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="react, javascript" className="mt-1 block w-full rounded border p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Mode</label>
          <select value={mode} onChange={e => setMode(e.target.value)} className="mt-1 block w-full rounded border p-2">
            <option value="text">Text</option>
            <option value="voice">Voice (coming soon)</option>
          </select>
        </div>

        <div>
          <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded">
            {loading ? "Starting..." : "Start Interview"}
          </button>
        </div>
      </form>
    </div>
  );
}
