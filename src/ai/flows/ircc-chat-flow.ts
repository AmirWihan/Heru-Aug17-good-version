
'use server';
/**
 * @fileOverview An AI chatbot trained on IRCC information.
 *
 * - askHeru - A function that takes a user query and returns an answer.
 * - AskHeruInput - The input type for the askHeru function.
 * - AskHeruOutput - The return type for the askHeru function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskHeruInputSchema = z.object({
  query: z.string().describe('The user\'s question about Canadian immigration.'),
});
export type AskHeruInput = z.infer<typeof AskHeruInputSchema>;

const AskHeruOutputSchema = z.object({
  response: z.string().describe('The AI-generated answer to the user\'s question.'),
});
export type AskHeruOutput = z.infer<typeof AskHeruOutputSchema>;

const prompt = ai.definePrompt({
  name: 'irccChatPrompt',
  input: {schema: AskHeruInputSchema},
  output: {schema: AskHeruOutputSchema},
  prompt: `You are an expert AI assistant for VisaFor, specializing in Canadian immigration. Your knowledge is based on the official documentation, rules, and regulations from Immigration, Refugees and Citizenship Canada (IRCC).

  When responding to a user's question, you must adhere to the following rules:
  1.  Provide accurate, clear, and concise answers based strictly on your IRCC knowledge base.
  2.  If the answer is not available in your knowledge base, you must state: "I do not have information on that topic based on my current IRCC knowledge base. For the most accurate details, please consult the official IRCC website or a regulated professional."
  3.  Do not speculate, provide legal advice, or use information from any source other than the IRCC materials you were trained on.
  4.  Begin your response directly without any preamble.

  User's Question: {{{query}}}
  `,
});

const irccChatFlow = ai.defineFlow(
  {
    name: 'irccChatFlow',
    inputSchema: AskHeruInputSchema,
    outputSchema: AskHeruOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("Failed to get response from AI chat.");
    }
    return output;
  }
);


export async function askHeru(input: AskHeruInput): Promise<AskHeruOutput> {
  return irccChatFlow(input);
}
