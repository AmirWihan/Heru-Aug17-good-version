
'use server';

/**
 * @fileOverview An AI agent that calculates a user's Comprehensive Ranking System (CRS) score for Canadian Express Entry.
 *
 * - calculateCrsScore - A function that calculates a CRS score based on detailed user input.
 * - CrsInput - The input type for the calculateCrsScore function.
 * - CrsOutput - The return type for the calculateCrsScore function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LanguageScoresSchema = z.object({
  listening: z.number().min(0).max(9),
  reading: z.number().min(0).max(9),
  writing: z.number().min(0).max(9),
  speaking: z.number().min(0).max(9),
});

export const CrsInputSchema = z.object({
  maritalStatus: z.enum(['single', 'married']).describe('The applicant\'s marital status.'),
  age: z.number().describe('The applicant\'s age in years.'),
  
  educationLevel: z.string().describe('The applicant\'s highest level of education.'),
  studiedInCanada: z.enum(['yes', 'no']).describe('Whether the applicant has a Canadian degree, diploma or certificate.'),

  canadianWorkExperience: z.number().describe('Years of Canadian work experience.'),
  foreignWorkExperience: z.number().describe('Years of foreign work experience.'),
  
  firstLanguage: z.enum(['english', 'french']).describe('The applicant\'s first official language.'),
  englishScores: LanguageScoresSchema.optional().describe('Applicant\'s English test scores (IELTS or CELPIP equivalent).'),
  frenchScores: LanguageScoresSchema.optional().describe('Applicant\'s French test scores (TEF or TCF equivalent).'),

  spouse: z.object({
    educationLevel: z.string().describe('Spouse\'s highest level of education.'),
    canadianWorkExperience: z.number().describe('Spouse\'s years of Canadian work experience.'),
    firstLanguageScores: LanguageScoresSchema.describe('Spouse\'s language test scores.'),
  }).optional().describe('Spouse/common-law partner\'s details, if applicable.'),

  hasJobOffer: z.enum(['yes', 'no']).describe('Whether the applicant has a valid job offer in Canada.'),
  hasProvincialNomination: z.enum(['yes', 'no']).describe('Whether the applicant has a provincial nomination.'),
  hasSiblingInCanada: z.enum(['yes', 'no']).describe('Whether the applicant has a sibling living in Canada who is a citizen or permanent resident.'),
});
export type CrsInput = z.infer<typeof CrsInputSchema>;

const CrsOutputSchema = z.object({
  totalScore: z.number().describe('The final calculated CRS score, out of 1200.'),
  breakdown: z.object({
    coreHumanCapital: z.number().describe('Points from core factors like age, education, language, and Canadian work experience.'),
    spouseFactors: z.number().describe('Points from spouse\'s education, language, and Canadian work experience.'),
    skillTransferability: z.number().describe('Points from combinations of education, work experience, and language skills.'),
    additionalPoints: z.number().describe('Points from factors like a provincial nomination, job offer, sibling in Canada, etc.'),
  }),
  feedback: z.string().describe('A brief, helpful summary and interpretation of the score.'),
  isEligible: z.boolean().describe('A simple boolean indicating if the score is generally considered competitive.'),
});
export type CrsOutput = z.infer<typeof CrsOutputSchema>;

export async function calculateCrsScore(input: CrsInput): Promise<CrsOutput> {
  const jsonString = JSON.stringify(input);
  return crsCalculatorFlow(jsonString);
}

const prompt = ai.definePrompt({
  name: 'crsCalculatorPrompt',
  input: { schema: z.string() }, // Expects a JSON string
  output: { schema: CrsOutputSchema },
  prompt: `You are an expert Canadian immigration consultant specializing in the Express Entry Comprehensive Ranking System (CRS). Your task is to calculate a user's CRS score with perfect accuracy based on the official IRCC guidelines. The maximum possible score is 1200.

  Carefully analyze the user's input from the provided JSON string and calculate their total CRS score.
  
  You must provide a breakdown of the score for each of the following sections according to the latest official IRCC rules:
  1.  **Core / Human Capital Factors:** Based on age, education, language proficiency (first and second), and Canadian work experience. The maximum points for a single applicant is 500.
  2.  **Spouse or common-law partner factors:** Based on the spouse's education, language proficiency, and Canadian work experience. This section only applies if marital status is 'married'. Maximum 40 points.
  3.  **Skill Transferability factors:** Based on combinations of education, language, and work experience. Maximum 100 points.
  4.  **Additional Points:** For a provincial nomination (600 points), a valid job offer (50 or 200 points), Canadian study experience (15 or 30 points), a sibling in Canada (15 points), or French-language skills (25 or 50 points). Maximum 600 points for this section (due to PNP).

  For language scores, map the provided scores (IELTS format) to Canadian Language Benchmark (CLB) levels to calculate points accurately.
  - IELTS 9 = CLB 10
  - IELTS 8-8.5 = CLB 9
  - IELTS 7-7.5 = CLB 8
  - IELTS 6.5 = CLB 7

  After calculating the score, determine if it is "competitive" (isEligible=true). A score above 450 is generally competitive.
  
  Finally, provide a brief, helpful, and encouraging feedback summary for the user. Mention their strengths and potential areas for improvement (e.g., improving language scores, gaining more work experience).

  User Input (JSON):
  {{{json this}}}
  `,
});

const crsCalculatorFlow = ai.defineFlow(
  {
    name: 'crsCalculatorFlow',
    inputSchema: z.string(), // Input is a JSON string
    outputSchema: CrsOutputSchema,
  },
  async (jsonString) => {
    const { output } = await prompt(jsonString);
    return output!;
  }
);
