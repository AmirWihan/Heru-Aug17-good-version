/**
 * @fileOverview Defines the Zod schema and TypeScript types for the risk analyzer AI flow.
 */
import { z } from 'zod';

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
