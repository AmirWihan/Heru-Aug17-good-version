'use server';

/**
 * @fileOverview A general-purpose AI writing assistant.
 *
 * - assistWithWriting - A function that takes text and an instruction to modify it.
 * - WritingAssistantInput - The input type for the assistWithWriting function.
 * - WritingAssistantOutput - The return type for the assistWithWriting function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const WritingAssistantInputSchema = z.object({
  textToImprove: z.string().describe("The original text to be modified."),
  instruction: z.string().describe("The instruction on how to modify the text (e.g., 'make it more professional', 'shorten it', 'check grammar')."),
});
export type WritingAssistantInput = z.infer<typeof WritingAssistantInputSchema>;

const WritingAssistantOutputSchema = z.object({
  improvedText: z.string().describe('The resulting text after applying the instruction.'),
});
export type WritingAssistantOutput = z.infer<typeof WritingAssistantOutputSchema>;

export async function assistWithWriting(input: WritingAssistantInput): Promise<WritingAssistantOutput> {
  return writingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'writingAssistantPrompt',
  input: { schema: WritingAssistantInputSchema },
  output: { schema: WritingAssistantOutputSchema },
  prompt: `You are a helpful writing assistant. Your task is to take the user's text and modify it based on their instruction.

  **Instruction:** {{{instruction}}}

  **Original Text:**
  ---
  {{{textToImprove}}}
  ---

  Return only the improved text in the 'improvedText' field.
  `,
});

const writingAssistantFlow = ai.defineFlow(
  {
    name: 'writingAssistantFlow',
    inputSchema: WritingAssistantInputSchema,
    outputSchema: WritingAssistantOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
