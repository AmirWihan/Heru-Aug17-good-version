import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Example questions for immigration score
const QUESTIONS = [
  { key: "age", label: "What is your age?", type: "number", min: 18, max: 60 },
  { key: "education", label: "Highest education completed?", type: "select", options: ["PhD", "Master", "Bachelor", "Diploma", "High School"] },
  { key: "english", label: "IELTS/TOEFL English score?", type: "number", min: 0, max: 9 },
  { key: "work", label: "Years of skilled work experience?", type: "number", min: 0, max: 30 },
  { key: "adaptability", label: "Do you have relatives in the destination country?", type: "select", options: ["Yes", "No"] },
];

function calculateScore(answers: Record<string, any>) {
  let score = 0;
  // Simple scoring rule for demo; replace with real logic
  if (answers.age >= 18 && answers.age <= 35) score += 25;
  else if (answers.age <= 45) score += 15;
  else score += 5;

  switch (answers.education) {
    case "PhD": score += 25; break;
    case "Master": score += 23; break;
    case "Bachelor": score += 20; break;
    case "Diploma": score += 15; break;
    case "High School": score += 10; break;
  }
  if (answers.english >= 7) score += 20;
  else if (answers.english >= 5) score += 10;
  if (answers.work >= 5) score += 15;
  else if (answers.work > 0) score += 5;
  if (answers.adaptability === "Yes") score += 5;
  return score;
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

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else { setSubmitted(true); onScore(score, answers); }
  };

  const handleChange = (val: any) => {
    setAnswers({ ...answers, [QUESTIONS[step].key]: val });
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

  const q = QUESTIONS[step];
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
            onChange={e => handleChange(e.target.value)}
          >
            <option value="" disabled>Select...</option>
            {q.options!.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type="number"
            className="w-full border rounded p-2"
            min={q.min}
            max={q.max}
            value={answers[q.key] || ""}
            onChange={e => handleChange(Number(e.target.value))}
          />
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleNext} disabled={answers[q.key] === undefined || answers[q.key] === ""}>
          {step === QUESTIONS.length - 1 ? "Finish" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
};
