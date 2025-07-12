/**
 * @fileOverview Defines the Zod schema and TypeScript types for the cover letter builder AI flow.
 */
import { z } from 'zod';
import { IntakeFormInputSchema } from '@/ai/schemas/intake-form-schema';

export const BuildCoverLetterInputSchema = z.object({
  jobTitle: z.string().describe("The title of the job being applied for."),
  companyName: z.string().describe("The name of the company."),
  jobDescription: z.string().describe("The full job description."),
  clientData: z.object({
    fullName: z.string(),
    workHistory: IntakeFormInputSchema.shape.workHistory,
    education: IntakeFormInputSchema.shape.education,
  }).describe("The client's relevant career and education data."),
});
export type BuildCoverLetterInput = z.infer<typeof BuildCoverLetterInputSchema>;

export const BuildCoverLetterOutputSchema = z.object({
  coverLetterText: z.string().describe('The generated cover letter in Markdown format.'),
});
export type BuildCoverLetterOutput = z.infer<typeof BuildCoverLetterOutputSchema>;
