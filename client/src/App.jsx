import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Interview from "./pages/Interview";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <Link to="/" className="font-semibold text-xl">AI Interviewer</Link>
          <nav>
            <Link to="/" className="mr-4 text-sm">Home</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interview/:sessionId" element={<Interview />} />
        </Routes>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-4xl mx-auto p-4 text-sm text-gray-500">
          Built with ❤️ — local dev
        </div>
      </footer>
    </div>
  );
}
