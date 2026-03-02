export interface QuestionOption {
  value: string;
  label: string;
}

export interface ConditionalLogic {
  dependsOn: string;
  condition: {
    equals?: string;
    includes?: string;
  };
  showQuestionId: string;
}

export interface Question {
  id: string;
  type: "radio" | "multi-select" | "select" | "compound";
  text: string;
  required?: boolean;
  options?: QuestionOption[];
  compoundFields?: {
    name: string;
    label: string;
    placeholder?: string;
    type?: string;
  }[];
  conditional?: ConditionalLogic;
}

export interface QuestionnaireConfig {
  questions: Question[];
}

export interface ConsultSubmission {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  responses: Array<{
    questionId: string;
    questionType: string;
    answer: string;
  }>;
  timezone: string;
}
