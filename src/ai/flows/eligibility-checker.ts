'use server';

/**
 * @fileOverview An AI agent that evaluates a user's eligibility for Canadian immigration.
 *
 * - checkEligibility - A function that calculates an immigration score based on user input.
 * - EligibilityInput - The input type for the checkEligibility function.
 * - EligibilityOutput - The return type for the checkEligibility function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EligibilityInputSchema = z.object({
  age: z.number().describe('The age of the applicant.'),
  educationLevel: z.string().describe('The highest level of education attained (e.g., Bachelors, Masters, PhD).'),
  yearsOfExperience: z.number().describe('The number of years of skilled work experience.'),
  ieltsScore: z.number().describe('The IELTS language test score.'),
});
export type EligibilityInput = z.infer<typeof EligibilityInputSchema>;

const EligibilityOutputSchema = z.object({
  crsScore: z.number().describe('The calculated Comprehensive Ranking System (CRS) score.'),
  isEligible: z.boolean().describe('Whether the applicant meets a minimum threshold.'),
  feedback: z.string().describe('A brief explanation of the score and potential areas for improvement.'),
});
export type EligibilityOutput = z.infer<typeof EligibilityOutputSchema>;

export async function checkEligibility(input: EligibilityInput): Promise<EligibilityOutput> {
  return eligibilityCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'eligibilityCheckerPrompt',
  input: { schema: EligibilityInputSchema },
  output: { schema: EligibilityOutputSchema },
  prompt: `You are an expert Canadian immigration consultant. Your task is to calculate a user's Comprehensive Ranking System (CRS) score based on the information they provide.

  Use the following simplified scoring model:
  - Age:
    - 18-35: 12 points
    - 36-40: 8 points
    - 41-45: 5 points
    - 46+: 0 points
  - Education:
    - PhD: 25 points
    - Masters: 23 points
    - Bachelors: 21 points
    - Other: 15 points
  - Work Experience:
    - 6+ years: 15 points
    - 4-5 years: 13 points
    - 2-3 years: 11 points
    - 0-1 year: 9 points
  - IELTS Score (out of 9):
    - 8-9: 10 points
    - 7: 8 points
    - 6: 5 points
    - Below 6: 0 points

  Calculate the total CRS score.
  Set isEligible to true if the score is 45 or higher.
  Provide brief feedback on their score, mentioning their strengths and areas for improvement.

  User Input:
  - Age: {{{age}}}
  - Education: {{{educationLevel}}}
  - Work Experience: {{{yearsOfExperience}}} years
  - IELTS Score: {{{ieltsScore}}}
  `,
});

const eligibilityCheckerFlow = ai.defineFlow(
  {
    name: 'eligibilityCheckerFlow',
    inputSchema: EligibilityInputSchema,
    outputSchema: EligibilityOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
