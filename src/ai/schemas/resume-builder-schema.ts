/**
 * @fileOverview Defines the Zod schema and TypeScript types for the resume builder AI flow.
 */
import { z } from 'zod';
import { IntakeFormInputSchema } from '@/ai/schemas/intake-form-schema';

export const BuildResumeInputSchema = z.object({
    clientName: z.string().describe("The client's full name."),
    clientContact: IntakeFormInputSchema.shape.personal.shape.contact.describe("The client's contact information."),
    clientWorkHistory: IntakeFormInputSchema.shape.workHistory.describe("The client's work history."),
    clientEducation: IntakeFormInputSchema.shape.education.describe("The client's education history."),
});
export type BuildResumeInput = z.infer<typeof BuildResumeInputSchema>;

export const BuildResumeOutputSchema = z.object({
  resumeText: z.string().describe('The generated resume in Markdown format.'),
});
export type BuildResumeOutput = z.infer<typeof BuildResumeOutputSchema>;
