import React from "react";

/**
 * Pure presentational card for the current question.
 * Props:
 *  - question: { id, text }
 *  - answer: string
 *  - onChange(answer)
 */
export default function QuestionCard({ question, answer = "", onChange }) {
  return (
    <div className="bg-white rounded p-6 shadow">
      <div className="text-sm text-gray-500 mb-2">Question</div>
      <div className="font-medium text-lg mb-4">{question?.text}</div>

      <label className="block text-sm font-medium mb-2">Your Answer</label>
      <textarea
        value={answer}
        onChange={(e) => onChange(e.target.value)}
        rows={7}
        className="w-full border rounded p-2 resize-y"
        placeholder="Type your answer here..."
      />

      <div className="text-xs text-gray-400 mt-2">
        Tip: write concise, example-driven answers. You can edit before submitting.
      </div>
    </div>
  );
}
