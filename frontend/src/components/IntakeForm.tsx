/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { questionnaireConfig } from "../config/questionnaire";
import DynamicQuestionnaire from "./DynamicQuestionnaire";
import { apiUrl } from "../utils/const";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

const IntakeForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  });

  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateFormData = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 0 || age > 120) {
        newErrors.dateOfBirth = "Please enter a valid date of birth";
      }
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResponses = (): boolean => {
    const newErrors: Record<string, string> = {};

    questionnaireConfig.questions.forEach((question) => {
      let isCurrentlyRequired: string | boolean | undefined =
        question.required ?? false;

      if (question.conditional) {
        const parentValue = responses[question.conditional.dependsOn];

        const conditionMet =
          question.conditional.condition?.equals &&
          parentValue === question.conditional.condition.equals;

        isCurrentlyRequired = conditionMet && (question.required ?? false);
      }

      if (!isCurrentlyRequired) return;

      const value = responses[question.id];

      if (value === undefined || value === null || value === "") {
        newErrors[question.id] = "This field is required";
      } else if (
        question.type === "multi-select" &&
        Array.isArray(value) &&
        value.length === 0
      ) {
        newErrors[question.id] = "Please select at least one option";
      } else if (question.type === "compound") {
        const compoundValue = value as Record<string, string>;
        const allFieldsFilled = question.compoundFields?.every(
          (field) =>
            compoundValue?.[field.name] &&
            String(compoundValue[field.name]).trim() !== ""
        );
        if (!allFieldsFilled) {
          newErrors[question.id] = "All fields are required";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get user timezone
  const getUserTimezone = (): string => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      console.warn("Could not detect timezone, using UTC as fallback");
      return "UTC";
    }
  };

  // Format responses for submission
  const formatResponses = () => {
    return questionnaireConfig.questions
      .filter((question) => {
        let isCurrentlyRequired: string | boolean | undefined =
          question.required ?? false;

        if (question.conditional) {
          const parentValue = responses[question.conditional.dependsOn];
          const conditionMet =
            question.conditional.condition?.equals &&
            parentValue === question.conditional.condition.equals;

          isCurrentlyRequired = conditionMet && (question.required ?? false);
        }

        return !question.conditional || isCurrentlyRequired;
      })
      .map((question) => {
        let answer = responses[question.id];

        if (question.type === "multi-select" && Array.isArray(answer)) {
          answer = answer.join(", ");
        } else if (question.type === "compound" && typeof answer === "object") {
          const compoundValue = answer as Record<string, string>;
          answer = Object.values(compoundValue).join(" ");
        }

        return {
          questionId: question.id,
          questionType: question.type,
          answer: String(answer ?? ""),
        };
      });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isFormDataValid = validateFormData();
    const isResponsesValid = validateResponses();

    if (!isFormDataValid || !isResponsesValid) {
      const firstError = document.querySelector(".text-red-500");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const timezone = getUserTimezone();
      const formattedResponses = formatResponses();
      const submission = {
        userDetails: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
        },
        responses: formattedResponses,
        timezone,
      };

      const response = await fetch(`${apiUrl}submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to submit form");
      }

      setSubmitSuccess(true);

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
      });
      setResponses({});
      setErrors({});
      setFormErrors({});
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit form. Please try again."
      );
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitSuccess(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
    });
    setResponses({});
    setErrors({});
    setFormErrors({});
    setSubmitError(null);
  };

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Submission Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for completing the intake consult form. Our team will
            review your information and contact you soon.
          </p>
          <button
            onClick={handleReset}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Intake Consult Form
      </h1>

      <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Personal Information
          </h2>

          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                formErrors.fullName
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              } rounded-md shadow-sm py-2 px-3`}
              placeholder="John Doe"
              disabled={isSubmitting}
            />
            {formErrors.fullName && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {formErrors.fullName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                formErrors.email
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              } rounded-md shadow-sm py-2 px-3`}
              placeholder="john@example.com"
              disabled={isSubmitting}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {formErrors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                formErrors.phone
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              } rounded-md shadow-sm py-2 px-3`}
              placeholder="1234567890"
              disabled={isSubmitting}
            />
            {formErrors.phone && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {formErrors.phone}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                formErrors.dateOfBirth
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              } rounded-md shadow-sm py-2 px-3`}
              disabled={isSubmitting}
            />
            {formErrors.dateOfBirth && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {formErrors.dateOfBirth}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Health Questionnaire
          </h2>

          <DynamicQuestionnaire
            questions={questionnaireConfig.questions}
            responses={responses}
            onResponseChange={handleResponseChange}
            errors={errors}
          />
        </div>

        {submitError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Consult"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IntakeForm;
