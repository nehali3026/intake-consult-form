import React from "react";
import type { Question, QuestionOption } from "../types";

interface MultiSelectQuestionProps {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

const MultiSelectQuestion: React.FC<MultiSelectQuestionProps> = ({
  question,
  value = [],
  onChange,
  error,
}) => {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

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
              type="checkbox"
              id={`${question.id}-${option.value}`}
              value={option.value}
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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

export default MultiSelectQuestion;
