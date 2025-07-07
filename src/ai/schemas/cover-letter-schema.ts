/**
 * @fileOverview Defines the Zod schema and TypeScript types for the cover letter builder AI flow.
 */
import { z } from 'zod';
import { IntakeFormInputSchema } from '@/ai/schemas/intake-form-schema';

const CoverLetterJobDetailsSchema = z.object({
  jobTitle: z.string().describe("The title of the job being applied for."),
  companyName: z.string().describe("The name of the company."),
  jobDescription: z.string().describe("The full job description."),
});

export const BuildCoverLetterInputSchema = IntakeFormInputSchema.merge(CoverLetterJobDetailsSchema);
export type BuildCoverLetterInput = z.infer<typeof BuildCoverLetterInputSchema>;

export const BuildCoverLetterOutputSchema = z.object({
  coverLetterText: z.string().describe('The generated cover letter in Markdown format.'),
});
export type BuildCoverLetterOutput = z.infer<typeof BuildCoverLetterOutputSchema>;
