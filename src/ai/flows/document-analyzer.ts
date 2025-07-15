
'use server';

/**
 * @fileOverview An AI agent that analyzes a document and provides a checklist for review.
 *
 * - analyzeDocument - A function that handles the document analysis.
 * - DocumentAnalysisInput - The input type for the analyzeDocument function.
 * - DocumentAnalysisOutput - The return type for the analyzeDocument function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DocumentAnalysisInputSchema = z.object({
  title: z.string().describe('The title of the document being analyzed (e.g., "Passport Bio Page").'),
  category: z.string().describe('The category of the document (e.g., "Identification", "Financial").'),
});
export type DocumentAnalysisInput = z.infer<typeof DocumentAnalysisInputSchema>;

const DocumentAnalysisOutputSchema = z.object({
  checklist: z.array(z.string()).describe("A concise list of 2-3 critical items to check for this document."),
});
export type DocumentAnalysisOutput = z.infer<typeof DocumentAnalysisOutputSchema>;

const prompt = ai.definePrompt({
  name: 'documentAnalyzerPrompt',
  input: { schema: DocumentAnalysisInputSchema },
  output: { schema: DocumentAnalysisOutputSchema },
  prompt: `You are an expert Canadian immigration paralegal known for your meticulous attention to detail.
  
  For a document titled "{{title}}" in the category "{{category}}", provide a checklist of 2-3 of the most critical items to verify to ensure it meets IRCC standards.
  
  Be concise and actionable.
  
  Example for "Passport" in "Identification":
  - Check expiry date is more than 6 months away.
  - Ensure all corners of the bio page are visible and not cut off.
  - Confirm signature is present on the signature line.
  
  Example for "Bank Statement" in "Financial":
  - Verify the document is on official bank letterhead.
  - Check that the closing balance has been stable for at least 6 months.
  - Ensure the account holder's name matches the applicant's name exactly.`,
});

const documentAnalyzerFlow = ai.defineFlow(
  {
    name: 'documentAnalyzerFlow',
    inputSchema: DocumentAnalysisInputSchema,
    outputSchema: DocumentAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("Failed to analyze document.");
    }
    return output;
  }
);

export async function analyzeDocument(input: DocumentAnalysisInput): Promise<DocumentAnalysisOutput> {
  return documentAnalyzerFlow(input);
}
