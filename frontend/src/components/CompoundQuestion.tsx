import React from "react";
import type { Question } from "../types";

interface CompoundQuestionProps {
  question: Question;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  error?: string;
}

const CompoundQuestion: React.FC<CompoundQuestionProps> = ({
  question,
  value = {},
  onChange,
  error,
}) => {
  const handleFieldChange = (fieldName: string, fieldValue: string) => {
    onChange({
      ...value,
      [fieldName]: fieldValue,
    });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-4">
        {question.compoundFields?.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={`${question.id}-${field.name}`}
              className="block text-xs text-gray-500"
            >
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              id={`${question.id}-${field.name}`}
              placeholder={field.placeholder}
              value={value[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default CompoundQuestion;
