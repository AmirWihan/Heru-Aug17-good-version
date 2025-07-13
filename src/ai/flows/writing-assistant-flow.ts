
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
import { 
    WritingAssistantInputSchema, 
    WritingAssistantOutputSchema, 
    type WritingAssistantInput, 
    type WritingAssistantOutput 
} from '@/ai/schemas/writing-assistant-schema';

export async function assistWithWriting(jsonString: string): Promise<WritingAssistantOutput> {
  const input: WritingAssistantInput = JSON.parse(jsonString);
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
