

'use server';

/**
 * @fileOverview An AI agent that analyzes a client's profile to predict immigration application success.
 *
 * - predictSuccess - A function that handles the success prediction analysis.
 * - SuccessPredictorInputSchema - The Zod schema for the detailed user input object.
 * - SuccessPredictorOutput - The return type for the predictSuccess function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuccessPredictorInputSchema = z.object({
  visaType: z.string().describe('The type of visa or immigration program the client is applying for (e.g., Express Entry, Student Visa).'),
  countryOfOrigin: z.string().describe("The client's country of origin."),
  age: z.number().describe("The client's age in years."),
  educationLevel: z.string().describe("The client's highest level of education."),
});
export type SuccessPredictorInput = z.infer<typeof SuccessPredictorInputSchema>;

const SuccessPredictorOutputSchema = z.object({
  successProbability: z.number().min(0).max(100).describe('The estimated probability of success for the application, as a percentage.'),
  scoreLabel: z.enum(['Green', 'Yellow', 'Red']).describe('A color-coded score label based on the success probability (Green > 80%, Yellow 50-79%, Red < 50%).'),
  reason: z.string().describe('A brief, 1-2 sentence explanation for the given score, highlighting key positive or negative factors.'),
});
export type SuccessPredictorOutput = z.infer<typeof SuccessPredictorOutputSchema>;

const prompt = ai.definePrompt({
  name: 'successPredictorPrompt',
  input: { schema: z.string() },
  output: { schema: SuccessPredictorOutputSchema },
  prompt: `You are an expert Canadian immigration advisor with deep knowledge of immigration law, IRCC policies, and current processing trends. Your task is to provide a realistic, data-informed assessment of a client's immigration application profile based on the provided JSON data.

  Client Profile (JSON):
  {{{json this}}}

  Based on this information, you must:
  1.  Calculate a **Success Probability** as a percentage. This should reflect the likely outcome based on factors like age points in Express Entry, education credential value, visa type requirements, and any known trends associated with the country of origin (like high volume or specific verification needs).
  2.  Determine a **Score Label**:
      - 'Green' if the success probability is 80% or higher.
      - 'Yellow' if the probability is between 50% and 79%.
      - 'Red' if the probability is below 50%.
  3.  Write a concise **Reason** (1-2 sentences) explaining the score. Mention the most critical positive or negative factors influencing the assessment. For example, "The high score is due to the candidate's young age and high level of education, which are strongly favored in the Express Entry system." or "The lower probability reflects the high competition for this visa type and the need for a strong language test score, which is not yet provided."

  Return your analysis in the specified JSON format.
  `,
});


const successPredictorFlow = ai.defineFlow(
  {
    name: 'successPredictorFlow',
    inputSchema: z.string(),
    outputSchema: SuccessPredictorOutputSchema,
  },
  async (jsonString) => {
    const { output } = await prompt(jsonString);
    return output!;
  }
);


export async function predictSuccess(jsonString: string): Promise<SuccessPredictorOutput> {
  return successPredictorFlow(jsonString);
}
