
'use server';

/**
 * @fileOverview An AI agent that checks immigration application documents for missing information, errors, or inconsistencies.
 *
 * - applicationChecker - A function that handles the application checking process.
 * - ApplicationCheckerInput - The input type for the applicationChecker function.
 * - ApplicationCheckerOutput - The return type for the applicationChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ApplicationCheckerInputSchema = z.object({
  documentText: z
    .string()
    .describe("The text content extracted from the application document."),
  applicationType: z.string().describe("The type of application (e.g., Permanent Residency, Student Visa)."),
});

export type ApplicationCheckerInput = z.infer<typeof ApplicationCheckerInputSchema>;

const ApplicationCheckerOutputSchema = z.object({
  missingInformation: z.array(z.string()).describe("A list of missing information or documents."),
  errors: z.array(z.string()).describe("A list of errors found in the document."),
  inconsistencies: z.array(z.string()).describe("A list of inconsistencies found in the document."),
  summary: z.string().describe("A summary of the application check results."),
});

export type ApplicationCheckerOutput = z.infer<typeof ApplicationCheckerOutputSchema>;

const prompt = ai.definePrompt({
  name: 'applicationCheckerPrompt',
  input: {schema: ApplicationCheckerInputSchema},
  output: {schema: ApplicationCheckerOutputSchema},
  prompt: `You are an expert immigration consultant.

You will receive the text content of an application document and the type of application.

Your task is to identify any missing information, errors, or inconsistencies in the document.

Application Type: {{{applicationType}}}

Document Text:
{{{documentText}}}

Output the missing information, errors, and inconsistencies in separate lists. Also, provide a summary of your findings.

Ensure that the output is well-formatted and easy to understand.

Follow the schema to produce your output.`, 
});

const applicationCheckerFlow = ai.defineFlow(
    {
        name: 'applicationCheckerFlow',
        inputSchema: ApplicationCheckerInputSchema,
        outputSchema: ApplicationCheckerOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        if (!output) {
            throw new Error('Failed to get analysis from AI.');
        }
        return output;
    }
);

export async function applicationChecker(jsonString: string): Promise<ApplicationCheckerOutput> {
  const input: ApplicationCheckerInput = JSON.parse(jsonString);
  return applicationCheckerFlow(input);
}
