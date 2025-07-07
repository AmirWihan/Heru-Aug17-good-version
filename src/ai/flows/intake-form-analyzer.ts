'use server';

/**
 * @fileOverview An AI agent that analyzes a client's intake form for potential issues.
 *
 * - analyzeIntakeForm - A function that handles the intake form analysis.
 * - IntakeFormInputSchema - The Zod schema for the input.
 * - IntakeFormInput - The input type for the analyzeIntakeForm function.
 * - IntakeFormAnalysis - The return type for the analyzeIntakeForm function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const FamilyMemberSchema = z.object({
    fullName: z.string(),
    relationship: z.string(),
    dateOfBirth: z.string(),
    countryOfBirth: z.string(),
    currentAddress: z.string(),
    occupation: z.string(),
});

export const IntakeFormInputSchema = z.object({
  personal: z.object({
    fullName: z.string(),
    dateOfBirth: z.string(),
    countryOfBirth: z.string(),
    countryOfCitizenship: z.string(),
    passportNumber: z.string(),
    passportExpiry: z.string(),
    height: z.string(),
    eyeColor: z.string(),
    contact: z.object({
        email: z.string(),
        phone: z.string(),
        address: z.string(),
    }),
  }),
  family: z.object({
    maritalStatus: z.string(),
    spouse: FamilyMemberSchema.optional(),
    mother: FamilyMemberSchema.optional(),
    father: FamilyMemberSchema.optional(),
    children: z.array(FamilyMemberSchema).optional(),
    siblings: z.array(FamilyMemberSchema).optional(),
  }),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    yearCompleted: z.string(),
    countryOfStudy: z.string(),
  })),
   studyDetails: z.object({
    schoolName: z.string(),
    programName: z.string(),
    dliNumber: z.string(),
    tuitionFee: z.string(),
    livingExpenses: z.string(),
  }).optional(),
  workHistory: z.array(z.object({
    company: z.string(),
    position: z.string(),
    duration: z.string(),
    country: z.string(),
  })),
  languageProficiency: z.object({
    englishScores: z.object({ listening: z.number(), reading: z.number(), writing: z.number(), speaking: z.number() }).optional(),
    frenchScores: z.object({ listening: z.number(), reading: z.number(), writing: z.number(), speaking: z.number() }).optional(),
  }),
  travelHistory: z.array(z.object({
    country: z.string(),
    purpose: z.string(),
    duration: z.string(),
    year: z.string(),
  })),
  immigrationHistory: z.object({
    previouslyApplied: z.boolean(),
    previousApplicationDetails: z.string().optional(),
    wasRefused: z.boolean(),
    refusalDetails: z.string().optional(),
  }),
  admissibility: z.object({
    hasCriminalRecord: z.boolean(),
    criminalRecordDetails: z.string().optional(),
    hasMedicalIssues: z.boolean(),
    medicalIssuesDetails: z.string().optional(),
    hasOverstayed: z.boolean().optional(),
    overstayDetails: z.string().optional(),
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
  educationAnalysis: z.object({
    equivalencySuggestion: z.string().describe("Suggest the Canadian education equivalency level (e.g., 'Bachelor's degree', 'Two or more certificates') based on the degrees provided."),
    notes: z.string().describe("Any brief notes or observations about the client's education history."),
  }).optional(),
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
  1.  **Inconsistencies:** Check for contradictions within the provided data (e.g., work history not matching education timeline, family composition mismatch).
  2.  **Inadmissibility:** Flag any answers that could lead to medical, criminal, or other inadmissibility. Give these a 'high' severity. Pay close attention to the 'admissibility' section.
  3.  **Immigration History:** Pay close attention to previous applications and refusals. A past refusal is a significant flag that requires detailed explanation.
  4.  **Gaps in History:** Look for unexplained gaps in work or travel history.
  5.  **Completeness:** Identify areas that are incomplete or may require more detail for a successful application.
  6.  **Strengths & Weaknesses:** Briefly mention strong points (e.g., high education, Canadian work experience) or potential weak points (e.g., limited work experience, low language scores).
  7.  **Educational Equivalency:** Based on the provided education history, suggest a Canadian equivalency level and add any relevant notes. This is for the 'educationAnalysis' output field.

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
