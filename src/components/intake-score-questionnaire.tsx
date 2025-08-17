import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Question = {
  key: string;
  label: string;
  type: "number" | "select" | "boolean";
  min?: number;
  max?: number;
  options?: string[];
  showIf?: (answers: Record<string, any>) => boolean;
};

// Step configuration with conditional spouse/children and French language
const BASE_QUESTIONS: Question[] = [
  { key: "age", label: "What is your age?", type: "number", min: 18, max: 60 },
  { key: "education", label: "Highest education completed?", type: "select", options: ["High School", "Diploma", "Bachelor", "Master", "PhD"] },
  { key: "englishClb", label: "English level (CLB)", type: "select", options: ["CLB4", "CLB5", "CLB6", "CLB7", "CLB8", "CLB9", "CLB10"] },
  { key: "frenchClb", label: "French level (CLB)", type: "select", options: ["None", "CLB4", "CLB5", "CLB6", "CLB7", "CLB8", "CLB9", "CLB10"] },
  { key: "work", label: "Years of skilled work experience?", type: "number", min: 0, max: 30 },
  { key: "adaptability", label: "Do you have relatives in Canada?", type: "select", options: ["Yes", "No"] },
  { key: "maritalStatus", label: "Marital status", type: "select", options: ["Single", "Married"] },
  { key: "hasChildren", label: "Do you have children?", type: "boolean" },
  { key: "childrenCount", label: "How many children?", type: "number", min: 1, max: 12, showIf: (a) => Boolean(a.hasChildren) },
  { key: "spouseEducation", label: "Spouse highest education", type: "select", options: ["High School", "Diploma", "Bachelor", "Master", "PhD"], showIf: (a) => a.maritalStatus === "Married" },
  { key: "spouseEnglishClb", label: "Spouse English level (CLB)", type: "select", options: ["None", "CLB4", "CLB5", "CLB6", "CLB7", "CLB8", "CLB9", "CLB10"], showIf: (a) => a.maritalStatus === "Married" },
];

function clbPoints(clb: string, scale: "primary" | "spouse" = "primary") {
  const order = ["CLB4", "CLB5", "CLB6", "CLB7", "CLB8", "CLB9", "CLB10"];
  const i = order.indexOf((clb || "").toUpperCase());
  if (i < 0) return 0;
  const tablePrimary = [0, 2, 4, 8, 12, 16, 20];
  const tableSpouse = [0, 1, 2, 3, 4, 5, 6];
  return scale === "primary" ? tablePrimary[i] : tableSpouse[i];
}

function frenchBonus(clb: string) {
  const order = ["CLB7", "CLB8", "CLB9", "CLB10"];
  const idx = order.indexOf((clb || "").toUpperCase());
  if (idx < 0) return 0;
  const pts = [10, 12, 15, 20];
  return pts[idx];
}

function educationPoints(level: string, spouse = false) {
  const mapPrimary: Record<string, number> = {
    "High School": 5,
    "Diploma": 10,
    "Bachelor": 15,
    "Master": 20,
    "PhD": 25,
  };
  const mapSpouse: Record<string, number> = {
    "High School": 2,
    "Diploma": 3,
    "Bachelor": 5,
    "Master": 6,
    "PhD": 8,
  };
  return (spouse ? mapSpouse[level] : mapPrimary[level]) || 0;
}

function calculateScore(answers: Record<string, any>) {
  let score = 0;
  // Age (simplified)
  const age = Number(answers.age || 0);
  if (age >= 18 && age <= 35) score += 12;
  else if (age >= 36 && age <= 45) score += 8;
  else if (age >= 46 && age <= 50) score += 4;

  // Education
  score += educationPoints(answers.education);

  // English (primary)
  score += clbPoints(answers.englishClb, "primary");

  // French bonus
  score += frenchBonus(answers.frenchClb);

  // Work years (simplified)
  const work = Number(answers.work || 0);
  if (work >= 5) score += 15; else if (work > 0) score += 5;

  // Adaptability (relatives in Canada)
  if (answers.adaptability === "Yes") score += 5;

  // Children
  const childrenCount = Number(answers.childrenCount || 0);
  if (answers.hasChildren && childrenCount > 0) {
    score += Math.min(childrenCount * 2, 6);
  }

  // Spouse factors
  if (answers.maritalStatus === "Married") {
    score += educationPoints(answers.spouseEducation, true);
    score += clbPoints(answers.spouseEnglishClb, "spouse");
  }

  // Clamp to 100
  return Math.max(0, Math.min(score, 100));
}

function getScoreColor(score: number) {
  if (score >= 70) return "success";
  if (score >= 50) return "warning";
  return "destructive";
}

export const IntakeScoreQuestionnaire: React.FC<{
  onScore: (score: number, answers: Record<string, any>) => void;
}> = ({ onScore }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = calculateScore(answers);
  const color = getScoreColor(score);

  // Build visible steps based on current answers
  const steps = useMemo(() => BASE_QUESTIONS.filter(q => (q.showIf ? q.showIf(answers) : true)), [answers]);

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else { setSubmitted(true); onScore(score, answers); }
  };

  const handleChange = (key: string, val: any) => {
    // Reset dependent fields if toggled off
    const next = { ...answers, [key]: val } as any;
    if (key === "hasChildren" && !val) {
      next.childrenCount = 0;
    }
    if (key === "maritalStatus" && val !== "Married") {
      next.spouseEducation = "";
      next.spouseEnglishClb = "";
    }
    setAnswers(next);
  };

  if (submitted) {
    return (
      <Card className="mb-4 animate-fade-in">
        <CardHeader>
          <CardTitle>Screening Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl font-bold">{score}</span>
            <Badge variant={color}>{color === "success" ? "High" : color === "warning" ? "Medium" : "Low"}</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => { setStep(0); setSubmitted(false); }} variant="outline">Retake</Button>
        </CardFooter>
      </Card>
    );
  }

  const q = steps[step];
  return (
    <Card className="mb-4 animate-fade-in">
      <CardHeader>
        <CardTitle>Initial Screening</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 font-medium">{q.label}</div>
        {q.type === "select" ? (
          <select
            className="w-full border rounded p-2"
            value={answers[q.key] || ""}
            onChange={e => handleChange(q.key, e.target.value)}
          >
            <option value="" disabled>Select...</option>
            {q.options!.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : q.type === "number" ? (
          <input
            type="number"
            className="w-full border rounded p-2"
            min={q.min}
            max={q.max}
            value={answers[q.key] ?? ""}
            onChange={e => handleChange(q.key, Number(e.target.value))}
          />
        ) : (
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(answers[q.key])}
              onChange={e => handleChange(q.key, e.target.checked)}
            />
            <span>Yes</span>
          </label>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleNext} disabled={answers[q.key] === undefined || answers[q.key] === ""}>
          {step === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
};
