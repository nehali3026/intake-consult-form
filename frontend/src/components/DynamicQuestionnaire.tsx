import React, { useState, useEffect } from "react";
import type { Question } from "../types";
import RadioQuestion from "./RadioQuestion";
import MultiSelectQuestion from "./MultiSelectQuestion";
import SelectQuestion from "./SelectQuestion";
import CompoundQuestion from "./CompoundQuestion";

interface DynamicQuestionnaireProps {
  questions: Question[];
  responses: Record<string, any>;
  onResponseChange: (questionId: string, value: any) => void;
  errors: Record<string, string>;
}

const DynamicQuestionnaire: React.FC<DynamicQuestionnaireProps> = ({
  questions,
  responses,
  onResponseChange,
  errors,
}) => {
  const [visibleQuestions, setVisibleQuestions] =
    useState<Question[]>(questions);

  useEffect(() => {
    // Filter questions based on conditional logic
    const filtered = questions.filter((question) => {
      if (!question.conditional) return true;

      const dependsOnValue = responses[question.conditional.dependsOn];
      const condition = question.conditional.condition;

      if (condition.equals !== undefined) {
        return dependsOnValue === condition.equals;
      }

      if (condition.includes !== undefined && Array.isArray(dependsOnValue)) {
        return dependsOnValue.includes(condition.includes);
      }

      return true;
    });

    setVisibleQuestions(filtered);
  }, [responses, questions]);

  const renderQuestion = (question: Question) => {
    const commonProps = {
      key: question.id,
      question,
      value: responses[question.id],
      onChange: (value: any) => onResponseChange(question.id, value),
      error: errors[question.id],
    };

    switch (question.type) {
      case "radio":
        return <RadioQuestion {...commonProps} />;
      case "multi-select":
        return (
          <MultiSelectQuestion
            {...commonProps}
            value={responses[question.id] || []}
          />
        );
      case "select":
        return <SelectQuestion {...commonProps} />;
      case "compound":
        return (
          <CompoundQuestion
            {...commonProps}
            value={responses[question.id] || {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {visibleQuestions.map((question) => renderQuestion(question))}
    </div>
  );
};

export default DynamicQuestionnaire;
