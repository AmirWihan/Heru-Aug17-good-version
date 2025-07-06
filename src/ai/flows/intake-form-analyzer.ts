'use server';

/**
 * @fileOverview An AI agent that analyzes a client's intake form for potential issues.
 *
 * - analyzeIntakeForm - A function that handles the intake form analysis.
 * - IntakeFormInput - The input type for the analyzeIntakeForm function.
 * - IntakeFormAnalysis - The return type for the analyzeIntakeForm function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const IntakeFormInputSchema = z.object({
  personal: z.object({
    fullName: z.string(),
    dateOfBirth: z.string(),
    countryOfBirth: z.string(),
    countryOfCitizenship: z.string(),
  }),
  family: z.object({
    maritalStatus: z.string(),
    hasChildren: z.boolean(),
  }),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    yearCompleted: z.string(),
  })),
  workHistory: z.array(z.object({
    company: z.string(),
    position: z.string(),
    duration: z.string(),
  })),
  admissibility: z.object({
    hasCriminalRecord: z.boolean(),
    hasMedicalIssues: z.boolean(),
  }),
});
export type IntakeFormInput = z.infer<typeof IntakeFormInputSchema>;

const FlagSchema = z.object({
  severity: z.enum(['low', 'medium', 'high']).describe("The severity of the flag (low, medium, or high)."),
  field: z.string().describe("The specific form field or section related to the flag."),
  message: z.string().describe("A clear and concise message explaining the potential issue."),
});

const IntakeFormAnalysisSchema = z.object({
  summary: z.string().describe("A brief, overall summary of the AI's findings from the form review."),
  flags: z.array(FlagSchema).describe("An array of potential issues, inconsistencies, or red flags found in the form."),
});
export type IntakeFormAnalysis = z.infer<typeof IntakeFormAnalysisSchema>;

export async function analyzeIntakeForm(input: IntakeFormInput): Promise<IntakeFormAnalysis> {
  return intakeFormAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intakeFormAnalyzerPrompt',
  input: { schema: IntakeFormInputSchema },
  output: { schema: IntakeFormAnalysisSchema },
  prompt: `You are an expert Canadian immigration case analyst. Your task is to review a client's submitted intake form data and identify any potential issues, red flags, or areas that require further clarification.

  Analyze the following client data:
  \`\`\`json
  {{{json this}}}
  \`\`\`

  Your analysis should focus on:
  1.  **Inconsistencies:** Check for contradictions within the provided data.
  2.  **Inadmissibility:** Flag any answers that could lead to medical or criminal inadmissibility (e.g., hasCriminalRecord: true).
  3.  **Missing Information:** Identify areas that are incomplete or may require more detail for a successful application.
  4.  **Strengths & Weaknesses:** Briefly mention strong points (e.g., high education) or potential weak points (e.g., limited work experience).

  Create a flag for each issue you identify. For each flag, specify the severity, the related field/section, and a clear message for the lawyer.
  
  Finally, write a concise overall summary of your findings.
  `,
});

const intakeFormAnalyzerFlow = ai.defineFlow(
  {
    name: 'intakeFormAnalyzerFlow',
    inputSchema: IntakeFormInputSchema,
    outputSchema: IntakeFormAnalysisSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
