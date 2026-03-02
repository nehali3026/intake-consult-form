import React from "react";
import type { Question, QuestionOption } from "../types";

interface SelectQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const SelectQuestion: React.FC<SelectQuestionProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value="">Select an option</option>
        {question.options?.map((option: QuestionOption) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default SelectQuestion;
