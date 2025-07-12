/**
 * @fileOverview Defines the Zod schema and TypeScript types for the cover letter builder AI flow.
 */
import { z } from 'zod';
import { IntakeFormInputSchema } from '@/ai/schemas/intake-form-schema';

export const BuildCoverLetterInputSchema = z.object({
  jobTitle: z.string().describe("The title of the job being applied for."),
  companyName: z.string().describe("The name of the company."),
  jobDescription: z.string().describe("The full job description."),
  clientName: z.string().describe("The client's full name."),
  clientWorkHistory: IntakeFormInputSchema.shape.workHistory.describe("The client's work history."),
  clientEducation: IntakeFormInputSchema.shape.education.describe("The client's education history."),
});
export type BuildCoverLetterInput = z.infer<typeof BuildCoverLetterInputSchema>;

export const BuildCoverLetterOutputSchema = z.object({
  coverLetterText: z.string().describe('The generated cover letter in Markdown format.'),
});
export type BuildCoverLetterOutput = z.infer<typeof BuildCoverLetterOutputSchema>;
