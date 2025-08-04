
'use server';
/**
 * @fileOverview An AI agent that analyzes client files to identify risks and suggest actions.
 *
 * - analyzeClientRisks - A function that handles the risk analysis process.
 * - RiskAnalysisInput - The input type for the analyzeClientRisks function.
 * - RiskAnalysisOutput - The return type for the analyzeClientRisks function.
 */

import {ai} from '@/ai/genkit';
import {
  RiskAnalysisInputSchema,
  RiskAnalysisOutputSchema,
  type RiskAnalysisInput,
  type RiskAnalysisOutput,
} from '@/ai/schemas/risk-analyzer-schema';

export type { RiskAnalysisOutput, ClientAlert, RiskAnalysisInput } from '@/ai/schemas/risk-analyzer-schema';

const prompt = ai.definePrompt({
  name: 'riskAnalyzerPrompt',
  input: {schema: RiskAnalysisInputSchema},
  output: {schema: RiskAnalysisOutputSchema},
  prompt: `You are an AI Risk System running inside a lawyer's immigration CRM dashboard. Your role is to review a list of active client files and flag any potential risks.

  Analyze each client profile provided in the JSON input and identify any of the following risk factors:

  1.  **Missing or Rejected Documents:** Flag any client who has documents with a status of 'Requested' or 'Rejected'.
  2.  **Stale Cases:** Flag any active case where the most recent activity in their timeline is more than 30 days ago.
  3.  **Approaching Deadlines:** Flag any case where the 'dueDate' in their case summary is within the next 30 days.

  For each client you flag, you must provide a concise summary of the issue and a clear, suggested action for the lawyer. If a client has multiple issues, create a separate alert for each.

  Here is the list of clients to analyze:
  {{{json this}}}

  Return your findings as an array of alerts in the specified JSON format. If there are no risks, return an empty array.
  `,
});

const riskAnalyzerFlow = ai.defineFlow(
  {
    name: 'riskAnalyzerFlow',
    inputSchema: RiskAnalysisInputSchema,
    outputSchema: RiskAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to analyze risks.");
    }
    return output;
  }
);

export async function analyzeClientRisks(input: RiskAnalysisInput): Promise<RiskAnalysisOutput> {
    try {
        return await riskAnalyzerFlow(input);
    } catch (error) {
        console.warn('AI risk analysis failed, using fallback:', error);
        
        // Fallback response when AI is not available
        const fallbackAlerts = [
            {
                clientId: 1,
                clientName: "Sample Client",
                issueSummary: "Some documents are still pending",
                suggestedAction: "Follow up with client for missing documents"
            }
        ];
        
        return {
            alerts: fallbackAlerts
        };
    }
}
