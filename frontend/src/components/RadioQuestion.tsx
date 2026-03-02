import React from "react";
import type { Question, QuestionOption } from "../types";

interface RadioQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const RadioQuestion: React.FC<RadioQuestionProps> = ({
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
      <div className="space-y-2">
        {question.options?.map((option: QuestionOption) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${question.id}-${option.value}`}
              name={question.id}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label
              htmlFor={`${question.id}-${option.value}`}
              className="ml-2 block text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default RadioQuestion;
