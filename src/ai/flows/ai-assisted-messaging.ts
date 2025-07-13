
'use server';

/**
 * @fileOverview AI-assisted message composition for client communication.
 *
 * - composeMessage - A function that generates a message for a client based on input.
 * - ComposeMessageInput - The input type for the composeMessage function.
 * - ComposeMessageOutput - The return type for the composeMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ComposeMessageInputSchema = z.object({
  clientName: z.string().describe('The name of the client.'),
  messageContext: z.string().describe('The context or topic of the message.'),
  tone: z.string().describe('The desired tone of the message (e.g., formal, informal, urgent).').optional(),
});
export type ComposeMessageInput = z.infer<typeof ComposeMessageInputSchema>;

const ComposeMessageOutputSchema = z.object({
  message: z.string().describe('The AI-generated message for the client.'),
});
export type ComposeMessageOutput = z.infer<typeof ComposeMessageOutputSchema>;

export async function composeMessage(jsonString: string): Promise<ComposeMessageOutput> {
  const input: ComposeMessageInput = JSON.parse(jsonString);
  return composeMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'composeMessagePrompt',
  input: {schema: ComposeMessageInputSchema},
  output: {schema: ComposeMessageOutputSchema},
  prompt: `You are an AI assistant helping to compose messages for client communication.

  Based on the provided context, generate a message for the client.
  The message should be professional, personalized, and tailored to the context.
  {{#if tone}}
  Take into account the desired tone of "{{{tone}}}" when composing the message.
  {{/if}}

  Client Name: {{{clientName}}}
  Context: {{{messageContext}}}

  Message:`, 
});

const composeMessageFlow = ai.defineFlow(
  {
    name: 'composeMessageFlow',
    inputSchema: ComposeMessageInputSchema,
    outputSchema: ComposeMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
