/**
 * @fileOverview Defines the Zod schema and TypeScript types for the writing assistant AI flow.
 */
import { z } from 'zod';

export const WritingAssistantInputSchema = z.object({
  textToImprove: z.string().describe("The original text to be modified."),
  instruction: z.string().describe("The instruction on how to modify the text (e.g., 'make it more professional', 'shorten it', 'check grammar')."),
});
export type WritingAssistantInput = z.infer<typeof WritingAssistantInputSchema>;

export const WritingAssistantOutputSchema = z.object({
  improvedText: z.string().describe('The resulting text after applying the instruction.'),
});
export type WritingAssistantOutput = z.infer<typeof WritingAssistantOutputSchema>;
