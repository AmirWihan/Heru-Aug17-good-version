'use server';
/**
 * @fileOverview An AI agent that analyzes client files to identify risks and suggest actions.
 *
 * - analyzeClientRisks - A function that handles the risk analysis process.
 * - RiskAnalysisInput - The input type for the analyzeClientRisks function.
 * - RiskAnalysisOutput - The return type for the analyzeClientRisks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Simplified schema for what the AI needs.
const DocumentSchema = z.object({
  title: z.string(),
  status: z.enum(['Uploaded', 'Pending Review', 'Approved', 'Rejected', 'Requested', 'Pending Client Review']),
  dateAdded: z.string().describe('The date the document was added (YYYY-MM-DD).'),
});

const ActivitySchema = z.object({
  title: z.string(),
  timestamp: z.string().describe('The ISO 8601 timestamp of the activity.'),
});

const ClientProfileForAnalysisSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(['Active', 'On-hold', 'Closed', 'Blocked']),
  activity: z.array(ActivitySchema).describe('A log of the most recent activities.'),
  documents: z.array(DocumentSchema).describe('A list of client documents.'),
  caseSummary: z.object({
    dueDate: z.string().describe('The upcoming due date for the case (YYYY-MM-DD), if any.'),
  }),
});

export const RiskAnalysisInputSchema = z.object({
  clients: z.array(ClientProfileForAnalysisSchema),
  currentDate: z.string().describe('The current date in YYYY-MM-DD format.'),
});
export type RiskAnalysisInput = z.infer<typeof RiskAnalysisInputSchema>;


const ClientAlertSchema = z.object({
  clientId: z.number().describe("The ID of the flagged client."),
  clientName: z.string().describe("The name of the flagged client."),
  issueSummary: z.string().describe("A short summary of the issue or risk identified."),
  suggestedAction: z.string().describe("A specific, actionable next step to mitigate the risk."),
});
export type ClientAlert = z.infer<typeof ClientAlertSchema>;


export const RiskAnalysisOutputSchema = z.object({
  alerts: z.array(ClientAlertSchema),
});
export type RiskAnalysisOutput = z.infer<typeof RiskAnalysisOutputSchema>;

export async function analyzeClientRisks(input: RiskAnalysisInput): Promise<RiskAnalysisOutput> {
  const jsonString = JSON.stringify(input);
  return riskAnalyzerFlow(jsonString);
}

const prompt = ai.definePrompt({
  name: 'riskAnalyzerPrompt',
  input: {schema: z.string()},
  output: {schema: RiskAnalysisOutputSchema},
  prompt: `You are an AI Risk System running inside a lawyer's immigration CRM dashboard. Your role is to review a list of active client files and flag any potential risks.

  Analyze each client profile provided in the JSON input and identify any of the following risk factors:

  1.  **Missing or Rejected Documents:** Flag any client who has documents with a status of 'Requested' or 'Rejected'.
  2.  **Stale Cases:** Flag any active case where the most recent activity in their timeline is more than 30 days ago.
  3.  **Approaching Deadlines:** Flag any case where the 'dueDate' in their case summary is within the next 30 days.

  For each client you flag, you must provide a concise summary of the issue and a clear, suggested action for the lawyer. If a client has multiple issues, create a separate alert for each.

  Here is the list of clients to analyze:
  \`\`\`json
  {{{json this}}}
  \`\`\`

  Return your findings as an array of alerts in the specified JSON format. If there are no risks, return an empty array.
  `,
});

const riskAnalyzerFlow = ai.defineFlow(
  {
    name: 'riskAnalyzerFlow',
    inputSchema: z.string(),
    outputSchema: RiskAnalysisOutputSchema,
  },
  async (jsonString) => {
    const {output} = await prompt(jsonString);
    return output!;
  }
);
