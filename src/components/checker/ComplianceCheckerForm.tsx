"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";

interface FormData {
  [key: string]: string | boolean;
}

interface RiskResult {
  level: "unacceptable" | "high" | "limited" | "minimal";
  percentage: number;
  obligations: string[];
  description: string;
}

const ASSESSMENT_QUESTIONS = [
  {
    id: "purpose",
    question: "What is the primary purpose of your AI system?",
    type: "select",
    options: [
      "Emotion recognition",
      "Biometric identification",
      "Critical infrastructure control",
      "Human evaluation for employment",
      "Credit/loan decisions",
      "Law enforcement",
      "Other",
    ],
  },
  {
    id: "users",
    question: "Who are the primary users of your AI system?",
    type: "select",
    options: [
      "General public",
      "Specific organizations",
      "Government agencies",
      "Law enforcement",
      "Critical infrastructure operators",
    ],
  },
  {
    id: "data_types",
    question: "What types of data does your system process?",
    type: "checkbox",
    options: [
      "Biometric data",
      "Personal identifiers",
      "Financial data",
      "Health information",
      "Criminal records",
      "Location data",
    ],
  },
  {
    id: "decisions",
    question:
      "Does your system make autonomous decisions affecting individuals?",
    type: "select",
    options: [
      "Yes, legally binding decisions",
      "Yes, recommendations",
      "No, informational only",
    ],
  },
  {
    id: "vulnerable_groups",
    question: "Does your system target vulnerable populations?",
    type: "select",
    options: [
      "Children",
      "Elderly",
      "People with disabilities",
      "No specific vulnerable groups",
    ],
  },
  {
    id: "transparency",
    question: "How transparent is your system to users?",
    type: "select",
    options: [
      "Users know they're interacting with AI",
      "Partially transparent",
      "Black box",
      "Not applicable",
    ],
  },
  {
    id: "human_oversight",
    question: "Is there human oversight of AI decisions?",
    type: "select",
    options: [
      "Always required",
      "For critical decisions only",
      "Minimal oversight",
      "None",
    ],
  },
  {
    id: "model_type",
    question: "What type of AI model does your system use?",
    type: "select",
    options: [
      "Large Language Model (LLM)",
      "Computer Vision",
      "Predictive Analytics",
      "Recommendation System",
      "Robotic Process Automation",
      "Other",
    ],
  },
  {
    id: "training_data",
    question: "How much training data does your model use?",
    type: "select",
    options: [
      "< 1 million samples",
      "1-100 million samples",
      "100 million - 1 billion samples",
      "> 1 billion samples",
    ],
  },
  {
    id: "compliance_measures",
    question: "What compliance measures do you currently have?",
    type: "checkbox",
    options: [
      "Privacy by design",
      "Impact assessments",
      "Testing for bias",
      "User documentation",
      "Data protection measures",
      "None",
    ],
  },
  {
    id: "incidents",
    question: "Have there been any negative incidents or complaints?",
    type: "select",
    options: [
      "Multiple incidents",
      "Some incidents",
      "No known incidents",
      "Unknown",
    ],
  },
  {
    id: "geographical_scope",
    question: "What is the geographical scope of your system?",
    type: "select",
    options: ["EU only", "Europe + other regions", "Global", "Single country"],
  },
];

export default function ComplianceCheckerForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [result, setResult] = useState<RiskResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnswer = (value: string | boolean) => {
    const questionId = ASSESSMENT_QUESTIONS[currentQuestion].id;
    setFormData((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      submitForm();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const submitForm = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock result - in production this would come from an API
      const mockResult: RiskResult = {
        level: "high",
        percentage: 65,
        obligations: [
          "Maintain detailed documentation of training data",
          "Implement human oversight for all decisions",
          "Conduct regular bias testing",
          "Provide transparency to users",
          "Implement appropriate security measures",
          "Establish incident reporting procedures",
        ],
        description:
          "Your AI system falls into the High-Risk category under the EU AI Act. This means you must implement substantial compliance measures.",
      };

      setResult(mockResult);
    } finally {
      setIsLoading(false);
    }
  };

  const question = ASSESSMENT_QUESTIONS[currentQuestion];
  const isAnswered = formData[question.id];

  if (result) {
    return (
      <ResultScreen
        result={result}
        onReset={() => {
          setResult(null);
          setCurrentQuestion(0);
          setFormData({});
        }}
      />
    );
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-900">
                Analyzing your responses...
              </p>
              <p className="text-sm text-slate-600 mt-2">
                Assessing EU AI Act compliance requirements
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">EU AI Act Assessment</h1>
                <span className="text-sm font-medium text-slate-600">
                  Question {currentQuestion + 1} of{" "}
                  {ASSESSMENT_QUESTIONS.length}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-6">
                {question.question}
              </h2>

              {question.type === "select" ? (
                <div className="space-y-3">
                  {question.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        formData[question.id] === option
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        {formData[question.id] === option && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {question.options?.map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-4 border-2 rounded-lg border-slate-200 hover:border-slate-300 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={
                          Array.isArray(formData[question.id]) &&
                          formData[question.id].includes(option)
                        }
                        onChange={(e) => {
                          const current = Array.isArray(formData[question.id])
                            ? formData[question.id]
                            : [];
                          if (e.target.checked) {
                            handleAnswer([...current, option]);
                          } else {
                            handleAnswer(
                              current.filter((item: string) => item !== option),
                            );
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-300"
                      />
                      <span className="ml-3 font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentQuestion === 0}
                className="flex-1"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!isAnswered}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {currentQuestion === ASSESSMENT_QUESTIONS.length - 1
                  ? "Get Results"
                  : "Next"}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ResultScreen({
  result,
  onReset,
}: {
  result: RiskResult;
  onReset: () => void;
}) {
  const riskColors = {
    unacceptable: "bg-red-100 border-red-300 text-red-900",
    high: "bg-orange-100 border-orange-300 text-orange-900",
    limited: "bg-yellow-100 border-yellow-300 text-yellow-900",
    minimal: "bg-green-100 border-green-300 text-green-900",
  };

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Your Compliance Assessment
          </h1>
          <p className="text-lg text-slate-600">Based on your responses</p>
        </div>

        <div
          className={`rounded-lg border-2 p-8 mb-8 ${riskColors[result.level]}`}
        >
          <div className="text-center">
            <div className="text-5xl font-bold mb-4 capitalize">
              {result.level} Risk
            </div>
            <div className="text-lg font-medium">
              {result.percentage}% Compliance Effort Required
            </div>
            <p className="mt-4 text-base">{result.description}</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            Your Obligations
          </h2>
          <ul className="space-y-4">
            {result.obligations.map((obligation, index) => (
              <li key={index} className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{obligation}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4">
          <Button onClick={onReset} variant="outline" className="flex-1">
            Start New Assessment
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            Download Report (Coming Soon)
          </Button>
        </div>
      </div>
    </section>
  );
}
