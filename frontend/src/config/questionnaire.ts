import type { QuestionnaireConfig } from "../types";

export const questionnaireConfig: QuestionnaireConfig = {
  questions: [
    {
      id: "q1",
      type: "radio",
      text: "Do you have any chronic conditions?",
      required: true,
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "q2",
      type: "multi-select",
      text: "Select all that apply:",
      required: true,
      options: [
        { value: "diabetes", label: "Diabetes" },
        { value: "hypertension", label: "Hypertension" },
        { value: "asthma", label: "Asthma" },
        { value: "arthritis", label: "Arthritis" },
      ],
      conditional: {
        dependsOn: "q1",
        condition: { equals: "yes" },
        showQuestionId: "q2",
      },
    },
    {
      id: "q3",
      type: "select",
      text: "What is your dietary preference?",
      required: true,
      options: [
        { value: "vegetarian", label: "Vegetarian" },
        { value: "vegan", label: "Vegan" },
        { value: "non-vegetarian", label: "Non-Vegetarian" },
        { value: "pescatarian", label: "Pescatarian" },
      ],
    },
    {
      id: "q4",
      type: "compound",
      text: "What is your height?",
      required: true,
      compoundFields: [
        { name: "feet", label: "Feet", placeholder: "ft", type: "number" },
        { name: "inches", label: "Inches", placeholder: "in", type: "number" },
      ],
    },
    {
      id: "q5",
      type: "radio",
      text: "Are you pregnant?",
      required: true,
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "q6",
      type: "select",
      text: "Select trimester:",
      required: true,
      options: [
        { value: "first", label: "First Trimester" },
        { value: "second", label: "Second Trimester" },
        { value: "third", label: "Third Trimester" },
      ],
      conditional: {
        dependsOn: "q5",
        condition: { equals: "yes" },
        showQuestionId: "q6",
      },
    },
  ],
};
